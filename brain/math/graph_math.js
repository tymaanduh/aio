(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Math_Graph_Utils = __MODULE_API;
  root.DictionaryMathGraphUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function build_universe_edge_key(a, b, nodeCountInput) {
    const nodeCount = Math.max(1, Math.floor(Number(nodeCountInput) || 1));
    const left = Math.max(0, Math.min(nodeCount - 1, Math.floor(Number(a) || 0)));
    const right = Math.max(0, Math.min(nodeCount - 1, Math.floor(Number(b) || 0)));
    return left <= right ? String(left) + ":" + String(right) : String(right) + ":" + String(left);
  }

  return {
    build_universe_edge_key
  };
});
