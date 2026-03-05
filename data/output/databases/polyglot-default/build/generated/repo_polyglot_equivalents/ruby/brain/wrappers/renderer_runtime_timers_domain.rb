# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_runtime_timers_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "clearAutosaveTimer",
  "clearEntryCommitTimer",
  "clearLookupTimer",
  "clearStatsWorkerTimer",
  "clearTreeSearchTimer",
  "clearUniverseBuildTimer",
  "clearUniverseCacheSaveTimer",
  "scheduleGraphBuild",
  "scheduleIndexWarmup"
]
      SYMBOL_MAP = {
  "clearAutosaveTimer": "clear_autosave_timer",
  "clearEntryCommitTimer": "clear_entry_commit_timer",
  "clearLookupTimer": "clear_lookup_timer",
  "clearStatsWorkerTimer": "clear_stats_worker_timer",
  "clearTreeSearchTimer": "clear_tree_search_timer",
  "clearUniverseBuildTimer": "clear_universe_build_timer",
  "clearUniverseCacheSaveTimer": "clear_universe_cache_save_timer",
  "scheduleGraphBuild": "schedule_graph_build",
  "scheduleIndexWarmup": "schedule_index_warmup"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.clear_autosave_timer(*args)
        raise NotImplementedError, "Equivalent stub for 'clearAutosaveTimer' from brain/wrappers/renderer_runtime_timers_domain.js"
      end

      def self.clear_entry_commit_timer(*args)
        raise NotImplementedError, "Equivalent stub for 'clearEntryCommitTimer' from brain/wrappers/renderer_runtime_timers_domain.js"
      end

      def self.clear_lookup_timer(*args)
        raise NotImplementedError, "Equivalent stub for 'clearLookupTimer' from brain/wrappers/renderer_runtime_timers_domain.js"
      end

      def self.clear_stats_worker_timer(*args)
        raise NotImplementedError, "Equivalent stub for 'clearStatsWorkerTimer' from brain/wrappers/renderer_runtime_timers_domain.js"
      end

      def self.clear_tree_search_timer(*args)
        raise NotImplementedError, "Equivalent stub for 'clearTreeSearchTimer' from brain/wrappers/renderer_runtime_timers_domain.js"
      end

      def self.clear_universe_build_timer(*args)
        raise NotImplementedError, "Equivalent stub for 'clearUniverseBuildTimer' from brain/wrappers/renderer_runtime_timers_domain.js"
      end

      def self.clear_universe_cache_save_timer(*args)
        raise NotImplementedError, "Equivalent stub for 'clearUniverseCacheSaveTimer' from brain/wrappers/renderer_runtime_timers_domain.js"
      end

      def self.schedule_graph_build(*args)
        raise NotImplementedError, "Equivalent stub for 'scheduleGraphBuild' from brain/wrappers/renderer_runtime_timers_domain.js"
      end

      def self.schedule_index_warmup(*args)
        raise NotImplementedError, "Equivalent stub for 'scheduleIndexWarmup' from brain/wrappers/renderer_runtime_timers_domain.js"
      end
    end
  end
end
