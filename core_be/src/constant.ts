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
        attribute: { dataId: "div-01" }
      }
    },

    // // header section
    // "header-02": {
    //   tag: "div",
    //   attribute: { class: "header" },
    //   children: ["div-03", "div-05"],
    //   dev: {
    //     attribute: { dataId: "header-02" },
    //     builderRender: {
    //       groupName: "header",
    //       renderName: "Header",
    //       renderIconName: "header",
    //     },
    //   },
    // },

    // "div-03": {
    //   tag: "div",
    //   attribute: { class: "header__content" },
    //   children: ["div-04"],
    //   dev: {
    //     attribute: { dataId: "div-03" },
    //   },
    // },

    // "div-04": {
    //   tag: "text",
    //   attribute: { value: "MyWebsite", class: "header__title" },
    //   children: [],
    //   dev: {
    //     attribute: { dataId: "div-04" },
    //     builderRender: {
    //       renderName: "Header Title",
    //       renderIconName: "text",
    //     },
    //   },
    // },

    // "div-05": {
    //   tag: "div",
    //   attribute: { class: "header__menu" },
    //   children: ["div-06"],
    //   dev: {
    //     attribute: { dataId: "div-05" },
    //   },
    // },

    // "div-06": {
    //   tag: "div",
    //   attribute: { class: "menu-item" },
    //   children: ["a-07"],
    //   dev: {
    //     attribute: { dataId: "div-06" },
    //     builderRender: {
    //       renderName: "Header Menu",
    //       renderIconName: "menu",
    //     },
    //   },
    // },

    // "a-07": {
    //   tag: "a",
    //   attribute: { class: "menu-link" },
    //   children: ["text-08"],
    //   dev: {
    //     attribute: { dataId: "a-07" },
    //   },
    // },

    // "text-08": {
    //   tag: "text",
    //   attribute: { value: "Home" },
    //   children: [],
    //   dev: {
    //     attribute: { dataId: "text-08" },
    //     builderRender: {
    //       renderName: "Header Menu Text",
    //       renderIconName: "text",
    //     },
    //   },
    // },

    // // template section
    // "template-09": {
    //   tag: "div",
    //   attribute: { class: "template" },
    //   children: ["div-10"],
    //   dev: {
    //     attribute: { dataId: "template-09" },
    //     builderRender: {
    //       groupName: "template",
    //       renderName: "Template",
    //       renderIconName: "template",
    //     },
    //   },
    // },

    // "div-10": {
    //   tag: "div",
    //   attribute: { class: "hero__content" },
    //   children: ["div-11", "div-13"],
    //   dev: {
    //     attribute: { dataId: "div-10" },
    //   },
    // },

    // "div-11": {
    //   tag: "div",
    //   attribute: { class: "hero__image__container" },
    //   children: ["img-12"],
    //   dev: { attribute: { dataId: "div-11" } },
    // },

    // "img-12": {
    //   tag: "img",
    //   attribute: {
    //     class: "hero__image",
    //     value: "https://i.ibb.co/XrDHM9qq/pexels-thiago-kai-1873845-32394258.jpg",
    //   },
    //   children: [],
    //   dev: {
    //     attribute: { dataId: "img-12" },
    //     builderRender: {
    //       renderName: "Hero Image",
    //       renderIconName: "image",
    //     },
    //   },
    // },

    // "div-13": {
    //   tag: "div",
    //   attribute: { class: "hero__text__container" },
    //   children: ["h2-14", "div-16"],
    //   dev: { attribute: { dataId: "div-13" } },
    // },

    // "h2-14": {
    //   tag: "h2",
    //   attribute: { class: "hero__title" },
    //   children: ["text-15"],
    //   dev: { attribute: { dataId: "h2-14" } },
    // },

    // "text-15": {
    //   tag: "text",
    //   attribute: { value: "Welcome to My Website!" },
    //   children: [],
    //   dev: {
    //     attribute: { dataId: "text-15" },
    //     builderRender: {
    //       renderName: "Hero Title",
    //       renderIconName: "text",
    //     },
    //   },
    // },

    // "div-16": {
    //   tag: "div",
    //   attribute: { class: "hero__subtitle" },
    //   children: ["text-17"],
    //   dev: { attribute: { dataId: "div-16" } },
    // },

    // "text-17": {
    //   tag: "text",
    //   attribute: { value: "We are glad to have you here." },
    //   children: [],
    //   dev: {
    //     attribute: { dataId: "text-17" },
    //     builderRender: {
    //       renderName: "Hero Subtitle",
    //       renderIconName: "text",
    //     },
    //   },
    // },

    // // footer section
    // "footer-18": {
    //   tag: "div",
    //   attribute: { class: "footer" },
    //   children: ["div-19", "div-21"],
    //   dev: {
    //     attribute: { dataId: "footer-18" },
    //     builderRender: {
    //       groupName: "footer",
    //       renderName: "Footer",
    //       renderIconName: "footer",
    //     },
    //   },
    // },

    // "div-19": {
    //   tag: "div",
    //   attribute: { class: "footer__top" },
    //   children: ["text-20"],
    //   dev: { attribute: { dataId: "div-19" } },
    // },

    // "text-20": {
    //   tag: "text",
    //   attribute: { value: "Contact Us" },
    //   children: [],
    //   dev: {
    //     attribute: { dataId: "text-20" },
    //     builderRender: {
    //       renderName: "Footer Title Text",
    //       renderIconName: "text",
    //     },
    //   },
    // },

    // "div-21": {
    //   tag: "div",
    //   attribute: { class: "footer__bottom" },
    //   children: ["text-22"],
    //   dev: { attribute: { dataId: "div-21" } },
    // },

    // "text-22": {
    //   tag: "text",
    //   attribute: { value: "© 2025 MyWebsite. All rights reserved." },
    //   children: [],
    //   dev: {
    //     attribute: { dataId: "text-22" },
    //     builderRender: {
    //       renderName: "Footer Copyright",
    //       renderIconName: "text",
    //     },
    //   },
    // },
  },

  htmlNode: "placeholder-html-id",
  bodyNode: "placeholder-body-id",
};