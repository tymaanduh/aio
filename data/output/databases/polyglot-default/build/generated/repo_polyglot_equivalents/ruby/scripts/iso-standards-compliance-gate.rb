# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/iso-standards-compliance-gate.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.analyze(*args)
        raise NotImplementedError, "Equivalent stub for 'analyze' from scripts/iso-standards-compliance-gate.js"
      end

      def self.build_checklist_markdown(*args)
        raise NotImplementedError, "Equivalent stub for 'buildChecklistMarkdown' from scripts/iso-standards-compliance-gate.js"
      end

      def self.build_recommendations(*args)
        raise NotImplementedError, "Equivalent stub for 'buildRecommendations' from scripts/iso-standards-compliance-gate.js"
      end

      def self.evaluate_evidence_links(*args)
        raise NotImplementedError, "Equivalent stub for 'evaluateEvidenceLinks' from scripts/iso-standards-compliance-gate.js"
      end

      def self.evaluate_standard_row(*args)
        raise NotImplementedError, "Equivalent stub for 'evaluateStandardRow' from scripts/iso-standards-compliance-gate.js"
      end

      def self.get_status_field_name(*args)
        raise NotImplementedError, "Equivalent stub for 'getStatusFieldName' from scripts/iso-standards-compliance-gate.js"
      end

      def self.issue(*args)
        raise NotImplementedError, "Equivalent stub for 'issue' from scripts/iso-standards-compliance-gate.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/iso-standards-compliance-gate.js"
      end

      def self.normalize_path(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizePath' from scripts/iso-standards-compliance-gate.js"
      end

      def self.normalize_text(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeText' from scripts/iso-standards-compliance-gate.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/iso-standards-compliance-gate.js"
      end

      def self.read_json(*args)
        raise NotImplementedError, "Equivalent stub for 'readJson' from scripts/iso-standards-compliance-gate.js"
      end

      def self.write_outputs(*args)
        raise NotImplementedError, "Equivalent stub for 'writeOutputs' from scripts/iso-standards-compliance-gate.js"
      end
    end
  end
end
