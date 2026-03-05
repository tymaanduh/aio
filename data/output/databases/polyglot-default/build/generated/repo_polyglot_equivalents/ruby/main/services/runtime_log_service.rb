# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/services/runtime_log_service.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "append_runtime_log",
  "broadcast_runtime_log",
  "create_log_console_window",
  "create_runtime_log_result",
  "get_runtime_log_buffer",
  "get_runtime_log_status",
  "is_runtime_logs_enabled",
  "now_iso",
  "sanitize_runtime_log_entry",
  "set_runtime_logs_enabled"
]
      SYMBOL_MAP = {
  "append_runtime_log": "append_runtime_log",
  "broadcast_runtime_log": "broadcast_runtime_log",
  "create_log_console_window": "create_log_console_window",
  "create_runtime_log_result": "create_runtime_log_result",
  "get_runtime_log_buffer": "get_runtime_log_buffer",
  "get_runtime_log_status": "get_runtime_log_status",
  "is_runtime_logs_enabled": "is_runtime_logs_enabled",
  "now_iso": "now_iso",
  "sanitize_runtime_log_entry": "sanitize_runtime_log_entry",
  "set_runtime_logs_enabled": "set_runtime_logs_enabled"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.append_runtime_log(*args)
        raise NotImplementedError, "Equivalent stub for 'append_runtime_log' from main/services/runtime_log_service.js"
      end

      def self.broadcast_runtime_log(*args)
        raise NotImplementedError, "Equivalent stub for 'broadcast_runtime_log' from main/services/runtime_log_service.js"
      end

      def self.create_log_console_window(*args)
        raise NotImplementedError, "Equivalent stub for 'create_log_console_window' from main/services/runtime_log_service.js"
      end

      def self.create_runtime_log_result(*args)
        raise NotImplementedError, "Equivalent stub for 'create_runtime_log_result' from main/services/runtime_log_service.js"
      end

      def self.get_runtime_log_buffer(*args)
        raise NotImplementedError, "Equivalent stub for 'get_runtime_log_buffer' from main/services/runtime_log_service.js"
      end

      def self.get_runtime_log_status(*args)
        raise NotImplementedError, "Equivalent stub for 'get_runtime_log_status' from main/services/runtime_log_service.js"
      end

      def self.is_runtime_logs_enabled(*args)
        raise NotImplementedError, "Equivalent stub for 'is_runtime_logs_enabled' from main/services/runtime_log_service.js"
      end

      def self.now_iso(*args)
        raise NotImplementedError, "Equivalent stub for 'now_iso' from main/services/runtime_log_service.js"
      end

      def self.sanitize_runtime_log_entry(*args)
        raise NotImplementedError, "Equivalent stub for 'sanitize_runtime_log_entry' from main/services/runtime_log_service.js"
      end

      def self.set_runtime_logs_enabled(*args)
        raise NotImplementedError, "Equivalent stub for 'set_runtime_logs_enabled' from main/services/runtime_log_service.js"
      end
    end
  end
end
