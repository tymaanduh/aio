// Auto-generated C++ equivalent module proxy for main/auth.js.
#include "../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "main/auth.js";

namespace aio::repo_polyglot_equivalents::main::auth {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int append_auth_runtime_log(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "append_auth_runtime_log", args_json);
}

inline int can_attempt_login(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "can_attempt_login", args_json);
}

inline int create_auth_error(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_auth_error", args_json);
}

inline int create_auth_ok(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_auth_ok", args_json);
}

inline int create_login_error_response(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_login_error_response", args_json);
}

inline int createAccount(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createAccount", args_json);
}

inline int ensureAuthenticated(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "ensureAuthenticated", args_json);
}

inline int format_quoted_message(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "format_quoted_message", args_json);
}

inline int getAuthStatus(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getAuthStatus", args_json);
}

inline int hashPassword(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "hashPassword", args_json);
}

inline int injectDataIo(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "injectDataIo", args_json);
}

inline int isQuickLoginEnabled(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "isQuickLoginEnabled", args_json);
}

inline int load_auth_state(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "load_auth_state", args_json);
}

inline int login(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "login", args_json);
}

inline int logout(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "logout", args_json);
}

inline int lookupDefinitionOnline(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "lookupDefinitionOnline", args_json);
}

inline int now_iso(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "now_iso", args_json);
}

inline int parseOnlineDefinitionResponse(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseOnlineDefinitionResponse", args_json);
}

inline int prune_login_attempts(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "prune_login_attempts", args_json);
}

inline int record_failed_login_attempt(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "record_failed_login_attempt", args_json);
}

inline int resolve_builtin_account_username(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolve_builtin_account_username", args_json);
}

inline int safeCompareHex(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "safeCompareHex", args_json);
}

inline int save_auth_state(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "save_auth_state", args_json);
}

inline int try_quick_login(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "try_quick_login", args_json);
}

inline int validate_new_account_credentials(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "validate_new_account_credentials", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
