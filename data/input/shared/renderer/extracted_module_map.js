(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Extracted_Module_Map = __MODULE_API;
  root.DictionaryRendererExtractedModuleMap = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const PATTERN_EXTRACTED_MODULE = Object.freeze({
    CORE_RUNTIME: "Dictionary_Renderer_Core_Runtime_Domain",
    IO: "Dictionary_Renderer_Io_Domain",
    UI_SHELL: "Dictionary_Renderer_Ui_Shell_Domain",
    INIT: "Dictionary_Renderer_Init_Domain",
    SENTENCE: "Dictionary_Renderer_Sentence_Domain",
    TREE: "Dictionary_Renderer_Tree_Domain",
    COMMAND: "Dictionary_Renderer_Command_Domain",
    SNAPSHOT: "Dictionary_Renderer_Snapshot_Domain",
    SELECTION_DOMAIN: "Dictionary_Renderer_Selection_Domain",
    HISTORY_DOMAIN: "Dictionary_Renderer_History_Domain",
    DIAGNOSTICS_DOMAIN: "Dictionary_Renderer_Diagnostics_Domain",
    STATISTICS_DOMAIN: "Dictionary_Renderer_Statistics_Domain",
    UNIVERSE_DOMAIN: "Dictionary_Renderer_Universe_Domain",
    UNIVERSE_RENDER_DOMAIN: "Dictionary_Renderer_Universe_Render_Domain",
    UNIVERSE_SELECTION_DOMAIN: "Dictionary_Renderer_Universe_Selection_Domain",
    UNIVERSE_EVENTS: "Dictionary_Renderer_Universe_Events",
    EVENTS_DOMAIN: "Dictionary_Renderer_Events_Domain",
    RUNTIME_TIMERS_DOMAIN: "Dictionary_Renderer_Runtime_Timers_Domain",
    MATH_SCALAR: "Dictionary_Math_Scalar_Utils",
    MATH_PROJECTION: "Dictionary_Math_Projection_Utils",
    MATH_GRAPH: "Dictionary_Math_Graph_Utils",
    MATH_CAMERA: "Dictionary_Math_Camera_Utils"
  });

  return {
    PATTERN_EXTRACTED_MODULE
  };
});
