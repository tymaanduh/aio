// Auto-generated C++ equivalent module proxy for brain/wrappers/renderer_command_domain.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_command_domain.js";

namespace aio::repo_polyglot_equivalents::brain::wrappers::renderer_command_domain {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int buildCommandPaletteActions(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildCommandPaletteActions", args_json);
}

inline int closeCmdPalette(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "closeCmdPalette", args_json);
}

inline int createCommandItem(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createCommandItem", args_json);
}

inline int createCommandLabel(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createCommandLabel", args_json);
}

inline int createCommandRunner(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createCommandRunner", args_json);
}

inline int executeCommandPaletteItem(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "executeCommandPaletteItem", args_json);
}

inline int filterCommandPalette(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "filterCommandPalette", args_json);
}

inline int isCommandPaletteVisible(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "isCommandPaletteVisible", args_json);
}

inline int openCommandPalette(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "openCommandPalette", args_json);
}

inline int renderCmdList(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderCmdList", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
