export interface PageNode {
  dev?: any;
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

export interface CssData {
  json: {
    [className: string]: Record<string, string>;
  };
  raw: string;
}

// export interface CSSProperties {
//   [property: string]: string | number | CSSProperties;
// }

// export interface CSSJson {
//   [selector: string]: CSSProperties | CSSJson;
// }
