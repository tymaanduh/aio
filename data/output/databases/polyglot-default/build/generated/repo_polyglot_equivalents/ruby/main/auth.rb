# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "main/auth.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "append_auth_runtime_log",
  "can_attempt_login",
  "create_auth_error",
  "create_auth_ok",
  "create_login_error_response",
  "createAccount",
  "ensureAuthenticated",
  "format_quoted_message",
  "getAuthStatus",
  "hashPassword",
  "injectDataIo",
  "isQuickLoginEnabled",
  "load_auth_state",
  "login",
  "logout",
  "lookupDefinitionOnline",
  "now_iso",
  "parseOnlineDefinitionResponse",
  "prune_login_attempts",
  "record_failed_login_attempt",
  "resolve_builtin_account_username",
  "safeCompareHex",
  "save_auth_state",
  "try_quick_login",
  "validate_new_account_credentials"
]
      SYMBOL_MAP = {
  "append_auth_runtime_log": "append_auth_runtime_log",
  "can_attempt_login": "can_attempt_login",
  "create_auth_error": "create_auth_error",
  "create_auth_ok": "create_auth_ok",
  "create_login_error_response": "create_login_error_response",
  "createAccount": "create_account",
  "ensureAuthenticated": "ensure_authenticated",
  "format_quoted_message": "format_quoted_message",
  "getAuthStatus": "get_auth_status",
  "hashPassword": "hash_password",
  "injectDataIo": "inject_data_io",
  "isQuickLoginEnabled": "is_quick_login_enabled",
  "load_auth_state": "load_auth_state",
  "login": "login",
  "logout": "logout",
  "lookupDefinitionOnline": "lookup_definition_online",
  "now_iso": "now_iso",
  "parseOnlineDefinitionResponse": "parse_online_definition_response",
  "prune_login_attempts": "prune_login_attempts",
  "record_failed_login_attempt": "record_failed_login_attempt",
  "resolve_builtin_account_username": "resolve_builtin_account_username",
  "safeCompareHex": "safe_compare_hex",
  "save_auth_state": "save_auth_state",
  "try_quick_login": "try_quick_login",
  "validate_new_account_credentials": "validate_new_account_credentials"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.invoke_source_function(function_name, *args, **kwargs)
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.invoke_js_function(
          SOURCE_JS_FILE,
          function_name,
          args,
          kwargs
        )
      end

      def self.run_source_entrypoint(args = [])
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.run_js_entrypoint(SOURCE_JS_FILE, args)
      end

      def self.append_auth_runtime_log(*args, **kwargs)
        invoke_source_function("append_auth_runtime_log", *args, **kwargs)
      end

      def self.can_attempt_login(*args, **kwargs)
        invoke_source_function("can_attempt_login", *args, **kwargs)
      end

      def self.create_auth_error(*args, **kwargs)
        invoke_source_function("create_auth_error", *args, **kwargs)
      end

      def self.create_auth_ok(*args, **kwargs)
        invoke_source_function("create_auth_ok", *args, **kwargs)
      end

      def self.create_login_error_response(*args, **kwargs)
        invoke_source_function("create_login_error_response", *args, **kwargs)
      end

      def self.create_account(*args, **kwargs)
        invoke_source_function("createAccount", *args, **kwargs)
      end

      def self.ensure_authenticated(*args, **kwargs)
        invoke_source_function("ensureAuthenticated", *args, **kwargs)
      end

      def self.format_quoted_message(*args, **kwargs)
        invoke_source_function("format_quoted_message", *args, **kwargs)
      end

      def self.get_auth_status(*args, **kwargs)
        invoke_source_function("getAuthStatus", *args, **kwargs)
      end

      def self.hash_password(*args, **kwargs)
        invoke_source_function("hashPassword", *args, **kwargs)
      end

      def self.inject_data_io(*args, **kwargs)
        invoke_source_function("injectDataIo", *args, **kwargs)
      end

      def self.is_quick_login_enabled(*args, **kwargs)
        invoke_source_function("isQuickLoginEnabled", *args, **kwargs)
      end

      def self.load_auth_state(*args, **kwargs)
        invoke_source_function("load_auth_state", *args, **kwargs)
      end

      def self.login(*args, **kwargs)
        invoke_source_function("login", *args, **kwargs)
      end

      def self.logout(*args, **kwargs)
        invoke_source_function("logout", *args, **kwargs)
      end

      def self.lookup_definition_online(*args, **kwargs)
        invoke_source_function("lookupDefinitionOnline", *args, **kwargs)
      end

      def self.now_iso(*args, **kwargs)
        invoke_source_function("now_iso", *args, **kwargs)
      end

      def self.parse_online_definition_response(*args, **kwargs)
        invoke_source_function("parseOnlineDefinitionResponse", *args, **kwargs)
      end

      def self.prune_login_attempts(*args, **kwargs)
        invoke_source_function("prune_login_attempts", *args, **kwargs)
      end

      def self.record_failed_login_attempt(*args, **kwargs)
        invoke_source_function("record_failed_login_attempt", *args, **kwargs)
      end

      def self.resolve_builtin_account_username(*args, **kwargs)
        invoke_source_function("resolve_builtin_account_username", *args, **kwargs)
      end

      def self.safe_compare_hex(*args, **kwargs)
        invoke_source_function("safeCompareHex", *args, **kwargs)
      end

      def self.save_auth_state(*args, **kwargs)
        invoke_source_function("save_auth_state", *args, **kwargs)
      end

      def self.try_quick_login(*args, **kwargs)
        invoke_source_function("try_quick_login", *args, **kwargs)
      end

      def self.validate_new_account_credentials(*args, **kwargs)
        invoke_source_function("validate_new_account_credentials", *args, **kwargs)
      end
    end
  end
end

if __FILE__ == $PROGRAM_NAME
  args = ARGV.dup
  function_flag_index = args.index("--function")
  if function_flag_index
    function_name = args[function_flag_index + 1] || ""
    args_json_index = args.index("--args-json")
    args_json = args_json_index ? (args[args_json_index + 1] || "[]") : "[]"
    result = Aio::RepoPolyglotEquivalents::ModuleProxy.invoke_source_function(
      function_name,
      *Array(JSON.parse(args_json))
    )
    puts(JSON.generate({ ok: true, result: result }))
    exit(0)
  end

  report = Aio::RepoPolyglotEquivalents::ModuleProxy.run_source_entrypoint(ARGV)
  exit(Integer(report.fetch("exit_code", 0)))
end
