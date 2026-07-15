import type { User } from "./auth";
// Note: `CssNode` here is THIS project's JSON shape, not css-tree's AST node of the same name —
// which is why css-tree is imported as a namespace.
import type { CssNode, PageNode } from "./page";
import { pg } from "./postgres";
import { randomUUID } from "crypto";
import * as csstree from "css-tree";
import { parseHTML } from "linkedom";

export interface HtmlToNodesResult {
  nodes: Record<string, PageNode>;
  rootNodes: string[];
}

export const extractUser = async (req: Bun.BunRequest) => {
  const cookie = req.cookies;

  const session = cookie.get("session");

  if (!session) {
    return null;
  }

  const [user]: [User] =
    await pg`SELECT id, name, email FROM users WHERE session = ${session};`;

  return user;
};

export function htmlToNodes(html: string): HtmlToNodesResult {
  const { document } = parseHTML(html);

  const nodes: Record<string, PageNode> = {};
  const rootNodes: string[] = [];

  function traverse(node: Element): string {
    const id = randomUUID();

    const attrs: Record<string, string> = {};
    for (const attr of Array.from(node.attributes)) {
      attrs[attr.name] = attr.value;
    }

    const children: string[] = [];
    let text: string | undefined;

    // Collapse source indentation the way HTML rendering does, but keep the spaces that separate
    // a text run from an inline element — "Limited time: " + <strong>10% off</strong> + " for new
    // customers" must not become "Limited time:10% offfor new customers".
    type Part =
      | { kind: "text"; value: string }
      | { kind: "element"; node: Element };
    const parts: Part[] = [];
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 3) {
        parts.push({
          kind: "text",
          value: (child.textContent ?? "").replace(/\s+/g, " "),
        });
      } else if (child.nodeType === 1) {
        parts.push({ kind: "element", node: child as Element });
      }
    }
    // Leading/trailing whitespace-only runs are just how the file is indented.
    while (parts[0]?.kind === "text" && !parts[0].value.trim()) parts.shift();
    while (
      parts.at(-1)?.kind === "text" &&
      !(parts.at(-1) as { value: string }).value.trim()
    )
      parts.pop();

    const hasElements = parts.some((p) => p.kind === "element");

    if (!hasElements) {
      // The common case: a node that is nothing but its own label. Keep the text ON the node, which
      // is the shape the builder's text editor reads and writes.
      const value = parts
        .map((p) => (p as { value: string }).value)
        .join("")
        .trim();
      if (value) text = value;
    } else {
      // Mixed content. A single `text` field cannot express "text, then an element, then more text",
      // and the old code just overwrote it — so every run but the last was SILENTLY DROPPED and what
      // survived got rendered before the element instead of around it. Text runs become real child
      // nodes so their order is preserved.
      for (const part of parts) {
        if (part.kind === "element") {
          children.push(traverse(part.node));
          continue;
        }
        if (!part.value) continue;
        const textId = randomUUID();
        nodes[textId] = {
          tag: "#text",
          attribute: {
            dataId: textId,
            devName: "Text",
            devIcon: "text",
          },
          children: [],
          text: part.value,
        };
        children.push(textId);
      }
    }

    const pageNode: PageNode = {
      tag: node.tagName.toLowerCase(),
      attribute: { ...attrs, dataId: id },
      children,
      ...(text ? { text } : {}),
    };

    nodes[id] = pageNode;
    return id;
  }

  for (const child of Array.from(document.children)) {
    rootNodes.push(traverse(child));
  }

  return { nodes, rootNodes };
}

// cssToJson is a character scanner, not a CSS parser, and scopeCss only understands @media and
// @keyframes. Everything below is VALID CSS that the pipeline mangles or drops WITHOUT AN ERROR —
// which is the worst way to fail, because the file still looks right when you open it. The section
// generator lets a model write CSS freely, so these have to be caught at the door.
// An at-rule survives if scopeCss can nest it inside the section's scoped selector (@media,
// @supports, @container) or hoist it with a namespaced name (@keyframes). @layer and @font-face can
// do neither: nesting them is invalid CSS, and hoisting them would put a global name (a layer order,
// a font family) into a page shared by every other section.
const SURVIVES_SCOPING = /^@(media|supports|container|keyframes)\b/i;

export function validateSectionCss(css: string, rootClass: string): string[] {
  const problems: string[] = [];
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "");

  if (/(^|[\s,{}>+~]):root\b/.test(source)) {
    problems.push(
      ":root becomes `.<scope>:root`, which matches nothing — every custom property declared there " +
        `is silently dead. Declare them on \`${rootClass}\` instead; children inherit them.`,
    );
  }

  for (const [atRule] of source.matchAll(/@[a-z-]+/gi)) {
    if (!SURVIVES_SCOPING.test(atRule)) {
      problems.push(
        `${atRule} does not survive scoping — the whole block is dropped. Use @media, @supports, ` +
          "@container or @keyframes.",
      );
    }
  }

  // `&` and `;`-inside-a-value (data: URIs) used to be rejected here — not because they are bad CSS,
  // but because the hand-rolled parser mangled them. It is a real parser now, and it handles both.

  // The scope class only ever lands on the section's ROOT node, so a selector that does not start
  // from the root class becomes `.<scope>.f-row` — one element carrying both classes, which never
  // exists. Four footers shipped like this and lost 49 rules between them.
  const scoped = scopeCss(cssToJson(source), "SCOPE");
  for (const selector of Object.keys(scoped)) {
    if (selector.startsWith("@")) continue;
    const rooted = selector
      .split(",")
      .every((part) => part.trim().startsWith(`.SCOPE${rootClass}`));
    if (!rooted) {
      problems.push(
        `\`${selector.replaceAll(".SCOPE", "")}\` is not rooted at \`${rootClass}\`, so it matches ` +
          "nothing once the section is scoped.",
      );
    }
  }

  return [...new Set(problems)];
}

// A section's CSS is scoped under a unique `s_…` class that lives on that section's root node. When
// the section is deleted the node goes but its CSS does not, unless something removes it — which is
// this. `removedScopes` are the scope classes no surviving node still carries; every css key that
// belongs to one of them (a `.s_….foo` selector or a `@keyframes s_…-name`) is dropped.
export const scopeClassesOf = (classAttr: string | undefined): string[] =>
  (classAttr ?? "").split(/\s+/).filter((c) => /^s_[\w-]+$/.test(c));

// Reordering a node's children must be exactly that — a rearrangement. `candidate` is only a valid
// new order if it is a PERMUTATION of `base`: same members, none added, dropped, or duplicated.
// This is the guard that stops a "reorder" request from injecting a node into someone's page or
// deleting one, so it must stay strict.
export const isPermutationOf = (candidate: string[], base: string[]): boolean => {
  if (candidate.length !== base.length) return false;
  if (new Set(candidate).size !== candidate.length) return false; // no duplicates
  const members = new Set(base);
  return candidate.every((id) => members.has(id));
};

export function pruneOrphanedCss(
  css: Record<string, unknown>,
  removedScopes: Iterable<string>,
): Record<string, unknown> {
  const scopes = [...removedScopes];
  if (scopes.length === 0) return css;

  const belongsToRemoved = (key: string) =>
    scopes.some(
      (s) =>
        key.includes(`.${s}.`) ||
        key.includes(`.${s} `) ||
        key.endsWith(`.${s}`) ||
        key === `@keyframes ${s}` ||
        key.startsWith(`@keyframes ${s}-`),
    );

  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(css)) {
    if (!belongsToRemoved(key)) next[key] = value;
  }
  return next;
}

// A model asked to write section-scoped CSS gets most selectors right and then writes one bare
// `.card { … }` — and that one stray rule matches NOTHING once the section is scoped, so the whole
// generation is rejected. But an unrooted selector has an obvious correct meaning: it is a
// descendant of the section root. Prefixing it with the root class is exactly what scoping intends,
// so auto-root it rather than fail the request over it. Things that CANNOT be auto-rooted (`:root`,
// @layer, @font-face, @import) are left untouched for validateSectionCss to reject with a reason.
export function autoRootSelectors(css: string, rootClass: string): string {
  const root = rootClass.startsWith(".") ? rootClass : `.${rootClass}`;

  const rootPart = (part: string): string => {
    const trimmed = part.trim();
    if (!trimmed) return trimmed;
    // Already rooted (the root itself, or a descendant of it), or unfixable — leave it.
    if (trimmed === root || trimmed.startsWith(`${root} `) || trimmed.startsWith(`${root}.`) ||
        trimmed.startsWith(`${root}:`) || trimmed.startsWith(`${root}>`) ||
        trimmed.startsWith(":root")) {
      return trimmed;
    }
    return `${root} ${trimmed}`;
  };

  const walk = (node: CssNode): CssNode => {
    const out: CssNode = {};
    for (const [key, value] of Object.entries(node)) {
      if (typeof value !== "object" || value === null) {
        out[key] = value;
        continue;
      }
      // Inside @media / @supports / @container the inner selectors need rooting too; @keyframes'
      // children are keyframe stops (0%, 50%), not selectors, so leave them alone.
      if (key.startsWith("@keyframes")) {
        out[key] = value;
      } else if (key.startsWith("@")) {
        out[key] = walk(value as CssNode);
      } else {
        const rooted = key.split(",").map(rootPart).join(",");
        out[rooted] = value;
      }
    }
    return out;
  };

  return jsonToCss(walk(cssToJson(css)));
}

// Tags that can execute code or pull in remote resources. A section is content, never a program.
// NOT <form>: dropping a node drops its whole subtree, so banning forms would silently delete the
// input and the button of any newsletter section. A form is only as dangerous as its `action`, and
// that is URL-checked below like every other URL.
const FORBIDDEN_TAGS = new Set([
  "script",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "base",
  "style",
  "noscript",
]);

const URL_ATTRS = new Set(["href", "src", "action", "formaction", "xlink:href"]);

// Anything that is not one of these can carry script. `data:` is allowed only for images, because
// data:text/html executes.
const isSafeUrl = (value: string): boolean => {
  // "java\tscript:x" and " javascript:x" both still reach the browser as javascript: — every
  // character up to and including the space is ignorable there, so strip them before looking at
  // the scheme. Entities are already decoded: this runs on the parsed tree, not the raw HTML.
  const url = value.replace(/[\u0000-\u0020]/g, "").toLowerCase();

  // The danger is a URL carrying a SCHEME the browser will execute — javascript:, data:, vbscript:.
  // A URL with no scheme (relative: "assets/x.png", "/about", "#faq", "//cdn/x") cannot run script,
  // so it is safe; only a scheme has to be on the allowlist. The old check inverted this and
  // rejected ordinary relative paths like "assets/x.png" — exactly what the exporter rewrites
  // bundled images to, which is why a bundled <img> came out as src="#".
  const scheme = url.match(/^([a-z][a-z0-9+.-]*):/);
  if (!scheme) return true;
  return ["http", "https", "mailto", "tel"].includes(scheme[1]!);
};

/**
 * Sanitise the PARSED node tree, not the HTML string.
 *
 * The previous sanitiser was a chain of regexes over the raw HTML, which is the classic footgun:
 * `<scri<script></script>pt>alert(1)</scri<script></script>pt>` survives it (the replace runs once
 * and does not rescan), and `href=javascript:alert(1)` survives it too (both of its rules require
 * the value to be quoted). Once the HTML has been through a real parser none of that matters —
 * whatever the attacker wrote, we are now looking at the tags and attributes the BROWSER will see.
 */
export function sanitizeNodes(
  nodes: Record<string, PageNode>,
  rootNodes: string[],
): void {
  const drop = (id: string) => {
    const node = nodes[id];
    if (!node) return;
    for (const childId of node.children) drop(childId);
    delete nodes[id];
  };

  for (const [id, node] of Object.entries(nodes)) {
    if (!nodes[id]) continue; // already dropped as a descendant

    if (FORBIDDEN_TAGS.has(node.tag)) {
      drop(id);
      continue;
    }

    for (const name of Object.keys(node.attribute)) {
      // onclick, onerror, onload, … — never legitimate in a template.
      if (/^on/i.test(name)) {
        delete node.attribute[name];
        continue;
      }
      if (URL_ATTRS.has(name.toLowerCase())) {
        const value = node.attribute[name];
        if (value && !isSafeUrl(value)) node.attribute[name] = "#";
      }
    }
  }

  // A dropped node must also stop being somebody's child.
  for (const node of Object.values(nodes)) {
    node.children = node.children.filter((childId) => nodes[childId]);
  }
  for (let i = rootNodes.length - 1; i >= 0; i--) {
    if (!nodes[rootNodes[i]!]) rootNodes.splice(i, 1);
  }
}

// A radio group is identified by its `name`, and that name is GLOBAL to the page. Two copies of a
// section that uses radios (e.g. the slideshow's slide picker) would silently join the same group
// and drive each other — the same class of collision as the @keyframes and @media ones. Namespacing
// the name per section makes it structurally impossible.
export function scopeFormNames(
  nodes: Record<string, PageNode>,
  uniqueClass: string,
): void {
  for (const node of Object.values(nodes)) {
    if (node.tag !== "input") continue;
    const name = node.attribute["name"];
    if (name) node.attribute["name"] = `${uniqueClass}-${name}`;
  }
}

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

// The builder's own bookkeeping. It drives the layers panel; it has no business in a shipped page.
const EDITOR_ATTRS = new Set([
  "dataId",
  "devName",
  "devIcon",
  "devGroupName",
  "css-id",
]);

const escapeText = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const escapeAttribute = (value: string) =>
  escapeText(value).replace(/"/g, "&quot;");

// The style panel writes to node.style, which is a REACT style object — camelCased. Serialising it
// verbatim would emit `backgroundColor:red`, which is not a CSS property, so every edit the user made
// by hand would silently do nothing in the exported page.
const inlineStyle = (style: Record<string, string>) =>
  Object.entries(style)
    .map(([property, value]) => {
      const cssProperty = property.replace(
        /[A-Z]/g,
        (char) => `-${char.toLowerCase()}`,
      );
      return `${cssProperty}:${value}`;
    })
    .join(";");

/**
 * Serialise the node tree back to HTML — the inverse of htmlToNodes, and the thing that makes the
 * page shippable rather than merely editable.
 */
export function nodesToHtml(
  nodes: Record<string, PageNode>,
  rootId: string,
): string {
  const node = nodes[rootId];
  if (!node) return "";

  if (node.tag === "#text") return escapeText(node.text ?? "");

  // The builder renders an image as `<img src={attribute.value}>` — the URL lives in `value`, not
  // `src` — and the image panel writes both. A generic pass would ship `<img value="…">` (which no
  // browser honours) and, for an AI-authored `<img src>`, nothing in `value` at all. Normalise to a
  // real `src`, and give it the same alt the builder shows so the exported image is not nameless.
  if (node.tag === "img") {
    const url = node.attribute["value"] || node.attribute["src"] || "";
    const src = url && isSafeUrl(url) ? url : "#";
    const alt = node.attribute["alt"] ?? node.attribute["devName"] ?? "";
    return `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}" />`;
  }

  const attributes: string[] = [];
  for (const [name, value] of Object.entries(node.attribute)) {
    if (EDITOR_ATTRS.has(name) || name === "style") continue;
    // This produces the file the user hands to their visitors. The builder's live renderer already
    // drops these, but the export baked every attribute in verbatim — so a page that looked safe in
    // the editor could ship a stored XSS. An event handler and a javascript: URL must not survive
    // into the distributed HTML, no matter how they got into the database.
    if (/^on/i.test(name)) continue;
    if (URL_ATTRS.has(name.toLowerCase()) && value && !isSafeUrl(value)) {
      attributes.push(`${name}="#"`);
      continue;
    }
    attributes.push(`${name}="${escapeAttribute(value)}"`);
  }

  const style = [
    node.attribute["style"],
    node.style && Object.keys(node.style).length
      ? inlineStyle(node.style)
      : undefined,
  ]
    .filter(Boolean)
    .join(";");
  if (style) attributes.push(`style="${escapeAttribute(style)}"`);

  const open = `<${node.tag}${attributes.length ? ` ${attributes.join(" ")}` : ""}>`;
  if (VOID_TAGS.has(node.tag)) return open;

  const text = node.text ? escapeText(node.text) : "";
  const children = node.children
    .map((childId) => nodesToHtml(nodes, childId))
    .join("");

  return `${open}${text}${children}</${node.tag}>`;
}

// The shape stored in the database: `{ selector: { property: value, "@media …": { … } } }`. The
// builder's style panel writes straight into these top-level selector keys (page.ts/updatePageCss),
// so the shape is a contract — a real parser may not change it, only stop mangling it.
//
// It used to be a hand-rolled character scanner. It split declarations on ";" wherever it appeared,
// which tore `url("data:image/svg+xml;base64,…")` in half and silently dropped the rest of the
// value; it stripped comments with a regex that did not know about strings; and it could not tell a
// selector from a value. css-tree already shipped in this project's dependencies, unused.
const coerceValue = (value: string): string | number =>
  Number.isNaN(Number(value)) ? value : Number(value);

const readCssBlock = (
  children: csstree.CssNode[],
  target: CssNode,
  depth: number,
): void => {
  // Cheap insurance against a pathological re-parse loop (see the Raw case below).
  if (depth > 32) return;

  for (const node of children) {
    switch (node.type) {
      case "Declaration": {
        const value = csstree.generate(node.value);
        target[node.property] = coerceValue(
          node.important ? `${value} !important` : value,
        );
        break;
      }

      case "Rule": {
        const selector = csstree.generate(node.prelude);
        if (typeof target[selector] !== "object" || target[selector] === null) {
          target[selector] = {};
        }
        readCssBlock(
          node.block.children.toArray(),
          target[selector] as CssNode,
          depth + 1,
        );
        break;
      }

      case "Atrule": {
        // @import and friends carry no block; they never survived scoping anyway.
        if (!node.block) break;

        const prelude = node.prelude ? csstree.generate(node.prelude) : "";
        const key = prelude ? `@${node.name} ${prelude}` : `@${node.name}`;
        if (typeof target[key] !== "object" || target[key] === null) {
          target[key] = {};
        }
        readCssBlock(
          node.block.children.toArray(),
          target[key] as CssNode,
          depth + 1,
        );
        break;
      }

      case "Raw": {
        // css-tree stops reading a declaration block at the first thing that is not a declaration
        // and hands the remainder back as Raw — which is exactly what happens with the nested CSS
        // that headers 2-5 and the templates are written in. Parse that remainder as a stylesheet of
        // its own and the nested rules come back.
        const nested = csstree.parse(node.value);
        if (nested.type !== "StyleSheet") break;
        readCssBlock(nested.children.toArray(), target, depth + 1);
        break;
      }

      // Comment, and anything else structural, carries no style.
      default:
        break;
    }
  }
};

export function cssToJson(css: string): CssNode {
  const root: CssNode = {};

  let ast: csstree.CssNode;
  try {
    ast = csstree.parse(css);
  } catch {
    return root;
  }
  if (ast.type !== "StyleSheet") return root;

  readCssBlock(ast.children.toArray(), root, 0);
  return root;
}

export const jsonToCss = (json: CssNode, depth: number = 0): string => {
  let cssString = "";
  const indent = "  ".repeat(depth);

  for (const [key, value] of Object.entries(json)) {
    if (typeof value === "object" && value !== null) {
      cssString += `${indent}${key} {\n`;
      cssString += jsonToCss(value as CssNode, depth + 1);
      cssString += `${indent}}\n`;
    } 
    else {
      cssString += `${indent}${key}: ${value};\n`;
    }
  }

  return cssString;
};

// A selector may be a comma-separated list; every part needs the scope class, not just the first.
const scopeSelector = (selector: string, uniqueClass: string) =>
  selector
    .split(",")
    .map((part) => `.${uniqueClass}${part.trim()}`)
    .join(",");

// Properties whose value names an @keyframes rule.
const ANIMATION_PROPS = new Set(["animation", "animation-name"]);

// At-rules that CSS nesting lets us tuck inside a style rule — which is how they survive scoping.
// @layer and @font-face cannot be nested, so they have no home here and stay rejected at the door.
const NESTABLE_AT_RULE = /^@(media|supports|container)\b/i;

export const scopeCss = (cssJson: any, uniqueClass: string) => {
  const scoped: any = {};

  const bucketFor = (selector: string) => {
    const key = scopeSelector(selector, uniqueClass);
    if (!scoped[key] || typeof scoped[key] !== "object") scoped[key] = {};
    return scoped[key];
  };

  // Keyframe names live in a GLOBAL namespace, so two sections that both define, say,
  // "@keyframes float" would overwrite each other in the page-wide shallow jsonb merge — the same
  // collision as the @media one below, one namespace over. Rename every keyframe this stylesheet
  // defines, then rewrite the animation declarations that reference it.
  const renames = new Map<string, string>();
  Object.keys(cssJson).forEach((key) => {
    if (!key.startsWith("@keyframes")) return;
    const name = key.slice("@keyframes".length).trim();
    if (name) renames.set(name, `${uniqueClass}-${name}`);
  });

  const rewriteAnimations = (node: any): any => {
    if (typeof node !== "object" || node === null) return node;
    const out: any = {};
    for (const [prop, value] of Object.entries(node)) {
      if (typeof value === "object" && value !== null) {
        out[prop] = rewriteAnimations(value);
      } else if (ANIMATION_PROPS.has(prop) && typeof value === "string" && renames.size) {
        // Only rename the keyframes this stylesheet actually declares, and only as whole words,
        // so the rest of the shorthand (durations, easings, `infinite`, …) is left alone.
        out[prop] = [...renames].reduce(
          (v, [from, to]) => v.replace(new RegExp(`\\b${from}\\b`, "g"), to),
          value,
        );
      } else {
        out[prop] = value;
      }
    }
    return out;
  };

  // Plain rules first, so that in each bucket the declarations are serialised before any
  // nested at-rule. Declarations that trail a nested rule are legal but poorly supported.
  Object.keys(cssJson).forEach((key) => {
    if (key.startsWith("@")) return;
    Object.assign(bucketFor(key), rewriteAnimations(cssJson[key]));
  });

  Object.keys(cssJson).forEach((key) => {
    if (NESTABLE_AT_RULE.test(key)) {
      // Nest the query INSIDE each scoped selector rather than emitting a top-level "@media(...)"
      // key. Every section's CSS is merged into one page-wide jsonb object with `css || new`
      // (page.ts), and jsonb `||` is a SHALLOW merge — so a shared top-level "@media(max-width:640px)"
      // key meant the last section written silently deleted every other section's rules for that
      // breakpoint. Scoped selectors are unique per section, so bucketing under them makes the
      // collision structurally impossible.
      //
      // @supports rides along: CSS nesting allows it inside a style rule exactly like @media, so it
      // gets the same treatment instead of being silently dropped as it was before.
      const conditionalRules = cssJson[key];
      Object.keys(conditionalRules).forEach((subKey) => {
        const bucket = bucketFor(subKey);
        if (!bucket[key] || typeof bucket[key] !== "object") bucket[key] = {};
        Object.assign(bucket[key], rewriteAnimations(conditionalRules[subKey]));
      });
    } else if (key.startsWith("@keyframes")) {
      const name = key.slice("@keyframes".length).trim();
      scoped[`@keyframes ${renames.get(name) ?? name}`] = cssJson[key];
    }
  });

  return scoped;
};
