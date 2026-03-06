# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/validate-wrapper-contracts.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "compareInputLists",
  "escapeRegExp",
  "issue",
  "listJsFiles",
  "main",
  "normalizeInputList",
  "normalizeText",
  "parseArgs",
  "readJson",
  "requireArg",
  "symbolPatternForLanguage",
  "validate"
]
      SYMBOL_MAP = {
  "compareInputLists": "compare_input_lists",
  "escapeRegExp": "escape_reg_exp",
  "issue": "issue",
  "listJsFiles": "list_js_files",
  "main": "main",
  "normalizeInputList": "normalize_input_list",
  "normalizeText": "normalize_text",
  "parseArgs": "parse_args",
  "readJson": "read_json",
  "requireArg": "require_arg",
  "symbolPatternForLanguage": "symbol_pattern_for_language",
  "validate": "validate"
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

      def self.compare_input_lists(*args, **kwargs)
        invoke_source_function("compareInputLists", *args, **kwargs)
      end

      def self.escape_reg_exp(*args, **kwargs)
        invoke_source_function("escapeRegExp", *args, **kwargs)
      end

      def self.issue(*args, **kwargs)
        invoke_source_function("issue", *args, **kwargs)
      end

      def self.list_js_files(*args, **kwargs)
        invoke_source_function("listJsFiles", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.normalize_input_list(*args, **kwargs)
        invoke_source_function("normalizeInputList", *args, **kwargs)
      end

      def self.normalize_text(*args, **kwargs)
        invoke_source_function("normalizeText", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.read_json(*args, **kwargs)
        invoke_source_function("readJson", *args, **kwargs)
      end

      def self.require_arg(*args, **kwargs)
        invoke_source_function("requireArg", *args, **kwargs)
      end

      def self.symbol_pattern_for_language(*args, **kwargs)
        invoke_source_function("symbolPatternForLanguage", *args, **kwargs)
      end

      def self.validate(*args, **kwargs)
        invoke_source_function("validate", *args, **kwargs)
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
