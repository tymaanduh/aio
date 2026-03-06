# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_runtime_timers_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
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

      def self.clear_autosave_timer(*args, **kwargs)
        invoke_source_function("clearAutosaveTimer", *args, **kwargs)
      end

      def self.clear_entry_commit_timer(*args, **kwargs)
        invoke_source_function("clearEntryCommitTimer", *args, **kwargs)
      end

      def self.clear_lookup_timer(*args, **kwargs)
        invoke_source_function("clearLookupTimer", *args, **kwargs)
      end

      def self.clear_stats_worker_timer(*args, **kwargs)
        invoke_source_function("clearStatsWorkerTimer", *args, **kwargs)
      end

      def self.clear_tree_search_timer(*args, **kwargs)
        invoke_source_function("clearTreeSearchTimer", *args, **kwargs)
      end

      def self.clear_universe_build_timer(*args, **kwargs)
        invoke_source_function("clearUniverseBuildTimer", *args, **kwargs)
      end

      def self.clear_universe_cache_save_timer(*args, **kwargs)
        invoke_source_function("clearUniverseCacheSaveTimer", *args, **kwargs)
      end

      def self.schedule_graph_build(*args, **kwargs)
        invoke_source_function("scheduleGraphBuild", *args, **kwargs)
      end

      def self.schedule_index_warmup(*args, **kwargs)
        invoke_source_function("scheduleIndexWarmup", *args, **kwargs)
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
