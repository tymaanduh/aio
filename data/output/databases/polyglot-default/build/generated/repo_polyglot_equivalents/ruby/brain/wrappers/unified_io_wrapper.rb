# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/unified_io_wrapper.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "attachRuntimeAliases",
  "build_pipeline_from_function_specs",
  "build_pipeline_from_operation_ids",
  "buildAliasLookup",
  "buildFunctionSignatureIndexFromOperations",
  "buildTwoPassFailure",
  "buildTwoPassSuccess",
  "collectCallArgsForStage",
  "create_default_function_registry",
  "create_runtime_io_reader",
  "create_runtime_io_stream",
  "create_runtime_io_writer",
  "create_unified_wrapper",
  "create_unified_wrapper_catalog",
  "createStageResult",
  "ensureRuntimeGroup",
  "ensureRuntimeMeta",
  "execute_pipeline",
  "identify_arguments",
  "initializeRuntimeBanks",
  "isPlainObject",
  "loadDefaultSpec",
  "loadNodeSpec",
  "loadRuntimeSpec",
  "normalize_runtime_io_stream",
  "normalize_stage_from_function_spec",
  "normalizeAliasIndex",
  "normalizeFunctionSignatureIndex",
  "normalizeGroupIndex",
  "normalizeInputArgs",
  "normalizeLabelIndex",
  "normalizeOperationIndex",
  "normalizeOperationList",
  "normalizePipelineIndex",
  "normalizeRuntimeDefaults",
  "normalizeText",
  "normalizeWrapperIndex",
  "nowIso",
  "read_symbol_value",
  "recordPassExecute",
  "recordPassIdentify",
  "resolve_operation_by_function_id",
  "resolveCanonicalSymbol",
  "resolveRuntimeGroupIds",
  "resolveStageOperation",
  "run_auto_pipeline",
  "run_pipeline_by_id",
  "run_two_pass",
  "run_two_pass_with_stream",
  "toArray",
  "toFiniteNumber",
  "toUniqueTextList",
  "write_symbol_value"
]
      SYMBOL_MAP = {
  "attachRuntimeAliases": "attach_runtime_aliases",
  "build_pipeline_from_function_specs": "build_pipeline_from_function_specs",
  "build_pipeline_from_operation_ids": "build_pipeline_from_operation_ids",
  "buildAliasLookup": "build_alias_lookup",
  "buildFunctionSignatureIndexFromOperations": "build_function_signature_index_from_operations",
  "buildTwoPassFailure": "build_two_pass_failure",
  "buildTwoPassSuccess": "build_two_pass_success",
  "collectCallArgsForStage": "collect_call_args_for_stage",
  "create_default_function_registry": "create_default_function_registry",
  "create_runtime_io_reader": "create_runtime_io_reader",
  "create_runtime_io_stream": "create_runtime_io_stream",
  "create_runtime_io_writer": "create_runtime_io_writer",
  "create_unified_wrapper": "create_unified_wrapper",
  "create_unified_wrapper_catalog": "create_unified_wrapper_catalog",
  "createStageResult": "create_stage_result",
  "ensureRuntimeGroup": "ensure_runtime_group",
  "ensureRuntimeMeta": "ensure_runtime_meta",
  "execute_pipeline": "execute_pipeline",
  "identify_arguments": "identify_arguments",
  "initializeRuntimeBanks": "initialize_runtime_banks",
  "isPlainObject": "is_plain_object",
  "loadDefaultSpec": "load_default_spec",
  "loadNodeSpec": "load_node_spec",
  "loadRuntimeSpec": "load_runtime_spec",
  "normalize_runtime_io_stream": "normalize_runtime_io_stream",
  "normalize_stage_from_function_spec": "normalize_stage_from_function_spec",
  "normalizeAliasIndex": "normalize_alias_index",
  "normalizeFunctionSignatureIndex": "normalize_function_signature_index",
  "normalizeGroupIndex": "normalize_group_index",
  "normalizeInputArgs": "normalize_input_args",
  "normalizeLabelIndex": "normalize_label_index",
  "normalizeOperationIndex": "normalize_operation_index",
  "normalizeOperationList": "normalize_operation_list",
  "normalizePipelineIndex": "normalize_pipeline_index",
  "normalizeRuntimeDefaults": "normalize_runtime_defaults",
  "normalizeText": "normalize_text",
  "normalizeWrapperIndex": "normalize_wrapper_index",
  "nowIso": "now_iso",
  "read_symbol_value": "read_symbol_value",
  "recordPassExecute": "record_pass_execute",
  "recordPassIdentify": "record_pass_identify",
  "resolve_operation_by_function_id": "resolve_operation_by_function_id",
  "resolveCanonicalSymbol": "resolve_canonical_symbol",
  "resolveRuntimeGroupIds": "resolve_runtime_group_ids",
  "resolveStageOperation": "resolve_stage_operation",
  "run_auto_pipeline": "run_auto_pipeline",
  "run_pipeline_by_id": "run_pipeline_by_id",
  "run_two_pass": "run_two_pass",
  "run_two_pass_with_stream": "run_two_pass_with_stream",
  "toArray": "to_array",
  "toFiniteNumber": "to_finite_number",
  "toUniqueTextList": "to_unique_text_list",
  "write_symbol_value": "write_symbol_value"
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

      def self.attach_runtime_aliases(*args, **kwargs)
        invoke_source_function("attachRuntimeAliases", *args, **kwargs)
      end

      def self.build_pipeline_from_function_specs(*args, **kwargs)
        invoke_source_function("build_pipeline_from_function_specs", *args, **kwargs)
      end

      def self.build_pipeline_from_operation_ids(*args, **kwargs)
        invoke_source_function("build_pipeline_from_operation_ids", *args, **kwargs)
      end

      def self.build_alias_lookup(*args, **kwargs)
        invoke_source_function("buildAliasLookup", *args, **kwargs)
      end

      def self.build_function_signature_index_from_operations(*args, **kwargs)
        invoke_source_function("buildFunctionSignatureIndexFromOperations", *args, **kwargs)
      end

      def self.build_two_pass_failure(*args, **kwargs)
        invoke_source_function("buildTwoPassFailure", *args, **kwargs)
      end

      def self.build_two_pass_success(*args, **kwargs)
        invoke_source_function("buildTwoPassSuccess", *args, **kwargs)
      end

      def self.collect_call_args_for_stage(*args, **kwargs)
        invoke_source_function("collectCallArgsForStage", *args, **kwargs)
      end

      def self.create_default_function_registry(*args, **kwargs)
        invoke_source_function("create_default_function_registry", *args, **kwargs)
      end

      def self.create_runtime_io_reader(*args, **kwargs)
        invoke_source_function("create_runtime_io_reader", *args, **kwargs)
      end

      def self.create_runtime_io_stream(*args, **kwargs)
        invoke_source_function("create_runtime_io_stream", *args, **kwargs)
      end

      def self.create_runtime_io_writer(*args, **kwargs)
        invoke_source_function("create_runtime_io_writer", *args, **kwargs)
      end

      def self.create_unified_wrapper(*args, **kwargs)
        invoke_source_function("create_unified_wrapper", *args, **kwargs)
      end

      def self.create_unified_wrapper_catalog(*args, **kwargs)
        invoke_source_function("create_unified_wrapper_catalog", *args, **kwargs)
      end

      def self.create_stage_result(*args, **kwargs)
        invoke_source_function("createStageResult", *args, **kwargs)
      end

      def self.ensure_runtime_group(*args, **kwargs)
        invoke_source_function("ensureRuntimeGroup", *args, **kwargs)
      end

      def self.ensure_runtime_meta(*args, **kwargs)
        invoke_source_function("ensureRuntimeMeta", *args, **kwargs)
      end

      def self.execute_pipeline(*args, **kwargs)
        invoke_source_function("execute_pipeline", *args, **kwargs)
      end

      def self.identify_arguments(*args, **kwargs)
        invoke_source_function("identify_arguments", *args, **kwargs)
      end

      def self.initialize_runtime_banks(*args, **kwargs)
        invoke_source_function("initializeRuntimeBanks", *args, **kwargs)
      end

      def self.is_plain_object(*args, **kwargs)
        invoke_source_function("isPlainObject", *args, **kwargs)
      end

      def self.load_default_spec(*args, **kwargs)
        invoke_source_function("loadDefaultSpec", *args, **kwargs)
      end

      def self.load_node_spec(*args, **kwargs)
        invoke_source_function("loadNodeSpec", *args, **kwargs)
      end

      def self.load_runtime_spec(*args, **kwargs)
        invoke_source_function("loadRuntimeSpec", *args, **kwargs)
      end

      def self.normalize_runtime_io_stream(*args, **kwargs)
        invoke_source_function("normalize_runtime_io_stream", *args, **kwargs)
      end

      def self.normalize_stage_from_function_spec(*args, **kwargs)
        invoke_source_function("normalize_stage_from_function_spec", *args, **kwargs)
      end

      def self.normalize_alias_index(*args, **kwargs)
        invoke_source_function("normalizeAliasIndex", *args, **kwargs)
      end

      def self.normalize_function_signature_index(*args, **kwargs)
        invoke_source_function("normalizeFunctionSignatureIndex", *args, **kwargs)
      end

      def self.normalize_group_index(*args, **kwargs)
        invoke_source_function("normalizeGroupIndex", *args, **kwargs)
      end

      def self.normalize_input_args(*args, **kwargs)
        invoke_source_function("normalizeInputArgs", *args, **kwargs)
      end

      def self.normalize_label_index(*args, **kwargs)
        invoke_source_function("normalizeLabelIndex", *args, **kwargs)
      end

      def self.normalize_operation_index(*args, **kwargs)
        invoke_source_function("normalizeOperationIndex", *args, **kwargs)
      end

      def self.normalize_operation_list(*args, **kwargs)
        invoke_source_function("normalizeOperationList", *args, **kwargs)
      end

      def self.normalize_pipeline_index(*args, **kwargs)
        invoke_source_function("normalizePipelineIndex", *args, **kwargs)
      end

      def self.normalize_runtime_defaults(*args, **kwargs)
        invoke_source_function("normalizeRuntimeDefaults", *args, **kwargs)
      end

      def self.normalize_text(*args, **kwargs)
        invoke_source_function("normalizeText", *args, **kwargs)
      end

      def self.normalize_wrapper_index(*args, **kwargs)
        invoke_source_function("normalizeWrapperIndex", *args, **kwargs)
      end

      def self.now_iso(*args, **kwargs)
        invoke_source_function("nowIso", *args, **kwargs)
      end

      def self.read_symbol_value(*args, **kwargs)
        invoke_source_function("read_symbol_value", *args, **kwargs)
      end

      def self.record_pass_execute(*args, **kwargs)
        invoke_source_function("recordPassExecute", *args, **kwargs)
      end

      def self.record_pass_identify(*args, **kwargs)
        invoke_source_function("recordPassIdentify", *args, **kwargs)
      end

      def self.resolve_operation_by_function_id(*args, **kwargs)
        invoke_source_function("resolve_operation_by_function_id", *args, **kwargs)
      end

      def self.resolve_canonical_symbol(*args, **kwargs)
        invoke_source_function("resolveCanonicalSymbol", *args, **kwargs)
      end

      def self.resolve_runtime_group_ids(*args, **kwargs)
        invoke_source_function("resolveRuntimeGroupIds", *args, **kwargs)
      end

      def self.resolve_stage_operation(*args, **kwargs)
        invoke_source_function("resolveStageOperation", *args, **kwargs)
      end

      def self.run_auto_pipeline(*args, **kwargs)
        invoke_source_function("run_auto_pipeline", *args, **kwargs)
      end

      def self.run_pipeline_by_id(*args, **kwargs)
        invoke_source_function("run_pipeline_by_id", *args, **kwargs)
      end

      def self.run_two_pass(*args, **kwargs)
        invoke_source_function("run_two_pass", *args, **kwargs)
      end

      def self.run_two_pass_with_stream(*args, **kwargs)
        invoke_source_function("run_two_pass_with_stream", *args, **kwargs)
      end

      def self.to_array(*args, **kwargs)
        invoke_source_function("toArray", *args, **kwargs)
      end

      def self.to_finite_number(*args, **kwargs)
        invoke_source_function("toFiniteNumber", *args, **kwargs)
      end

      def self.to_unique_text_list(*args, **kwargs)
        invoke_source_function("toUniqueTextList", *args, **kwargs)
      end

      def self.write_symbol_value(*args, **kwargs)
        invoke_source_function("write_symbol_value", *args, **kwargs)
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
