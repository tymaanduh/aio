// Auto-generated C++ equivalent module proxy for brain/modules/universe_graphics_engine.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/modules/universe_graphics_engine.js";

namespace aio::repo_polyglot_equivalents::brain::modules::universe_graphics_engine {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int clearProjectionCache(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearProjectionCache", args_json);
}

inline int compileShader(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "compileShader", args_json);
}

inline int createProgram(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createProgram", args_json);
}

inline int createUniverseGraphicsEngine(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createUniverseGraphicsEngine", args_json);
}

inline int defaultClampNumber(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "defaultClampNumber", args_json);
}

inline int defaultCleanText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "defaultCleanText", args_json);
}

inline int disposeWebgl(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "disposeWebgl", args_json);
}

inline int drawWebglLines(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "drawWebglLines", args_json);
}

inline int drawWebglPoints(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "drawWebglPoints", args_json);
}

inline int findNodeIndexAt(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "findNodeIndexAt", args_json);
}

inline int getCanvasContext(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getCanvasContext", args_json);
}

inline int getEdgeStride(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getEdgeStride", args_json);
}

inline int getEdgeTarget(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getEdgeTarget", args_json);
}

inline int getNodeRadius(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getNodeRadius", args_json);
}

inline int getProjectionData(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getProjectionData", args_json);
}

inline int initializeWebgl(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "initializeWebgl", args_json);
}

inline int isInteractionActive(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "isInteractionActive", args_json);
}

inline int markInteraction(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "markInteraction", args_json);
}

inline int renderWebgl(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderWebgl", args_json);
}

inline int resetCanvasContext(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resetCanvasContext", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
