(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Tree_Utils = __MODULE_API;
  root.DictionaryTreeUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function clamp(value, min, max) {
    if (!Number.isFinite(value)) {
      return min;
    }
    return Math.max(min, Math.min(max, value));
  }

  function shouldVirtualizeGroup(entryCount, threshold = 180) {
    return Number(entryCount) > threshold;
  }

  function calculateVirtualWindow(options = {}) {
    const totalCount = Math.max(0, Number(options.totalCount) || 0);
    const rowHeight = Math.max(1, Number(options.rowHeight) || 1);
    const viewportHeight = Math.max(1, Number(options.viewportHeight) || rowHeight);
    const overscan = Math.max(0, Number(options.overscan) || 0);
    const maxScrollTop = Math.max(0, totalCount * rowHeight - viewportHeight);
    const scrollTop = clamp(Number(options.scrollTop) || 0, 0, maxScrollTop);

    if (totalCount === 0) {
      return {
        start: 0,
        end: 0,
        offsetTop: 0,
        totalHeight: 0,
        scrollTop
      };
    }

    const visibleCount = Math.ceil(viewportHeight / rowHeight);
    const baseStart = Math.floor(scrollTop / rowHeight);
    const start = Math.max(0, baseStart - overscan);
    const end = Math.min(totalCount, baseStart + visibleCount + overscan);

    return {
      start,
      end,
      offsetTop: start * rowHeight,
      totalHeight: totalCount * rowHeight,
      scrollTop
    };
  }

  return {
    shouldVirtualizeGroup,
    calculateVirtualWindow
  };
});
