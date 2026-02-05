export interface PageNode {
  tag: string;
  attribute: Record<string, string>;
  children: string[];
  text?: string;
}

export interface Page {
  htmlNode: string;
  bodyNode: string;
  nodes: Record<string, PageNode>;
}
