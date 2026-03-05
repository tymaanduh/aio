# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/codex-desktop-sync.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "copyDirectory",
  "ensureDirectory",
  "ensureManagedDestination",
  "listFilesRecursively",
  "listSkillDirectories",
  "main",
  "normalizePath",
  "normalizeRelativePath",
  "parseArgs",
  "readJsonIfExists",
  "readManagementMarker",
  "syncAgentsSnapshot",
  "syncSkills"
]
      SYMBOL_MAP = {
  "copyDirectory": "copy_directory",
  "ensureDirectory": "ensure_directory",
  "ensureManagedDestination": "ensure_managed_destination",
  "listFilesRecursively": "list_files_recursively",
  "listSkillDirectories": "list_skill_directories",
  "main": "main",
  "normalizePath": "normalize_path",
  "normalizeRelativePath": "normalize_relative_path",
  "parseArgs": "parse_args",
  "readJsonIfExists": "read_json_if_exists",
  "readManagementMarker": "read_management_marker",
  "syncAgentsSnapshot": "sync_agents_snapshot",
  "syncSkills": "sync_skills"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.copy_directory(*args)
        raise NotImplementedError, "Equivalent stub for 'copyDirectory' from scripts/codex-desktop-sync.js"
      end

      def self.ensure_directory(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureDirectory' from scripts/codex-desktop-sync.js"
      end

      def self.ensure_managed_destination(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureManagedDestination' from scripts/codex-desktop-sync.js"
      end

      def self.list_files_recursively(*args)
        raise NotImplementedError, "Equivalent stub for 'listFilesRecursively' from scripts/codex-desktop-sync.js"
      end

      def self.list_skill_directories(*args)
        raise NotImplementedError, "Equivalent stub for 'listSkillDirectories' from scripts/codex-desktop-sync.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/codex-desktop-sync.js"
      end

      def self.normalize_path(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizePath' from scripts/codex-desktop-sync.js"
      end

      def self.normalize_relative_path(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeRelativePath' from scripts/codex-desktop-sync.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/codex-desktop-sync.js"
      end

      def self.read_json_if_exists(*args)
        raise NotImplementedError, "Equivalent stub for 'readJsonIfExists' from scripts/codex-desktop-sync.js"
      end

      def self.read_management_marker(*args)
        raise NotImplementedError, "Equivalent stub for 'readManagementMarker' from scripts/codex-desktop-sync.js"
      end

      def self.sync_agents_snapshot(*args)
        raise NotImplementedError, "Equivalent stub for 'syncAgentsSnapshot' from scripts/codex-desktop-sync.js"
      end

      def self.sync_skills(*args)
        raise NotImplementedError, "Equivalent stub for 'syncSkills' from scripts/codex-desktop-sync.js"
      end
    end
  end
end
