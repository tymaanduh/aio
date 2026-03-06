# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/general-workflow.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "buildOutputFormatSummary",
  "buildOutputFormatTargets",
  "buildPipelineArgs",
  "buildScriptRuntimeReport",
  "buildWorkflowSummary",
  "exitOnFailedStage",
  "main",
  "parseArgs",
  "parseCommandSummary",
  "parseJsonFromCommandOutput",
  "printHelpAndExit",
  "resolveMode",
  "resolveNpxCommand",
  "resolvePrettierCommand",
  "runAgentRegistryValidationStage",
  "runCommand",
  "runEfficiencyStage",
  "runHardGovernanceStage",
  "runOutputFormatStage",
  "runPipelineStage",
  "runPreflightStage",
  "runPruneStage",
  "runRuntimeOptimizationBacklogStage",
  "runSeparationAuditStage",
  "runSwappableScriptStage",
  "runUiuxBlueprintStage",
  "runWrapperContractStage",
  "skippedStage",
  "toRuntimeStageEntry",
  "writeJsonSummary",
  "writeScriptRuntimeReport"
]
      SYMBOL_MAP = {
  "buildOutputFormatSummary": "build_output_format_summary",
  "buildOutputFormatTargets": "build_output_format_targets",
  "buildPipelineArgs": "build_pipeline_args",
  "buildScriptRuntimeReport": "build_script_runtime_report",
  "buildWorkflowSummary": "build_workflow_summary",
  "exitOnFailedStage": "exit_on_failed_stage",
  "main": "main",
  "parseArgs": "parse_args",
  "parseCommandSummary": "parse_command_summary",
  "parseJsonFromCommandOutput": "parse_json_from_command_output",
  "printHelpAndExit": "print_help_and_exit",
  "resolveMode": "resolve_mode",
  "resolveNpxCommand": "resolve_npx_command",
  "resolvePrettierCommand": "resolve_prettier_command",
  "runAgentRegistryValidationStage": "run_agent_registry_validation_stage",
  "runCommand": "run_command",
  "runEfficiencyStage": "run_efficiency_stage",
  "runHardGovernanceStage": "run_hard_governance_stage",
  "runOutputFormatStage": "run_output_format_stage",
  "runPipelineStage": "run_pipeline_stage",
  "runPreflightStage": "run_preflight_stage",
  "runPruneStage": "run_prune_stage",
  "runRuntimeOptimizationBacklogStage": "run_runtime_optimization_backlog_stage",
  "runSeparationAuditStage": "run_separation_audit_stage",
  "runSwappableScriptStage": "run_swappable_script_stage",
  "runUiuxBlueprintStage": "run_uiux_blueprint_stage",
  "runWrapperContractStage": "run_wrapper_contract_stage",
  "skippedStage": "skipped_stage",
  "toRuntimeStageEntry": "to_runtime_stage_entry",
  "writeJsonSummary": "write_json_summary",
  "writeScriptRuntimeReport": "write_script_runtime_report"
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

      def self.build_output_format_summary(*args, **kwargs)
        invoke_source_function("buildOutputFormatSummary", *args, **kwargs)
      end

      def self.build_output_format_targets(*args, **kwargs)
        invoke_source_function("buildOutputFormatTargets", *args, **kwargs)
      end

      def self.build_pipeline_args(*args, **kwargs)
        invoke_source_function("buildPipelineArgs", *args, **kwargs)
      end

      def self.build_script_runtime_report(*args, **kwargs)
        invoke_source_function("buildScriptRuntimeReport", *args, **kwargs)
      end

      def self.build_workflow_summary(*args, **kwargs)
        invoke_source_function("buildWorkflowSummary", *args, **kwargs)
      end

      def self.exit_on_failed_stage(*args, **kwargs)
        invoke_source_function("exitOnFailedStage", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.parse_command_summary(*args, **kwargs)
        invoke_source_function("parseCommandSummary", *args, **kwargs)
      end

      def self.parse_json_from_command_output(*args, **kwargs)
        invoke_source_function("parseJsonFromCommandOutput", *args, **kwargs)
      end

      def self.print_help_and_exit(*args, **kwargs)
        invoke_source_function("printHelpAndExit", *args, **kwargs)
      end

      def self.resolve_mode(*args, **kwargs)
        invoke_source_function("resolveMode", *args, **kwargs)
      end

      def self.resolve_npx_command(*args, **kwargs)
        invoke_source_function("resolveNpxCommand", *args, **kwargs)
      end

      def self.resolve_prettier_command(*args, **kwargs)
        invoke_source_function("resolvePrettierCommand", *args, **kwargs)
      end

      def self.run_agent_registry_validation_stage(*args, **kwargs)
        invoke_source_function("runAgentRegistryValidationStage", *args, **kwargs)
      end

      def self.run_command(*args, **kwargs)
        invoke_source_function("runCommand", *args, **kwargs)
      end

      def self.run_efficiency_stage(*args, **kwargs)
        invoke_source_function("runEfficiencyStage", *args, **kwargs)
      end

      def self.run_hard_governance_stage(*args, **kwargs)
        invoke_source_function("runHardGovernanceStage", *args, **kwargs)
      end

      def self.run_output_format_stage(*args, **kwargs)
        invoke_source_function("runOutputFormatStage", *args, **kwargs)
      end

      def self.run_pipeline_stage(*args, **kwargs)
        invoke_source_function("runPipelineStage", *args, **kwargs)
      end

      def self.run_preflight_stage(*args, **kwargs)
        invoke_source_function("runPreflightStage", *args, **kwargs)
      end

      def self.run_prune_stage(*args, **kwargs)
        invoke_source_function("runPruneStage", *args, **kwargs)
      end

      def self.run_runtime_optimization_backlog_stage(*args, **kwargs)
        invoke_source_function("runRuntimeOptimizationBacklogStage", *args, **kwargs)
      end

      def self.run_separation_audit_stage(*args, **kwargs)
        invoke_source_function("runSeparationAuditStage", *args, **kwargs)
      end

      def self.run_swappable_script_stage(*args, **kwargs)
        invoke_source_function("runSwappableScriptStage", *args, **kwargs)
      end

      def self.run_uiux_blueprint_stage(*args, **kwargs)
        invoke_source_function("runUiuxBlueprintStage", *args, **kwargs)
      end

      def self.run_wrapper_contract_stage(*args, **kwargs)
        invoke_source_function("runWrapperContractStage", *args, **kwargs)
      end

      def self.skipped_stage(*args, **kwargs)
        invoke_source_function("skippedStage", *args, **kwargs)
      end

      def self.to_runtime_stage_entry(*args, **kwargs)
        invoke_source_function("toRuntimeStageEntry", *args, **kwargs)
      end

      def self.write_json_summary(*args, **kwargs)
        invoke_source_function("writeJsonSummary", *args, **kwargs)
      end

      def self.write_script_runtime_report(*args, **kwargs)
        invoke_source_function("writeScriptRuntimeReport", *args, **kwargs)
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
