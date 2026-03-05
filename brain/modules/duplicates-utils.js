(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Duplicates_Utils = __MODULE_API;
  root.DictionaryDuplicatesUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function normalizeWordLower(word, maxLength = 120) {
    return String(word || "")
      .trim()
      .slice(0, maxLength)
      .toLowerCase();
  }

  function tokenize(word) {
    return normalizeWordLower(word)
      .replace(/[^a-z0-9\s'-]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  }

  function jaccardSimilarity(leftTokens, rightTokens) {
    const left = new Set(leftTokens);
    const right = new Set(rightTokens);
    if (left.size === 0 || right.size === 0) {
      return 0;
    }
    let intersection = 0;
    left.forEach((token) => {
      if (right.has(token)) {
        intersection += 1;
      }
    });
    const union = left.size + right.size - intersection;
    return union === 0 ? 0 : intersection / union;
  }

  function buildNearDuplicateCluster(entries, word, options = {}) {
    const safeEntries = Array.isArray(entries) ? entries : [];
    const target = normalizeWordLower(word);
    const excludeId = String(options.excludeId || "");
    const limit = Number.isFinite(options.limit) ? Math.max(1, options.limit) : 8;
    if (!target) {
      return [];
    }
    const targetTokens = tokenize(target);
    const prefix = target.slice(0, 4);

    return safeEntries
      .filter((entry) => {
        if (!entry || typeof entry !== "object") {
          return false;
        }
        if (excludeId && entry.id === excludeId) {
          return false;
        }
        const normalized = normalizeWordLower(entry.word);
        if (!normalized || normalized === target) {
          return false;
        }
        if (normalized.startsWith(prefix) || target.startsWith(normalized.slice(0, 4))) {
          return true;
        }
        const score = jaccardSimilarity(targetTokens, tokenize(normalized));
        return score >= 0.4;
      })
      .slice(0, limit);
  }

  return {
    normalizeWordLower,
    tokenize,
    jaccardSimilarity,
    buildNearDuplicateCluster
  };
});
