(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./scalar_math.js"));
    return;
  }
  const __MODULE_API = factory(root.Dictionary_Math_Scalar_Utils || root.DictionaryMathScalarUtils || {});
  root.Dictionary_Math_Camera_Utils = __MODULE_API;
  root.DictionaryMathCameraUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function (scalarApi) {
  const clamp_number = typeof scalarApi.clamp_number === "function"
    ? scalarApi.clamp_number
    : (value, min, max) => Math.min(max, Math.max(min, Number(value)));

  function compute_fit_camera(input = {}) {
    const nodes = Array.isArray(input.nodes) ? input.nodes : [];
    const zoomMin = Number(input.zoomMin) || 0.2;
    const zoomMax = Number(input.zoomMax) || 5;
    const panMin = Number(input.panMin) || -1.6;
    const panMax = Number(input.panMax) || 1.6;

    if (nodes.length === 0) {
      return { panX: 0, panY: 0, zoom: 1 };
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    nodes.forEach((node) => {
      const x = Number(node?.x) || 0.5;
      const y = Number(node?.y) || 0.5;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });

    const spanX = Math.max(0.12, maxX - minX);
    const spanY = Math.max(0.12, maxY - minY);
    const zoom = clamp_number(Math.min(0.88 / spanX, 0.88 / spanY), zoomMin, zoomMax);
    const panX = clamp_number(0.5 - (minX + maxX) / 2, panMin, panMax);
    const panY = clamp_number(0.5 - (minY + maxY) / 2, panMin, panMax);
    return { panX, panY, zoom, spanX, spanY, minX, maxX, minY, maxY };
  }

  return {
    compute_fit_camera
  };
});
