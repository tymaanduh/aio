# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/generate-file-catalog-docs.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildBucketSummary",
  "buildMarkdown",
  "classifyFile",
  "collectFileRows",
  "escapePipes",
  "generate",
  "main",
  "normalizePath",
  "parseArgs",
  "shouldIgnoreDir",
  "sumBytes",
  "toBytesLabel",
  "toRelative"
]
      SYMBOL_MAP = {
  "buildBucketSummary": "build_bucket_summary",
  "buildMarkdown": "build_markdown",
  "classifyFile": "classify_file",
  "collectFileRows": "collect_file_rows",
  "escapePipes": "escape_pipes",
  "generate": "generate",
  "main": "main",
  "normalizePath": "normalize_path",
  "parseArgs": "parse_args",
  "shouldIgnoreDir": "should_ignore_dir",
  "sumBytes": "sum_bytes",
  "toBytesLabel": "to_bytes_label",
  "toRelative": "to_relative"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_bucket_summary(*args)
        raise NotImplementedError, "Equivalent stub for 'buildBucketSummary' from scripts/generate-file-catalog-docs.js"
      end

      def self.build_markdown(*args)
        raise NotImplementedError, "Equivalent stub for 'buildMarkdown' from scripts/generate-file-catalog-docs.js"
      end

      def self.classify_file(*args)
        raise NotImplementedError, "Equivalent stub for 'classifyFile' from scripts/generate-file-catalog-docs.js"
      end

      def self.collect_file_rows(*args)
        raise NotImplementedError, "Equivalent stub for 'collectFileRows' from scripts/generate-file-catalog-docs.js"
      end

      def self.escape_pipes(*args)
        raise NotImplementedError, "Equivalent stub for 'escapePipes' from scripts/generate-file-catalog-docs.js"
      end

      def self.generate(*args)
        raise NotImplementedError, "Equivalent stub for 'generate' from scripts/generate-file-catalog-docs.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/generate-file-catalog-docs.js"
      end

      def self.normalize_path(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizePath' from scripts/generate-file-catalog-docs.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/generate-file-catalog-docs.js"
      end

      def self.should_ignore_dir(*args)
        raise NotImplementedError, "Equivalent stub for 'shouldIgnoreDir' from scripts/generate-file-catalog-docs.js"
      end

      def self.sum_bytes(*args)
        raise NotImplementedError, "Equivalent stub for 'sumBytes' from scripts/generate-file-catalog-docs.js"
      end

      def self.to_bytes_label(*args)
        raise NotImplementedError, "Equivalent stub for 'toBytesLabel' from scripts/generate-file-catalog-docs.js"
      end

      def self.to_relative(*args)
        raise NotImplementedError, "Equivalent stub for 'toRelative' from scripts/generate-file-catalog-docs.js"
      end
    end
  end
end
