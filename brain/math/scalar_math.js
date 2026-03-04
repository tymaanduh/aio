(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Math_Scalar_Utils = __MODULE_API;
  root.DictionaryMathScalarUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function clamp_number(value, min, max) {
    const num = Number(value);
    if (!Number.isFinite(num)) {
      return min;
    }
    return Math.min(max, Math.max(min, num));
  }

  function calculate_percentile(samples, percentile) {
    if (!Array.isArray(samples) || samples.length === 0) {
      return 0;
    }
    const sorted = samples
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value))
      .sort((a, b) => a - b);
    if (sorted.length === 0) {
      return 0;
    }
    const rank = Math.floor(clamp_number(percentile, 0, 1) * (sorted.length - 1));
    return sorted[Math.max(0, Math.min(sorted.length - 1, rank))] || 0;
  }

  return {
    clamp_number,
    calculate_percentile
  };
});
