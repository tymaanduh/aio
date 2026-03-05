# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/project-source-resolver.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "fileExists",
  "findProjectRoot",
  "isAgentAccessControlFile",
  "isFile",
  "listMatchingFiles",
  "normalizePath",
  "resolveAgentAccessControl",
  "resolveMaybeRelocatedPath",
  "resolveRequestLogFile",
  "resolveUpdateLogPaths",
  "shouldIgnoreDirectory"
]
      SYMBOL_MAP = {
  "fileExists": "file_exists",
  "findProjectRoot": "find_project_root",
  "isAgentAccessControlFile": "is_agent_access_control_file",
  "isFile": "is_file",
  "listMatchingFiles": "list_matching_files",
  "normalizePath": "normalize_path",
  "resolveAgentAccessControl": "resolve_agent_access_control",
  "resolveMaybeRelocatedPath": "resolve_maybe_relocated_path",
  "resolveRequestLogFile": "resolve_request_log_file",
  "resolveUpdateLogPaths": "resolve_update_log_paths",
  "shouldIgnoreDirectory": "should_ignore_directory"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.file_exists(*args)
        raise NotImplementedError, "Equivalent stub for 'fileExists' from scripts/project-source-resolver.js"
      end

      def self.find_project_root(*args)
        raise NotImplementedError, "Equivalent stub for 'findProjectRoot' from scripts/project-source-resolver.js"
      end

      def self.is_agent_access_control_file(*args)
        raise NotImplementedError, "Equivalent stub for 'isAgentAccessControlFile' from scripts/project-source-resolver.js"
      end

      def self.is_file(*args)
        raise NotImplementedError, "Equivalent stub for 'isFile' from scripts/project-source-resolver.js"
      end

      def self.list_matching_files(*args)
        raise NotImplementedError, "Equivalent stub for 'listMatchingFiles' from scripts/project-source-resolver.js"
      end

      def self.normalize_path(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizePath' from scripts/project-source-resolver.js"
      end

      def self.resolve_agent_access_control(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveAgentAccessControl' from scripts/project-source-resolver.js"
      end

      def self.resolve_maybe_relocated_path(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveMaybeRelocatedPath' from scripts/project-source-resolver.js"
      end

      def self.resolve_request_log_file(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveRequestLogFile' from scripts/project-source-resolver.js"
      end

      def self.resolve_update_log_paths(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveUpdateLogPaths' from scripts/project-source-resolver.js"
      end

      def self.should_ignore_directory(*args)
        raise NotImplementedError, "Equivalent stub for 'shouldIgnoreDirectory' from scripts/project-source-resolver.js"
      end
    end
  end
end
