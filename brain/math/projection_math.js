(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./scalar_math.js"));
    return;
  }
  const __MODULE_API = factory(root.Dictionary_Math_Scalar_Utils || root.DictionaryMathScalarUtils || {});
  root.Dictionary_Math_Projection_Utils = __MODULE_API;
  root.DictionaryMathProjectionUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function (scalarApi) {
  const clamp_number =
    typeof scalarApi.clamp_number === "function"
      ? scalarApi.clamp_number
      : (value, min, max) => Math.min(max, Math.max(min, Number(value)));

  function norm_graph_coord(value, max, nodeSize) {
    return clamp_number(Number(value), 8, max - nodeSize - 8);
  }

  return {
    norm_graph_coord
  };
});
