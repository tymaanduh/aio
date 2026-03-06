// Auto-generated C++ equivalent module proxy for scripts/codex-desktop-sync.js.
#include "../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "scripts/codex-desktop-sync.js";

namespace aio::repo_polyglot_equivalents::scripts::codex_desktop_sync {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int copyDirectory(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "copyDirectory", args_json);
}

inline int ensureDirectory(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "ensureDirectory", args_json);
}

inline int ensureManagedDestination(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "ensureManagedDestination", args_json);
}

inline int listFilesRecursively(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "listFilesRecursively", args_json);
}

inline int listSkillDirectories(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "listSkillDirectories", args_json);
}

inline int main(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "main", args_json);
}

inline int normalizePath(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizePath", args_json);
}

inline int normalizeRelativePath(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeRelativePath", args_json);
}

inline int parseArgs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseArgs", args_json);
}

inline int readJsonIfExists(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "readJsonIfExists", args_json);
}

inline int readManagementMarker(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "readManagementMarker", args_json);
}

inline int syncAgentsSnapshot(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "syncAgentsSnapshot", args_json);
}

inline int syncSkills(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "syncSkills", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
