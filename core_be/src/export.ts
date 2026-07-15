import dns from "node:dns/promises";
import net from "node:net";

import { zipSync } from "fflate";

import type { CssNode, PageNode } from "./page";
import { pg } from "./postgres";
import { extractUser, jsonToCss, nodesToHtml } from "./utils";

interface ExportedPage {
  id: number;
  name: string;
  data: { nodes: Record<string, PageNode>; bodyNode: string };
  css: CssNode;
}

// Sections are authored against the builder canvas, which zeroes margins and switches every box to
// border-box. Ship the page without this and every <h2>, <p> and <ul> picks up the browser's default
// margin — the exported page would not be the page the user laid out.
//
// The base font matters for the same reason, and is easier to miss: the builder forces
// `font-family: … !important` onto every element, so no template ever needed one of its own. Export
// without a base font and the page falls back to the browser's default serif — a Times New Roman
// hero under a sans-serif header. The FONT IS THE PAGE'S DECISION, not the section's, so it belongs
// here, where a section can still override it if it means to.
const RESET = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
body{font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
input,button,select,textarea{font:inherit;color:inherit}
img,svg{display:block;max-width:100%}
`;

// The promise of the export is that the user can take the site anywhere. A page that still fetches
// its hero image from images.unsplash.com every time a visitor loads it has not been taken anywhere —
// it is one CDN policy change, one firewall, one offline deploy away from a page full of holes. So
// pull the images into the bundle and cut the cord.
const REMOTE_IMAGE_IN_CSS = /url\(\s*['"]?(https?:\/\/[^'")\s]+)['"]?\s*\)/g;
// A bare remote image URL — an <img src> lives outside url(), so the CSS-shaped regex above misses it.
const REMOTE_IMAGE_BARE = /(https?:\/\/[^'")\s]+\.(?:png|jpe?g|gif|webp|avif|svg))(?:\?[^'"\s)]*)?/gi;
const LOCAL_UPLOAD = /\/uploads\/([a-zA-Z0-9_-]+\.(?:png|jpe?g|gif|webp|svg))/g;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 10_000;

const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

// This function fetches a URL that came out of the page's CSS — and the page's CSS is USER INPUT
// (the style panel writes to it, and the AI generator writes to it). Without this check, "export my
// site" is a button that makes the server issue a GET to any address the user names, including the
// ones only the server can reach: 127.0.0.1, the private network, and the cloud metadata endpoint at
// 169.254.169.254 that hands out credentials. That is SSRF, and the export feature is what opened it.
const isPrivateAddress = (address: string) => {
  if (net.isIPv4(address)) {
    const [a, b] = address.split(".").map(Number) as [number, number];
    return (
      a === 0 || // this host
      a === 10 || // private
      a === 127 || // loopback
      (a === 169 && b === 254) || // link-local, incl. the cloud metadata service
      (a === 172 && b >= 16 && b <= 31) || // private
      (a === 192 && b === 168) || // private
      (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
      a >= 224 // multicast and reserved
    );
  }

  const ip = address.toLowerCase().replace(/^\[|\]$/g, "");
  return (
    ip === "::1" || // loopback
    ip === "::" ||
    ip.startsWith("fc") || // unique local
    ip.startsWith("fd") ||
    ip.startsWith("fe80") || // link-local
    ip.startsWith("::ffff:") // IPv4 mapped — check the v4 part instead
  );
};

export const reachesOnlyThePublicInternet = async (
  url: string,
): Promise<boolean> => {
  try {
    const { hostname, protocol } = new URL(url);
    if (protocol !== "http:" && protocol !== "https:") return false;

    // A literal IP needs no lookup, and a hostname is only as safe as what it resolves to.
    if (net.isIP(hostname)) return !isPrivateAddress(hostname);

    const addresses = await dns.lookup(hostname, { all: true });
    return (
      addresses.length > 0 &&
      addresses.every(({ address }) => !isPrivateAddress(address))
    );
  } catch {
    return false;
  }
};

/** Fetch one remote image. Returns null on anything unexpected — the export must never fail because
 *  somebody else's CDN was slow. */
const fetchImage = async (
  url: string,
): Promise<{ name: string; bytes: Uint8Array } | null> => {
  try {
    if (!(await reachesOnlyThePublicInternet(url))) {
      console.warn(`Export: refusing to fetch ${url} — not a public address.`);
      return null;
    }

    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: "follow",
    });
    // A redirect is a second chance to point us somewhere private, so re-check where we ended up.
    if (res.url && res.url !== url && !(await reachesOnlyThePublicInternet(res.url))) {
      return null;
    }
    if (!res.ok) return null;

    const mime = (res.headers.get("content-type") ?? "").split(";")[0]!.trim();
    if (!EXT_BY_MIME[mime]) return null;

    const bytes = new Uint8Array(await res.arrayBuffer());
    if (bytes.byteLength === 0 || bytes.byteLength > MAX_IMAGE_BYTES) return null;

    const hash = Bun.hash(url).toString(16).padStart(16, "0");
    return { name: `remote-${hash}.${EXT_BY_MIME[mime]}`, bytes };
  } catch {
    return null;
  }
};

const slugify = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * A crawler prints the description under the title in every search result, and the builder has no
 * field for one. Rather than ship an empty tag, take the page's own first sentence of real prose.
 *
 * Walking the tree in document order is not enough: the FIRST paragraph on the page belongs to the
 * header's promo bar, so a naive version puts "Free shipping on orders over $75" under every search
 * result. The header and the footer are chrome — they say nothing about what the page IS. The
 * builder already tells us which is which, via devGroupName.
 */
const describe = (
  nodes: Record<string, PageNode>,
  bodyNode: string,
): string => {
  const textOf = (node: PageNode): string => {
    const own = node.text ?? "";
    const kids = node.children
      .map((id) => nodes[id])
      .filter((child): child is PageNode => Boolean(child))
      .map(textOf)
      .join(" ");
    return `${own} ${kids}`.replace(/\s+/g, " ").trim();
  };

  const found: string[] = [];

  const walk = (id: string) => {
    const node = nodes[id];
    if (!node) return;

    const group = node.attribute["devGroupName"];
    if (group === "header" || group === "footer") return;

    if (node.tag === "p") {
      const text = textOf(node);
      if (text.length >= 40) {
        found.push(text);
        return;
      }
    }

    node.children.forEach(walk);
  };

  walk(bodyNode);

  const description = found[0] ?? "";
  return description.length > 157
    ? `${description.slice(0, 157).trimEnd()}…`
    : description;
};

interface PageMeta {
  title: string;
  description: string;
  file: string;
  image?: string;
}

const documentFor = (meta: PageMeta, body: string, baseUrl?: string) => {
  const canonical = baseUrl ? `${baseUrl}/${meta.file}` : undefined;
  const image = meta.image
    ? baseUrl
      ? `${baseUrl}/${meta.image}`
      : meta.image
    : undefined;

  const tags = [
    `<meta charset="utf-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
    `<title>${escapeHtml(meta.title)}</title>`,
  ];

  if (meta.description) {
    tags.push(
      `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    );
  }
  if (canonical) tags.push(`<link rel="canonical" href="${escapeHtml(canonical)}" />`);

  tags.push(
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
  );
  if (meta.description) {
    tags.push(
      `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    );
  }
  if (canonical) tags.push(`<meta property="og:url" content="${escapeHtml(canonical)}" />`);

  // og:image only works when it resolves to an absolute URL, so it is only honest to emit it once we
  // know the domain. A relative og:image is not a smaller version of the tag — it is a broken one.
  if (image && baseUrl) {
    tags.push(`<meta property="og:image" content="${escapeHtml(image)}" />`);
    tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
  } else {
    tags.push(`<meta name="twitter:card" content="summary" />`);
  }

  tags.push(`<link rel="stylesheet" href="style.css" />`);

  return `<!doctype html>
<html lang="en">
<head>
${tags.join("\n")}
</head>
${body}
</html>
`;
};

/**
 * The whole export, minus the database and the zip container — so it can be tested by rendering the
 * result in a browser instead of by trusting it.
 */
export const buildSiteBundle = async (
  pages: ExportedPage[],
  baseUrl?: string,
): Promise<Record<string, Uint8Array>> => {
  const files: Record<string, Uint8Array> = {};
  const encoder = new TextEncoder();

  // 1. Work out where every page will live. The first one is the site's front door.
  const taken = new Set<string>();
  const fileFor = (page: ExportedPage, index: number) => {
    if (index === 0) return "index.html";
    const base = slugify(page.name) || `page-${page.id}`;
    let file = `${base}.html`;
    let n = 2;
    while (taken.has(file)) file = `${base}-${n++}.html`;
    taken.add(file);
    return file;
  };

  const routes = pages.map((page, index) => ({
    page,
    file: fileFor(page, index),
  }));

  // 2. Collect every image the site points at, across all pages, so each one is fetched once. Images
  //    hide in two places: `background-image` in a style attribute or in the CSS, and the URL of an
  //    <img> node (which the builder keeps in `value`). Miss the second and an uploaded or remote
  //    <img> ships pointing at the builder's own host — a broken image the moment the site moves.
  const assetStrings = routes.flatMap(({ page }) =>
    Object.values(page.data.nodes).flatMap((node) => {
      const out: string[] = [];
      if (node.attribute["style"]) out.push(node.attribute["style"]);
      if (node.tag === "img") {
        const url = node.attribute["value"] || node.attribute["src"];
        if (url) out.push(url);
      }
      return out;
    }),
  );
  const rawCss = routes.map(({ page }) => jsonToCss(page.css ?? {}));
  const source = [...assetStrings, ...rawCss].join("\n");

  const rewrites = new Map<RegExp, string>();
  const bundled: string[] = [];

  for (const [, filename] of source.matchAll(LOCAL_UPLOAD)) {
    if (!filename) continue;
    const file = Bun.file(`assets/uploads/${filename}`);
    if (!(await file.exists())) continue;

    files[`assets/${filename}`] = new Uint8Array(await file.arrayBuffer());
    bundled.push(`assets/${filename}`);
    rewrites.set(
      new RegExp(`(?:https?:\\/\\/[^"'()\\s]*?)?\\/uploads\\/${filename}`, "g"),
      `assets/${filename}`,
    );
  }

  const remote = new Set(
    [
      ...[...source.matchAll(REMOTE_IMAGE_IN_CSS)].map(([, url]) => url!),
      ...[...source.matchAll(REMOTE_IMAGE_BARE)].map(([url]) => url),
    ]
      // A /uploads/ URL is a local asset on the builder's own host — it is handled by LOCAL_UPLOAD
      // above; the bare regex just happens to match it too. Don't also try to fetch it as remote.
      .filter((url) => !url.includes("/uploads/")),
  );
  const fetched = await Promise.all([...remote].map(fetchImage));

  [...remote].forEach((url, index) => {
    const image = fetched[index];
    if (!image) {
      // Someone else's server let us down. Ship the page pointing at the original URL rather than
      // with a hole where the image was, and say so.
      console.warn(`Export: could not bundle ${url}; leaving it remote.`);
      return;
    }
    files[`assets/${image.name}`] = image.bytes;
    bundled.push(`assets/${image.name}`);
    rewrites.set(
      new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      `assets/${image.name}`,
    );
  });

  const applyRewrites = (value: string) =>
    [...rewrites].reduce((out, [from, to]) => out.replace(from, to), value);

  // 3. Every page shares one stylesheet. Each section's rules are already scoped to a unique class,
  //    so merging them cannot collide — and the visitor's browser then caches it across the site.
  const css = RESET + rawCss.map(applyRewrites).join("");
  files["style.css"] = encoder.encode(css);

  // 4. The pages themselves.
  routes.forEach(({ page, file }, index) => {
    const { nodes, bodyNode } = page.data;

    // Rewrite the node attributes BEFORE serialising: nodesToHtml escapes the style attribute, so a
    // URL arrives in the markup carrying "&amp;" and a text replace afterwards would miss every one.
    // Same for an <img>'s URL, which nodesToHtml reads from `value`.
    for (const node of Object.values(nodes)) {
      if (node.attribute["style"]) {
        node.attribute["style"] = applyRewrites(node.attribute["style"]);
      }
      if (node.tag === "img") {
        if (node.attribute["value"]) {
          node.attribute["value"] = applyRewrites(node.attribute["value"]);
        }
        if (node.attribute["src"]) {
          node.attribute["src"] = applyRewrites(node.attribute["src"]);
        }
      }
    }

    // The share image has to be THIS page's image. Reaching for the first asset in the site would
    // put the home page's hero on the About page's Facebook card.
    const own = [
      ...Object.values(nodes).map((node) => node.attribute["style"] ?? ""),
      rawCss[index] ?? "",
    ].join("\n");
    const image = bundled.find((asset) => applyRewrites(own).includes(asset));

    const html = documentFor(
      {
        title: page.name || "Site",
        description: describe(nodes, bodyNode),
        file,
        image,
      },
      nodesToHtml(nodes, bodyNode),
      baseUrl,
    );

    files[file] = encoder.encode(html);
  });

  // 5. A sitemap needs absolute URLs, so it can only be written once the domain is known. Emitting
  //    one full of relative paths would be worse than emitting none.
  if (baseUrl) {
    const urls = routes
      .map(({ file }) => `  <url><loc>${escapeHtml(`${baseUrl}/${file}`)}</loc></url>`)
      .join("\n");

    files["sitemap.xml"] = encoder.encode(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    );
    files["robots.txt"] = encoder.encode(
      `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`,
    );
  }

  return files;
};

/** A trailing slash would double up in every URL we build from this. */
const normaliseBaseUrl = (value: string | null): string | undefined => {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return undefined;
  }
};

export const exportSite = async (req: Bun.BunRequest): Promise<Response> => {
  const user = await extractUser(req);
  if (!user) return new Response(null, { status: 401 });

  const baseUrl = normaliseBaseUrl(
    new URL(req.url).searchParams.get("baseUrl"),
  );

  const pages: ExportedPage[] = await pg`
    SELECT id, name, data, css FROM pages
    WHERE user_id = ${user.id}
    ORDER BY id;
  `;

  const exportable = pages.filter((page) => page.data?.nodes?.[page.data.bodyNode]);
  if (exportable.length === 0) {
    return new Response("Nothing to export yet", { status: 409 });
  }

  const zip = zipSync(await buildSiteBundle(exportable, baseUrl), { level: 6 });
  const slug = slugify(exportable[0]!.name) || "site";

  return new Response(zip as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${slug}.zip"`,
      "Content-Length": String(zip.byteLength),
    },
  });
};
