(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Alias_Index = __MODULE_API;
  root.DictionaryAliasIndex = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  // Array-first alias index: [alias, [full English term, ...]]
  const SHORT_FORM_WORD_INDEX = [
    ["app", ["application"]],
    ["pg", ["page"]],
    ["rt", ["runtime"]],
    ["dom", ["document"]],
    ["cfg", ["configuration"]],
    ["idx", ["index"]],
    ["fx", ["effects"]],
    ["gfx", ["graphics"]],
    ["ui", ["user interface"]],
    ["ux", ["user experience"]],
    ["auth", ["authentication"]],
    ["diag", ["diagnostics"]],
    ["stat", ["statistics"]],
    ["tree", ["tree"]],
    ["graph", ["graph"]],
    ["uni", ["universe"]],
    ["mod", ["module"]],
    ["fn", ["function"]],
    ["arg", ["argument"]],
    ["val", ["value"]],
    ["ref", ["reference"]],
    ["tmp", ["temporary"]],
    ["cmd", ["command"]],
    ["evt", ["event"]],
    ["msg", ["message"]],
    ["api", ["application programming interface"]],
    ["ipc", ["inter-process communication"]],
    ["ch", ["channel"]],
    ["win", ["window"]],
    ["env", ["environment"]],
    ["util", ["utility"]]
  ];

  function normalizeAlias(value) {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
  }

  function createAliasMap(index = SHORT_FORM_WORD_INDEX) {
    const map = new Map();
    (Array.isArray(index) ? index : []).forEach((row) => {
      const alias = normalizeAlias(Array.isArray(row) ? row[0] : "");
      if (!alias) {
        return;
      }
      const words = Array.isArray(row[1]) ? row[1].filter((item) => typeof item === "string" && item.trim()) : [];
      map.set(alias, words);
    });
    return map;
  }

  function getAliasWords(alias, mapOrIndex = SHORT_FORM_WORD_INDEX) {
    const map = mapOrIndex instanceof Map ? mapOrIndex : createAliasMap(mapOrIndex);
    return map.get(normalizeAlias(alias)) || [];
  }

  return {
    ALIAS_WORD_INDEX: SHORT_FORM_WORD_INDEX,
    normalizeAlias,
    createAliasMap,
    getAliasWords
  };
});
