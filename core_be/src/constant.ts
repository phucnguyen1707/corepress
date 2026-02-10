export const INITIAL_PAGE_DATA = {
  nodes: {
    "placeholder-html-id": {
      tag: "html",
      attribute: {},
      children: ["placeholder-body-id"],
    },

    "placeholder-body-id": {
      tag: "body",
      attribute: {},
      children: ["div-01"],
    },

    "div-01": {
      tag: "div",
      attribute: {},
      children: [],
      dev: {
        attribute: { dataId: "div-01" },
      },
    },
  },

  htmlNode: "placeholder-html-id",
  bodyNode: "placeholder-body-id",
};
