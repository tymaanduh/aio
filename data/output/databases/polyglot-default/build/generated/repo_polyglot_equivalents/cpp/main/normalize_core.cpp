// Auto-generated C++ equivalent module proxy for main/normalize_core.js.
#include "../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "main/normalize_core.js";

namespace aio::repo_polyglot_equivalents::main::normalize_core {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int build_edge_mode_counts(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "build_edge_mode_counts", args_json);
}

inline int clamp_number(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clamp_number", args_json);
}

inline int cleanText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "cleanText", args_json);
}

inline int normalize_unique_labels(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_unique_labels", args_json);
}

inline int normalizeEntryMode(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeEntryMode", args_json);
}

inline int normalizeEntryUsageCount(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeEntryUsageCount", args_json);
}

inline int normalizeGraphCoordinate(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeGraphCoordinate", args_json);
}

inline int normalizeLabel(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeLabel", args_json);
}

inline int normalizePassword(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizePassword", args_json);
}

inline int normalizeUsername(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeUsername", args_json);
}

inline int normalizeWordIdentityKey(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeWordIdentityKey", args_json);
}

inline int now_iso(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "now_iso", args_json);
}

inline int round_positive_milliseconds(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "round_positive_milliseconds", args_json);
}

inline int to_non_negative_int(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "to_non_negative_int", args_json);
}

inline int to_source_object(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "to_source_object", args_json);
}

inline int toTimestampMs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toTimestampMs", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
