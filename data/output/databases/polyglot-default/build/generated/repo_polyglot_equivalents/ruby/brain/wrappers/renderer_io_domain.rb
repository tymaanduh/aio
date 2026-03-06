# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_io_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
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

      def self.apply_imported_entries(*args, **kwargs)
        invoke_source_function("applyImportedEntries", *args, **kwargs)
      end

      def self.export_current_data(*args, **kwargs)
        invoke_source_function("exportCurrentData", *args, **kwargs)
      end

      def self.export_entries_as_csv(*args, **kwargs)
        invoke_source_function("exportEntriesAsCsv", *args, **kwargs)
      end

      def self.import_entries_from_text(*args, **kwargs)
        invoke_source_function("importEntriesFromText", *args, **kwargs)
      end

      def self.parse_bulk_import_entries(*args, **kwargs)
        invoke_source_function("parseBulkImportEntries", *args, **kwargs)
      end

      def self.parse_csv_entries(*args, **kwargs)
        invoke_source_function("parseCsvEntries", *args, **kwargs)
      end

      def self.parse_csv_line(*args, **kwargs)
        invoke_source_function("parseCsvLine", *args, **kwargs)
      end

      def self.parse_imported_entries(*args, **kwargs)
        invoke_source_function("parseImportedEntries", *args, **kwargs)
      end

      def self.parse_smart_paste_entries(*args, **kwargs)
        invoke_source_function("parseSmartPasteEntries", *args, **kwargs)
      end

      def self.to_csv_safe(*args, **kwargs)
        invoke_source_function("toCsvSafe", *args, **kwargs)
      end

      def self.trigger_download(*args, **kwargs)
        invoke_source_function("triggerDownload", *args, **kwargs)
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
