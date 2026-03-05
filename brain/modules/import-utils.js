(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Import_Utils = __MODULE_API;
  root.DictionaryImportUtils = __MODULE_API;
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
