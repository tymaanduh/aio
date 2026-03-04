(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Group_Tokens = __MODULE_API;
  root.DictionaryRendererGroupTokens = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const GROUP_TOKENS = Object.freeze({
    APP: "app",
    RENDERER: "renderer",
    WINDOW: "window",
    PAGE: "page",
    CONTROL: "control",
    CORE: "core",
    ENTRY: "entry",
    SELECTION: "selection",
    HISTORY: "history",
    EVENTS: "events",
    DIAGNOSTICS: "diagnostics",
    LOG: "log",
    STATISTICS: "statistics",
    UNIVERSE: "universe",
    RENDER: "render",
    SNAPSHOT: "snapshot",
    RUNTIME: "runtime",
    TIMERS: "timers",
    MATH: "math",
    LEGACY: "legacy",
    DUAL: "dual",
    MODULAR: "modular"
  });

  return { GROUP_TOKENS };
});
