(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./group_tokens.js"));
    return;
  }
  const __MODULE_API = factory(root.Dictionary_Renderer_Group_Tokens || root.DictionaryRendererGroupTokens || {});
  root.Dictionary_Renderer_Group_Paths = __MODULE_API;
  root.DictionaryRendererGroupPaths = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function (tokensApi) {
  const GROUP_TOKEN_MAP = tokensApi.GROUP_TOKENS || {};

  function cleanText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function pathJoin(parts) {
    return (Array.isArray(parts) ? parts : []).map(cleanText).filter(Boolean).join(".");
  }

  const GROUP_PATHS = Object.freeze({
    RENDERER_EVENTS: pathJoin([GROUP_TOKEN_MAP.RENDERER, GROUP_TOKEN_MAP.EVENTS]),
    RENDERER_CORE_RUNTIME: pathJoin([GROUP_TOKEN_MAP.RENDERER, GROUP_TOKEN_MAP.CORE, GROUP_TOKEN_MAP.RUNTIME]),
    RENDERER_ENTRY_SELECTION: pathJoin([GROUP_TOKEN_MAP.RENDERER, GROUP_TOKEN_MAP.ENTRY, GROUP_TOKEN_MAP.SELECTION]),
    RENDERER_SNAPSHOT_HISTORY: pathJoin([GROUP_TOKEN_MAP.RENDERER, GROUP_TOKEN_MAP.SNAPSHOT, GROUP_TOKEN_MAP.HISTORY]),
    RENDERER_DIAGNOSTICS_RUNTIME_LOG: pathJoin([
      GROUP_TOKEN_MAP.RENDERER,
      GROUP_TOKEN_MAP.DIAGNOSTICS,
      GROUP_TOKEN_MAP.RUNTIME,
      GROUP_TOKEN_MAP.LOG
    ]),
    RENDERER_STATISTICS: pathJoin([GROUP_TOKEN_MAP.RENDERER, GROUP_TOKEN_MAP.STATISTICS]),
    RENDERER_UNIVERSE: pathJoin([GROUP_TOKEN_MAP.RENDERER, GROUP_TOKEN_MAP.UNIVERSE]),
    RENDERER_UNIVERSE_RENDER: pathJoin([GROUP_TOKEN_MAP.RENDERER, GROUP_TOKEN_MAP.UNIVERSE, GROUP_TOKEN_MAP.RENDER]),
    RENDERER_UNIVERSE_SELECTION: pathJoin([
      GROUP_TOKEN_MAP.RENDERER,
      GROUP_TOKEN_MAP.UNIVERSE,
      GROUP_TOKEN_MAP.SELECTION
    ]),
    RENDERER_RUNTIME_TIMERS: pathJoin([GROUP_TOKEN_MAP.RENDERER, GROUP_TOKEN_MAP.RUNTIME, GROUP_TOKEN_MAP.TIMERS]),
    RENDERER_SNAPSHOT: pathJoin([GROUP_TOKEN_MAP.RENDERER, GROUP_TOKEN_MAP.SNAPSHOT]),
    RENDERER_MATH: pathJoin([GROUP_TOKEN_MAP.RENDERER, GROUP_TOKEN_MAP.MATH])
  });

  return {
    GROUP_PATHS,
    pathJoin
  };
});
