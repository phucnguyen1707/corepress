# builder_fe — the CorePress visual editor

A Next.js 16 / React 19 app. It loads a user's page from `core_be`, renders it as an editable canvas,
lets them add/edit/delete/reorder sections, switch and manage pages, and export the finished site.
The backend (`../core_be`) holds the source of truth and every hard invariant about the page format —
read `../core_be/CLAUDE.md` before touching anything that renders or persists a page.

## Where things live

- `components/edit/EditPage` — top-level editor shell. Owns the **active page id** and the page list,
  passes the active id down. `HeaderBar` (device toggle, save status, export, page switcher) and
  `BodySession` (the canvas + layers panel) hang off it.
- `components/edit/BodySession` — the heart. `renderNode` turns the node tree into live DOM;
  `renderTree` builds the layers panel; it also owns section add/delete and the debounced auto-save.
- `components/edit/PageSwitcher`, `components/modal/AddSection`, `components/setting/*` — page
  management, the add-section modal (+ AI tab), and the per-node style/text/image/layout panels.
- `axios/page.service.ts` — every call to the backend. `utils/mockupData.tsx` — the add-section
  catalogue (metadata only). `utils/saveStatus.ts` — the save-status store.

## The renderer is the trap (BodySession `renderNode`)

`renderNode` is the ONLY code that turns stored nodes back into DOM, and it used to be quietly wrong
in three ways that are now fixed — do not reintroduce them:

1. It rebuilds each node with its **real tag** (`React.createElement(tag, …)`), not a `<div>`. Nodes
   that carry text keep that text **nested inside** them (`[text, ...children]`), not as a sibling.
   The old code forced any node with text into a `<div>` and made text a sibling — which turned every
   `<button>`/`<a href>` label into a plain div: no keyboard focus, no href, no role.
2. `domAttributes` passes real HTML attributes through to the DOM (so `href`, `type`, `aria-label`
   survive), while dropping the builder's bookkeeping (`devName`/`devIcon`/`devGroupName`/`css-id`/
   `dataId`) and **stripping `on*` handlers + neutralising unsafe URLs** — the render side of the XSS
   defence. SVG presentation attributes are camelCased (`stroke-width` → `strokeWidth`).
3. An **`<img>`'s URL lives in `attribute.value`**, not `src` (`<img src={attribute.value}>`). The
   image panel writes both; keep that in mind anywhere you touch images.

## Auto-save (there is no "Save" button, by design)

Edits persist automatically: `updateNodeStyle` debounces an `editNode` call; add/delete/rename hit the
backend immediately. The header shows a **save status** ("Saving…/All changes saved/Save failed"),
not a button, because the work is already being saved. That status is driven from ONE place: axios
request/response interceptors in `page.service.ts` count in-flight **mutations** (POST/PATCH/DELETE)
into `utils/saveStatus.ts`. A GET (loading a page, fetching css, downloading the export) is a read and
must not read as "saving" — so if you add a mutating call, it flows through automatically; if you add
a read that shouldn't show saving, make sure it's a GET.

## Add-section previews come from the real files

`AddSection` fetches `GET /templates` and previews the **real** section HTML/CSS — the same source the
insert reads — so the preview cannot drift from what gets inserted. `mockupData.tsx` is metadata only
(id/name/description/category/icon); its `id` is `<kind>-<index>` and the numeric index is what the
insert route (`addSection`) keys the backend file by. Do NOT re-embed section markup here; that
duplicate is exactly what drifted before (previews stayed purple after the templates were rethemed).

## Notes

- `AGENTS.md`/`../core_iframe/CLAUDE.md` warn that this project's Next.js may differ from training
  data — check `node_modules/next/dist/docs/` before using an unfamiliar Next API.
- **`next build` is the real gate, not `tsc --noEmit`.** Next 16 validates each route's props
  against its own generated `LayoutProps`/`PageProps` types, and those checks live in
  `.next/**/validator.ts` — which `tsc` on `src/**` never sees. A `[locale]/layout` that typed
  `params` as the strict `Locale` enum passed `tsc` but FAILED the production build (the route
  provides `locale: string`); route param types must match what the route actually provides. Run
  `npx next build` before trusting the app compiles.
