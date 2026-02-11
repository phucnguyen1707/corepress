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

    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 3) {
        const trimmed = child.textContent?.trim();
        if (trimmed) text = trimmed;
      } else if (child.nodeType === 1) {
        const cid = traverse(child as Element);
        children.push(cid);
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
