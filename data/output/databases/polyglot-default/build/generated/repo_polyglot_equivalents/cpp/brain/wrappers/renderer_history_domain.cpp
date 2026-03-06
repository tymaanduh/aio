// Auto-generated C++ equivalent module proxy for brain/wrappers/renderer_history_domain.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_history_domain.js";

namespace aio::repo_polyglot_equivalents::brain::wrappers::renderer_history_domain {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int applyUndoSnapshot(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "applyUndoSnapshot", args_json);
}

inline int buildCheckpointDigest(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildCheckpointDigest", args_json);
}

inline int buildHistoryCheckpoint(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildHistoryCheckpoint", args_json);
}

inline int buildUndoSnapshot(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildUndoSnapshot", args_json);
}

inline int captureUndoSnapshot(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "captureUndoSnapshot", args_json);
}

inline int digestUndoSnapshot(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "digestUndoSnapshot", args_json);
}

inline int ensureCheckpoint(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "ensureCheckpoint", args_json);
}

inline int restoreCheckpointById(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "restoreCheckpointById", args_json);
}

inline int runRedo(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runRedo", args_json);
}

inline int runUndo(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runUndo", args_json);
}

inline int updateHistoryRestoreOptions(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "updateHistoryRestoreOptions", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
