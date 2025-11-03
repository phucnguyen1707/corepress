import type { User } from "./auth";
import type { PageNode } from "./page";
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

export function html_to_nodes(html: string): HtmlToNodesResult {
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

    nodes[id] = {
      tag: node.tagName.toLowerCase(),
      attribute: attrs,
      children,
      ...(text ? { text } : {}),
    };

    return id;
  }

  for (const child of Array.from(document.children)) {
    rootNodes.push(traverse(child));
  }

  return { nodes, rootNodes };
}
