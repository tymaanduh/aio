# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/generate-wrapper-polyglot-bindings.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "buildArtifacts",
  "buildConstMap",
  "buildFunctionEntry",
  "buildWrapperSymbolRegistry",
  "checkArtifacts",
  "checkWrapperBindingArtifacts",
  "computeWrapperValue",
  "generateWrapperBindingArtifacts",
  "main",
  "normalizeBehavior",
  "normalizeBoolean",
  "normalizeText",
  "parseArgs",
  "parseNumericArg",
  "readJson",
  "renderCppHeader",
  "renderCppSource",
  "renderJs",
  "renderPython",
  "renderRuby",
  "renderTs",
  "runWrapperFunction",
  "sortedUnique",
  "stableJson",
  "toCamel",
  "toConstKey",
  "toCppStringLiteral",
  "toSnake",
  "writeArtifacts"
]
      SYMBOL_MAP = {
  "buildArtifacts": "build_artifacts",
  "buildConstMap": "build_const_map",
  "buildFunctionEntry": "build_function_entry",
  "buildWrapperSymbolRegistry": "build_wrapper_symbol_registry",
  "checkArtifacts": "check_artifacts",
  "checkWrapperBindingArtifacts": "check_wrapper_binding_artifacts",
  "computeWrapperValue": "compute_wrapper_value",
  "generateWrapperBindingArtifacts": "generate_wrapper_binding_artifacts",
  "main": "main",
  "normalizeBehavior": "normalize_behavior",
  "normalizeBoolean": "normalize_boolean",
  "normalizeText": "normalize_text",
  "parseArgs": "parse_args",
  "parseNumericArg": "parse_numeric_arg",
  "readJson": "read_json",
  "renderCppHeader": "render_cpp_header",
  "renderCppSource": "render_cpp_source",
  "renderJs": "render_js",
  "renderPython": "render_python",
  "renderRuby": "render_ruby",
  "renderTs": "render_ts",
  "runWrapperFunction": "run_wrapper_function",
  "sortedUnique": "sorted_unique",
  "stableJson": "stable_json",
  "toCamel": "to_camel",
  "toConstKey": "to_const_key",
  "toCppStringLiteral": "to_cpp_string_literal",
  "toSnake": "to_snake",
  "writeArtifacts": "write_artifacts"
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

      def self.build_artifacts(*args, **kwargs)
        invoke_source_function("buildArtifacts", *args, **kwargs)
      end

      def self.build_const_map(*args, **kwargs)
        invoke_source_function("buildConstMap", *args, **kwargs)
      end

      def self.build_function_entry(*args, **kwargs)
        invoke_source_function("buildFunctionEntry", *args, **kwargs)
      end

      def self.build_wrapper_symbol_registry(*args, **kwargs)
        invoke_source_function("buildWrapperSymbolRegistry", *args, **kwargs)
      end

      def self.check_artifacts(*args, **kwargs)
        invoke_source_function("checkArtifacts", *args, **kwargs)
      end

      def self.check_wrapper_binding_artifacts(*args, **kwargs)
        invoke_source_function("checkWrapperBindingArtifacts", *args, **kwargs)
      end

      def self.compute_wrapper_value(*args, **kwargs)
        invoke_source_function("computeWrapperValue", *args, **kwargs)
      end

      def self.generate_wrapper_binding_artifacts(*args, **kwargs)
        invoke_source_function("generateWrapperBindingArtifacts", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.normalize_behavior(*args, **kwargs)
        invoke_source_function("normalizeBehavior", *args, **kwargs)
      end

      def self.normalize_boolean(*args, **kwargs)
        invoke_source_function("normalizeBoolean", *args, **kwargs)
      end

      def self.normalize_text(*args, **kwargs)
        invoke_source_function("normalizeText", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.parse_numeric_arg(*args, **kwargs)
        invoke_source_function("parseNumericArg", *args, **kwargs)
      end

      def self.read_json(*args, **kwargs)
        invoke_source_function("readJson", *args, **kwargs)
      end

      def self.render_cpp_header(*args, **kwargs)
        invoke_source_function("renderCppHeader", *args, **kwargs)
      end

      def self.render_cpp_source(*args, **kwargs)
        invoke_source_function("renderCppSource", *args, **kwargs)
      end

      def self.render_js(*args, **kwargs)
        invoke_source_function("renderJs", *args, **kwargs)
      end

      def self.render_python(*args, **kwargs)
        invoke_source_function("renderPython", *args, **kwargs)
      end

      def self.render_ruby(*args, **kwargs)
        invoke_source_function("renderRuby", *args, **kwargs)
      end

      def self.render_ts(*args, **kwargs)
        invoke_source_function("renderTs", *args, **kwargs)
      end

      def self.run_wrapper_function(*args, **kwargs)
        invoke_source_function("runWrapperFunction", *args, **kwargs)
      end

      def self.sorted_unique(*args, **kwargs)
        invoke_source_function("sortedUnique", *args, **kwargs)
      end

      def self.stable_json(*args, **kwargs)
        invoke_source_function("stableJson", *args, **kwargs)
      end

      def self.to_camel(*args, **kwargs)
        invoke_source_function("toCamel", *args, **kwargs)
      end

      def self.to_const_key(*args, **kwargs)
        invoke_source_function("toConstKey", *args, **kwargs)
      end

      def self.to_cpp_string_literal(*args, **kwargs)
        invoke_source_function("toCppStringLiteral", *args, **kwargs)
      end

      def self.to_snake(*args, **kwargs)
        invoke_source_function("toSnake", *args, **kwargs)
      end

      def self.write_artifacts(*args, **kwargs)
        invoke_source_function("writeArtifacts", *args, **kwargs)
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
