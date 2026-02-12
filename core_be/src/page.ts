import {
  cssToJson,
  extractUser,
  htmlToNodes,
  jsonToCss,
  scopeCss,
} from "./utils";
import { pg } from "./postgres";
import { nanoid } from "nanoid";

//! INTERFACE -----------------------------------------------------------------------------

interface Page {
  id: number;
  name: string;
  user_id: number;
  data: PageData;
  css: CssNode;
  created_at: Date;
}

interface PageData {
  bodyNode: string;
  htmlNode: string;
  nodes: Record<string, PageNode>;
}

export interface PageNode {
  attribute: Record<string, string>;
  tag: string;
  children: string[];
}

export interface CssNode {
  [key: string]: string | number | CssNode;
}

interface InsertNodeRequest {
  node: PageNode;
}

interface EditNodeRequest {
  node: PageNode;
}

//! CONTROLLER -----------------------------------------------------------------------------

// GET PAGE
export const getPage = async (
  req: Bun.BunRequest<"page/:id">,
): Promise<Response> => {
  const user = await extractUser(req);

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const pageId = req.params.id;

  if (!pageId) {
    return new Response(null, { status: 400 });
  }

  const [page]: [Page] =
    await pg`SELECT data FROM pages WHERE id = ${pageId} AND user_id = ${user.id};`;

  if (!page) {
    return new Response(null, { status: 404 });
  }

  return new Response(JSON.stringify(page), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// GET PAGE CSS
export const getPageCSS = async (
  req: Bun.BunRequest<"page/:id/css">,
): Promise<Response> => {
  const user = await extractUser(req);

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const pageId = req.params.id;

  if (!pageId) {
    return new Response(null, { status: 400 });
  }

  const [css] =
    await pg`SELECT css as json FROM pages WHERE id = ${pageId} AND user_id = ${user.id};`;

  if (!css) {
    return new Response(null, { status: 404 });
  }

  const response = {
    ...css,
    raw: jsonToCss(css.json).replace(/\n/g, ""),
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// UPDATE PAGE CSS
export const updatePageCss = async (
  req: Bun.BunRequest<"/page/:id/edit/css">,
): Promise<Response> => {
  const user = await extractUser(req);
  if (!user) return new Response(null, { status: 401 });

  const pageId = req.params.id;

  if (!pageId) {
    return new Response(null, { status: 400 });
  }

  try {
    const payload = await req.json();

    await pg.begin(async (sql) => {
      const [page]: [Page] = await sql`
        SELECT css FROM pages 
        WHERE id = ${pageId} AND user_id = ${user.id}
        FOR UPDATE
      `;

      if (!page) throw new Error("Page not found");

      const currentCss = page.css || {};

      for (const [selector, newStyles] of Object.entries(payload)) {
        // Get existing styles for this selector (or empty object if new)
        const existingStyles = (currentCss[selector] || {}) as CssNode;

        // Merge: Old styles + New styles (New overwrites Old only if keys match)
        currentCss[selector] = { ...existingStyles, ...(newStyles as CssNode) };
      }

      await sql`
        UPDATE pages
        SET css = ${currentCss}::jsonb
        WHERE id = ${pageId}
      `;
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Update failed:", error);
    return new Response("Error updating CSS", { status: 500 });
  }
};

// GET NODE
export const getNode = async (
  req: Bun.BunRequest<"/page/:id/node/:nodeId">,
): Promise<Response> => {
  const user = await extractUser(req);
  if (!user) return new Response(null, { status: 401 });

  const pageId = req.params.id;
  const nodeId = req.params.nodeId;

  const [page] = await pg`
    SELECT data->'nodes'->${nodeId} AS node
    FROM pages
    WHERE id = ${pageId} AND user_id = ${user.id};
  `;

  if (!page?.node) return new Response(null, { status: 404 });

  return new Response(JSON.stringify(page.node), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// INSERT NODE
export const insertNode = async (
  req: Bun.BunRequest<"/page/:id/node/insert/:parentId">,
): Promise<Response> => {
  const user = await extractUser(req);

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const pageId = req.params.id;
  const parentId = req.params.parentId;

  const [page]: [Page] =
    await pg`SELECT data FROM pages WHERE id = ${pageId} AND user_id = ${user.id};`;

  if (!page) {
    return new Response(null, { status: 404 });
  }

  const { node } = (await req.json()) as InsertNodeRequest;

  const newNodeId = crypto.randomUUID();

  await pg`
    UPDATE pages
    SET data = jsonb_set(
      jsonb_set(
        data,
        ${`{nodes,${newNodeId}}`}::text[],
        ${node}
      ),
      ${`{nodes,${parentId},children}`}::text[],
      (data->'nodes'->${parentId}->'children' || ${[newNodeId]})
    )
    WHERE id = ${pageId} AND user_id = ${user.id};
  `;

  return new Response(null, {
    status: 200,
  });
};

// EDIT NODE
export const editNode = async (
  req: Bun.BunRequest<"/page/:id/node/edit/:nodeId">,
): Promise<Response> => {
  const user = await extractUser(req);
  if (!user) return new Response(null, { status: 401 });

  const pageId = req.params.id;
  const nodeId = req.params.nodeId;

  const [page] = await pg`
    SELECT data FROM pages
    WHERE id = ${pageId} AND user_id = ${user.id};
  `;

  if (!page) return new Response("Page not found", { status: 404 });

  const { node } = (await req.json()) as EditNodeRequest;

  if (!node) return new Response("Node not found", { status: 400 });

  await pg`
    UPDATE pages
    SET data = jsonb_set(
      data,
      ${`{nodes,${nodeId}}`}::text[],
      ${node}
    )
    WHERE id = ${pageId} AND user_id = ${user.id};
  `;

  return new Response(null, {
    status: 200,
  });
};

// DELETE NODE
export const deleteNode = async (
  req: Bun.BunRequest<"/page/:id/node/delete/:nodeId">,
): Promise<Response> => {
  const user = await extractUser(req);
  if (!user) return new Response(null, { status: 401 });

  const pageId = req.params.id;
  const nodeId = req.params.nodeId;

  const [page] = await pg`
    SELECT data FROM pages
    WHERE id = ${pageId} AND user_id = ${user.id};
  `;

  if (!page) return new Response(null, { status: 404 });

  const nodes = page.data.nodes;
  if (!nodes[nodeId]) return new Response(null, { status: 404 });

  const collectDescendants = (id: string, acc: Set<string>) => {
    acc.add(id);
    const node = nodes[id];
    if (node?.children) {
      for (const childId of node.children) {
        collectDescendants(childId, acc);
      }
    }
  };

  const toDelete = new Set<string>();
  collectDescendants(nodeId, toDelete);
  const allIds = Array.from(toDelete);

  await pg`
    UPDATE pages
    SET data = jsonb_set(
      data,
      '{nodes}',
      (
        SELECT jsonb_object_agg(key, value)
        FROM (
          SELECT
            key,
            CASE
              WHEN value ? 'children' THEN
                jsonb_set(
                  value,
                  '{children}',
                  (
                    SELECT COALESCE(jsonb_agg(child_id), '[]'::jsonb)
                    FROM jsonb_array_elements_text(value->'children') AS child_id
                    WHERE child_id NOT IN (SELECT unnest(${pg.array(
                      allIds,
                      "text",
                    )}))
                  )
                )
              ELSE value
            END as value
          FROM jsonb_each(data->'nodes')
          WHERE key NOT IN (SELECT unnest(${pg.array(allIds, "text")}))
        ) AS filtered_nodes
      )
    )
    WHERE id = ${pageId} AND user_id = ${user.id};`;

  return new Response(null, {
    status: 200,
  });
};

// Add section
export const addSection = async (
  req: Bun.BunRequest<"/page/:id/section/add/:section_type/:template_index/node/:node_id">,
): Promise<Response> => {
  const user = await extractUser(req);
  if (!user) return new Response(null, { status: 401 });

  const pageId = req.params.id;
  const sectionType = req.params.section_type;
  const templateIndex = req.params.template_index;
  const nodeId = req.params.node_id;

  const uniqueScopeId = `s_${nanoid(10)}`;

  switch (sectionType) {
    case "header":
      try {
        const html = await Bun.file(
          `assets/templates/header/header${templateIndex}.html`,
        ).text();

        const resultHTML = htmlToNodes(html);
        const nodes = resultHTML.nodes;
        const rootNodes = resultHTML.rootNodes;

        rootNodes.forEach((rootId: string) => {
          if (nodes[rootId]) {
            const currentClass = nodes[rootId].attribute["class"] || "";
            nodes[rootId].attribute["class"] =
              `${uniqueScopeId} ${currentClass}`.trim();
          }
        });

        const cssText = await Bun.file(
          `assets/templates/header/header${templateIndex}.css`,
        ).text();

        const rawCssJson = cssToJson(cssText);

        const scopedCssJson = scopeCss(rawCssJson, uniqueScopeId);

        await pg`
          UPDATE pages
          SET 
            data = jsonb_set(
              data || jsonb_build_object('nodes', data->'nodes' || ${nodes}::jsonb),
              array['nodes', ${nodeId}, 'children']::text[],
              (data#>array['nodes', ${nodeId}, 'children']::text[] || ${rootNodes}::jsonb)
            ),
            css = css || ${scopedCssJson}::jsonb
          WHERE id = ${pageId} AND user_id = ${user.id};`;
      } catch (error) {
        console.error(error);
        return new Response("Template not found or Error processing", {
          status: 404,
        });
      }

      break;
    default:
      return new Response(null, { status: 400 });
  }

  return new Response(null, {
    status: 200,
  });
};
