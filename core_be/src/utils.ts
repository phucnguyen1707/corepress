import type { User } from "./auth";
import type { CssNode, PageNode } from "./page";
import { pg } from "./postgres";
import { randomUUID } from "crypto";
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
const SURVIVES_SCOPING = /^@(media|keyframes)\b/i;

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
        `${atRule} does not survive scoping — the whole block is dropped. Only @media and @keyframes do.`,
      );
    }
  }

  // Look for "&" only where a selector can be — a query string ("?q=80&w=2070") is not nesting.
  const withoutValues = source
    .replace(/url\([^)]*\)/gi, "url()")
    .replace(/"[^"]*"|'[^']*'/g, '""');
  if (withoutValues.includes("&")) {
    problems.push(
      "`&` is not understood: it survives as a literal character in the selector. Write the full selector out.",
    );
  }

  for (const [, value] of source.matchAll(/url\(([^)]*)\)/gi)) {
    if (value?.includes(";")) {
      problems.push(
        "A `;` inside a value (a data: URI, typically) is read as the end of the declaration, which " +
          "tears it in half. Use an inline <svg> in the HTML instead.",
      );
    }
  }

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
  if (url.startsWith("#") || url.startsWith("/") || url.startsWith("./")) {
    return true;
  }
  // No data: URLs at all. Nothing in a template needs one, and an allowlist should never be
  // wider than the need.
  return /^(https?|mailto|tel):/.test(url);
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

export function cssToJson(css: string): CssNode {
  const cleanCss = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\n/g, " ")
    .replace(/\s\s+/g, " ");

  const root: CssNode = {};
  const stack: CssNode[] = [root];
  let buffer = "";

  for (let i = 0; i < cleanCss.length; i++) {
    const char = cleanCss[i];

    const parent = stack[stack.length - 1]!;

    if (char === "{") {
      const selector = buffer.trim();
      
      if (!parent[selector] || typeof parent[selector] !== 'object') {
        parent[selector] = {};
      }

      stack.push(parent[selector]);
      
      buffer = "";
    } 
    else if (char === "}") {
      const trimmedBuffer = buffer.trim();
      if (trimmedBuffer) {
        const firstColon = trimmedBuffer.indexOf(":");
        if (firstColon > -1) {
          const key = trimmedBuffer.slice(0, firstColon).trim();
          const value = trimmedBuffer.slice(firstColon + 1).trim();
          parent[key] = Number.isNaN(Number(value)) ? value : Number(value);;
        }
      }
      
      if (stack.length > 1) {
        stack.pop();
      }
      
      buffer = "";
    } 
    else if (char === ";") {
      const trimmedBuffer = buffer.trim();
      const firstColon = trimmedBuffer.indexOf(":");
      
      if (firstColon > -1) {
        const key = trimmedBuffer.slice(0, firstColon).trim();
        const value = trimmedBuffer.slice(firstColon + 1).trim();
        parent[key] = Number.isNaN(Number(value)) ? value : Number(value);;
      }
      
      buffer = "";
    } 
    else {
      buffer += char;
    }
  }

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
    if (key.startsWith("@media")) {
      // Nest the media query INSIDE each scoped selector rather than emitting a top-level
      // "@media(...)" key. Every section's CSS is merged into one page-wide jsonb object with
      // `css || new` (page.ts), and jsonb `||` is a SHALLOW merge — so a shared top-level
      // "@media(max-width:640px)" key meant the last section written silently deleted every
      // other section's rules for that breakpoint. Scoped selectors are unique per section,
      // so bucketing under them makes the collision structurally impossible.
      const mediaRules = cssJson[key];
      Object.keys(mediaRules).forEach((subKey) => {
        const bucket = bucketFor(subKey);
        if (!bucket[key] || typeof bucket[key] !== "object") bucket[key] = {};
        Object.assign(bucket[key], rewriteAnimations(mediaRules[subKey]));
      });
    } else if (key.startsWith("@keyframes")) {
      const name = key.slice("@keyframes".length).trim();
      scoped[`@keyframes ${renames.get(name) ?? name}`] = cssJson[key];
    }
  });

  return scoped;
};
