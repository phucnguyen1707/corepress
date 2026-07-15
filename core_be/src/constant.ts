/**
 * A brand-new page: html > body > an empty `div-01` container. The container id is LITERAL, not a
 * UUID, because addSection appends every section under the node called `div-01` — so every page,
 * however it was created, has to have one. Only the html/body ids are made unique per page.
 */
export const makeInitialPageData = () => {
  const htmlId = crypto.randomUUID();
  const bodyId = crypto.randomUUID();
  return JSON.parse(
    JSON.stringify(INITIAL_PAGE_DATA)
      .replaceAll("placeholder-html-id", htmlId)
      .replaceAll("placeholder-body-id", bodyId),
  );
};

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
