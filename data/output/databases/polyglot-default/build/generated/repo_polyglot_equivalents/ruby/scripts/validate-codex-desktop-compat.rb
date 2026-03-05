# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/validate-codex-desktop-compat.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildReport",
  "issue",
  "main",
  "parseArgs",
  "parseFrontmatter",
  "parseYamlFile",
  "readText",
  "validateSkill"
]
      SYMBOL_MAP = {
  "buildReport": "build_report",
  "issue": "issue",
  "main": "main",
  "parseArgs": "parse_args",
  "parseFrontmatter": "parse_frontmatter",
  "parseYamlFile": "parse_yaml_file",
  "readText": "read_text",
  "validateSkill": "validate_skill"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_report(*args)
        raise NotImplementedError, "Equivalent stub for 'buildReport' from scripts/validate-codex-desktop-compat.js"
      end

      def self.issue(*args)
        raise NotImplementedError, "Equivalent stub for 'issue' from scripts/validate-codex-desktop-compat.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/validate-codex-desktop-compat.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/validate-codex-desktop-compat.js"
      end

      def self.parse_frontmatter(*args)
        raise NotImplementedError, "Equivalent stub for 'parseFrontmatter' from scripts/validate-codex-desktop-compat.js"
      end

      def self.parse_yaml_file(*args)
        raise NotImplementedError, "Equivalent stub for 'parseYamlFile' from scripts/validate-codex-desktop-compat.js"
      end

      def self.read_text(*args)
        raise NotImplementedError, "Equivalent stub for 'readText' from scripts/validate-codex-desktop-compat.js"
      end

      def self.validate_skill(*args)
        raise NotImplementedError, "Equivalent stub for 'validateSkill' from scripts/validate-codex-desktop-compat.js"
      end
    end
  end
end
