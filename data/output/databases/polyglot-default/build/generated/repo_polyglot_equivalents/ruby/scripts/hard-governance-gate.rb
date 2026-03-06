# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/hard-governance-gate.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "analyze",
  "analyzeAgents",
  "analyzeAutomations",
  "analyzeRouting",
  "buildFutureBlueprintMarkdown",
  "buildRoadmapMarkdown",
  "buildSuggestions",
  "checkRequiredStandardsCatalogs",
  "checkRequiredWorkflowScripts",
  "estimateTokens",
  "issue",
  "main",
  "normalizePathForOutput",
  "normalizeText",
  "parseArgs",
  "parseRRule",
  "readAutomations",
  "readJson",
  "readYaml",
  "runIsoStandardsComplianceSubcheck",
  "runStandardsBaselineSubcheck",
  "runUiuxBlueprintSubcheck",
  "runWorkflowPipelineOrderSubcheck",
  "writeOutputs"
]
      SYMBOL_MAP = {
  "analyze": "analyze",
  "analyzeAgents": "analyze_agents",
  "analyzeAutomations": "analyze_automations",
  "analyzeRouting": "analyze_routing",
  "buildFutureBlueprintMarkdown": "build_future_blueprint_markdown",
  "buildRoadmapMarkdown": "build_roadmap_markdown",
  "buildSuggestions": "build_suggestions",
  "checkRequiredStandardsCatalogs": "check_required_standards_catalogs",
  "checkRequiredWorkflowScripts": "check_required_workflow_scripts",
  "estimateTokens": "estimate_tokens",
  "issue": "issue",
  "main": "main",
  "normalizePathForOutput": "normalize_path_for_output",
  "normalizeText": "normalize_text",
  "parseArgs": "parse_args",
  "parseRRule": "parse_rrule",
  "readAutomations": "read_automations",
  "readJson": "read_json",
  "readYaml": "read_yaml",
  "runIsoStandardsComplianceSubcheck": "run_iso_standards_compliance_subcheck",
  "runStandardsBaselineSubcheck": "run_standards_baseline_subcheck",
  "runUiuxBlueprintSubcheck": "run_uiux_blueprint_subcheck",
  "runWorkflowPipelineOrderSubcheck": "run_workflow_pipeline_order_subcheck",
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

      def self.analyze_agents(*args, **kwargs)
        invoke_source_function("analyzeAgents", *args, **kwargs)
      end

      def self.analyze_automations(*args, **kwargs)
        invoke_source_function("analyzeAutomations", *args, **kwargs)
      end

      def self.analyze_routing(*args, **kwargs)
        invoke_source_function("analyzeRouting", *args, **kwargs)
      end

      def self.build_future_blueprint_markdown(*args, **kwargs)
        invoke_source_function("buildFutureBlueprintMarkdown", *args, **kwargs)
      end

      def self.build_roadmap_markdown(*args, **kwargs)
        invoke_source_function("buildRoadmapMarkdown", *args, **kwargs)
      end

      def self.build_suggestions(*args, **kwargs)
        invoke_source_function("buildSuggestions", *args, **kwargs)
      end

      def self.check_required_standards_catalogs(*args, **kwargs)
        invoke_source_function("checkRequiredStandardsCatalogs", *args, **kwargs)
      end

      def self.check_required_workflow_scripts(*args, **kwargs)
        invoke_source_function("checkRequiredWorkflowScripts", *args, **kwargs)
      end

      def self.estimate_tokens(*args, **kwargs)
        invoke_source_function("estimateTokens", *args, **kwargs)
      end

      def self.issue(*args, **kwargs)
        invoke_source_function("issue", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.normalize_path_for_output(*args, **kwargs)
        invoke_source_function("normalizePathForOutput", *args, **kwargs)
      end

      def self.normalize_text(*args, **kwargs)
        invoke_source_function("normalizeText", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.parse_rrule(*args, **kwargs)
        invoke_source_function("parseRRule", *args, **kwargs)
      end

      def self.read_automations(*args, **kwargs)
        invoke_source_function("readAutomations", *args, **kwargs)
      end

      def self.read_json(*args, **kwargs)
        invoke_source_function("readJson", *args, **kwargs)
      end

      def self.read_yaml(*args, **kwargs)
        invoke_source_function("readYaml", *args, **kwargs)
      end

      def self.run_iso_standards_compliance_subcheck(*args, **kwargs)
        invoke_source_function("runIsoStandardsComplianceSubcheck", *args, **kwargs)
      end

      def self.run_standards_baseline_subcheck(*args, **kwargs)
        invoke_source_function("runStandardsBaselineSubcheck", *args, **kwargs)
      end

      def self.run_uiux_blueprint_subcheck(*args, **kwargs)
        invoke_source_function("runUiuxBlueprintSubcheck", *args, **kwargs)
      end

      def self.run_workflow_pipeline_order_subcheck(*args, **kwargs)
        invoke_source_function("runWorkflowPipelineOrderSubcheck", *args, **kwargs)
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
