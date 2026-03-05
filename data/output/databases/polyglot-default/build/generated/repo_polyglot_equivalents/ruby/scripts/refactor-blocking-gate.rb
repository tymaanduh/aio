# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/refactor-blocking-gate.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "countLines",
  "ensureFilesExist",
  "extractGroupSetModuleKeys",
  "extractObjectKeys",
  "fail",
  "logLine",
  "main",
  "pass",
  "printSmokeChecklist",
  "readText",
  "runAlignmentChecks",
  "runCommand",
  "runShapeChecks",
  "runSizeChecks"
]
      SYMBOL_MAP = {
  "countLines": "count_lines",
  "ensureFilesExist": "ensure_files_exist",
  "extractGroupSetModuleKeys": "extract_group_set_module_keys",
  "extractObjectKeys": "extract_object_keys",
  "fail": "fail",
  "logLine": "log_line",
  "main": "main",
  "pass": "pass",
  "printSmokeChecklist": "print_smoke_checklist",
  "readText": "read_text",
  "runAlignmentChecks": "run_alignment_checks",
  "runCommand": "run_command",
  "runShapeChecks": "run_shape_checks",
  "runSizeChecks": "run_size_checks"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.count_lines(*args)
        raise NotImplementedError, "Equivalent stub for 'countLines' from scripts/refactor-blocking-gate.js"
      end

      def self.ensure_files_exist(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureFilesExist' from scripts/refactor-blocking-gate.js"
      end

      def self.extract_group_set_module_keys(*args)
        raise NotImplementedError, "Equivalent stub for 'extractGroupSetModuleKeys' from scripts/refactor-blocking-gate.js"
      end

      def self.extract_object_keys(*args)
        raise NotImplementedError, "Equivalent stub for 'extractObjectKeys' from scripts/refactor-blocking-gate.js"
      end

      def self.fail(*args)
        raise NotImplementedError, "Equivalent stub for 'fail' from scripts/refactor-blocking-gate.js"
      end

      def self.log_line(*args)
        raise NotImplementedError, "Equivalent stub for 'logLine' from scripts/refactor-blocking-gate.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/refactor-blocking-gate.js"
      end

      def self.pass(*args)
        raise NotImplementedError, "Equivalent stub for 'pass' from scripts/refactor-blocking-gate.js"
      end

      def self.print_smoke_checklist(*args)
        raise NotImplementedError, "Equivalent stub for 'printSmokeChecklist' from scripts/refactor-blocking-gate.js"
      end

      def self.read_text(*args)
        raise NotImplementedError, "Equivalent stub for 'readText' from scripts/refactor-blocking-gate.js"
      end

      def self.run_alignment_checks(*args)
        raise NotImplementedError, "Equivalent stub for 'runAlignmentChecks' from scripts/refactor-blocking-gate.js"
      end

      def self.run_command(*args)
        raise NotImplementedError, "Equivalent stub for 'runCommand' from scripts/refactor-blocking-gate.js"
      end

      def self.run_shape_checks(*args)
        raise NotImplementedError, "Equivalent stub for 'runShapeChecks' from scripts/refactor-blocking-gate.js"
      end

      def self.run_size_checks(*args)
        raise NotImplementedError, "Equivalent stub for 'runSizeChecks' from scripts/refactor-blocking-gate.js"
      end
    end
  end
end
