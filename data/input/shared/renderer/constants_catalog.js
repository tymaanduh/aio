(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Constants_Catalog = __MODULE_API;
  root.DictionaryRendererConstantsCatalog = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  return {
    default_labels: ["Who", "What", "Where", "When", "Why", "How"],
    top_tree_labels: ["Who", "What", "Where", "When", "Why", "How"],
    universe_webgl_line_color_label: [170 / 255, 151 / 255, 255 / 255, 0.16],
    universe_webgl_line_color_default: [129 / 255, 168 / 255, 226 / 255, 0.16],
    phrase_patterns: [
      ["article", "adjective", "noun"],
      ["pronoun", "verb", "article", "noun"],
      ["noun", "verb", "adverb"],
      ["verb", "article", "noun"]
    ],
    qw_labels: {
      who: "Who",
      what: "What",
      where: "Where",
      when: "When",
      why: "Why",
      how: "How"
    }
  };
});
