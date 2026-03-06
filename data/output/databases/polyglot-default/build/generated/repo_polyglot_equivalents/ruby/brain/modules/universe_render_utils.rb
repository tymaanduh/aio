# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/modules/universe_render_utils.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "ensureFloat32Capacity",
  "ensureWebglBufferCapacity",
  "getUniverseColorRgb",
  "getUniverseColorRgbBytes",
  "normalizeHexColorKey",
  "pushRgba",
  "pushRgbaFromArray",
  "pushRgbaPair"
]
      SYMBOL_MAP = {
  "ensureFloat32Capacity": "ensure_float32_capacity",
  "ensureWebglBufferCapacity": "ensure_webgl_buffer_capacity",
  "getUniverseColorRgb": "get_universe_color_rgb",
  "getUniverseColorRgbBytes": "get_universe_color_rgb_bytes",
  "normalizeHexColorKey": "normalize_hex_color_key",
  "pushRgba": "push_rgba",
  "pushRgbaFromArray": "push_rgba_from_array",
  "pushRgbaPair": "push_rgba_pair"
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

      def self.ensure_float32_capacity(*args, **kwargs)
        invoke_source_function("ensureFloat32Capacity", *args, **kwargs)
      end

      def self.ensure_webgl_buffer_capacity(*args, **kwargs)
        invoke_source_function("ensureWebglBufferCapacity", *args, **kwargs)
      end

      def self.get_universe_color_rgb(*args, **kwargs)
        invoke_source_function("getUniverseColorRgb", *args, **kwargs)
      end

      def self.get_universe_color_rgb_bytes(*args, **kwargs)
        invoke_source_function("getUniverseColorRgbBytes", *args, **kwargs)
      end

      def self.normalize_hex_color_key(*args, **kwargs)
        invoke_source_function("normalizeHexColorKey", *args, **kwargs)
      end

      def self.push_rgba(*args, **kwargs)
        invoke_source_function("pushRgba", *args, **kwargs)
      end

      def self.push_rgba_from_array(*args, **kwargs)
        invoke_source_function("pushRgbaFromArray", *args, **kwargs)
      end

      def self.push_rgba_pair(*args, **kwargs)
        invoke_source_function("pushRgbaPair", *args, **kwargs)
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
