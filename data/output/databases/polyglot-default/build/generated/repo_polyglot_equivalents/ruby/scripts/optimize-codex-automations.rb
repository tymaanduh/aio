# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/optimize-codex-automations.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "analyzeAndMaybeApply",
  "compactWhitespace",
  "estimateTokens",
  "main",
  "mappedPrompt",
  "mappedRRule",
  "normalizeHourlyRRule",
  "normalizePrompt",
  "parseArgs",
  "updatePromptInToml",
  "updateRRuleInToml"
]
      SYMBOL_MAP = {
  "analyzeAndMaybeApply": "analyze_and_maybe_apply",
  "compactWhitespace": "compact_whitespace",
  "estimateTokens": "estimate_tokens",
  "main": "main",
  "mappedPrompt": "mapped_prompt",
  "mappedRRule": "mapped_rrule",
  "normalizeHourlyRRule": "normalize_hourly_rrule",
  "normalizePrompt": "normalize_prompt",
  "parseArgs": "parse_args",
  "updatePromptInToml": "update_prompt_in_toml",
  "updateRRuleInToml": "update_rrule_in_toml"
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

      def self.analyze_and_maybe_apply(*args, **kwargs)
        invoke_source_function("analyzeAndMaybeApply", *args, **kwargs)
      end

      def self.compact_whitespace(*args, **kwargs)
        invoke_source_function("compactWhitespace", *args, **kwargs)
      end

      def self.estimate_tokens(*args, **kwargs)
        invoke_source_function("estimateTokens", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.mapped_prompt(*args, **kwargs)
        invoke_source_function("mappedPrompt", *args, **kwargs)
      end

      def self.mapped_rrule(*args, **kwargs)
        invoke_source_function("mappedRRule", *args, **kwargs)
      end

      def self.normalize_hourly_rrule(*args, **kwargs)
        invoke_source_function("normalizeHourlyRRule", *args, **kwargs)
      end

      def self.normalize_prompt(*args, **kwargs)
        invoke_source_function("normalizePrompt", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.update_prompt_in_toml(*args, **kwargs)
        invoke_source_function("updatePromptInToml", *args, **kwargs)
      end

      def self.update_rrule_in_toml(*args, **kwargs)
        invoke_source_function("updateRRuleInToml", *args, **kwargs)
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
