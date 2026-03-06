# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/repo-update-log.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "addWatcher",
  "appendNdjson",
  "buildDirectoryList",
  "classifyDiffs",
  "configureRuntime",
  "createEventId",
  "createFileHash",
  "ensureDir",
  "ensureLogPaths",
  "fileSnapshot",
  "isIgnored",
  "nowIso",
  "parseArgs",
  "printHelpAndExit",
  "readState",
  "recordEvent",
  "removeWatcherByPrefix",
  "run",
  "runScanMode",
  "runWatchMode",
  "saveKnownState",
  "scanFileState",
  "scheduleSync",
  "shutdown",
  "syncPath",
  "toRelativePath",
  "unique",
  "writeState"
]
      SYMBOL_MAP = {
  "addWatcher": "add_watcher",
  "appendNdjson": "append_ndjson",
  "buildDirectoryList": "build_directory_list",
  "classifyDiffs": "classify_diffs",
  "configureRuntime": "configure_runtime",
  "createEventId": "create_event_id",
  "createFileHash": "create_file_hash",
  "ensureDir": "ensure_dir",
  "ensureLogPaths": "ensure_log_paths",
  "fileSnapshot": "file_snapshot",
  "isIgnored": "is_ignored",
  "nowIso": "now_iso",
  "parseArgs": "parse_args",
  "printHelpAndExit": "print_help_and_exit",
  "readState": "read_state",
  "recordEvent": "record_event",
  "removeWatcherByPrefix": "remove_watcher_by_prefix",
  "run": "run",
  "runScanMode": "run_scan_mode",
  "runWatchMode": "run_watch_mode",
  "saveKnownState": "save_known_state",
  "scanFileState": "scan_file_state",
  "scheduleSync": "schedule_sync",
  "shutdown": "shutdown",
  "syncPath": "sync_path",
  "toRelativePath": "to_relative_path",
  "unique": "unique",
  "writeState": "write_state"
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

      def self.add_watcher(*args, **kwargs)
        invoke_source_function("addWatcher", *args, **kwargs)
      end

      def self.append_ndjson(*args, **kwargs)
        invoke_source_function("appendNdjson", *args, **kwargs)
      end

      def self.build_directory_list(*args, **kwargs)
        invoke_source_function("buildDirectoryList", *args, **kwargs)
      end

      def self.classify_diffs(*args, **kwargs)
        invoke_source_function("classifyDiffs", *args, **kwargs)
      end

      def self.configure_runtime(*args, **kwargs)
        invoke_source_function("configureRuntime", *args, **kwargs)
      end

      def self.create_event_id(*args, **kwargs)
        invoke_source_function("createEventId", *args, **kwargs)
      end

      def self.create_file_hash(*args, **kwargs)
        invoke_source_function("createFileHash", *args, **kwargs)
      end

      def self.ensure_dir(*args, **kwargs)
        invoke_source_function("ensureDir", *args, **kwargs)
      end

      def self.ensure_log_paths(*args, **kwargs)
        invoke_source_function("ensureLogPaths", *args, **kwargs)
      end

      def self.file_snapshot(*args, **kwargs)
        invoke_source_function("fileSnapshot", *args, **kwargs)
      end

      def self.is_ignored(*args, **kwargs)
        invoke_source_function("isIgnored", *args, **kwargs)
      end

      def self.now_iso(*args, **kwargs)
        invoke_source_function("nowIso", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.print_help_and_exit(*args, **kwargs)
        invoke_source_function("printHelpAndExit", *args, **kwargs)
      end

      def self.read_state(*args, **kwargs)
        invoke_source_function("readState", *args, **kwargs)
      end

      def self.record_event(*args, **kwargs)
        invoke_source_function("recordEvent", *args, **kwargs)
      end

      def self.remove_watcher_by_prefix(*args, **kwargs)
        invoke_source_function("removeWatcherByPrefix", *args, **kwargs)
      end

      def self.run(*args, **kwargs)
        invoke_source_function("run", *args, **kwargs)
      end

      def self.run_scan_mode(*args, **kwargs)
        invoke_source_function("runScanMode", *args, **kwargs)
      end

      def self.run_watch_mode(*args, **kwargs)
        invoke_source_function("runWatchMode", *args, **kwargs)
      end

      def self.save_known_state(*args, **kwargs)
        invoke_source_function("saveKnownState", *args, **kwargs)
      end

      def self.scan_file_state(*args, **kwargs)
        invoke_source_function("scanFileState", *args, **kwargs)
      end

      def self.schedule_sync(*args, **kwargs)
        invoke_source_function("scheduleSync", *args, **kwargs)
      end

      def self.shutdown(*args, **kwargs)
        invoke_source_function("shutdown", *args, **kwargs)
      end

      def self.sync_path(*args, **kwargs)
        invoke_source_function("syncPath", *args, **kwargs)
      end

      def self.to_relative_path(*args, **kwargs)
        invoke_source_function("toRelativePath", *args, **kwargs)
      end

      def self.unique(*args, **kwargs)
        invoke_source_function("unique", *args, **kwargs)
      end

      def self.write_state(*args, **kwargs)
        invoke_source_function("writeState", *args, **kwargs)
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
