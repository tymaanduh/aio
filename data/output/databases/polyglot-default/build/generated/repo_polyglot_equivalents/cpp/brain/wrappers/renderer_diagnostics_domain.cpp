// Auto-generated C++ equivalent module proxy for brain/wrappers/renderer_diagnostics_domain.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_diagnostics_domain.js";

namespace aio::repo_polyglot_equivalents::brain::wrappers::renderer_diagnostics_domain {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int clearDiagnosticsFlushTimer(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearDiagnosticsFlushTimer", args_json);
}

inline int pushRuntimeLog(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "pushRuntimeLog", args_json);
}

inline int recordDiagnosticError(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "recordDiagnosticError", args_json);
}

inline int recordDiagnosticPerf(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "recordDiagnosticPerf", args_json);
}

inline int renderDiagnosticsPanel(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderDiagnosticsPanel", args_json);
}

inline int renderDiagnosticsSummary(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderDiagnosticsSummary", args_json);
}

inline int scheduleDiagnosticsFlush(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "scheduleDiagnosticsFlush", args_json);
}

inline int setEntryWarnings(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setEntryWarnings", args_json);
}

inline int setSentenceStatus(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setSentenceStatus", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
