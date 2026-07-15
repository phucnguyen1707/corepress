# core_be — the CorePress builder backend

A Bun HTTP server (`Bun.serve`, port 8000) over Postgres. It stores the pages a user builds in the
visual editor, adds/edits/deletes their sections, generates sections with AI, and exports a finished
site as a static zip. Entry point: `src/index.ts`. Run `bun start`; test `bun test`.

The one thing to internalise before changing anything here: **this codebase's characteristic bug is
silent failure.** A rule can be valid CSS or valid HTML, look right when you open the file, and still
be mangled or dropped without any error — the damage only shows up in what the user's visitor
eventually sees. Most of the invariants below exist to close one of those traps, and every one has a
regression test in `src/utils.test.ts`. Do not "simplify" them away without reading the test first.

## Request flow

`index.ts` wraps every route with CORS and dispatches to handlers in `page.ts`, `auth.ts`, `ai.ts`,
`export.ts`, `upload.ts`, `templates.ts`. Routes worth knowing:

- `auth`: `/auth/register|login|logout`, `GET /auth/user` (returns `{ user, pages }`).
- pages: `GET /pages`, `POST /page`, `GET|DELETE /page/:id`, `PATCH /page/:id/rename`,
  `GET /page/:id/css`, `POST /page/:id/edit/css`, node CRUD under `/page/:id/node/...`
  (incl. `PATCH /page/:id/node/:parentId/reorder`, whose body `children` must be a **permutation**
  of the current children — `isPermutationOf` guards it so a reorder can't inject or drop a node),
  `POST /page/:id/section/add/:section_type/:template_index/node/:node_id`.
- AI: `POST /page/:id/ai/section/generate` (Groq, `llama-3.3-70b-versatile`, needs `GROQ_API_KEY`).
- assets: `GET /templates` (serves the real section files), `GET /site/export`, `POST /upload/image`,
  `GET /uploads/:filename`.

Auth is a random-UUID session in an httpOnly cookie; `extractUser` reads it. **Every page/query is
scoped `WHERE ... AND user_id = ${user.id}`** — keep it that way, and establish ownership *before*
any other check (see `deletePageById`, where a "last page" guard that ran first would have leaked
one user's state to another).

## The data model

A page is `{ data: { nodes, bodyNode, htmlNode }, css }`, both `jsonb`.

- **`nodes`**: a flat map `id → { tag, attribute, children, text?, style? }`. `htmlToNodes` builds it
  from HTML; `nodesToHtml` is the exact inverse (round-trip is tested against all shipped templates).
- **`css`**: `{ selector: { prop: value, "@media …": { … } } }`. The builder's style panel writes
  straight into these top-level selector keys (`updatePageCss`), so **the shape is a contract** — a
  change to it breaks the editor.

### The scope-class contract (critical)

When a section is added (`addSection` in `page.ts`, or `ai.ts`), it gets a unique class
`s_<nanoid>` prepended to its **root node only**, and its CSS is scoped under that class. So:

- The `s_…` class lives on exactly one node per section (the root). Children keep their template
  classes (`.nav`, `.logo`).
- Every css key for that section starts with `.s_….` (a selector) or `@keyframes s_…-name`.
- Deleting a section must delete its CSS too, or it orphans forever and bloats every export —
  `deleteNode` does this via `pruneOrphanedCss` + `scopeClassesOf`. Deleting a *child* node must NOT
  (the scope class is still on the surviving root).

## The CSS pipeline — `cssToJson → scopeCss → jsonToCss`

`cssToJson` is now a real parser (`css-tree`), not the old hand-rolled scanner. `scopeCss` rewrites a
section's CSS so it only affects that section. **Hard rules that fail silently if broken:**

1. **Every top-level selector must start with the section's root class** (`.header-1 .nav`, never a
   bare `.nav`). `scopeCss` produces `.<scope>.header-1 .nav`; a bare `.nav` becomes `.<scope>.nav`,
   which needs one element to carry both classes and so matches nothing. Four footers once shipped
   like this and lost 49 rules between them. `validateSectionCss` rejects this; `autoRootSelectors`
   auto-fixes it for AI output.
2. **Tokens go on the root class, never `:root`.** `:root` scopes to `.<scope>:root` → matches
   nothing. Put `--x` on `.header-1`; children inherit.
3. **`@media`/`@supports`/`@container` are nested *inside* each scoped selector, not emitted as a
   top-level key.** A shared top-level `@media(...)` key was clobbered by the page-wide shallow jsonb
   merge (`css || new`), silently deleting other sections' responsive rules. Same reason `@keyframes`
   names are auto-namespaced per section, and form `name`s are namespaced (`scopeFormNames`) — three
   faces of one bug: *a global name + many sections on one page = last write wins.*
4. Only `@media`/`@supports`/`@container`/`@keyframes` survive. `@layer`/`@font-face`/`@import` can't
   be scoped and are rejected. `&` nesting and `;`-in-a-value (data: URIs) DO work now.
5. **Never `height: 100%` on a section root.** In the exported page the parent is an auto-height
   `<div>`, so a percentage resolves to `auto` and a section of absolutely-positioned children
   collapses to zero pixels (this killed template5's slideshow). Use `min-height`.

## HTML ↔ nodes

- `htmlToNodes` preserves **every run of mixed text** (`Limited time: <strong>10% off</strong> for…`
  keeps all three parts, in order) as `#text` child nodes; the old code kept only the last run.
- `nodesToHtml` is what makes a page shippable. It drops builder-only attributes
  (`devName`/`devIcon`/`devGroupName`/`css-id`/`dataId`), void tags self-close, `node.style` (a
  camelCased React object) is serialised to real CSS, and — the trap — an **`<img>` keeps its URL in
  `attribute.value`, not `src`** (the builder renders `<img src={value}>`); `nodesToHtml` normalises
  that to a real `src` + `alt`.

## Security invariants (do not weaken)

- **All three content-input paths sanitise the PARSED tree, not the raw string** (a regex over markup
  is bypassable — `<scri<script></script>pt>` and entity-encoded `javascript&#58;` slip past one):
  AI (`generateSection`) and icon replace (`replaceIcon`) both call `sanitizeNodes`; templates are
  curated. `sanitizeNodes` drops forbidden tags, strips `on*` handlers, and neutralises unsafe URLs.
- **Both output paths sanitise too**: the builder renderer (`BodySession.tsx`) and the exporter
  (`nodesToHtml`) each strip `on*` and neutralise `javascript:`/`data:` URLs — so a stored XSS can't
  ship even if bad data reaches the DB by some other route.
- `isSafeUrl` blocks by **dangerous scheme** (`javascript:`, `data:`, `vbscript:`), not by an
  allowlist of prefixes — a relative URL (`assets/x.png`) has no scheme and is safe. Don't revert it
  to prefix-matching; that breaks the exporter's bundled-image paths.
- **Export never fetches a private address.** `reachesOnlyThePublicInternet` resolves the host and
  refuses loopback / private / link-local / the cloud-metadata IP — otherwise "export my site" is an
  SSRF button, because image URLs come from user CSS. It fails closed.
- Uploaded files: allowlisted image MIME, server-chosen filename (no path traversal), and served with
  `Content-Security-Policy: …; sandbox` + `nosniff` so an uploaded SVG can't run script on this
  origin.
- Logout revokes the session in the DB (`users.session = NULL`), not just the cookie.

## Export = distribution (`export.ts`)

`GET /site/export` zips every page the user owns as `index.html` (front door) + `<slug>.html` +
one shared `style.css` + `assets/`. Non-obvious requirements, each learned from a real break:

- Ship the builder's **reset CSS and a base `font-family`** — sections are authored against the
  builder canvas (which zeroes margins and forces a font with `!important`), so without them the
  exported page picks up browser-default margins and a Times-New-Roman serif.
- **Pull every image into the bundle** — `background-image` URLs in CSS/style *and* `<img>` src/value,
  both uploaded (`/uploads/`) and remote (`images.unsplash.com`) — and rewrite the references to
  `assets/…`. A page that still fetches its hero from someone else's CDN has not "gone anywhere".
  If a fetch fails, keep the original URL (degrade, never fail the export).
- SEO tags, `sitemap.xml`, `robots.txt`, and `og:image` are only written when a `baseUrl` is given —
  a relative canonical/sitemap is worse than none.

## The section library

`assets/templates/{header,footer,template}/<kind><N>.{html,css}` are the real sections. Body sections
are `template<N>` (1–5 heroes/etc., 6–11 features/pricing/testimonials/faq/cta/contact). The frontend
`AddSection` modal previews and inserts them; both now read the **real files** via `GET /templates`,
so the preview can no longer drift from what gets inserted (it used to embed a stale copy). The FE's
`mockupData.tsx` is metadata only (name/description/category), keyed `<kind>-<N>` where `N` is the
numeric template index the insert route needs.

`GET /templates` caches the files in memory on first read, so **restart the server after adding a
template file** for it to appear.

## Testing

`bun test` runs `src/utils.test.ts` — the guardrail for every invariant above (scoping,
name-collisions, mixed-content, round-trip, self-standing height, sanitisation, SSRF, export,
auto-rooting, orphan-CSS pruning). If you change pipeline or sanitisation behaviour, a test should
change with it; if a test goes red, assume the code regressed before assuming the test is wrong.
