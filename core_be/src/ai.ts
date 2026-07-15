import {
  autoRootSelectors,
  cssToJson,
  extractUser,
  htmlToNodes,
  sanitizeNodes,
  scopeCss,
  scopeFormNames,
  validateSectionCss,
} from "./utils";
import { pg } from "./postgres";
import { nanoid } from "nanoid";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const ALLOWED_SECTIONS = new Set(["header", "footer", "template"]);

interface GenerateRequest {
  prompt: string;
  sectionType: string;
  nodeId: string;
}

const SYSTEM_PROMPT = `You are a senior web designer. Generate a single reusable website section as scoped HTML and CSS.

Output rules (STRICT):
- Return ONLY valid JSON with this exact shape: {"html": string, "css": string}.
- HTML: a single root <div> containing the section. No <html>, <head>, <body>, <script>, <link>, <style>, or <iframe>. No event handlers (onclick, onload, etc). No javascript: URLs. Use placeholder text/images only.
- CSS: plain CSS only, and EVERY selector must start with the single root class you used in the HTML (e.g. ".my-header .logo { ... }" — never a bare ".logo { ... }", which will match nothing).
- CSS: @media, @supports, @container and @keyframes all work, and so does & nesting. Do NOT use :root, @layer, @font-face or @import — those cannot be scoped to one section and are rejected. Put custom properties on your root class (".my-header { --brand: #0A6E5E; }"); children inherit them.
- CSS: remote images may only come from https://images.unsplash.com. A data: URI is allowed, but for icons prefer an inline <svg> in the HTML using currentColor.
- Do not include markdown fences or commentary. Only the JSON.`;

const stripDangerousHtml = (html: string): string => {
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, "");
  s = s.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
  s = s.replace(/<link\b[^>]*>/gi, "");
  s = s.replace(/\s+on[a-z]+\s*=\s*"[^"]*"/gi, "");
  s = s.replace(/\s+on[a-z]+\s*=\s*'[^']*'/gi, "");
  s = s.replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, "");
  s = s.replace(/(href|src|action|formaction)\s*=\s*"(\s*javascript:[^"]*)"/gi, '$1="#"');
  s = s.replace(/(href|src|action|formaction)\s*=\s*'(\s*javascript:[^']*)'/gi, "$1='#'");
  return s;
};

const stripDangerousCss = (css: string): string => {
  let s = css;
  s = s.replace(/@import[^;]*;/gi, "");
  s = s.replace(/expression\s*\([^)]*\)/gi, "");
  s = s.replace(/javascript\s*:/gi, "");
  s = s.replace(/behavior\s*:[^;]*;?/gi, "");
  return s;
};

const parseModelJson = (raw: string): { html: string; css: string } | null => {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced?.[1] ?? raw;
  try {
    const parsed = JSON.parse(body);
    if (typeof parsed?.html === "string" && typeof parsed?.css === "string") {
      return parsed;
    }
  } catch {
    // fall through
  }
  return null;
};

export const generateSection = async (
  req: Bun.BunRequest<"/page/:id/ai/section/generate">,
): Promise<Response> => {
  const user = await extractUser(req);
  if (!user) return new Response(null, { status: 401 });

  const pageId = req.params.id;
  if (!pageId) return new Response(null, { status: 400 });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response("GROQ_API_KEY is not configured", { status: 500 });
  }

  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { prompt, sectionType, nodeId } = body;

  if (!prompt || typeof prompt !== "string" || prompt.length > 1000) {
    return new Response("Invalid prompt", { status: 400 });
  }
  if (!ALLOWED_SECTIONS.has(sectionType)) {
    return new Response("Invalid sectionType", { status: 400 });
  }
  if (!nodeId || typeof nodeId !== "string") {
    return new Response("Invalid nodeId", { status: 400 });
  }

  const [existing] = await pg`
    SELECT data->'nodes'->${nodeId} AS node
    FROM pages
    WHERE id = ${pageId} AND user_id = ${user.id};
  `;
  if (!existing?.node) {
    return new Response("Parent node not found", { status: 404 });
  }

  let modelJson: { html: string; css: string } | null = null;

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Section type: ${sectionType}\nUser request: ${prompt}`,
          },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq error:", groqRes.status, errText);
      return new Response(`AI provider error: ${groqRes.status}`, {
        status: 502,
      });
    }

    const data = (await groqRes.json()) as any;
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) {
      return new Response("Empty AI response", { status: 502 });
    }

    modelJson = parseModelJson(content);
  } catch (err) {
    console.error(err);
    return new Response("Failed to call AI provider", { status: 502 });
  }

  if (!modelJson) {
    return new Response("AI returned malformed output", { status: 502 });
  }

  const safeHtml = stripDangerousHtml(modelJson.html);
  const safeCss = stripDangerousCss(modelJson.css);

  try {
    const uniqueScopeId = `s_${nanoid(10)}`;
    const { nodes, rootNodes } = htmlToNodes(safeHtml);

    if (rootNodes.length === 0) {
      return new Response("AI returned empty HTML", { status: 502 });
    }

    // The regex pass above is a first line of defence, not the last one: it runs on the raw
    // string and is bypassable. This runs on the PARSED tree, so what it inspects is exactly
    // what the browser would see.
    sanitizeNodes(nodes, rootNodes);
    scopeFormNames(nodes, uniqueScopeId);

    // The CSS pipeline discards :root, @supports, @layer, @font-face and any selector that is not
    // rooted at the section's own class — silently, with no error. Refuse the section rather than
    // persist CSS that will quietly do nothing.
    const rootClassName = (nodes[rootNodes[0]!]?.attribute["class"] ?? "")
      .split(/\s+/)
      .filter(Boolean)[0];

    if (!rootClassName) {
      return new Response("AI section has no root class to scope its CSS to", {
        status: 502,
      });
    }

    // Forgive the model's most common mistake: a stray selector that forgot the section root. Rooting
    // it is exactly what scoping wants, so fix it rather than reject the whole generation. Anything
    // that genuinely cannot be scoped (:root, @layer, …) still fails validation below with a reason.
    const rootedCss = autoRootSelectors(safeCss, `.${rootClassName}`);

    const cssProblems = validateSectionCss(rootedCss, `.${rootClassName}`);
    if (cssProblems.length > 0) {
      console.error("Rejected AI CSS:", cssProblems);
      return new Response(
        `AI returned CSS this pipeline cannot express:\n- ${cssProblems.join("\n- ")}`,
        { status: 502 },
      );
    }

    const sectionLabel =
      sectionType.charAt(0).toUpperCase() + sectionType.slice(1);

    rootNodes.forEach((rootId: string) => {
      if (nodes[rootId]) {
        const currentClass = nodes[rootId].attribute["class"] || "";
        nodes[rootId].attribute["class"] =
          `${uniqueScopeId} ${currentClass}`.trim();
        nodes[rootId].attribute["devGroupName"] = sectionType;
        nodes[rootId].attribute["devName"] = `${sectionLabel} (AI)`;
        nodes[rootId].attribute["devIcon"] = sectionType;
      }
    });

    const rawCssJson = cssToJson(rootedCss);
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
  } catch (err) {
    console.error(err);
    return new Response("Failed to insert generated section", { status: 500 });
  }

  return new Response(null, { status: 200 });
};
