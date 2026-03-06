// Auto-generated C++ equivalent module proxy for app/renderer.js.
#include "../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "app/renderer.js";

namespace aio::repo_polyglot_equivalents::app::renderer {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int applyLocalAssist(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "applyLocalAssist", args_json);
}

inline int autoSaveDraftAndAdvance(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "autoSaveDraftAndAdvance", args_json);
}

inline int bindActionElement(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "bindActionElement", args_json);
}

inline int bindAuthFallbackHandlers(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "bindAuthFallbackHandlers", args_json);
}

inline int bindEvents(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "bindEvents", args_json);
}

inline int bindUniverseInteractions(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "bindUniverseInteractions", args_json);
}

inline int buildSnapshot(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildSnapshot", args_json);
}

inline int captureUndoSnapshot(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "captureUndoSnapshot", args_json);
}

inline int clampNumber(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clampNumber", args_json);
}

inline int clearEntrySelections(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearEntrySelections", args_json);
}

inline int clearPathHighlights(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearPathHighlights", args_json);
}

inline int clearPendingLink(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearPendingLink", args_json);
}

inline int clearProjectionCache(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearProjectionCache", args_json);
}

inline int collectEntryFromForm(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "collectEntryFromForm", args_json);
}

inline int createEntryFromFormData(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createEntryFromFormData", args_json);
}

inline int createUniverseBenchmarkState(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createUniverseBenchmarkState", args_json);
}

inline int ensureEntryVisible(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "ensureEntryVisible", args_json);
}

inline int ensureLabelExists(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "ensureLabelExists", args_json);
}

inline int ensureLabelsExist(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "ensureLabelsExist", args_json);
}

inline int formatSaved(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "formatSaved", args_json);
}

inline int getAuthCredentials(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getAuthCredentials", args_json);
}

inline int getAuthSubmitHint(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getAuthSubmitHint", args_json);
}

inline int getCategoryKeyForLabel(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getCategoryKeyForLabel", args_json);
}

inline int getDuplicateEntry(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getDuplicateEntry", args_json);
}

inline int getEntriesForLabel(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getEntriesForLabel", args_json);
}

inline int getEntriesIndex(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getEntriesIndex", args_json);
}

inline int getEntryBacklinkCount(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getEntryBacklinkCount", args_json);
}

inline int getGroupLimit(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getGroupLimit", args_json);
}

inline int getIdx(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getIdx", args_json);
}

inline int getNearDuplicateEntries(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getNearDuplicateEntries", args_json);
}

inline int getNode(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getNode", args_json);
}

inline int getPrimaryPartOfSpeech(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getPrimaryPartOfSpeech", args_json);
}

inline int getRelatedEntries(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getRelatedEntries", args_json);
}

inline int getSelectedEntry(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getSelectedEntry", args_json);
}

inline int getUnlabeledEntries(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getUnlabeledEntries", args_json);
}

inline int hasReadyDraftForAutoCommit(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "hasReadyDraftForAutoCommit", args_json);
}

inline int incrementEntryUsage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "incrementEntryUsage", args_json);
}

inline int initialize(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "initialize", args_json);
}

inline int initializeAuthGate(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "initializeAuthGate", args_json);
}

inline int invalidateUniverseGraph(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "invalidateUniverseGraph", args_json);
}

inline int loadDictionaryData(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "loadDictionaryData", args_json);
}

inline int loadUniverseCache(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "loadUniverseCache", args_json);
}

inline int loadUniverseGpuStatus(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "loadUniverseGpuStatus", args_json);
}

inline int lookupAndSaveEntry(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "lookupAndSaveEntry", args_json);
}

inline int markEntriesDirty(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "markEntriesDirty", args_json);
}

inline int markGraphDirty(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "markGraphDirty", args_json);
}

inline int mergeLookupLabels(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "mergeLookupLabels", args_json);
}

inline int normalizeLoadedEntry(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeLoadedEntry", args_json);
}

inline int normalizeLoadedSentenceGraph(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeLoadedSentenceGraph", args_json);
}

inline int pushRuntimeLog(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "pushRuntimeLog", args_json);
}

inline int rebuildGraphIndex(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "rebuildGraphIndex", args_json);
}

inline int recordDiagnosticError(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "recordDiagnosticError", args_json);
}

inline int renderClusterPanel(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderClusterPanel", args_json);
}

inline int renderDiagnosticsSummary(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderDiagnosticsSummary", args_json);
}

inline int renderEditorForEntry(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderEditorForEntry", args_json);
}

inline int renderEditorForNewEntry(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderEditorForNewEntry", args_json);
}

inline int renderEntryInsights(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderEntryInsights", args_json);
}

inline int renderPerfHud(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderPerfHud", args_json);
}

inline int renderStatisticsView(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderStatisticsView", args_json);
}

inline int renderSummary(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderSummary", args_json);
}

inline int reqGraph(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "reqGraph", args_json);
}

inline int reqSentence(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "reqSentence", args_json);
}

inline int reqTree(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "reqTree", args_json);
}

inline int requestGraphBuildNow(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "requestGraphBuildNow", args_json);
}

inline int requestStatsWorkerComputeNow(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "requestStatsWorkerComputeNow", args_json);
}

inline int resetAdjacencyCache(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resetAdjacencyCache", args_json);
}

inline int resetAuthHintIfNeeded(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resetAuthHintIfNeeded", args_json);
}

inline int resetEditor(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resetEditor", args_json);
}

inline int resetHighlightCache(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resetHighlightCache", args_json);
}

inline int RESOLVE_ALIAS_WORD(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "RESOLVE_ALIAS_WORD", args_json);
}

inline int resolveModuleUtils(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveModuleUtils", args_json);
}

inline int run_submit(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "run_submit", args_json);
}

inline int runExtractedFunction(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runExtractedFunction", args_json);
}

inline int saveEntryFromForm(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "saveEntryFromForm", args_json);
}

inline int saveState(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "saveState", args_json);
}

inline int scheduleAutoCommitDraft(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "scheduleAutoCommitDraft", args_json);
}

inline int scheduleAutosave(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "scheduleAutosave", args_json);
}

inline int scheduleGraphBuild(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "scheduleGraphBuild", args_json);
}

inline int scheduleIndexWarmup(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "scheduleIndexWarmup", args_json);
}

inline int setActiveView(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setActiveView", args_json);
}

inline int setAuthGateVisible(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setAuthGateVisible", args_json);
}

inline int setAuthHint(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setAuthHint", args_json);
}

inline int setAuthMode(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setAuthMode", args_json);
}

inline int setEntryWarnings(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setEntryWarnings", args_json);
}

inline int setGroupExpanded(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setGroupExpanded", args_json);
}

inline int setHelperText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setHelperText", args_json);
}

inline int setPathStatus(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setPathStatus", args_json);
}

inline int setQuickCaptureStatus(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setQuickCaptureStatus", args_json);
}

inline int setSentenceStatus(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setSentenceStatus", args_json);
}

inline int setStatus(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setStatus", args_json);
}

inline int sortEntries(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "sortEntries", args_json);
}

inline int submitAuth(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "submitAuth", args_json);
}

inline int surfaceAuthBindError(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "surfaceAuthBindError", args_json);
}

inline int syncCanvasVisibility(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "syncCanvasVisibility", args_json);
}

inline int syncControls(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "syncControls", args_json);
}

inline int syncExplorerLayoutControls(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "syncExplorerLayoutControls", args_json);
}

inline int syncPathFlags(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "syncPathFlags", args_json);
}

inline int syncUiSettingsControls(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "syncUiSettingsControls", args_json);
}

inline int updateEntryFromFormData(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "updateEntryFromFormData", args_json);
}

inline int updateEntryModeVisualState(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "updateEntryModeVisualState", args_json);
}

inline int updateHistoryRestoreOptions(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "updateHistoryRestoreOptions", args_json);
}

inline int updateUniverseBookmarkSelect(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "updateUniverseBookmarkSelect", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
