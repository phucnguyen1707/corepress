import {
  cssToJson,
  extractUser,
  htmlToNodes,
  isPermutationOf,
  jsonToCss,
  pruneOrphanedCss,
  sanitizeNodes,
  scopeClassesOf,
  scopeFormNames,
  scopeCss,
} from "./utils";
import { makeInitialPageData } from "./constant";
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
  text?: string;
  // Written by the builder's style panel (BodySession.updateNodeStyle) and persisted through
  // editNode. It is a React style object, so its keys are camelCased — see nodesToHtml.
  style?: Record<string, string>;
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

const MAX_PAGES_PER_USER = 50;

// A page name shows up in the page switcher, the browser tab of the exported site, and its filename.
// Keep it to something a person would type, and never empty.
const cleanPageName = (raw: unknown): string | null => {
  if (typeof raw !== "string") return null;
  const name = raw.trim().replace(/\s+/g, " ").slice(0, 80);
  return name.length > 0 ? name : null;
};

// LIST PAGES
export const listPages = async (req: Bun.BunRequest): Promise<Response> => {
  const user = await extractUser(req);
  if (!user) return new Response(null, { status: 401 });

  const pages = await pg`
    SELECT id, name FROM pages WHERE user_id = ${user.id} ORDER BY id;
  `;

  return new Response(JSON.stringify({ pages }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// CREATE PAGE
export const createPage = async (req: Bun.BunRequest): Promise<Response> => {
  const user = await extractUser(req);
  if (!user) return new Response(null, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = cleanPageName((body as { name?: unknown }).name) ?? "New Page";

  const [{ count }] = await pg`
    SELECT COUNT(*)::int AS count FROM pages WHERE user_id = ${user.id};
  `;
  if (count >= MAX_PAGES_PER_USER) {
    return new Response("Page limit reached", { status: 409 });
  }

  const [page] = await pg`
    INSERT INTO pages (name, user_id, data)
    VALUES (${name}, ${user.id}, ${makeInitialPageData()})
    RETURNING id, name;
  `;

  return new Response(JSON.stringify(page), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};

// RENAME PAGE
export const renamePage = async (
  req: Bun.BunRequest<"/page/:id/rename">,
): Promise<Response> => {
  const user = await extractUser(req);
  if (!user) return new Response(null, { status: 401 });

  const pageId = req.params.id;
  const body = await req.json().catch(() => ({}));
  const name = cleanPageName((body as { name?: unknown }).name);
  if (!name) return new Response("A page name is required", { status: 400 });

  const [page] = await pg`
    UPDATE pages SET name = ${name}
    WHERE id = ${pageId} AND user_id = ${user.id}
    RETURNING id, name;
  `;
  if (!page) return new Response(null, { status: 404 });

  return new Response(JSON.stringify(page), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// DELETE PAGE
export const deletePageById = async (
  req: Bun.BunRequest<"/page/:id">,
): Promise<Response> => {
  const user = await extractUser(req);
  if (!user) return new Response(null, { status: 401 });

  const pageId = req.params.id;

  return await pg.begin(async (tx) => {
    // Establish ownership FIRST. A page that is not this user's must read as 404 whether or not it
    // exists — otherwise the "last page" check below would answer questions about someone else's
    // account (B trying to delete A's page would get a confusing 409 instead of a flat 404).
    const [target] = await tx`
      SELECT id FROM pages WHERE id = ${pageId} AND user_id = ${user.id};
    `;
    if (!target) return new Response(null, { status: 404 });

    // Deleting a user's last page leaves them with an empty builder and nothing to edit or export —
    // a broken state, not an intended one. Refuse it, and let the client offer to reset instead.
    const [{ count }] = await tx`
      SELECT COUNT(*)::int AS count FROM pages WHERE user_id = ${user.id};
    `;
    if (count <= 1) {
      return new Response("Cannot delete your only page", { status: 409 });
    }

    await tx`DELETE FROM pages WHERE id = ${pageId} AND user_id = ${user.id};`;
    return new Response(null, { status: 200 });
  });
};

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

// REORDER a node's children (move sections up/down)
export const reorderChildren = async (
  req: Bun.BunRequest<"/page/:id/node/:parentId/reorder">,
): Promise<Response> => {
  const user = await extractUser(req);
  if (!user) return new Response(null, { status: 401 });

  const pageId = req.params.id;
  const parentId = req.params.parentId;

  const body = await req.json().catch(() => null);
  const requested = (body as { children?: unknown })?.children;
  if (!Array.isArray(requested) || !requested.every((c) => typeof c === "string")) {
    return new Response("children must be an array of node ids", { status: 400 });
  }

  const [page] = await pg`
    SELECT data->'nodes'->${parentId}->'children' AS children
    FROM pages
    WHERE id = ${pageId} AND user_id = ${user.id};
  `;
  if (!page?.children) return new Response("Parent node not found", { status: 404 });

  // A reorder is a rearrangement, not a way to inject or delete nodes — the new order must be a
  // permutation of the current children. Anything else is a client bug or an attack, refused rather
  // than allowed to corrupt the tree.
  if (!isPermutationOf(requested, page.children)) {
    return new Response("children must be a permutation of the existing children", {
      status: 409,
    });
  }

  await pg`
    UPDATE pages
    SET data = jsonb_set(
      data,
      ${`{nodes,${parentId},children}`}::text[],
      ${requested}::jsonb
    )
    WHERE id = ${pageId} AND user_id = ${user.id};
  `;

  return new Response(null, { status: 200 });
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
    SELECT data, css FROM pages
    WHERE id = ${pageId} AND user_id = ${user.id};
  `;

  if (!page) return new Response(null, { status: 404 });

  const nodes = page.data.nodes as Record<string, PageNode>;
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

  // Deleting a section removes its node but used to LEAVE its scoped CSS in page.css forever — dead
  // weight that grows with every add/delete and bloats every export. Drop the CSS for any scope
  // class the deleted subtree carried that no SURVIVING node still uses.
  const removedScopes = new Set<string>();
  for (const id of allIds) {
    for (const s of scopeClassesOf(nodes[id]?.attribute?.["class"])) {
      removedScopes.add(s);
    }
  }
  for (const [id, node] of Object.entries(nodes)) {
    if (toDelete.has(id)) continue;
    for (const s of scopeClassesOf(node.attribute?.["class"])) removedScopes.delete(s);
  }

  const nextCss = pruneOrphanedCss(
    (page.css ?? {}) as Record<string, unknown>,
    removedScopes,
  );

  await pg`
    UPDATE pages
    SET css = ${nextCss}::jsonb,
        data = jsonb_set(
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

// REPLACE ICON (SVG subtree)
const ALLOWED_SVG_TAGS = new Set([
  "svg",
  "path",
  "circle",
  "rect",
  "polyline",
  "polygon",
  "line",
  "ellipse",
  "g",
  "defs",
  "lineargradient",
  "radialgradient",
  "stop",
  "title",
  "desc",
]);

const sanitizeSvg = (raw: string): string => {
  let s = raw;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, "");
  s = s.replace(/\s+on[a-z]+\s*=\s*"[^"]*"/gi, "");
  s = s.replace(/\s+on[a-z]+\s*=\s*'[^']*'/gi, "");
  s = s.replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, "");
  s = s.replace(/javascript\s*:/gi, "");
  return s;
};

export const replaceIcon = async (
  req: Bun.BunRequest<"/page/:id/icon/replace/:nodeId">,
): Promise<Response> => {
  const user = await extractUser(req);
  if (!user) return new Response(null, { status: 401 });

  const pageId = req.params.id;
  const nodeId = req.params.nodeId;

  let body: { svg?: string };
  try {
    body = (await req.json()) as { svg?: string };
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!body.svg || typeof body.svg !== "string" || body.svg.length > 20000) {
    return new Response("Invalid svg payload", { status: 400 });
  }

  const trimmed = body.svg.trim();
  if (!/^<svg[\s>]/i.test(trimmed)) {
    return new Response("Payload must start with <svg>", { status: 400 });
  }

  const safe = sanitizeSvg(trimmed);
  const { nodes: parsedNodes, rootNodes } = htmlToNodes(safe);
  if (rootNodes.length !== 1) {
    return new Response("Expected a single <svg> root", { status: 400 });
  }

  // The regex pass above guards attributes, and a regex over raw markup is bypassable (an entity-
  // encoded "javascript&#58;" slips past it, then the parser decodes it). Sanitise the PARSED tree
  // too — it strips event handlers and neutralises unsafe URLs on exactly the tags/attributes the
  // browser will see, which is what actually matters.
  sanitizeNodes(parsedNodes, rootNodes);

  const newRoot = parsedNodes[rootNodes[0]!];
  if (!newRoot || newRoot.tag !== "svg") {
    return new Response("Root element must be <svg>", { status: 400 });
  }

  for (const [, node] of Object.entries(parsedNodes)) {
    if (!ALLOWED_SVG_TAGS.has(node.tag.toLowerCase())) {
      return new Response(`Disallowed tag: <${node.tag}>`, { status: 400 });
    }
  }

  const [existing] = await pg`
    SELECT data->'nodes'->${nodeId} AS node, data->'nodes' AS nodes
    FROM pages
    WHERE id = ${pageId} AND user_id = ${user.id};
  `;
  if (!existing?.node) {
    return new Response("Node not found", { status: 404 });
  }
  if (existing.node.tag !== "svg") {
    return new Response("Target node is not an svg", { status: 400 });
  }

  const allNodes = existing.nodes as Record<string, { children?: string[] }>;
  const oldDescendants: string[] = [];
  const collect = (id: string) => {
    const n = allNodes[id];
    if (!n) return;
    for (const c of n.children || []) {
      oldDescendants.push(c);
      collect(c);
    }
  };
  collect(nodeId);

  const preservedDataId = existing.node.attribute?.dataId ?? nodeId;
  const mergedSvgNode = {
    ...newRoot,
    attribute: { ...newRoot.attribute, dataId: preservedDataId },
  };

  delete parsedNodes[rootNodes[0]!];
  const newChildNodes = parsedNodes;

  try {
    await pg.begin(async (sql) => {
      await sql`
        UPDATE pages
        SET data = jsonb_set(
          data || jsonb_build_object('nodes', data->'nodes' || ${newChildNodes}::jsonb),
          ${`{nodes,${nodeId}}`}::text[],
          ${mergedSvgNode}::jsonb
        )
        WHERE id = ${pageId} AND user_id = ${user.id};
      `;

      if (oldDescendants.length > 0) {
        await sql`
          UPDATE pages
          SET data = jsonb_set(
            data,
            '{nodes}',
            (
              SELECT COALESCE(jsonb_object_agg(key, value), '{}'::jsonb)
              FROM jsonb_each(data->'nodes')
              WHERE key NOT IN (SELECT unnest(${sql.array(oldDescendants, "text")}))
            )
          )
          WHERE id = ${pageId} AND user_id = ${user.id};
        `;
      }
    });
  } catch (err) {
    console.error("replaceIcon failed:", err);
    return new Response("Failed to replace icon", { status: 500 });
  }

  return new Response(null, { status: 200 });
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

  const allowedSections = new Set(["header", "footer", "template"]);
  if (!allowedSections.has(sectionType)) {
    return new Response(null, { status: 400 });
  }
  if (!/^\d+$/.test(templateIndex)) {
    return new Response(null, { status: 400 });
  }

  try {
    const [existing] = await pg`
      SELECT data->'nodes'->${nodeId} AS node
      FROM pages
      WHERE id = ${pageId} AND user_id = ${user.id};
    `;
    if (!existing?.node) {
      return new Response("Parent node not found", { status: 404 });
    }

    const html = await Bun.file(
      `assets/templates/${sectionType}/${sectionType}${templateIndex}.html`,
    ).text();

    const resultHTML = htmlToNodes(html);
    const nodes = resultHTML.nodes;
    const rootNodes = resultHTML.rootNodes;

    scopeFormNames(nodes, uniqueScopeId);

    const sectionLabel =
      sectionType.charAt(0).toUpperCase() + sectionType.slice(1);

    rootNodes.forEach((rootId: string) => {
      if (nodes[rootId]) {
        const currentClass = nodes[rootId].attribute["class"] || "";
        nodes[rootId].attribute["class"] =
          `${uniqueScopeId} ${currentClass}`.trim();
        nodes[rootId].attribute["devGroupName"] = sectionType;
        nodes[rootId].attribute["devName"] =
          `${sectionLabel} ${templateIndex}`;
        nodes[rootId].attribute["devIcon"] = sectionType;
      }
    });

    const cssText = await Bun.file(
      `assets/templates/${sectionType}/${sectionType}${templateIndex}.css`,
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

  return new Response(null, {
    status: 200,
  });
};
