interface NodeAttributes {
  id?: string;
  class?: string;
  value?: string;
}

interface DevAttributes {
  dataId?: string;
}

interface BuilderRenderInterface {
  groupName?: 'header' | 'template' | 'footer';
  renderName?: string;
  renderIconName?: string;
}

interface PageNode {
  tag: string;
  attribute: NodeAttributes;
  children: string[];
  dev: {
    attribute: DevAttributes;
    builderRender?: BuilderRenderInterface;
  };
}

export interface Page {
  htmlNode: string;
  bodyNode: string;
  nodes: Record<string, PageNode>;
}
