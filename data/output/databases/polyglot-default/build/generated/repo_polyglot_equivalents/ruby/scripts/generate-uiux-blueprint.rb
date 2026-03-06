# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/generate-uiux-blueprint.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "analyze",
  "buildBlueprintMarkdown",
  "buildRecommendations",
  "ensureDirForFile",
  "issue",
  "main",
  "normalizePath",
  "normalizeText",
  "parseArgs",
  "readJson",
  "validateColorRoles",
  "validateComponentTaxonomy",
  "validateLayoutErgonomics",
  "validateMeasurementPlan",
  "validateUserPreferences",
  "writeOutputs"
]
      SYMBOL_MAP = {
  "analyze": "analyze",
  "buildBlueprintMarkdown": "build_blueprint_markdown",
  "buildRecommendations": "build_recommendations",
  "ensureDirForFile": "ensure_dir_for_file",
  "issue": "issue",
  "main": "main",
  "normalizePath": "normalize_path",
  "normalizeText": "normalize_text",
  "parseArgs": "parse_args",
  "readJson": "read_json",
  "validateColorRoles": "validate_color_roles",
  "validateComponentTaxonomy": "validate_component_taxonomy",
  "validateLayoutErgonomics": "validate_layout_ergonomics",
  "validateMeasurementPlan": "validate_measurement_plan",
  "validateUserPreferences": "validate_user_preferences",
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

      def self.build_blueprint_markdown(*args, **kwargs)
        invoke_source_function("buildBlueprintMarkdown", *args, **kwargs)
      end

      def self.build_recommendations(*args, **kwargs)
        invoke_source_function("buildRecommendations", *args, **kwargs)
      end

      def self.ensure_dir_for_file(*args, **kwargs)
        invoke_source_function("ensureDirForFile", *args, **kwargs)
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

      def self.validate_color_roles(*args, **kwargs)
        invoke_source_function("validateColorRoles", *args, **kwargs)
      end

      def self.validate_component_taxonomy(*args, **kwargs)
        invoke_source_function("validateComponentTaxonomy", *args, **kwargs)
      end

      def self.validate_layout_ergonomics(*args, **kwargs)
        invoke_source_function("validateLayoutErgonomics", *args, **kwargs)
      end

      def self.validate_measurement_plan(*args, **kwargs)
        invoke_source_function("validateMeasurementPlan", *args, **kwargs)
      end

      def self.validate_user_preferences(*args, **kwargs)
        invoke_source_function("validateUserPreferences", *args, **kwargs)
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
