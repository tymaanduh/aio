# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "main/normalize_language_bridge_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "create_default_language_bridge_state",
  "normalize_entry_links",
  "normalize_glossary",
  "normalize_keyword_index",
  "normalize_language_bridge_state",
  "normalize_machine_descriptor_index",
  "normalize_source_entry",
  "normalize_string_list",
  "normalize_triad_map"
]
      SYMBOL_MAP = {
  "create_default_language_bridge_state": "create_default_language_bridge_state",
  "normalize_entry_links": "normalize_entry_links",
  "normalize_glossary": "normalize_glossary",
  "normalize_keyword_index": "normalize_keyword_index",
  "normalize_language_bridge_state": "normalize_language_bridge_state",
  "normalize_machine_descriptor_index": "normalize_machine_descriptor_index",
  "normalize_source_entry": "normalize_source_entry",
  "normalize_string_list": "normalize_string_list",
  "normalize_triad_map": "normalize_triad_map"
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

      def self.create_default_language_bridge_state(*args, **kwargs)
        invoke_source_function("create_default_language_bridge_state", *args, **kwargs)
      end

      def self.normalize_entry_links(*args, **kwargs)
        invoke_source_function("normalize_entry_links", *args, **kwargs)
      end

      def self.normalize_glossary(*args, **kwargs)
        invoke_source_function("normalize_glossary", *args, **kwargs)
      end

      def self.normalize_keyword_index(*args, **kwargs)
        invoke_source_function("normalize_keyword_index", *args, **kwargs)
      end

      def self.normalize_language_bridge_state(*args, **kwargs)
        invoke_source_function("normalize_language_bridge_state", *args, **kwargs)
      end

      def self.normalize_machine_descriptor_index(*args, **kwargs)
        invoke_source_function("normalize_machine_descriptor_index", *args, **kwargs)
      end

      def self.normalize_source_entry(*args, **kwargs)
        invoke_source_function("normalize_source_entry", *args, **kwargs)
      end

      def self.normalize_string_list(*args, **kwargs)
        invoke_source_function("normalize_string_list", *args, **kwargs)
      end

      def self.normalize_triad_map(*args, **kwargs)
        invoke_source_function("normalize_triad_map", *args, **kwargs)
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
