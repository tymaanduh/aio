# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/lib/agent-access-policy.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "compactAccessPolicy",
  "expandAccessPolicy",
  "normalizeList",
  "normalizeProfile",
  "normalizeText",
  "profileSignature",
  "stableProfileId"
]
      SYMBOL_MAP = {
  "compactAccessPolicy": "compact_access_policy",
  "expandAccessPolicy": "expand_access_policy",
  "normalizeList": "normalize_list",
  "normalizeProfile": "normalize_profile",
  "normalizeText": "normalize_text",
  "profileSignature": "profile_signature",
  "stableProfileId": "stable_profile_id"
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

      def self.compact_access_policy(*args, **kwargs)
        invoke_source_function("compactAccessPolicy", *args, **kwargs)
      end

      def self.expand_access_policy(*args, **kwargs)
        invoke_source_function("expandAccessPolicy", *args, **kwargs)
      end

      def self.normalize_list(*args, **kwargs)
        invoke_source_function("normalizeList", *args, **kwargs)
      end

      def self.normalize_profile(*args, **kwargs)
        invoke_source_function("normalizeProfile", *args, **kwargs)
      end

      def self.normalize_text(*args, **kwargs)
        invoke_source_function("normalizeText", *args, **kwargs)
      end

      def self.profile_signature(*args, **kwargs)
        invoke_source_function("profileSignature", *args, **kwargs)
      end

      def self.stable_profile_id(*args, **kwargs)
        invoke_source_function("stableProfileId", *args, **kwargs)
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
