(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Page_Namespace_Utils = __MODULE_API;
  root.DictionaryPageNamespaceUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function bindPageNamespace(root, pageMap) {
    const host = root && typeof root === "object" ? root : {};
    const namespace = host.page && typeof host.page === "object" ? host.page : {};
    host.page = namespace;

    const pages = pageMap && typeof pageMap === "object" ? pageMap : {};
    const bound = {};
    Object.keys(pages).forEach((pageName) => {
      const handlers = pages[pageName] && typeof pages[pageName] === "object" ? pages[pageName] : {};
      const slot = namespace[pageName] && typeof namespace[pageName] === "object" ? namespace[pageName] : {};
      namespace[pageName] = slot;
      Object.assign(slot, handlers);
      bound[pageName] = slot;
    });

    return bound;
  }

  return {
    bindPageNamespace
  };
});
