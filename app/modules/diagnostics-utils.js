(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  root.DictionaryDiagnosticsUtils = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const MAX_ERRORS = 400;
  const MAX_PERF = 1200;

  function createDefaultDiagnostics() {
    return {
      errors: [],
      perf: []
    };
  }

  function normalizeDiagnostics(input) {
    const source = input && typeof input === "object" ? input : createDefaultDiagnostics();
    const errors = Array.isArray(source.errors)
      ? source.errors
          .map((item) => {
            const sourceItem = item && typeof item === "object" ? item : {};
            const message = String(sourceItem.message || "")
              .trim()
              .slice(0, 500);
            if (!message) {
              return null;
            }
            return {
              at: String(sourceItem.at || new Date().toISOString()).slice(0, 80),
              code: String(sourceItem.code || "renderer_error").slice(0, 80),
              message,
              context: String(sourceItem.context || "").slice(0, 400)
            };
          })
          .filter(Boolean)
          .slice(-MAX_ERRORS)
      : [];
    const perf = Array.isArray(source.perf)
      ? source.perf
          .map((item) => {
            const sourceItem = item && typeof item === "object" ? item : {};
            const key = String(sourceItem.key || "")
              .trim()
              .slice(0, 80);
            if (!key) {
              return null;
            }
            const ms = Number(sourceItem.ms);
            return {
              at: String(sourceItem.at || new Date().toISOString()).slice(0, 80),
              key,
              ms: Number.isFinite(ms) ? Math.max(0, Math.round(ms * 1000) / 1000) : 0
            };
          })
          .filter(Boolean)
          .slice(-MAX_PERF)
      : [];

    return {
      errors,
      perf
    };
  }

  function mergeDiagnostics(left, right) {
    const leftNorm = normalizeDiagnostics(left);
    const rightNorm = normalizeDiagnostics(right);
    return normalizeDiagnostics({
      errors: [...leftNorm.errors, ...rightNorm.errors],
      perf: [...leftNorm.perf, ...rightNorm.perf]
    });
  }

  return {
    MAX_ERRORS,
    MAX_PERF,
    createDefaultDiagnostics,
    normalizeDiagnostics,
    mergeDiagnostics
  };
});
