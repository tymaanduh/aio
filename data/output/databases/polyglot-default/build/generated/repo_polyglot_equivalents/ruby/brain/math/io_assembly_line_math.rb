# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/math/io_assembly_line_math.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "buildAliasLookup",
  "create_math_io_database",
  "create_math_io_handler",
  "createStageRuntime",
  "execute_stage",
  "get_database_snapshot",
  "get_slot_value",
  "identify_needed_data",
  "isPlainObject",
  "load_data",
  "loadDefaultCatalogSpec",
  "loadNodeCatalogSpec",
  "loadRuntimeCatalogSpec",
  "normalizeAliasIndex",
  "normalizeGroupIndex",
  "normalizeInstructionSet",
  "normalizeInstructionTemplateIndex",
  "normalizeLabelIndex",
  "normalizeOperationIndex",
  "normalizeRuntimeDefaults",
  "normalizeText",
  "nowIso",
  "readRuntimeSymbol",
  "resolve_operation",
  "resolveInstructionSet",
  "resolveStageSlotToken",
  "resolveSymbolFromAlias",
  "run_assembly_line",
  "runInstructionSet",
  "toArray",
  "toFiniteNumber",
  "toUniqueTextList",
  "unload_data",
  "writeRuntimeSymbol"
]
      SYMBOL_MAP = {
  "buildAliasLookup": "build_alias_lookup",
  "create_math_io_database": "create_math_io_database",
  "create_math_io_handler": "create_math_io_handler",
  "createStageRuntime": "create_stage_runtime",
  "execute_stage": "execute_stage",
  "get_database_snapshot": "get_database_snapshot",
  "get_slot_value": "get_slot_value",
  "identify_needed_data": "identify_needed_data",
  "isPlainObject": "is_plain_object",
  "load_data": "load_data",
  "loadDefaultCatalogSpec": "load_default_catalog_spec",
  "loadNodeCatalogSpec": "load_node_catalog_spec",
  "loadRuntimeCatalogSpec": "load_runtime_catalog_spec",
  "normalizeAliasIndex": "normalize_alias_index",
  "normalizeGroupIndex": "normalize_group_index",
  "normalizeInstructionSet": "normalize_instruction_set",
  "normalizeInstructionTemplateIndex": "normalize_instruction_template_index",
  "normalizeLabelIndex": "normalize_label_index",
  "normalizeOperationIndex": "normalize_operation_index",
  "normalizeRuntimeDefaults": "normalize_runtime_defaults",
  "normalizeText": "normalize_text",
  "nowIso": "now_iso",
  "readRuntimeSymbol": "read_runtime_symbol",
  "resolve_operation": "resolve_operation",
  "resolveInstructionSet": "resolve_instruction_set",
  "resolveStageSlotToken": "resolve_stage_slot_token",
  "resolveSymbolFromAlias": "resolve_symbol_from_alias",
  "run_assembly_line": "run_assembly_line",
  "runInstructionSet": "run_instruction_set",
  "toArray": "to_array",
  "toFiniteNumber": "to_finite_number",
  "toUniqueTextList": "to_unique_text_list",
  "unload_data": "unload_data",
  "writeRuntimeSymbol": "write_runtime_symbol"
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

      def self.build_alias_lookup(*args, **kwargs)
        invoke_source_function("buildAliasLookup", *args, **kwargs)
      end

      def self.create_math_io_database(*args, **kwargs)
        invoke_source_function("create_math_io_database", *args, **kwargs)
      end

      def self.create_math_io_handler(*args, **kwargs)
        invoke_source_function("create_math_io_handler", *args, **kwargs)
      end

      def self.create_stage_runtime(*args, **kwargs)
        invoke_source_function("createStageRuntime", *args, **kwargs)
      end

      def self.execute_stage(*args, **kwargs)
        invoke_source_function("execute_stage", *args, **kwargs)
      end

      def self.get_database_snapshot(*args, **kwargs)
        invoke_source_function("get_database_snapshot", *args, **kwargs)
      end

      def self.get_slot_value(*args, **kwargs)
        invoke_source_function("get_slot_value", *args, **kwargs)
      end

      def self.identify_needed_data(*args, **kwargs)
        invoke_source_function("identify_needed_data", *args, **kwargs)
      end

      def self.is_plain_object(*args, **kwargs)
        invoke_source_function("isPlainObject", *args, **kwargs)
      end

      def self.load_data(*args, **kwargs)
        invoke_source_function("load_data", *args, **kwargs)
      end

      def self.load_default_catalog_spec(*args, **kwargs)
        invoke_source_function("loadDefaultCatalogSpec", *args, **kwargs)
      end

      def self.load_node_catalog_spec(*args, **kwargs)
        invoke_source_function("loadNodeCatalogSpec", *args, **kwargs)
      end

      def self.load_runtime_catalog_spec(*args, **kwargs)
        invoke_source_function("loadRuntimeCatalogSpec", *args, **kwargs)
      end

      def self.normalize_alias_index(*args, **kwargs)
        invoke_source_function("normalizeAliasIndex", *args, **kwargs)
      end

      def self.normalize_group_index(*args, **kwargs)
        invoke_source_function("normalizeGroupIndex", *args, **kwargs)
      end

      def self.normalize_instruction_set(*args, **kwargs)
        invoke_source_function("normalizeInstructionSet", *args, **kwargs)
      end

      def self.normalize_instruction_template_index(*args, **kwargs)
        invoke_source_function("normalizeInstructionTemplateIndex", *args, **kwargs)
      end

      def self.normalize_label_index(*args, **kwargs)
        invoke_source_function("normalizeLabelIndex", *args, **kwargs)
      end

      def self.normalize_operation_index(*args, **kwargs)
        invoke_source_function("normalizeOperationIndex", *args, **kwargs)
      end

      def self.normalize_runtime_defaults(*args, **kwargs)
        invoke_source_function("normalizeRuntimeDefaults", *args, **kwargs)
      end

      def self.normalize_text(*args, **kwargs)
        invoke_source_function("normalizeText", *args, **kwargs)
      end

      def self.now_iso(*args, **kwargs)
        invoke_source_function("nowIso", *args, **kwargs)
      end

      def self.read_runtime_symbol(*args, **kwargs)
        invoke_source_function("readRuntimeSymbol", *args, **kwargs)
      end

      def self.resolve_operation(*args, **kwargs)
        invoke_source_function("resolve_operation", *args, **kwargs)
      end

      def self.resolve_instruction_set(*args, **kwargs)
        invoke_source_function("resolveInstructionSet", *args, **kwargs)
      end

      def self.resolve_stage_slot_token(*args, **kwargs)
        invoke_source_function("resolveStageSlotToken", *args, **kwargs)
      end

      def self.resolve_symbol_from_alias(*args, **kwargs)
        invoke_source_function("resolveSymbolFromAlias", *args, **kwargs)
      end

      def self.run_assembly_line(*args, **kwargs)
        invoke_source_function("run_assembly_line", *args, **kwargs)
      end

      def self.run_instruction_set(*args, **kwargs)
        invoke_source_function("runInstructionSet", *args, **kwargs)
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

      def self.unload_data(*args, **kwargs)
        invoke_source_function("unload_data", *args, **kwargs)
      end

      def self.write_runtime_symbol(*args, **kwargs)
        invoke_source_function("writeRuntimeSymbol", *args, **kwargs)
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
