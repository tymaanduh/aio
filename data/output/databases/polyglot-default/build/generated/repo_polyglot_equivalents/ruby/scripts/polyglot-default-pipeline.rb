# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/polyglot-default-pipeline.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "appendIfMissingMarker",
  "arraysEqualAsSet",
  "artifactPaths",
  "buildContractRuntimeIndex",
  "buildEnglishBlueprint",
  "buildFinalRecommendation",
  "buildHierarchyOrderDoc",
  "buildIncrementalEnglishSection",
  "buildIncrementalPseudocodeSection",
  "buildInstructionTemplateRegistry",
  "buildLanguageSupportFiles",
  "buildOutputSummary",
  "buildPolyglotImplementation",
  "buildPseudocodeBlueprint",
  "buildRuntimeDispatchCatalog",
  "buildStagePlan",
  "bytesOfText",
  "clone_plain_object",
  "createInitialUpdateScanReport",
  "DEFAULT_WRAPPER_PREFLIGHT",
  "derivePlannedUpdates",
  "deriveProjectName",
  "deriveScopeSummary",
  "detectToolchains",
  "emptyFunctionLanguagePlan",
  "emptyWinnerMapping",
  "ensureDir",
  "ensureOutputLayout",
  "ensureParentDir",
  "extensionForLanguage",
  "fileExists",
  "finalizeUpdateScanReport",
  "hashText",
  "median",
  "normalizeActionIdList",
  "normalizeContractCatalog",
  "normalizeInstructionTemplateIndex",
  "normalizeLanguageId",
  "nowIso",
  "parseArgs",
  "parseJsonFromCommandOutput",
  "parseJsonObject",
  "pickBenchmarkRanking",
  "pickBenchmarkTopLanguage",
  "pickFunctionLanguagePlan",
  "pickWinnerMapping",
  "printHelpAndExit",
  "readBrief",
  "readJsonIfExists",
  "readTextIfExists",
  "renderCppContractDataHeader",
  "renderCppWrapperModule",
  "renderLanguageStub",
  "renderPythonContractDataModule",
  "renderPythonWrapperModule",
  "resolveFirstExistingPath",
  "resolveRunMode",
  "resolveRuntimeBenchmarkLanguages",
  "runBenchmark",
  "runBuildChecks",
  "runPipeline",
  "runProbeBenchmark",
  "runSecurityAudit",
  "runUpdateScan",
  "runWrapperPreflight",
  "scoreLanguages",
  "stageSkip",
  "toCppStringLiteral",
  "toPascalCase",
  "toPythonLiteral",
  "toSortedUniqueArray",
  "toUpdateScanOk",
  "writeJson",
  "writeText",
  "writeUpdateScanReport"
]
      SYMBOL_MAP = {
  "appendIfMissingMarker": "append_if_missing_marker",
  "arraysEqualAsSet": "arrays_equal_as_set",
  "artifactPaths": "artifact_paths",
  "buildContractRuntimeIndex": "build_contract_runtime_index",
  "buildEnglishBlueprint": "build_english_blueprint",
  "buildFinalRecommendation": "build_final_recommendation",
  "buildHierarchyOrderDoc": "build_hierarchy_order_doc",
  "buildIncrementalEnglishSection": "build_incremental_english_section",
  "buildIncrementalPseudocodeSection": "build_incremental_pseudocode_section",
  "buildInstructionTemplateRegistry": "build_instruction_template_registry",
  "buildLanguageSupportFiles": "build_language_support_files",
  "buildOutputSummary": "build_output_summary",
  "buildPolyglotImplementation": "build_polyglot_implementation",
  "buildPseudocodeBlueprint": "build_pseudocode_blueprint",
  "buildRuntimeDispatchCatalog": "build_runtime_dispatch_catalog",
  "buildStagePlan": "build_stage_plan",
  "bytesOfText": "bytes_of_text",
  "clone_plain_object": "clone_plain_object",
  "createInitialUpdateScanReport": "create_initial_update_scan_report",
  "DEFAULT_WRAPPER_PREFLIGHT": "default_wrapper_preflight",
  "derivePlannedUpdates": "derive_planned_updates",
  "deriveProjectName": "derive_project_name",
  "deriveScopeSummary": "derive_scope_summary",
  "detectToolchains": "detect_toolchains",
  "emptyFunctionLanguagePlan": "empty_function_language_plan",
  "emptyWinnerMapping": "empty_winner_mapping",
  "ensureDir": "ensure_dir",
  "ensureOutputLayout": "ensure_output_layout",
  "ensureParentDir": "ensure_parent_dir",
  "extensionForLanguage": "extension_for_language",
  "fileExists": "file_exists",
  "finalizeUpdateScanReport": "finalize_update_scan_report",
  "hashText": "hash_text",
  "median": "median",
  "normalizeActionIdList": "normalize_action_id_list",
  "normalizeContractCatalog": "normalize_contract_catalog",
  "normalizeInstructionTemplateIndex": "normalize_instruction_template_index",
  "normalizeLanguageId": "normalize_language_id",
  "nowIso": "now_iso",
  "parseArgs": "parse_args",
  "parseJsonFromCommandOutput": "parse_json_from_command_output",
  "parseJsonObject": "parse_json_object",
  "pickBenchmarkRanking": "pick_benchmark_ranking",
  "pickBenchmarkTopLanguage": "pick_benchmark_top_language",
  "pickFunctionLanguagePlan": "pick_function_language_plan",
  "pickWinnerMapping": "pick_winner_mapping",
  "printHelpAndExit": "print_help_and_exit",
  "readBrief": "read_brief",
  "readJsonIfExists": "read_json_if_exists",
  "readTextIfExists": "read_text_if_exists",
  "renderCppContractDataHeader": "render_cpp_contract_data_header",
  "renderCppWrapperModule": "render_cpp_wrapper_module",
  "renderLanguageStub": "render_language_stub",
  "renderPythonContractDataModule": "render_python_contract_data_module",
  "renderPythonWrapperModule": "render_python_wrapper_module",
  "resolveFirstExistingPath": "resolve_first_existing_path",
  "resolveRunMode": "resolve_run_mode",
  "resolveRuntimeBenchmarkLanguages": "resolve_runtime_benchmark_languages",
  "runBenchmark": "run_benchmark",
  "runBuildChecks": "run_build_checks",
  "runPipeline": "run_pipeline",
  "runProbeBenchmark": "run_probe_benchmark",
  "runSecurityAudit": "run_security_audit",
  "runUpdateScan": "run_update_scan",
  "runWrapperPreflight": "run_wrapper_preflight",
  "scoreLanguages": "score_languages",
  "stageSkip": "stage_skip",
  "toCppStringLiteral": "to_cpp_string_literal",
  "toPascalCase": "to_pascal_case",
  "toPythonLiteral": "to_python_literal",
  "toSortedUniqueArray": "to_sorted_unique_array",
  "toUpdateScanOk": "to_update_scan_ok",
  "writeJson": "write_json",
  "writeText": "write_text",
  "writeUpdateScanReport": "write_update_scan_report"
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

      def self.append_if_missing_marker(*args, **kwargs)
        invoke_source_function("appendIfMissingMarker", *args, **kwargs)
      end

      def self.arrays_equal_as_set(*args, **kwargs)
        invoke_source_function("arraysEqualAsSet", *args, **kwargs)
      end

      def self.artifact_paths(*args, **kwargs)
        invoke_source_function("artifactPaths", *args, **kwargs)
      end

      def self.build_contract_runtime_index(*args, **kwargs)
        invoke_source_function("buildContractRuntimeIndex", *args, **kwargs)
      end

      def self.build_english_blueprint(*args, **kwargs)
        invoke_source_function("buildEnglishBlueprint", *args, **kwargs)
      end

      def self.build_final_recommendation(*args, **kwargs)
        invoke_source_function("buildFinalRecommendation", *args, **kwargs)
      end

      def self.build_hierarchy_order_doc(*args, **kwargs)
        invoke_source_function("buildHierarchyOrderDoc", *args, **kwargs)
      end

      def self.build_incremental_english_section(*args, **kwargs)
        invoke_source_function("buildIncrementalEnglishSection", *args, **kwargs)
      end

      def self.build_incremental_pseudocode_section(*args, **kwargs)
        invoke_source_function("buildIncrementalPseudocodeSection", *args, **kwargs)
      end

      def self.build_instruction_template_registry(*args, **kwargs)
        invoke_source_function("buildInstructionTemplateRegistry", *args, **kwargs)
      end

      def self.build_language_support_files(*args, **kwargs)
        invoke_source_function("buildLanguageSupportFiles", *args, **kwargs)
      end

      def self.build_output_summary(*args, **kwargs)
        invoke_source_function("buildOutputSummary", *args, **kwargs)
      end

      def self.build_polyglot_implementation(*args, **kwargs)
        invoke_source_function("buildPolyglotImplementation", *args, **kwargs)
      end

      def self.build_pseudocode_blueprint(*args, **kwargs)
        invoke_source_function("buildPseudocodeBlueprint", *args, **kwargs)
      end

      def self.build_runtime_dispatch_catalog(*args, **kwargs)
        invoke_source_function("buildRuntimeDispatchCatalog", *args, **kwargs)
      end

      def self.build_stage_plan(*args, **kwargs)
        invoke_source_function("buildStagePlan", *args, **kwargs)
      end

      def self.bytes_of_text(*args, **kwargs)
        invoke_source_function("bytesOfText", *args, **kwargs)
      end

      def self.clone_plain_object(*args, **kwargs)
        invoke_source_function("clone_plain_object", *args, **kwargs)
      end

      def self.create_initial_update_scan_report(*args, **kwargs)
        invoke_source_function("createInitialUpdateScanReport", *args, **kwargs)
      end

      def self.default_wrapper_preflight(*args, **kwargs)
        invoke_source_function("DEFAULT_WRAPPER_PREFLIGHT", *args, **kwargs)
      end

      def self.derive_planned_updates(*args, **kwargs)
        invoke_source_function("derivePlannedUpdates", *args, **kwargs)
      end

      def self.derive_project_name(*args, **kwargs)
        invoke_source_function("deriveProjectName", *args, **kwargs)
      end

      def self.derive_scope_summary(*args, **kwargs)
        invoke_source_function("deriveScopeSummary", *args, **kwargs)
      end

      def self.detect_toolchains(*args, **kwargs)
        invoke_source_function("detectToolchains", *args, **kwargs)
      end

      def self.empty_function_language_plan(*args, **kwargs)
        invoke_source_function("emptyFunctionLanguagePlan", *args, **kwargs)
      end

      def self.empty_winner_mapping(*args, **kwargs)
        invoke_source_function("emptyWinnerMapping", *args, **kwargs)
      end

      def self.ensure_dir(*args, **kwargs)
        invoke_source_function("ensureDir", *args, **kwargs)
      end

      def self.ensure_output_layout(*args, **kwargs)
        invoke_source_function("ensureOutputLayout", *args, **kwargs)
      end

      def self.ensure_parent_dir(*args, **kwargs)
        invoke_source_function("ensureParentDir", *args, **kwargs)
      end

      def self.extension_for_language(*args, **kwargs)
        invoke_source_function("extensionForLanguage", *args, **kwargs)
      end

      def self.file_exists(*args, **kwargs)
        invoke_source_function("fileExists", *args, **kwargs)
      end

      def self.finalize_update_scan_report(*args, **kwargs)
        invoke_source_function("finalizeUpdateScanReport", *args, **kwargs)
      end

      def self.hash_text(*args, **kwargs)
        invoke_source_function("hashText", *args, **kwargs)
      end

      def self.median(*args, **kwargs)
        invoke_source_function("median", *args, **kwargs)
      end

      def self.normalize_action_id_list(*args, **kwargs)
        invoke_source_function("normalizeActionIdList", *args, **kwargs)
      end

      def self.normalize_contract_catalog(*args, **kwargs)
        invoke_source_function("normalizeContractCatalog", *args, **kwargs)
      end

      def self.normalize_instruction_template_index(*args, **kwargs)
        invoke_source_function("normalizeInstructionTemplateIndex", *args, **kwargs)
      end

      def self.normalize_language_id(*args, **kwargs)
        invoke_source_function("normalizeLanguageId", *args, **kwargs)
      end

      def self.now_iso(*args, **kwargs)
        invoke_source_function("nowIso", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.parse_json_from_command_output(*args, **kwargs)
        invoke_source_function("parseJsonFromCommandOutput", *args, **kwargs)
      end

      def self.parse_json_object(*args, **kwargs)
        invoke_source_function("parseJsonObject", *args, **kwargs)
      end

      def self.pick_benchmark_ranking(*args, **kwargs)
        invoke_source_function("pickBenchmarkRanking", *args, **kwargs)
      end

      def self.pick_benchmark_top_language(*args, **kwargs)
        invoke_source_function("pickBenchmarkTopLanguage", *args, **kwargs)
      end

      def self.pick_function_language_plan(*args, **kwargs)
        invoke_source_function("pickFunctionLanguagePlan", *args, **kwargs)
      end

      def self.pick_winner_mapping(*args, **kwargs)
        invoke_source_function("pickWinnerMapping", *args, **kwargs)
      end

      def self.print_help_and_exit(*args, **kwargs)
        invoke_source_function("printHelpAndExit", *args, **kwargs)
      end

      def self.read_brief(*args, **kwargs)
        invoke_source_function("readBrief", *args, **kwargs)
      end

      def self.read_json_if_exists(*args, **kwargs)
        invoke_source_function("readJsonIfExists", *args, **kwargs)
      end

      def self.read_text_if_exists(*args, **kwargs)
        invoke_source_function("readTextIfExists", *args, **kwargs)
      end

      def self.render_cpp_contract_data_header(*args, **kwargs)
        invoke_source_function("renderCppContractDataHeader", *args, **kwargs)
      end

      def self.render_cpp_wrapper_module(*args, **kwargs)
        invoke_source_function("renderCppWrapperModule", *args, **kwargs)
      end

      def self.render_language_stub(*args, **kwargs)
        invoke_source_function("renderLanguageStub", *args, **kwargs)
      end

      def self.render_python_contract_data_module(*args, **kwargs)
        invoke_source_function("renderPythonContractDataModule", *args, **kwargs)
      end

      def self.render_python_wrapper_module(*args, **kwargs)
        invoke_source_function("renderPythonWrapperModule", *args, **kwargs)
      end

      def self.resolve_first_existing_path(*args, **kwargs)
        invoke_source_function("resolveFirstExistingPath", *args, **kwargs)
      end

      def self.resolve_run_mode(*args, **kwargs)
        invoke_source_function("resolveRunMode", *args, **kwargs)
      end

      def self.resolve_runtime_benchmark_languages(*args, **kwargs)
        invoke_source_function("resolveRuntimeBenchmarkLanguages", *args, **kwargs)
      end

      def self.run_benchmark(*args, **kwargs)
        invoke_source_function("runBenchmark", *args, **kwargs)
      end

      def self.run_build_checks(*args, **kwargs)
        invoke_source_function("runBuildChecks", *args, **kwargs)
      end

      def self.run_pipeline(*args, **kwargs)
        invoke_source_function("runPipeline", *args, **kwargs)
      end

      def self.run_probe_benchmark(*args, **kwargs)
        invoke_source_function("runProbeBenchmark", *args, **kwargs)
      end

      def self.run_security_audit(*args, **kwargs)
        invoke_source_function("runSecurityAudit", *args, **kwargs)
      end

      def self.run_update_scan(*args, **kwargs)
        invoke_source_function("runUpdateScan", *args, **kwargs)
      end

      def self.run_wrapper_preflight(*args, **kwargs)
        invoke_source_function("runWrapperPreflight", *args, **kwargs)
      end

      def self.score_languages(*args, **kwargs)
        invoke_source_function("scoreLanguages", *args, **kwargs)
      end

      def self.stage_skip(*args, **kwargs)
        invoke_source_function("stageSkip", *args, **kwargs)
      end

      def self.to_cpp_string_literal(*args, **kwargs)
        invoke_source_function("toCppStringLiteral", *args, **kwargs)
      end

      def self.to_pascal_case(*args, **kwargs)
        invoke_source_function("toPascalCase", *args, **kwargs)
      end

      def self.to_python_literal(*args, **kwargs)
        invoke_source_function("toPythonLiteral", *args, **kwargs)
      end

      def self.to_sorted_unique_array(*args, **kwargs)
        invoke_source_function("toSortedUniqueArray", *args, **kwargs)
      end

      def self.to_update_scan_ok(*args, **kwargs)
        invoke_source_function("toUpdateScanOk", *args, **kwargs)
      end

      def self.write_json(*args, **kwargs)
        invoke_source_function("writeJson", *args, **kwargs)
      end

      def self.write_text(*args, **kwargs)
        invoke_source_function("writeText", *args, **kwargs)
      end

      def self.write_update_scan_report(*args, **kwargs)
        invoke_source_function("writeUpdateScanReport", *args, **kwargs)
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
