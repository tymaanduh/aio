# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "renderer/workers/stats_worker.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "cleanText",
  "computeModel",
  "normalizeEntryMode",
  "normalizeUsageCount",
  "toTimestamp"
]
      SYMBOL_MAP = {
  "cleanText": "clean_text",
  "computeModel": "compute_model",
  "normalizeEntryMode": "normalize_entry_mode",
  "normalizeUsageCount": "normalize_usage_count",
  "toTimestamp": "to_timestamp"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.clean_text(*args)
        raise NotImplementedError, "Equivalent stub for 'cleanText' from renderer/workers/stats_worker.js"
      end

      def self.compute_model(*args)
        raise NotImplementedError, "Equivalent stub for 'computeModel' from renderer/workers/stats_worker.js"
      end

      def self.normalize_entry_mode(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeEntryMode' from renderer/workers/stats_worker.js"
      end

      def self.normalize_usage_count(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeUsageCount' from renderer/workers/stats_worker.js"
      end

      def self.to_timestamp(*args)
        raise NotImplementedError, "Equivalent stub for 'toTimestamp' from renderer/workers/stats_worker.js"
      end
    end
  end
end
