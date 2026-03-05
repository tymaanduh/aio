# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_io_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "applyImportedEntries",
  "exportCurrentData",
  "exportEntriesAsCsv",
  "importEntriesFromText",
  "parseBulkImportEntries",
  "parseCsvEntries",
  "parseCsvLine",
  "parseImportedEntries",
  "parseSmartPasteEntries",
  "toCsvSafe",
  "triggerDownload"
]
      SYMBOL_MAP = {
  "applyImportedEntries": "apply_imported_entries",
  "exportCurrentData": "export_current_data",
  "exportEntriesAsCsv": "export_entries_as_csv",
  "importEntriesFromText": "import_entries_from_text",
  "parseBulkImportEntries": "parse_bulk_import_entries",
  "parseCsvEntries": "parse_csv_entries",
  "parseCsvLine": "parse_csv_line",
  "parseImportedEntries": "parse_imported_entries",
  "parseSmartPasteEntries": "parse_smart_paste_entries",
  "toCsvSafe": "to_csv_safe",
  "triggerDownload": "trigger_download"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.apply_imported_entries(*args)
        raise NotImplementedError, "Equivalent stub for 'applyImportedEntries' from brain/wrappers/renderer_io_domain.js"
      end

      def self.export_current_data(*args)
        raise NotImplementedError, "Equivalent stub for 'exportCurrentData' from brain/wrappers/renderer_io_domain.js"
      end

      def self.export_entries_as_csv(*args)
        raise NotImplementedError, "Equivalent stub for 'exportEntriesAsCsv' from brain/wrappers/renderer_io_domain.js"
      end

      def self.import_entries_from_text(*args)
        raise NotImplementedError, "Equivalent stub for 'importEntriesFromText' from brain/wrappers/renderer_io_domain.js"
      end

      def self.parse_bulk_import_entries(*args)
        raise NotImplementedError, "Equivalent stub for 'parseBulkImportEntries' from brain/wrappers/renderer_io_domain.js"
      end

      def self.parse_csv_entries(*args)
        raise NotImplementedError, "Equivalent stub for 'parseCsvEntries' from brain/wrappers/renderer_io_domain.js"
      end

      def self.parse_csv_line(*args)
        raise NotImplementedError, "Equivalent stub for 'parseCsvLine' from brain/wrappers/renderer_io_domain.js"
      end

      def self.parse_imported_entries(*args)
        raise NotImplementedError, "Equivalent stub for 'parseImportedEntries' from brain/wrappers/renderer_io_domain.js"
      end

      def self.parse_smart_paste_entries(*args)
        raise NotImplementedError, "Equivalent stub for 'parseSmartPasteEntries' from brain/wrappers/renderer_io_domain.js"
      end

      def self.to_csv_safe(*args)
        raise NotImplementedError, "Equivalent stub for 'toCsvSafe' from brain/wrappers/renderer_io_domain.js"
      end

      def self.trigger_download(*args)
        raise NotImplementedError, "Equivalent stub for 'triggerDownload' from brain/wrappers/renderer_io_domain.js"
      end
    end
  end
end
