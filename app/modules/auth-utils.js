(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Auth_Utils = __MODULE_API;
  root.DictionaryAuthUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const AUTH_MODE_CREATE = "create";

  function getAuthSubmitHint(mode) {
    return mode === AUTH_MODE_CREATE ? "Press Enter to create your account." : "Press Enter to sign in.";
  }

  function isTypingTarget(activeElement, targets) {
    if (!activeElement || !Array.isArray(targets)) {
      return false;
    }
    return targets.includes(activeElement);
  }

  return {
    AUTH_MODE_CREATE,
    getAuthSubmitHint,
    isTypingTarget
  };
});
