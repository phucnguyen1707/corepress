import { describe, expect, test } from "bun:test";
import { readdirSync } from "fs";
import { parseHTML } from "linkedom";

import dns from "node:dns/promises";

import { buildSiteBundle, reachesOnlyThePublicInternet } from "./export";

import {
  autoRootSelectors,
  cssToJson,
  htmlToNodes,
  isPermutationOf,
  jsonToCss,
  nodesToHtml,
  pruneOrphanedCss,
  scopeClassesOf,
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
    .map((f) => {
      const name = f.replace(".css", "");
      // The root class is `.<kind>-<index>`, and the index can be two digits (template10, template11)
      // — so take the whole numeric suffix, not the last character.
      const root = `.${kind}-${name.match(/\d+$/)![0]}`;
      return { kind, name, root };
    }),
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
    // The query itself survives, nested inside the scoped selector. Its text is normalised by the
    // parser ("@media(" and "@media (" both come out the same) — which is a fix in itself: those two
    // spellings used to produce two DIFFERENT json keys, and that accident was the only reason some
    // sections escaped the collision above.
    const out = jsonToCss(scoped);
    expect(out).toContain(".s1.header-1 .nav");
    expect(out).toMatch(/@media\s*\(max-width:640px\)/);
  });

  test("the two spellings of a media query now produce the same key", () => {
    const spaced = cssToJson("@media (max-width:640px){ .a{ color:red; } }");
    const tight = cssToJson("@media(max-width:640px){ .a{ color:red; } }");

    expect(Object.keys(spaced)).toEqual(Object.keys(tight));
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
  test.each(sections)("$name has no unrooted top-level selector", async ({ kind, name, root }) => {
    const css = await Bun.file(`${TEMPLATES}/${kind}/${name}.css`).text();
    const scoped = scopeCss(cssToJson(css), "S");

    const dead = Object.keys(scoped).filter(
      (key) =>
        !key.startsWith("@") &&
        !key.split(",").every((part) => part.startsWith(`.S${root}`)),
    );

    expect(dead).toEqual([]);
  });
});

describe("pruneOrphanedCss", () => {
  // Deleting a section must take its CSS with it. Its rules are keyed under a unique `s_…` scope
  // class; everything else on the page must survive untouched.
  const css = {
    ".s_aaa.header-1": { color: "red" },
    ".s_aaa.header-1 .nav": { display: "flex" },
    "@keyframes s_aaa-float": { "0%": { opacity: 0 } },
    ".s_bbb.footer-1": { color: "blue" },
    ".s_bbb.footer-1 .link,.s_bbb.footer-1 .link:hover": { color: "green" },
  };

  test("removes exactly the deleted section's rules", () => {
    const pruned = pruneOrphanedCss(css, ["s_aaa"]);

    expect(Object.keys(pruned)).toEqual([
      ".s_bbb.footer-1",
      ".s_bbb.footer-1 .link,.s_bbb.footer-1 .link:hover",
    ]);
    // Not a trace of the removed scope, including its keyframes.
    expect(JSON.stringify(pruned)).not.toContain("s_aaa");
  });

  test("removing nothing leaves the object untouched", () => {
    expect(pruneOrphanedCss(css, [])).toBe(css);
  });

  test("scopeClassesOf reads only the s_ scope token", () => {
    expect(scopeClassesOf("s_aaa header-1")).toEqual(["s_aaa"]);
    expect(scopeClassesOf("header-1 nav")).toEqual([]);
    expect(scopeClassesOf(undefined)).toEqual([]);
  });
});

describe("isPermutationOf", () => {
  // The guard behind reorder: a new child order is only allowed if it rearranges the SAME nodes.
  const base = ["a", "b", "c"];

  test("accepts a genuine rearrangement", () => {
    expect(isPermutationOf(["c", "a", "b"], base)).toBe(true);
    expect(isPermutationOf(["a", "b", "c"], base)).toBe(true); // identity
  });

  test("rejects a dropped, added, or duplicated node", () => {
    expect(isPermutationOf(["a", "b"], base)).toBe(false); // dropped
    expect(isPermutationOf(["a", "b", "c", "d"], base)).toBe(false); // injected
    expect(isPermutationOf(["a", "a", "b"], base)).toBe(false); // duplicated (same length!)
    expect(isPermutationOf(["a", "b", "x"], base)).toBe(false); // swapped for a stranger
  });
});

describe("autoRootSelectors", () => {
  // A generated section fails validation if the model forgot the root class on even one selector.
  // Rooting those turns a hard 502 into a section that works — but must not paper over the things
  // that genuinely cannot be scoped.
  const ROOT = ".ai-hero";

  test("roots the selectors the model forgot, and leaves the rest alone", () => {
    const css =
      ".ai-hero{ padding:40px; } .ai-hero .title{ font-size:32px; } " +
      ".card{ border-radius:8px; } h2{ margin:0; } .card,.badge{ color:red; } " +
      "@media(max-width:600px){ .card{ border-radius:4px; } .ai-hero{ padding:20px; } }";

    const keys = Object.keys(cssToJson(autoRootSelectors(css, ROOT)));

    expect(keys).toContain(".ai-hero"); // the root itself is untouched
    expect(keys).toContain(".ai-hero .title"); // already rooted, untouched
    expect(keys).toContain(".ai-hero .card"); // bare .card got rooted
    expect(keys).toContain(".ai-hero h2"); // element selector got rooted
    expect(keys).toContain(".ai-hero .card,.ai-hero .badge"); // every comma part rooted
  });

  test("the rooted CSS passes validation and scopes with no dead rules", () => {
    const css = ".card{ color:red; } h2{ margin:0; } @media(max-width:9px){ .card{ color:blue; } }";
    const rooted = autoRootSelectors(css, ROOT);

    expect(validateSectionCss(rooted, ROOT)).toEqual([]);

    const scoped = scopeCss(cssToJson(rooted), "SC");
    const dead = Object.keys(scoped).filter(
      (k) => !k.startsWith("@") && !k.split(",").every((p) => p.startsWith(".SC.ai-hero")),
    );
    expect(dead).toEqual([]);
  });

  test.each([
    [":root", ":root{ --brand:#fff; } .ai-hero{ color:var(--brand); }"],
    ["@layer", "@layer base{ .ai-hero{ margin:0; } }"],
    ["@font-face", "@font-face{ font-family:X; } .ai-hero{ font-family:X; }"],
  ])("does not paper over %s (still rejected after rooting)", (_label, css) => {
    expect(validateSectionCss(autoRootSelectors(css, ROOT), ROOT).length).toBeGreaterThan(0);
  });
});

describe("shipped templates: standing on their own", () => {
  // In the EXPORTED page a section always sits in an ordinary auto-height <div>, so `height:100%` on
  // its root resolves to `auto` and does nothing at all. It is dead CSS everywhere it appears —
  // except that it is also a trap: template5's slides are all `position:absolute`, contributed no
  // height of their own, and the whole slideshow collapsed to ZERO pixels in the export. It looked
  // fine in the builder only because the builder canvas has a definite height to borrow.
  //
  // Measured: removing `height:100%` from all five roots that had it changed the rendered height of
  // none of the fifteen sections. If a section wants a floor, `min-height` is the honest way to ask.
  test.each(sections)("$name does not ask its parent for a height", async ({ kind, name, root }) => {
    const css = (await Bun.file(`${TEMPLATES}/${kind}/${name}.css`).text()).replace(
      /\/\*[\s\S]*?\*\//g,
      "",
    );
    const rootRule = new RegExp(`\\${root}\\s*\\{([\\s\\S]*?)\\n\\s*\\}`);

    expect(css.match(rootRule)?.[1] ?? "").not.toMatch(/(?<!min-)height\s*:\s*100%/);
  });
});

describe("validateSectionCss", () => {
  // Every one of these is valid CSS that the pipeline mangles or drops without saying a word, and
  // every one is something a model writes without thinking. The section generator lets a model
  // write CSS freely, so the door is the only place to catch them.
  test.each([
    [":root", ":root{ --brand:#0A6E5E; } .header-9{ color:var(--brand); }"],
    ["@layer", "@layer base{ .header-9{ margin:0; } }"],
    ["@font-face", "@font-face{ font-family:X; } .header-9{ font-family:X; }"],
    ["@import", "@import url(x.css); .header-9{ color:red; }"],
    ["an unrooted selector", ".header-9{ color:red; } .logo{ color:blue; }"],
  ])("rejects %s", (_label, css) => {
    expect(validateSectionCss(css, ".header-9").length).toBeGreaterThan(0);
  });

  // These three were rejected only because the hand-rolled parser mangled them. With a real parser
  // they are ordinary CSS, so the ban is gone — and the pipeline has to actually carry them through,
  // which is what the second half of each case checks.
  test("accepts a data: URI, and no longer tears the value in half", () => {
    const css = ".header-9{ background:url('data:image/svg+xml;base64,AA=='); color:red; }";

    expect(validateSectionCss(css, ".header-9")).toEqual([]);

    const out = jsonToCss(scopeCss(cssToJson(css), "s1"));
    expect(out).toContain("base64,AA==");
    expect(out).toContain("color: red");
  });

  test("accepts & nesting and keeps it nested", () => {
    const css = ".header-9{ color:red; &:hover{ color:blue; } }";

    expect(validateSectionCss(css, ".header-9")).toEqual([]);
    expect(jsonToCss(scopeCss(cssToJson(css), "s1"))).toMatch(/&:hover\s*\{/);
  });

  test("accepts @supports and nests it inside the scoped selector", () => {
    const css = "@supports (display:grid){ .header-9{ display:grid; } }";

    expect(validateSectionCss(css, ".header-9")).toEqual([]);

    const scoped = scopeCss(cssToJson(css), "s1");
    // Like @media: never a top-level key (that is what the page-wide shallow merge clobbers), and
    // never silently dropped — which is what used to happen to it.
    expect(Object.keys(scoped)).toEqual([".s1.header-9"]);
    expect(jsonToCss(scoped)).toMatch(/@supports\s*\(display:grid\)/);
  });

  test("accepts CSS the pipeline can actually express", () => {
    const css =
      ".header-9{ --brand:#0A6E5E; color:var(--brand); } " +
      ".header-9 .nav,.header-9 .cta{ display:flex; } " +
      "@media(max-width:640px){ .header-9 .nav{ display:none; } } " +
      "@keyframes fade{ 0%{ opacity:0; } }";

    expect(validateSectionCss(css, ".header-9")).toEqual([]);
  });

  test.each(sections)("$name passes the validator it ships with", async ({ kind, name, root }) => {
    const css = await Bun.file(`${TEMPLATES}/${kind}/${name}.css`).text();
    expect(validateSectionCss(css, root)).toEqual([]);
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

describe("nodesToHtml", () => {
  const roundTrip = (html: string) => {
    const { nodes, rootNodes } = htmlToNodes(html);
    return rootNodes.map((id) => nodesToHtml(nodes, id)).join("");
  };

  test.each(sections)("$name survives a round trip", async ({ kind, name }) => {
    const html = await Bun.file(`${TEMPLATES}/${kind}/${name}.html`).text();

    const text = (source: string) => {
      const { document } = parseHTML(`<body>${source}</body>`);
      document.querySelectorAll("svg").forEach((svg: Element) => svg.remove());
      return (document.body.textContent ?? "").replace(/\s+/g, " ").trim();
    };
    const elements = (source: string) =>
      parseHTML(`<body>${source}</body>`).document.querySelectorAll("*").length;

    const exported = roundTrip(html);

    expect(text(exported)).toBe(text(html));
    expect(elements(exported)).toBe(elements(html));
  });

  test("drops the builder's bookkeeping, keeps the classes the CSS needs", () => {
    const exported = roundTrip(
      `<div class="s1 header-1" css-id="header-1" devGroupName='header' devName='Header'></div>`,
    );

    expect(exported).toContain('class="s1 header-1"');
    expect(exported).not.toContain("devName");
    expect(exported).not.toContain("css-id");
    expect(exported).not.toContain("dataId");
  });

  test("does not emit a closing tag for a void element", () => {
    expect(roundTrip("<p>a<br />b</p>")).toBe("<p>a<br>b</p>");
  });

  test("escapes text and attribute values", () => {
    const exported = roundTrip(`<a href="/x?a=1&b=2" title='He said "hi"'>a &lt; b</a>`);

    expect(exported).toContain("a &lt; b");
    expect(exported).toContain("&quot;hi&quot;");
    expect(exported).toContain("a=1&amp;b=2");
  });

  test("converts the style panel's camelCased edits into real CSS", () => {
    // node.style is a React style object. Serialised verbatim it would emit "backgroundColor:red",
    // which is not a property — every edit made in the style panel would silently vanish.
    const nodes = {
      root: {
        tag: "div",
        attribute: { class: "box", style: "opacity:0.5" },
        children: [],
        style: { backgroundColor: "red", borderRadius: "8px" },
      },
    };

    const exported = nodesToHtml(nodes, "root");

    expect(exported).toContain("background-color:red");
    expect(exported).toContain("border-radius:8px");
    expect(exported).toContain("opacity:0.5");
  });

  // The export is the file the user distributes to their visitors. Whatever ended up on a node in the
  // database — through an icon-replace bypass, or any other write path — must not become live script
  // in that file. The builder's live renderer already strips these; the export used to bake every
  // attribute in verbatim, which is a stored XSS that ships.
  test("strips event handlers from the exported HTML", () => {
    const nodes = {
      root: {
        tag: "svg",
        attribute: { onload: "alert(1)", viewBox: "0 0 1 1" },
        children: ["c"],
      },
      c: { tag: "circle", attribute: { r: "1", onmouseover: "steal()" }, children: [] },
    };

    const exported = nodesToHtml(nodes, "root");

    expect(exported).not.toMatch(/\son[a-z]+\s*=/i);
    expect(exported).toContain('viewBox="0 0 1 1"'); // the harmless attribute stays
  });

  test("neutralises a javascript: URL in the exported HTML", () => {
    const nodes = {
      root: {
        tag: "a",
        // Decoded form, as it would sit on the node after the HTML parser ran.
        attribute: { href: "javascript:alert(1)", 'xlink:href': 'javascript:alert(1)' },
        children: [],
      },
    };

    const exported = nodesToHtml(nodes, "root");

    expect(exported).not.toContain("javascript:");
    expect(exported).toContain('href="#"');
  });

  // The builder keeps an image's URL in `value` (it renders `<img src={value}>`) and the image panel
  // writes both value and src. A generic serialiser shipped `<img value=…>` (which no browser
  // honours) and never carried alt.
  test("exports an <img> with a real src and an alt", () => {
    const fromPanel = nodesToHtml(
      { i: { tag: "img", attribute: { value: "assets/hero.jpg", src: "assets/hero.jpg", devName: "Hero" }, children: [] } },
      "i",
    );
    expect(fromPanel).toBe('<img src="assets/hero.jpg" alt="Hero" />');

    // An AI-authored <img src> (no `value`) must still export a working src.
    const fromAi = nodesToHtml(
      { i: { tag: "img", attribute: { src: "https://images.unsplash.com/x.jpg", devName: "Product" }, children: [] } },
      "i",
    );
    expect(fromAi).toContain('src="https://images.unsplash.com/x.jpg"');

    // A javascript: URL smuggled into an image is still neutralised.
    const evil = nodesToHtml(
      { i: { tag: "img", attribute: { value: "javascript:alert(1)" }, children: [] } },
      "i",
    );
    expect(evil).toContain('src="#"');
  });
});

describe("buildSiteBundle", () => {
  const decoder = new TextDecoder();

  // A page as the app actually assembles it: html > body > div, with a section appended.
  const pageWith = async (kind: string, index: number) => {
    const scope = "s_1";
    const rawHtml = await Bun.file(`${TEMPLATES}/${kind}/${kind}${index}.html`).text();
    const rawCss = await Bun.file(`${TEMPLATES}/${kind}/${kind}${index}.css`).text();

    const section = htmlToNodes(rawHtml);
    for (const rootId of section.rootNodes) {
      const root = section.nodes[rootId]!;
      root.attribute["class"] = `${scope} ${root.attribute["class"] ?? ""}`.trim();
    }

    return {
      id: index,
      name: "My Shop",
      data: {
        nodes: {
          body: { tag: "body", attribute: {}, children: ["container"] },
          container: { tag: "div", attribute: {}, children: section.rootNodes },
          ...section.nodes,
        },
        bodyNode: "body",
      },
      css: scopeCss(cssToJson(rawCss), scope),
    };
  };

  test("produces a page that stands on its own", async () => {
    const bundle = await buildSiteBundle([await pageWith("header", 1)]);
    const html = decoder.decode(bundle["index.html"]!);
    const css = decoder.decode(bundle["style.css"]!);

    expect(html).toStartWith("<!doctype html>");
    expect(html).toContain('<link rel="stylesheet" href="style.css" />');
    expect(html).toContain('<meta name="viewport"');

    // Sections are authored against the builder's reset. Without it every heading and paragraph
    // picks up the browser's default margin and the page is not the one that was laid out.
    expect(css).toContain("box-sizing:border-box");
    expect(css).toContain("margin:0");
    // And the builder forces a font onto everything, so no template ever declared one — export
    // without a base font and the page falls back to Times New Roman.
    expect(css).toContain("font-family:");
  });

  test("ships the classes the CSS targets and none of the builder's bookkeeping", async () => {
    const bundle = await buildSiteBundle([await pageWith("header", 1)]);
    const html = decoder.decode(bundle["index.html"]!);

    expect(html).toContain('class="s_1 header-1"');
    for (const attribute of ["devName", "devIcon", "devGroupName", "css-id", "dataId"]) {
      expect(html).not.toContain(attribute);
    }
  });

  test("keeps the semantics the templates were given", async () => {
    const bundle = await buildSiteBundle([await pageWith("header", 1)]);
    const html = decoder.decode(bundle["index.html"]!);

    expect(html).toContain('<button type="button"');
    expect(html).toContain('href="#"');
    expect(html).toContain("aria-label=");
  });

  // The point of the export is that the user can take the site anywhere. A page that still fetches
  // its hero from someone else's CDN has not gone anywhere — it is one policy change away from a
  // hole. These tests pin that: it pulls the image in when it can, and stays usable when it cannot.
  //
  // Both the DNS lookup (the SSRF guard) and the fetch are stubbed, so nothing here touches the real
  // network — a unit test that depends on live DNS is a unit test that fails on a plane.
  const withNetwork = async (
    fetchImpl: (url: string) => Promise<Response>,
    run: () => Promise<void>,
    dnsAddress = "93.184.216.34", // a public address, so the SSRF guard allows the fetch
  ) => {
    const realFetch = globalThis.fetch;
    const realLookup = dns.lookup;
    globalThis.fetch = ((input: string) => fetchImpl(String(input))) as typeof fetch;
    (dns as { lookup: unknown }).lookup = async () => [
      { address: dnsAddress, family: 4 },
    ];
    try {
      await run();
    } finally {
      globalThis.fetch = realFetch;
      (dns as { lookup: unknown }).lookup = realLookup;
    }
  };

  const jpegResponse = async () =>
    new Response(new Uint8Array([1, 2, 3]), {
      headers: { "content-type": "image/jpeg" },
    });

  test("pulls a remote image into the bundle and cuts the link to the CDN", async () => {
    const page = await pageWith("template", 2); // its hero is an unsplash.com background

    await withNetwork(jpegResponse, async () => {
      const bundle = await buildSiteBundle([page]);
      const css = decoder.decode(bundle["style.css"]!);

      const bundled = Object.keys(bundle).filter((f) => f.startsWith("assets/"));
      expect(bundled.length).toBeGreaterThan(0);

      // Not a single url() may still point off-box — that is the whole promise of the export.
      expect(css).not.toMatch(/url\(\s*['"]?https?:/);
      expect(css).toContain("assets/remote-");
    });
  });

  test("gives every page a file and points them all at one stylesheet", async () => {
    const home = { ...(await pageWith("header", 1)), id: 1, name: "Home" };
    const about = { ...(await pageWith("footer", 2)), id: 2, name: "About Us" };

    const bundle = await buildSiteBundle([home, about]);

    // The first page is the front door; the rest are named after themselves.
    expect(Object.keys(bundle)).toContain("index.html");
    expect(Object.keys(bundle)).toContain("about-us.html");

    // One stylesheet for the whole site: each section's rules are already scoped to a unique class,
    // so merging cannot collide, and the visitor's browser caches it across pages.
    expect(Object.keys(bundle).filter((f) => f.endsWith(".css"))).toEqual(["style.css"]);
    const css = decoder.decode(bundle["style.css"]!);
    expect(css).toContain(".s_1.header-1");
    expect(css).toContain(".s_1.footer-2");

    for (const file of ["index.html", "about-us.html"]) {
      expect(decoder.decode(bundle[file]!)).toContain('href="style.css"');
    }
  });

  test("writes the search-result metadata the builder has no field for", async () => {
    // template1 has a remote hero image, so stub the network to keep the test off the wire.
    await withNetwork(jpegResponse, async () => {
      const bundle = await buildSiteBundle([
        { ...(await pageWith("template", 1)), id: 1, name: "Home" },
      ]);
      const html = decoder.decode(bundle["index.html"]!);

      expect(html).toContain("<title>Home</title>");
      expect(html).toContain('<meta name="description"');
      expect(html).toContain('<meta property="og:title" content="Home" />');
      expect(html).toContain('<meta property="og:type" content="website" />');
    });
  });

  test("only writes the tags that need a domain once it has one", async () => {
    await withNetwork(jpegResponse, async () => {
      const page = { ...(await pageWith("template", 1)), id: 1, name: "Home" };

      const withoutDomain = await buildSiteBundle([page]);
      const withDomain = await buildSiteBundle([page], "https://shop.example");

      // A relative og:image is not a smaller version of the tag, it is a broken one — and a sitemap
      // of relative paths is not a sitemap. Better to leave them out than to ship them wrong.
      expect(decoder.decode(withoutDomain["index.html"]!)).not.toContain("og:image");
      expect(Object.keys(withoutDomain)).not.toContain("sitemap.xml");

      const html = decoder.decode(withDomain["index.html"]!);
      expect(html).toContain('<link rel="canonical" href="https://shop.example/index.html" />');
      expect(html).toContain('<meta property="og:url"');

      expect(decoder.decode(withDomain["sitemap.xml"]!)).toContain(
        "<loc>https://shop.example/index.html</loc>",
      );
      expect(decoder.decode(withDomain["robots.txt"]!)).toContain(
        "Sitemap: https://shop.example/sitemap.xml",
      );
    });
  });

  test("still exports a usable page when the CDN is unreachable", async () => {
    const page = await pageWith("template", 2);

    // DNS resolves fine (public address), but the fetch itself fails — the real "CDN is down" path.
    await withNetwork(
      async () => {
        throw new Error("network down");
      },
      async () => {
        const bundle = await buildSiteBundle([page]);
        const css = decoder.decode(bundle["style.css"]!);

        // Nothing to bundle, so the page keeps the original URL rather than losing the image —
        // degraded, but not broken, and never a failed export.
        expect(bundle["index.html"]).toBeDefined();
        expect(css).toContain("unsplash.com");
      },
    );
  });
});

describe("export SSRF guard", () => {
  // "Export my site" fetches every URL in the page's CSS, and that CSS is user input. The guard is
  // what stops it from being a button that makes the server GET an address only the server can reach.
  test.each([
    ["loopback", "http://127.0.0.1/x.png"],
    ["localhost by name (resolves to loopback)", "http://localhost/x.png"],
    ["the cloud metadata endpoint", "http://169.254.169.254/latest/meta-data/"],
    ["a private 10.x host", "http://10.0.0.5/x.png"],
    ["a private 192.168 host", "http://192.168.1.1/x.png"],
    ["a private 172.16 host", "http://172.16.0.1/x.png"],
    ["IPv6 loopback", "http://[::1]/x.png"],
    ["a non-http scheme", "file:///etc/passwd"],
  ])("blocks %s", async (_label, url) => {
    expect(await reachesOnlyThePublicInternet(url)).toBe(false);
  });

  test("allows a literal public IP", async () => {
    expect(await reachesOnlyThePublicInternet("https://1.1.1.1/x.png")).toBe(true);
  });

  test("allows a hostname that resolves to a public address", async () => {
    // Don't depend on live DNS in a unit test — stub the lookup so the assertion is deterministic.
    const real = dns.lookup;
    (dns as { lookup: unknown }).lookup = async () => [
      { address: "93.184.216.34", family: 4 },
    ];
    try {
      expect(
        await reachesOnlyThePublicInternet("https://images.unsplash.com/x.jpg"),
      ).toBe(true);
    } finally {
      (dns as { lookup: unknown }).lookup = real;
    }
  });

  test("blocks a hostname that resolves to a private address (DNS rebinding)", async () => {
    // A public-looking name that answers with a private IP is the classic bypass.
    const real = dns.lookup;
    (dns as { lookup: unknown }).lookup = async () => [
      { address: "169.254.169.254", family: 4 },
    ];
    try {
      expect(
        await reachesOnlyThePublicInternet("http://not-suspicious-at-all.com/x"),
      ).toBe(false);
    } finally {
      (dns as { lookup: unknown }).lookup = real;
    }
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

  test("keeps ordinary relative URLs, blocks scheme-bearing ones", () => {
    // A relative URL cannot run script, so it is safe — the exporter rewrites bundled images to
    // exactly this shape ("assets/x.png"), and it must not be clobbered to "#".
    const kept = sanitized(
      '<div><a href="assets/x.png">a</a><a href="/about">b</a><a href="products/1">c</a></div>',
    )
      .filter((n) => n.tag === "a")
      .map((n) => n.attribute.href);
    expect(kept).toEqual(["assets/x.png", "/about", "products/1"]);

    // But a dangerous scheme is still neutralised, even the ones the old allowlist never named.
    const blocked = sanitized(
      '<div><a href="data:text/html,<script>1</script>">a</a><a href="vbscript:msgbox">b</a></div>',
    )
      .filter((n) => n.tag === "a")
      .map((n) => n.attribute.href);
    expect(blocked).toEqual(["#", "#"]);
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
