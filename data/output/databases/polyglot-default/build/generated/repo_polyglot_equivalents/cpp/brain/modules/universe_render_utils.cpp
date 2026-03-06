// Auto-generated C++ equivalent module proxy for brain/modules/universe_render_utils.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/modules/universe_render_utils.js";

namespace aio::repo_polyglot_equivalents::brain::modules::universe_render_utils {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int ensureFloat32Capacity(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "ensureFloat32Capacity", args_json);
}

inline int ensureWebglBufferCapacity(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "ensureWebglBufferCapacity", args_json);
}

inline int getUniverseColorRgb(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getUniverseColorRgb", args_json);
}

inline int getUniverseColorRgbBytes(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getUniverseColorRgbBytes", args_json);
}

inline int normalizeHexColorKey(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeHexColorKey", args_json);
}

inline int pushRgba(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "pushRgba", args_json);
}

inline int pushRgbaFromArray(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "pushRgbaFromArray", args_json);
}

inline int pushRgbaPair(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "pushRgbaPair", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
