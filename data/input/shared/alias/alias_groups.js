(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Alias_Groups = __MODULE_API;
  root.DictionaryAliasGroups = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const ALIAS_GROUPS = Object.freeze({
    SCOPE: Object.freeze([
      ["app", "application", "scope", "Top-level app scope."],
      ["pg", "page", "scope", "Page-level grouping and routing."],
      ["win", "window", "scope", "Desktop window scope."],
      ["dom", "document", "scope", "DOM-specific context."],
      ["mod", "module", "scope", "Module/domain scope names."],
      ["env", "environment", "scope", "Runtime environment scope."]
    ]),
    DOMAIN: Object.freeze([
      ["tree", "tree", "domain", "Tree/lexicon explorer domain."],
      ["graph", "graph", "domain", "Sentence or universe graph domain."],
      ["uni", "universe", "domain", "Universe domain namespace."],
      ["auth", "authentication", "domain", "Authentication domain."],
      ["diag", "diagnostics", "domain", "Diagnostics and telemetry domain."],
      ["stat", "statistics", "domain", "Statistics and analytics domain."],
      ["util", "utility", "domain", "Reusable utility domain blocks."]
    ]),
    DATA: Object.freeze([
      ["cfg", "configuration", "data", "Configuration maps and settings."],
      ["idx", "index", "data", "Indexes, maps, and lookup tables."],
      ["val", "value", "data", "Generic value token."],
      ["ref", "reference", "data", "Reference identity/link pointers."],
      ["tmp", "temporary", "data", "Temporary value holder."],
      ["msg", "message", "data", "Text message/log payload."]
    ]),
    RUNTIME: Object.freeze([
      ["rt", "runtime", "runtime", "Runtime state and worker scopes."],
      ["fn", "function", "runtime", "Function helper naming."],
      ["arg", "argument", "runtime", "Input argument naming."],
      ["evt", "event", "runtime", "Event wiring and handlers."],
      ["fx", "effects", "runtime", "Effects/animation/render state."],
      ["gfx", "graphics", "runtime", "Graphics-specific runtime values."]
    ]),
    UI: Object.freeze([
      ["ui", "user interface", "ui", "UI scope and UI settings."],
      ["ux", "user experience", "ui", "UX behavior/interaction focus."],
      ["cmd", "command", "ui", "Command palette and command actions."],
      ["api", "application programming interface", "ui", "Public API bridge names."],
      ["ipc", "inter-process communication", "ui", "IPC contract names."],
      ["ch", "channel", "ui", "IPC channel key aliases."]
    ])
  });

  return {
    ALIAS_GROUPS
  };
});
