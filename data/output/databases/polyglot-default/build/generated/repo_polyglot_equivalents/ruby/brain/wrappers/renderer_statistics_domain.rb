# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_statistics_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
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

      def self.build_statistics_model_sync(*args, **kwargs)
        invoke_source_function("buildStatisticsModelSync", *args, **kwargs)
      end

      def self.get_entry_usage_score(*args, **kwargs)
        invoke_source_function("getEntryUsageScore", *args, **kwargs)
      end

      def self.get_statistics_model(*args, **kwargs)
        invoke_source_function("getStatisticsModel", *args, **kwargs)
      end

      def self.get_stats_model_key(*args, **kwargs)
        invoke_source_function("getStatsModelKey", *args, **kwargs)
      end

      def self.invalidate_statistics_cache(*args, **kwargs)
        invoke_source_function("invalidateStatisticsCache", *args, **kwargs)
      end

      def self.render_statistics_view(*args, **kwargs)
        invoke_source_function("renderStatisticsView", *args, **kwargs)
      end

      def self.request_stats_worker_compute_now(*args, **kwargs)
        invoke_source_function("requestStatsWorkerComputeNow", *args, **kwargs)
      end

      def self.schedule_stats_worker_compute(*args, **kwargs)
        invoke_source_function("scheduleStatsWorkerCompute", *args, **kwargs)
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
