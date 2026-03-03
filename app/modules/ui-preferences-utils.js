(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  root.DictionaryUiPreferencesUtils = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const UI_THEME_IDS = Object.freeze(["enterprise", "futuristic", "monochrome"]);
  const UI_THEME_SET = new Set(UI_THEME_IDS);

  function cleanText(value, maxLength = 100) {
    if (typeof value !== "string") {
      return "";
    }
    return value.trim().slice(0, maxLength);
  }

  function createDefaultUiPreferences() {
    return {
      version: 1,
      theme: "futuristic",
      reduceMotion: false,
      updatedAt: null
    };
  }

  function normalizeUiTheme(value) {
    const theme = cleanText(value, 40).toLowerCase();
    if (!theme || !UI_THEME_SET.has(theme)) {
      return "futuristic";
    }
    return theme;
  }

  function normalizeUiPreferences(input) {
    const source = input && typeof input === "object" ? input : createDefaultUiPreferences();
    const defaults = createDefaultUiPreferences();
    return {
      version: 1,
      theme: normalizeUiTheme(source.theme),
      reduceMotion: Boolean(source.reduceMotion),
      updatedAt: cleanText(source.updatedAt, 80) || defaults.updatedAt
    };
  }

  return {
    UI_THEME_IDS,
    createDefaultUiPreferences,
    normalizeUiTheme,
    normalizeUiPreferences
  };
});
