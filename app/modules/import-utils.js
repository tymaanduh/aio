(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  root.DictionaryImportUtils = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  async function applyInChunks(items, chunkSize, onChunk) {
    const safeItems = Array.isArray(items) ? items : [];
    const size = Math.max(1, Number(chunkSize) || 100);
    let offset = 0;
    while (offset < safeItems.length) {
      const next = safeItems.slice(offset, offset + size);
      // eslint-disable-next-line no-await-in-loop
      await onChunk(next, offset);
      offset += next.length;
      // Yield to keep UI responsive during large imports.
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  return {
    applyInChunks
  };
});
