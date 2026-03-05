# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/generate-wrapper-polyglot-bindings.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.build_artifacts(*args)
        raise NotImplementedError, "Equivalent stub for 'buildArtifacts' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.build_const_map(*args)
        raise NotImplementedError, "Equivalent stub for 'buildConstMap' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.build_function_entry(*args)
        raise NotImplementedError, "Equivalent stub for 'buildFunctionEntry' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.build_wrapper_symbol_registry(*args)
        raise NotImplementedError, "Equivalent stub for 'buildWrapperSymbolRegistry' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.check_artifacts(*args)
        raise NotImplementedError, "Equivalent stub for 'checkArtifacts' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.check_wrapper_binding_artifacts(*args)
        raise NotImplementedError, "Equivalent stub for 'checkWrapperBindingArtifacts' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.compute_wrapper_value(*args)
        raise NotImplementedError, "Equivalent stub for 'computeWrapperValue' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.generate_wrapper_binding_artifacts(*args)
        raise NotImplementedError, "Equivalent stub for 'generateWrapperBindingArtifacts' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.normalize_behavior(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeBehavior' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.normalize_boolean(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeBoolean' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.normalize_text(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeText' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.parse_numeric_arg(*args)
        raise NotImplementedError, "Equivalent stub for 'parseNumericArg' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.read_json(*args)
        raise NotImplementedError, "Equivalent stub for 'readJson' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.render_cpp_header(*args)
        raise NotImplementedError, "Equivalent stub for 'renderCppHeader' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.render_cpp_source(*args)
        raise NotImplementedError, "Equivalent stub for 'renderCppSource' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.render_js(*args)
        raise NotImplementedError, "Equivalent stub for 'renderJs' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.render_python(*args)
        raise NotImplementedError, "Equivalent stub for 'renderPython' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.render_ruby(*args)
        raise NotImplementedError, "Equivalent stub for 'renderRuby' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.render_ts(*args)
        raise NotImplementedError, "Equivalent stub for 'renderTs' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.run_wrapper_function(*args)
        raise NotImplementedError, "Equivalent stub for 'runWrapperFunction' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.sorted_unique(*args)
        raise NotImplementedError, "Equivalent stub for 'sortedUnique' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.stable_json(*args)
        raise NotImplementedError, "Equivalent stub for 'stableJson' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.to_camel(*args)
        raise NotImplementedError, "Equivalent stub for 'toCamel' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.to_const_key(*args)
        raise NotImplementedError, "Equivalent stub for 'toConstKey' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.to_cpp_string_literal(*args)
        raise NotImplementedError, "Equivalent stub for 'toCppStringLiteral' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.to_snake(*args)
        raise NotImplementedError, "Equivalent stub for 'toSnake' from scripts/generate-wrapper-polyglot-bindings.js"
      end

      def self.write_artifacts(*args)
        raise NotImplementedError, "Equivalent stub for 'writeArtifacts' from scripts/generate-wrapper-polyglot-bindings.js"
      end
    end
  end
end
