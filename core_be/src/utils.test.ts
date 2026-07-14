import { describe, expect, test } from "bun:test";
import { readdirSync } from "fs";

import {
  cssToJson,
  htmlToNodes,
  jsonToCss,
  sanitizeNodes,
  scopeCss,
  scopeFormNames,
  validateSectionCss,
} from "./utils";

// Postgres merges each section's CSS into one page-wide object with `css || new`, and jsonb `||`
// is a SHALLOW merge. So anything a section contributes at the TOP LEVEL of its CSS object is a
// name it shares with every other section on the page — and the last one written wins.
const shallowMerge = (a: object, b: object) => ({ ...a, ...b });

const TEMPLATES = "assets/templates";
const sections = (["header", "footer", "template"] as const).flatMap((kind) =>
  readdirSync(`${TEMPLATES}/${kind}`)
    .filter((f) => f.endsWith(".css"))
    .sort()
    .map((f) => ({ kind, name: f.replace(".css", "") })),
);

const rules = (node: object, prefix = ""): string[] =>
  Object.entries(node).flatMap(([key, value]) =>
    typeof value === "object" && value !== null
      ? key.startsWith("@")
        ? rules(value, `${prefix}${key} `)
        : [`${prefix}${key}`, ...rules(value, `${prefix}${key} `)]
      : [],
  );

describe("scopeCss", () => {
  test("never emits a top-level @media key", () => {
    // A shared "@media(max-width:640px)" key meant section B silently deleted section A's entire
    // block for that breakpoint. Nesting the query inside each scoped selector makes the top-level
    // keys unique per section, so the collision cannot be expressed.
    const css = "@media(max-width:640px){ .header-1 .nav{ display:none; } }";
    const scoped = scopeCss(cssToJson(css), "s1");

    expect(Object.keys(scoped).filter((k) => k.startsWith("@media"))).toEqual([]);
    expect(jsonToCss(scoped)).toContain("@media(max-width:640px)");
  });

  test("two sections sharing a breakpoint keep all of their rules", () => {
    const a = scopeCss(
      cssToJson("@media(max-width:640px){ .template-1 .hero{ padding:0; } }"),
      "sA",
    );
    const b = scopeCss(
      cssToJson("@media(max-width:640px){ .template-2 .hero{ padding:0; } }"),
      "sB",
    );

    const page = shallowMerge(a, b);

    for (const rule of [...rules(a), ...rules(b)]) {
      expect(rules(page)).toContain(rule);
    }
  });

  test("scopes every part of a comma-separated selector list", () => {
    // ".a, .b" used to become ".<scope>.a, .b" — the second half escaped the section entirely.
    const scoped = scopeCss(
      cssToJson(".template-1 .btn-a,.template-1 .btn-b{ color:red; }"),
      "s1",
    );
    const selector = Object.keys(scoped)[0]!;

    for (const part of selector.split(",")) {
      expect(part.trim()).toStartWith(".s1.template-1");
    }
  });

  test("namespaces @keyframes and rewrites the animations that reference them", () => {
    // Keyframe names are global to the page: two sections both defining "float" clobbered each other.
    const css =
      ".template-2 .badge{ animation:float 3s ease-in-out infinite; } " +
      "@keyframes float{ 0%{ transform:none; } }";

    const a = scopeCss(cssToJson(css), "sA");
    const b = scopeCss(cssToJson(css), "sB");
    const page = shallowMerge(a, b);

    expect(Object.keys(page).filter((k) => k.startsWith("@keyframes")).sort()).toEqual([
      "@keyframes sA-float",
      "@keyframes sB-float",
    ]);
    // …and each section's animation must point at its OWN copy, with the rest of the shorthand intact.
    expect(JSON.stringify(a)).toContain("sA-float 3s ease-in-out infinite");
    expect(JSON.stringify(b)).toContain("sB-float 3s ease-in-out infinite");
  });
});

describe("shipped templates", () => {
  // A selector that does not begin with its component's root class becomes ".<scope>.f-row" after
  // scoping, which requires ONE element to carry both classes — and the scope class only ever lands
  // on the section root. Four footers shipped like this and lost 49 rules between them.
  test.each(sections)("$name has no unrooted top-level selector", async ({ kind, name }) => {
    const css = await Bun.file(`${TEMPLATES}/${kind}/${name}.css`).text();
    const root = `.${kind}-${name.slice(-1)}`;
    const scoped = scopeCss(cssToJson(css), "S");

    const dead = Object.keys(scoped).filter(
      (key) =>
        !key.startsWith("@") &&
        !key.split(",").every((part) => part.startsWith(`.S${root}`)),
    );

    expect(dead).toEqual([]);
  });
});

describe("validateSectionCss", () => {
  // Every one of these is valid CSS that the pipeline mangles or drops without saying a word, and
  // every one is something a model writes without thinking. The section generator lets a model
  // write CSS freely, so the door is the only place to catch them.
  test.each([
    [":root", ":root{ --brand:#0A6E5E; } .header-9{ color:var(--brand); }"],
    ["@supports", "@supports (display:grid){ .header-9{ display:grid; } }"],
    ["@layer", "@layer base{ .header-9{ margin:0; } }"],
    ["@font-face", "@font-face{ font-family:X; } .header-9{ font-family:X; }"],
    ["@import", "@import url(x.css); .header-9{ color:red; }"],
    ["a ; inside a value", ".header-9{ background:url('data:image/svg+xml;base64,AA=='); }"],
    ["& nesting", ".header-9{ &:hover{ color:red; } }"],
    ["an unrooted selector", ".header-9{ color:red; } .logo{ color:blue; }"],
  ])("rejects %s", (_label, css) => {
    expect(validateSectionCss(css, ".header-9").length).toBeGreaterThan(0);
  });

  test("accepts CSS the pipeline can actually express", () => {
    const css =
      ".header-9{ --brand:#0A6E5E; color:var(--brand); } " +
      ".header-9 .nav,.header-9 .cta{ display:flex; } " +
      "@media(max-width:640px){ .header-9 .nav{ display:none; } } " +
      "@keyframes fade{ 0%{ opacity:0; } }";

    expect(validateSectionCss(css, ".header-9")).toEqual([]);
  });

  test.each(sections)("$name passes the validator it ships with", async ({ kind, name }) => {
    const css = await Bun.file(`${TEMPLATES}/${kind}/${name}.css`).text();
    expect(validateSectionCss(css, `.${kind}-${name.slice(-1)}`)).toEqual([]);
  });
});

describe("htmlToNodes", () => {
  test("keeps every run of text in a mixed-content node, in order", () => {
    // `text` was a single field that each text node overwrote, so "Limited time:" was dropped and
    // what survived rendered BEFORE the <strong> instead of after it.
    const { nodes, rootNodes } = htmlToNodes(
      "<p>Limited time: <strong>10% off</strong> for new customers</p>",
    );

    const p = nodes[rootNodes[0]!]!;
    // Each child is either a "#text" run or an inline element; <strong> holds nothing but its own
    // label, so its text stays on the node, exactly as the simple case below asserts.
    const rendered = p.children.map((id) => nodes[id]!.text).join("");

    expect(rendered).toBe("Limited time: 10% off for new customers");
    expect(p.text).toBeUndefined();
  });

  test("keeps text on the node itself when there is nothing else in it", () => {
    // The builder's text editor reads and writes node.text, so the simple case must not change shape.
    const { nodes, rootNodes } = htmlToNodes('<div class="logo-text">Brand</div>');

    expect(nodes[rootNodes[0]!]!.text).toBe("Brand");
    expect(nodes[rootNodes[0]!]!.children).toEqual([]);
  });
});

describe("scopeFormNames", () => {
  test("a radio group cannot reach across sections", () => {
    // Radios are grouped by `name`, which is global to the page — two slideshows would drive each other.
    const html = '<div><input type="radio" name="slide" /></div>';
    const nameIn = (scope: string) => {
      const { nodes } = htmlToNodes(html);
      scopeFormNames(nodes, scope);
      return Object.values(nodes).find((n) => n.tag === "input")!.attribute.name;
    };

    expect(nameIn("sA")).toBe("sA-slide");
    expect(nameIn("sB")).toBe("sB-slide");
  });
});

describe("sanitizeNodes", () => {
  const sanitized = (html: string) => {
    const { nodes, rootNodes } = htmlToNodes(html);
    sanitizeNodes(nodes, rootNodes);
    return Object.values(nodes);
  };

  test.each([
    ["a nested script the regex pass rebuilds", "<div><script>alert(1)</script></div>", "script"],
    ["an iframe", '<div><iframe src="//evil.com"></iframe></div>', "iframe"],
    ["a remote stylesheet", '<div><link rel="stylesheet" href="//evil.com/x.css" /></div>', "link"],
  ])("drops %s", (_label, html, tag) => {
    expect(sanitized(html).map((n) => n.tag)).not.toContain(tag);
  });

  test("drops every event handler", () => {
    const nodes = sanitized('<div><img src="x" onerror="alert(1)" onclick="x()" /></div>');
    const handlers = nodes.flatMap((n) =>
      Object.keys(n.attribute).filter((a) => /^on/i.test(a)),
    );

    expect(handlers).toEqual([]);
  });

  test.each([
    ["unquoted", "<a href=javascript:alert(1)>x</a>"],
    // "jav\tascript:" is still javascript: by the time the browser sees it.
    ["with a control character wedged in", '<a href="jav&#x09;ascript:alert(1)">x</a>'],
  ])("neutralises a javascript: URL %s", (_label, html) => {
    const anchor = sanitized(html).find((n) => n.tag === "a")!;
    expect(anchor.attribute.href).toBe("#");
  });

  test("leaves a legitimate URL alone", () => {
    const hrefs = sanitized('<div><a href="https://ok.com">a</a><a href="#">b</a></div>')
      .filter((n) => n.tag === "a")
      .map((n) => n.attribute.href);

    expect(hrefs).toEqual(["https://ok.com", "#"]);
  });

  test("leaves the shipped templates untouched", async () => {
    for (const { kind, name } of sections) {
      const html = await Bun.file(`${TEMPLATES}/${kind}/${name}.html`).text();

      const before = htmlToNodes(html);
      const after = htmlToNodes(html);
      sanitizeNodes(after.nodes, after.rootNodes);

      expect(Object.keys(after.nodes).length).toBe(Object.keys(before.nodes).length);
    }
  });
});
