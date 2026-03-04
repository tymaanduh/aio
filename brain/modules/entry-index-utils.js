(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Entry_Index_Utils = __MODULE_API;
  root.DictionaryEntryIndexUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function cleanText(value, maxLength = 1000) {
    if (typeof value !== "string") {
      return "";
    }
    return value.trim().slice(0, maxLength);
  }

  function createEntryIndexTools(options = {}) {
    const maxWord = Math.max(1, Math.floor(Number(options.maxWord) || 120));
    const maxLabel = Math.max(1, Math.floor(Number(options.maxLabel) || 80));
    const buildWordPrefixIndex =
      typeof options.buildWordPrefixIndex === "function" ? options.buildWordPrefixIndex : () => new Map();
    const isPartOfSpeechLabel =
      typeof options.isPartOfSpeechLabel === "function" ? options.isPartOfSpeechLabel : () => false;

    function buildEntriesIndex(labels, entries) {
      const sourceLabels = Array.isArray(labels) ? labels : [];
      const sourceEntries = Array.isArray(entries) ? entries : [];

      const byId = new Map();
      const byWordLower = new Map();
      const byLabel = new Map();
      const unlabeled = [];
      const unlabeledActive = [];
      const posIndex = {};
      const labelCounts = {};
      const labelCountsActive = {};
      let activeEntriesCount = 0;

      const sortedLabels = [...sourceLabels].sort((a, b) => a.localeCompare(b));
      const wordPrefixIndex = buildWordPrefixIndex(sourceEntries);

      sortedLabels.forEach((label) => {
        byLabel.set(label, []);
        labelCounts[label] = 0;
        labelCountsActive[label] = 0;
      });

      sourceEntries.forEach((entryRaw) => {
        const entry = entryRaw && typeof entryRaw === "object" ? entryRaw : {};
        byId.set(entry.id, entry);
        const isActive = !entry.archivedAt;
        if (isActive) {
          activeEntriesCount += 1;
        }

        const wordLower = cleanText(entry.word, maxWord).toLowerCase();
        if (wordLower && !byWordLower.has(wordLower)) {
          byWordLower.set(wordLower, entry);
        }

        const labelsList = Array.isArray(entry.labels) ? entry.labels : [];
        if (labelsList.length === 0) {
          unlabeled.push(entry);
          if (isActive) {
            unlabeledActive.push(entry);
          }
          return;
        }

        labelsList.forEach((label) => {
          if (!byLabel.has(label)) {
            byLabel.set(label, []);
            labelCounts[label] = labelCounts[label] || 0;
            labelCountsActive[label] = labelCountsActive[label] || 0;
          }
          byLabel.get(label).push(entry);
          labelCounts[label] = (labelCounts[label] || 0) + 1;
          if (isActive) {
            labelCountsActive[label] = (labelCountsActive[label] || 0) + 1;
          }

          const normalized = cleanText(label, maxLabel).toLowerCase();
          if (!isPartOfSpeechLabel(normalized)) {
            return;
          }
          if (!posIndex[normalized]) {
            posIndex[normalized] = [];
          }
          posIndex[normalized].push(entry);
        });
      });

      return {
        byId,
        byWordLower,
        wordPrefixIndex,
        byLabel,
        unlabeled,
        unlabeledActive,
        posIndex,
        labelCounts,
        labelCountsActive,
        activeEntriesCount,
        sortedLabels
      };
    }

    return {
      buildEntriesIndex
    };
  }

  return {
    createEntryIndexTools
  };
});
