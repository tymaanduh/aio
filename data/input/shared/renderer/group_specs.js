(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./group_tokens.js"), require("./group_paths.js"));
    return;
  }
  const __MODULE_API = factory(
    root.Dictionary_Renderer_Group_Tokens || root.DictionaryRendererGroupTokens || {},
    root.Dictionary_Renderer_Group_Paths || root.DictionaryRendererGroupPaths || {}
  );
  root.Dictionary_Renderer_Group_Specs = __MODULE_API;
  root.DictionaryRendererGroupSpecs = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function (tokensApi, pathsApi) {
  const GROUP_TOKEN_MAP = tokensApi.GROUP_TOKENS || {};
  const GROUP_PATH_MAP = pathsApi.GROUP_PATHS || {};
  const HOOK_KEYS = Object.freeze({
    PRE_LOAD: "pre_load",
    POST_LOAD: "post_load"
  });

  const RUNTIME_MODE = Object.freeze({
    LEGACY: GROUP_TOKEN_MAP.LEGACY || "legacy",
    DUAL: GROUP_TOKEN_MAP.DUAL || "dual",
    MODULAR: GROUP_TOKEN_MAP.MODULAR || "modular",
    active: GROUP_TOKEN_MAP.MODULAR || "modular"
  });

  const DOMAIN_GROUPS = Object.freeze({
    CORE_RUNTIME: GROUP_PATH_MAP.RENDERER_CORE_RUNTIME || "renderer.core.runtime",
    ENTRY_SELECTION: GROUP_PATH_MAP.RENDERER_ENTRY_SELECTION || "renderer.entry.selection",
    SNAPSHOT_HISTORY: GROUP_PATH_MAP.RENDERER_SNAPSHOT_HISTORY || "renderer.snapshot.history",
    DIAGNOSTICS_RUNTIME_LOG:
      GROUP_PATH_MAP.RENDERER_DIAGNOSTICS_RUNTIME_LOG || "renderer.diagnostics.runtime.log",
    STATISTICS: GROUP_PATH_MAP.RENDERER_STATISTICS || "renderer.statistics",
    EVENTS: GROUP_PATH_MAP.RENDERER_EVENTS || "renderer.events",
    UNIVERSE: GROUP_PATH_MAP.RENDERER_UNIVERSE || "renderer.universe",
    UNIVERSE_RENDER: GROUP_PATH_MAP.RENDERER_UNIVERSE_RENDER || "renderer.universe.render",
    UNIVERSE_SELECTION: GROUP_PATH_MAP.RENDERER_UNIVERSE_SELECTION || "renderer.universe.selection",
    RUNTIME_TIMERS: GROUP_PATH_MAP.RENDERER_RUNTIME_TIMERS || "renderer.runtime.timers",
    SNAPSHOT: GROUP_PATH_MAP.RENDERER_SNAPSHOT || "renderer.snapshot",
    MATH: GROUP_PATH_MAP.RENDERER_MATH || "renderer.math"
  });

  return {
    HOOK_KEYS,
    hook_keys: HOOK_KEYS,
    RUNTIME_MODE,
    runtime_mode: RUNTIME_MODE,
    DOMAIN_GROUPS
  };
});
