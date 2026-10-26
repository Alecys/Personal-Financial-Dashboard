// ========================================
// PATHS
// ========================================

const rootName = window.location.pathname.split("/").filter(Boolean)[0] || "";

const root = rootName ? `/${rootName}` : "";

export const paths = {
  root: {
    path: root,
    js: `${root}/config.js`,
  },

  base: {
    js: `${root}/base/base.js`,
    css: `${root}/base/base.css`,
  },

  foundation: {
    js: `${root}/foundation/foundation.js`,
    css: `${root}/foundation/foundation.css`,
    elements: `${root}/foundation/foundation-elements.css`,
  },

  controller: {
    js: `${root}/controller/controller.js`,
  },

  applications: {
    js: `${root}/path/path_applications.js`,
  },

  blocks: {
    js: `${root}/path/path_blocks.js`,
  },
};
