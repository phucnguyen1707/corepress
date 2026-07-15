import { readdir } from "node:fs/promises";

// The add-section modal previews a section before you insert it, and it used to preview a hand-kept
// COPY of each template embedded in the frontend. That copy drifted — after the templates were
// rethemed, the previews still showed the old design, so the preview no longer matched what would be
// inserted. This endpoint serves the real files instead, making the copy — and the drift — go away.

type Kind = "header" | "footer" | "template";
const KINDS: Kind[] = ["header", "footer", "template"];
const TEMPLATES_DIR = "assets/templates";

interface TemplateAsset {
  index: number;
  html: string;
  css: string;
}

// The files never change while the server is up, so read them once.
let cache: Record<Kind, TemplateAsset[]> | null = null;

const load = async (): Promise<Record<Kind, TemplateAsset[]>> => {
  if (cache) return cache;

  const result = {} as Record<Kind, TemplateAsset[]>;

  for (const kind of KINDS) {
    const dir = `${TEMPLATES_DIR}/${kind}`;
    const indices = new Set<number>();
    for (const file of await readdir(dir)) {
      const match = file.match(new RegExp(`^${kind}(\\d+)\\.(?:html|css)$`));
      if (match) indices.add(Number(match[1]));
    }

    const assets: TemplateAsset[] = [];
    for (const index of [...indices].sort((a, b) => a - b)) {
      const html = Bun.file(`${dir}/${kind}${index}.html`);
      const css = Bun.file(`${dir}/${kind}${index}.css`);
      if (!(await html.exists()) || !(await css.exists())) continue;
      assets.push({ index, html: await html.text(), css: await css.text() });
    }
    result[kind] = assets;
  }

  cache = result;
  return result;
};

export const listTemplates = async (): Promise<Response> => {
  const templates = await load();

  return new Response(JSON.stringify(templates), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // Static design assets — safe for the browser to hold onto for a while.
      "Cache-Control": "public, max-age=300",
    },
  });
};
