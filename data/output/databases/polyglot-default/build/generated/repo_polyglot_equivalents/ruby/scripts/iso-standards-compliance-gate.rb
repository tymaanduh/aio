# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/iso-standards-compliance-gate.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "analyze",
  "buildChecklistMarkdown",
  "buildRecommendations",
  "evaluateEvidenceLinks",
  "evaluateStandardRow",
  "getStatusFieldName",
  "issue",
  "main",
  "normalizePath",
  "normalizeText",
  "parseArgs",
  "readJson",
  "writeOutputs"
]
      SYMBOL_MAP = {
  "analyze": "analyze",
  "buildChecklistMarkdown": "build_checklist_markdown",
  "buildRecommendations": "build_recommendations",
  "evaluateEvidenceLinks": "evaluate_evidence_links",
  "evaluateStandardRow": "evaluate_standard_row",
  "getStatusFieldName": "get_status_field_name",
  "issue": "issue",
  "main": "main",
  "normalizePath": "normalize_path",
  "normalizeText": "normalize_text",
  "parseArgs": "parse_args",
  "readJson": "read_json",
  "writeOutputs": "write_outputs"
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

      def self.analyze(*args, **kwargs)
        invoke_source_function("analyze", *args, **kwargs)
      end

      def self.build_checklist_markdown(*args, **kwargs)
        invoke_source_function("buildChecklistMarkdown", *args, **kwargs)
      end

      def self.build_recommendations(*args, **kwargs)
        invoke_source_function("buildRecommendations", *args, **kwargs)
      end

      def self.evaluate_evidence_links(*args, **kwargs)
        invoke_source_function("evaluateEvidenceLinks", *args, **kwargs)
      end

      def self.evaluate_standard_row(*args, **kwargs)
        invoke_source_function("evaluateStandardRow", *args, **kwargs)
      end

      def self.get_status_field_name(*args, **kwargs)
        invoke_source_function("getStatusFieldName", *args, **kwargs)
      end

      def self.issue(*args, **kwargs)
        invoke_source_function("issue", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.normalize_path(*args, **kwargs)
        invoke_source_function("normalizePath", *args, **kwargs)
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

      def self.write_outputs(*args, **kwargs)
        invoke_source_function("writeOutputs", *args, **kwargs)
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
