# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/repo-update-log.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.add_watcher(*args)
        raise NotImplementedError, "Equivalent stub for 'addWatcher' from scripts/repo-update-log.js"
      end

      def self.append_ndjson(*args)
        raise NotImplementedError, "Equivalent stub for 'appendNdjson' from scripts/repo-update-log.js"
      end

      def self.build_directory_list(*args)
        raise NotImplementedError, "Equivalent stub for 'buildDirectoryList' from scripts/repo-update-log.js"
      end

      def self.classify_diffs(*args)
        raise NotImplementedError, "Equivalent stub for 'classifyDiffs' from scripts/repo-update-log.js"
      end

      def self.configure_runtime(*args)
        raise NotImplementedError, "Equivalent stub for 'configureRuntime' from scripts/repo-update-log.js"
      end

      def self.create_event_id(*args)
        raise NotImplementedError, "Equivalent stub for 'createEventId' from scripts/repo-update-log.js"
      end

      def self.create_file_hash(*args)
        raise NotImplementedError, "Equivalent stub for 'createFileHash' from scripts/repo-update-log.js"
      end

      def self.ensure_dir(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureDir' from scripts/repo-update-log.js"
      end

      def self.ensure_log_paths(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureLogPaths' from scripts/repo-update-log.js"
      end

      def self.file_snapshot(*args)
        raise NotImplementedError, "Equivalent stub for 'fileSnapshot' from scripts/repo-update-log.js"
      end

      def self.is_ignored(*args)
        raise NotImplementedError, "Equivalent stub for 'isIgnored' from scripts/repo-update-log.js"
      end

      def self.now_iso(*args)
        raise NotImplementedError, "Equivalent stub for 'nowIso' from scripts/repo-update-log.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/repo-update-log.js"
      end

      def self.print_help_and_exit(*args)
        raise NotImplementedError, "Equivalent stub for 'printHelpAndExit' from scripts/repo-update-log.js"
      end

      def self.read_state(*args)
        raise NotImplementedError, "Equivalent stub for 'readState' from scripts/repo-update-log.js"
      end

      def self.record_event(*args)
        raise NotImplementedError, "Equivalent stub for 'recordEvent' from scripts/repo-update-log.js"
      end

      def self.remove_watcher_by_prefix(*args)
        raise NotImplementedError, "Equivalent stub for 'removeWatcherByPrefix' from scripts/repo-update-log.js"
      end

      def self.run(*args)
        raise NotImplementedError, "Equivalent stub for 'run' from scripts/repo-update-log.js"
      end

      def self.run_scan_mode(*args)
        raise NotImplementedError, "Equivalent stub for 'runScanMode' from scripts/repo-update-log.js"
      end

      def self.run_watch_mode(*args)
        raise NotImplementedError, "Equivalent stub for 'runWatchMode' from scripts/repo-update-log.js"
      end

      def self.save_known_state(*args)
        raise NotImplementedError, "Equivalent stub for 'saveKnownState' from scripts/repo-update-log.js"
      end

      def self.scan_file_state(*args)
        raise NotImplementedError, "Equivalent stub for 'scanFileState' from scripts/repo-update-log.js"
      end

      def self.schedule_sync(*args)
        raise NotImplementedError, "Equivalent stub for 'scheduleSync' from scripts/repo-update-log.js"
      end

      def self.shutdown(*args)
        raise NotImplementedError, "Equivalent stub for 'shutdown' from scripts/repo-update-log.js"
      end

      def self.sync_path(*args)
        raise NotImplementedError, "Equivalent stub for 'syncPath' from scripts/repo-update-log.js"
      end

      def self.to_relative_path(*args)
        raise NotImplementedError, "Equivalent stub for 'toRelativePath' from scripts/repo-update-log.js"
      end

      def self.unique(*args)
        raise NotImplementedError, "Equivalent stub for 'unique' from scripts/repo-update-log.js"
      end

      def self.write_state(*args)
        raise NotImplementedError, "Equivalent stub for 'writeState' from scripts/repo-update-log.js"
      end
    end
  end
end
