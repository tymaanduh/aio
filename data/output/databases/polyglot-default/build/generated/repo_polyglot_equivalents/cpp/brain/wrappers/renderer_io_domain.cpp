// Auto-generated C++ equivalent module proxy for brain/wrappers/renderer_io_domain.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_io_domain.js";

namespace aio::repo_polyglot_equivalents::brain::wrappers::renderer_io_domain {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int applyImportedEntries(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "applyImportedEntries", args_json);
}

inline int exportCurrentData(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "exportCurrentData", args_json);
}

inline int exportEntriesAsCsv(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "exportEntriesAsCsv", args_json);
}

inline int importEntriesFromText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "importEntriesFromText", args_json);
}

inline int parseBulkImportEntries(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseBulkImportEntries", args_json);
}

inline int parseCsvEntries(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseCsvEntries", args_json);
}

inline int parseCsvLine(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseCsvLine", args_json);
}

inline int parseImportedEntries(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseImportedEntries", args_json);
}

inline int parseSmartPasteEntries(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseSmartPasteEntries", args_json);
}

inline int toCsvSafe(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toCsvSafe", args_json);
}

inline int triggerDownload(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "triggerDownload", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
