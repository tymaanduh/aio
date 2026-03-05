# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/validate-workflow-pipeline-order.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "analyze",
  "issue",
  "main",
  "normalizePath",
  "normalizeText",
  "parseArgs",
  "readJson",
  "validateGeneralWorkflowSource",
  "validateOrder",
  "validateUniqueList",
  "writeReport"
]
      SYMBOL_MAP = {
  "analyze": "analyze",
  "issue": "issue",
  "main": "main",
  "normalizePath": "normalize_path",
  "normalizeText": "normalize_text",
  "parseArgs": "parse_args",
  "readJson": "read_json",
  "validateGeneralWorkflowSource": "validate_general_workflow_source",
  "validateOrder": "validate_order",
  "validateUniqueList": "validate_unique_list",
  "writeReport": "write_report"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.analyze(*args)
        raise NotImplementedError, "Equivalent stub for 'analyze' from scripts/validate-workflow-pipeline-order.js"
      end

      def self.issue(*args)
        raise NotImplementedError, "Equivalent stub for 'issue' from scripts/validate-workflow-pipeline-order.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/validate-workflow-pipeline-order.js"
      end

      def self.normalize_path(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizePath' from scripts/validate-workflow-pipeline-order.js"
      end

      def self.normalize_text(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeText' from scripts/validate-workflow-pipeline-order.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/validate-workflow-pipeline-order.js"
      end

      def self.read_json(*args)
        raise NotImplementedError, "Equivalent stub for 'readJson' from scripts/validate-workflow-pipeline-order.js"
      end

      def self.validate_general_workflow_source(*args)
        raise NotImplementedError, "Equivalent stub for 'validateGeneralWorkflowSource' from scripts/validate-workflow-pipeline-order.js"
      end

      def self.validate_order(*args)
        raise NotImplementedError, "Equivalent stub for 'validateOrder' from scripts/validate-workflow-pipeline-order.js"
      end

      def self.validate_unique_list(*args)
        raise NotImplementedError, "Equivalent stub for 'validateUniqueList' from scripts/validate-workflow-pipeline-order.js"
      end

      def self.write_report(*args)
        raise NotImplementedError, "Equivalent stub for 'writeReport' from scripts/validate-workflow-pipeline-order.js"
      end
    end
  end
end
