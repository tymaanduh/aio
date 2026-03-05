# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_universe_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "onRemove",
  "queueCacheSave",
  "renderClusterPanel",
  "renderUniverseGraph",
  "requestGraphBuildNow"
]
      SYMBOL_MAP = {
  "onRemove": "on_remove",
  "queueCacheSave": "queue_cache_save",
  "renderClusterPanel": "render_cluster_panel",
  "renderUniverseGraph": "render_universe_graph",
  "requestGraphBuildNow": "request_graph_build_now"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.on_remove(*args)
        raise NotImplementedError, "Equivalent stub for 'onRemove' from brain/wrappers/renderer_universe_domain.js"
      end

      def self.queue_cache_save(*args)
        raise NotImplementedError, "Equivalent stub for 'queueCacheSave' from brain/wrappers/renderer_universe_domain.js"
      end

      def self.render_cluster_panel(*args)
        raise NotImplementedError, "Equivalent stub for 'renderClusterPanel' from brain/wrappers/renderer_universe_domain.js"
      end

      def self.render_universe_graph(*args)
        raise NotImplementedError, "Equivalent stub for 'renderUniverseGraph' from brain/wrappers/renderer_universe_domain.js"
      end

      def self.request_graph_build_now(*args)
        raise NotImplementedError, "Equivalent stub for 'requestGraphBuildNow' from brain/wrappers/renderer_universe_domain.js"
      end
    end
  end
end
