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
  devAttribute?: DevAttributes;
  builderRender?: BuilderRenderInterface;
}

export interface Page {
  rootNode: string;
  nodes: Record<string, PageNode>;
}
