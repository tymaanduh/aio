# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_history_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "applyUndoSnapshot",
  "buildCheckpointDigest",
  "buildHistoryCheckpoint",
  "buildUndoSnapshot",
  "captureUndoSnapshot",
  "digestUndoSnapshot",
  "ensureCheckpoint",
  "restoreCheckpointById",
  "runRedo",
  "runUndo",
  "updateHistoryRestoreOptions"
]
      SYMBOL_MAP = {
  "applyUndoSnapshot": "apply_undo_snapshot",
  "buildCheckpointDigest": "build_checkpoint_digest",
  "buildHistoryCheckpoint": "build_history_checkpoint",
  "buildUndoSnapshot": "build_undo_snapshot",
  "captureUndoSnapshot": "capture_undo_snapshot",
  "digestUndoSnapshot": "digest_undo_snapshot",
  "ensureCheckpoint": "ensure_checkpoint",
  "restoreCheckpointById": "restore_checkpoint_by_id",
  "runRedo": "run_redo",
  "runUndo": "run_undo",
  "updateHistoryRestoreOptions": "update_history_restore_options"
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

      def self.apply_undo_snapshot(*args, **kwargs)
        invoke_source_function("applyUndoSnapshot", *args, **kwargs)
      end

      def self.build_checkpoint_digest(*args, **kwargs)
        invoke_source_function("buildCheckpointDigest", *args, **kwargs)
      end

      def self.build_history_checkpoint(*args, **kwargs)
        invoke_source_function("buildHistoryCheckpoint", *args, **kwargs)
      end

      def self.build_undo_snapshot(*args, **kwargs)
        invoke_source_function("buildUndoSnapshot", *args, **kwargs)
      end

      def self.capture_undo_snapshot(*args, **kwargs)
        invoke_source_function("captureUndoSnapshot", *args, **kwargs)
      end

      def self.digest_undo_snapshot(*args, **kwargs)
        invoke_source_function("digestUndoSnapshot", *args, **kwargs)
      end

      def self.ensure_checkpoint(*args, **kwargs)
        invoke_source_function("ensureCheckpoint", *args, **kwargs)
      end

      def self.restore_checkpoint_by_id(*args, **kwargs)
        invoke_source_function("restoreCheckpointById", *args, **kwargs)
      end

      def self.run_redo(*args, **kwargs)
        invoke_source_function("runRedo", *args, **kwargs)
      end

      def self.run_undo(*args, **kwargs)
        invoke_source_function("runUndo", *args, **kwargs)
      end

      def self.update_history_restore_options(*args, **kwargs)
        invoke_source_function("updateHistoryRestoreOptions", *args, **kwargs)
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
