# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_statistics_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildStatisticsModelSync",
  "getEntryUsageScore",
  "getStatisticsModel",
  "getStatsModelKey",
  "invalidateStatisticsCache",
  "renderStatisticsView",
  "requestStatsWorkerComputeNow",
  "scheduleStatsWorkerCompute"
]
      SYMBOL_MAP = {
  "buildStatisticsModelSync": "build_statistics_model_sync",
  "getEntryUsageScore": "get_entry_usage_score",
  "getStatisticsModel": "get_statistics_model",
  "getStatsModelKey": "get_stats_model_key",
  "invalidateStatisticsCache": "invalidate_statistics_cache",
  "renderStatisticsView": "render_statistics_view",
  "requestStatsWorkerComputeNow": "request_stats_worker_compute_now",
  "scheduleStatsWorkerCompute": "schedule_stats_worker_compute"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_statistics_model_sync(*args)
        raise NotImplementedError, "Equivalent stub for 'buildStatisticsModelSync' from brain/wrappers/renderer_statistics_domain.js"
      end

      def self.get_entry_usage_score(*args)
        raise NotImplementedError, "Equivalent stub for 'getEntryUsageScore' from brain/wrappers/renderer_statistics_domain.js"
      end

      def self.get_statistics_model(*args)
        raise NotImplementedError, "Equivalent stub for 'getStatisticsModel' from brain/wrappers/renderer_statistics_domain.js"
      end

      def self.get_stats_model_key(*args)
        raise NotImplementedError, "Equivalent stub for 'getStatsModelKey' from brain/wrappers/renderer_statistics_domain.js"
      end

      def self.invalidate_statistics_cache(*args)
        raise NotImplementedError, "Equivalent stub for 'invalidateStatisticsCache' from brain/wrappers/renderer_statistics_domain.js"
      end

      def self.render_statistics_view(*args)
        raise NotImplementedError, "Equivalent stub for 'renderStatisticsView' from brain/wrappers/renderer_statistics_domain.js"
      end

      def self.request_stats_worker_compute_now(*args)
        raise NotImplementedError, "Equivalent stub for 'requestStatsWorkerComputeNow' from brain/wrappers/renderer_statistics_domain.js"
      end

      def self.schedule_stats_worker_compute(*args)
        raise NotImplementedError, "Equivalent stub for 'scheduleStatsWorkerCompute' from brain/wrappers/renderer_statistics_domain.js"
      end
    end
  end
end
