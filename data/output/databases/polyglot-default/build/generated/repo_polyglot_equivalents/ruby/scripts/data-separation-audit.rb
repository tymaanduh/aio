# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/data-separation-audit.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "classifyConstant",
  "collectJsFiles",
  "detectCandidatesInFile",
  "ensureDir",
  "isIgnoredPath",
  "main",
  "normalizePath",
  "nowIso",
  "parseArgs",
  "printHelpAndExit",
  "summarizeByPath",
  "toRelativePath"
]
      SYMBOL_MAP = {
  "classifyConstant": "classify_constant",
  "collectJsFiles": "collect_js_files",
  "detectCandidatesInFile": "detect_candidates_in_file",
  "ensureDir": "ensure_dir",
  "isIgnoredPath": "is_ignored_path",
  "main": "main",
  "normalizePath": "normalize_path",
  "nowIso": "now_iso",
  "parseArgs": "parse_args",
  "printHelpAndExit": "print_help_and_exit",
  "summarizeByPath": "summarize_by_path",
  "toRelativePath": "to_relative_path"
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

      def self.classify_constant(*args, **kwargs)
        invoke_source_function("classifyConstant", *args, **kwargs)
      end

      def self.collect_js_files(*args, **kwargs)
        invoke_source_function("collectJsFiles", *args, **kwargs)
      end

      def self.detect_candidates_in_file(*args, **kwargs)
        invoke_source_function("detectCandidatesInFile", *args, **kwargs)
      end

      def self.ensure_dir(*args, **kwargs)
        invoke_source_function("ensureDir", *args, **kwargs)
      end

      def self.is_ignored_path(*args, **kwargs)
        invoke_source_function("isIgnoredPath", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.normalize_path(*args, **kwargs)
        invoke_source_function("normalizePath", *args, **kwargs)
      end

      def self.now_iso(*args, **kwargs)
        invoke_source_function("nowIso", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.print_help_and_exit(*args, **kwargs)
        invoke_source_function("printHelpAndExit", *args, **kwargs)
      end

      def self.summarize_by_path(*args, **kwargs)
        invoke_source_function("summarizeByPath", *args, **kwargs)
      end

      def self.to_relative_path(*args, **kwargs)
        invoke_source_function("toRelativePath", *args, **kwargs)
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
