# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_history_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.apply_undo_snapshot(*args)
        raise NotImplementedError, "Equivalent stub for 'applyUndoSnapshot' from brain/wrappers/renderer_history_domain.js"
      end

      def self.build_checkpoint_digest(*args)
        raise NotImplementedError, "Equivalent stub for 'buildCheckpointDigest' from brain/wrappers/renderer_history_domain.js"
      end

      def self.build_history_checkpoint(*args)
        raise NotImplementedError, "Equivalent stub for 'buildHistoryCheckpoint' from brain/wrappers/renderer_history_domain.js"
      end

      def self.build_undo_snapshot(*args)
        raise NotImplementedError, "Equivalent stub for 'buildUndoSnapshot' from brain/wrappers/renderer_history_domain.js"
      end

      def self.capture_undo_snapshot(*args)
        raise NotImplementedError, "Equivalent stub for 'captureUndoSnapshot' from brain/wrappers/renderer_history_domain.js"
      end

      def self.digest_undo_snapshot(*args)
        raise NotImplementedError, "Equivalent stub for 'digestUndoSnapshot' from brain/wrappers/renderer_history_domain.js"
      end

      def self.ensure_checkpoint(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureCheckpoint' from brain/wrappers/renderer_history_domain.js"
      end

      def self.restore_checkpoint_by_id(*args)
        raise NotImplementedError, "Equivalent stub for 'restoreCheckpointById' from brain/wrappers/renderer_history_domain.js"
      end

      def self.run_redo(*args)
        raise NotImplementedError, "Equivalent stub for 'runRedo' from brain/wrappers/renderer_history_domain.js"
      end

      def self.run_undo(*args)
        raise NotImplementedError, "Equivalent stub for 'runUndo' from brain/wrappers/renderer_history_domain.js"
      end

      def self.update_history_restore_options(*args)
        raise NotImplementedError, "Equivalent stub for 'updateHistoryRestoreOptions' from brain/wrappers/renderer_history_domain.js"
      end
    end
  end
end
