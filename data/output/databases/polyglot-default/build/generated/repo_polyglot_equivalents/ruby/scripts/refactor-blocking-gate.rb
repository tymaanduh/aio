# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/refactor-blocking-gate.js"
      EQUIVALENT_KIND = "repo_module_proxy"
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

      def self.count_lines(*args, **kwargs)
        invoke_source_function("countLines", *args, **kwargs)
      end

      def self.ensure_files_exist(*args, **kwargs)
        invoke_source_function("ensureFilesExist", *args, **kwargs)
      end

      def self.extract_group_set_module_keys(*args, **kwargs)
        invoke_source_function("extractGroupSetModuleKeys", *args, **kwargs)
      end

      def self.extract_object_keys(*args, **kwargs)
        invoke_source_function("extractObjectKeys", *args, **kwargs)
      end

      def self.fail(*args, **kwargs)
        invoke_source_function("fail", *args, **kwargs)
      end

      def self.log_line(*args, **kwargs)
        invoke_source_function("logLine", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.pass(*args, **kwargs)
        invoke_source_function("pass", *args, **kwargs)
      end

      def self.print_smoke_checklist(*args, **kwargs)
        invoke_source_function("printSmokeChecklist", *args, **kwargs)
      end

      def self.read_text(*args, **kwargs)
        invoke_source_function("readText", *args, **kwargs)
      end

      def self.run_alignment_checks(*args, **kwargs)
        invoke_source_function("runAlignmentChecks", *args, **kwargs)
      end

      def self.run_command(*args, **kwargs)
        invoke_source_function("runCommand", *args, **kwargs)
      end

      def self.run_shape_checks(*args, **kwargs)
        invoke_source_function("runShapeChecks", *args, **kwargs)
      end

      def self.run_size_checks(*args, **kwargs)
        invoke_source_function("runSizeChecks", *args, **kwargs)
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
