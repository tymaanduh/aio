(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Indexing_Utils = __MODULE_API;
  root.DictionaryIndexingUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function normalizeWordLower(word, maxLength = 120) {
    return String(word || "")
      .trim()
      .slice(0, maxLength)
      .toLowerCase();
  }

  function buildWordPrefixIndex(entries) {
    const safeEntries = Array.isArray(entries) ? entries : [];
    const index = new Map();
    safeEntries.forEach((entry) => {
      const word = normalizeWordLower(entry?.word || "");
      if (!word) {
        return;
      }
      const key = word.slice(0, 3);
      if (!index.has(key)) {
        index.set(key, []);
      }
      index.get(key).push(entry);
    });
    return index;
  }

  return {
    normalizeWordLower,
    buildWordPrefixIndex
  };
});
