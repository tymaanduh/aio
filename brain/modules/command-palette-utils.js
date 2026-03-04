(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Command_Palette_Utils = __MODULE_API;
  root.DictionaryCommandPaletteUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function normalizeQuery(query) {
    return String(query || "")
      .trim()
      .toLowerCase();
  }

  function scoreCommand(query, label) {
    const q = normalizeQuery(query);
    const text = normalizeQuery(label);
    if (!q) {
      return 1;
    }
    if (text === q) {
      return 1000;
    }
    if (text.startsWith(q)) {
      return 800 - (text.length - q.length);
    }
    if (text.includes(q)) {
      return 500 - text.indexOf(q);
    }
    let cursor = 0;
    let hits = 0;
    for (const char of q) {
      const found = text.indexOf(char, cursor);
      if (found === -1) {
        return 0;
      }
      hits += 1;
      cursor = found + 1;
    }
    return hits > 0 ? 100 + hits : 0;
  }

  function rankCommands(query, commands) {
    const safe = Array.isArray(commands) ? commands : [];
    return safe
      .map((command) => ({
        command,
        score: scoreCommand(query, command?.label || "")
      }))
      .filter((item) => item.score > 0)
      .sort(
        (left, right) =>
          right.score - left.score || String(left.command.label).localeCompare(String(right.command.label))
      )
      .map((item) => item.command);
  }

  return {
    scoreCommand,
    rankCommands
  };
});
