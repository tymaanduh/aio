# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/workflow-preflight.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "buildReport",
  "checkHardGovernanceGate",
  "checkRequiredFiles",
  "checkRequiredJson",
  "checkRoutingKeywordConflicts",
  "checkScriptSwapCatalog",
  "checkShellShebangLineEndings",
  "checkWorkflowOrderGate",
  "checkWorkflowShards",
  "collectUnmergedFiles",
  "ensureParentDir",
  "listTextFiles",
  "main",
  "parseArgs",
  "runSwappableCheck",
  "scanConflictMarkers"
]
      SYMBOL_MAP = {
  "buildReport": "build_report",
  "checkHardGovernanceGate": "check_hard_governance_gate",
  "checkRequiredFiles": "check_required_files",
  "checkRequiredJson": "check_required_json",
  "checkRoutingKeywordConflicts": "check_routing_keyword_conflicts",
  "checkScriptSwapCatalog": "check_script_swap_catalog",
  "checkShellShebangLineEndings": "check_shell_shebang_line_endings",
  "checkWorkflowOrderGate": "check_workflow_order_gate",
  "checkWorkflowShards": "check_workflow_shards",
  "collectUnmergedFiles": "collect_unmerged_files",
  "ensureParentDir": "ensure_parent_dir",
  "listTextFiles": "list_text_files",
  "main": "main",
  "parseArgs": "parse_args",
  "runSwappableCheck": "run_swappable_check",
  "scanConflictMarkers": "scan_conflict_markers"
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

      def self.build_report(*args, **kwargs)
        invoke_source_function("buildReport", *args, **kwargs)
      end

      def self.check_hard_governance_gate(*args, **kwargs)
        invoke_source_function("checkHardGovernanceGate", *args, **kwargs)
      end

      def self.check_required_files(*args, **kwargs)
        invoke_source_function("checkRequiredFiles", *args, **kwargs)
      end

      def self.check_required_json(*args, **kwargs)
        invoke_source_function("checkRequiredJson", *args, **kwargs)
      end

      def self.check_routing_keyword_conflicts(*args, **kwargs)
        invoke_source_function("checkRoutingKeywordConflicts", *args, **kwargs)
      end

      def self.check_script_swap_catalog(*args, **kwargs)
        invoke_source_function("checkScriptSwapCatalog", *args, **kwargs)
      end

      def self.check_shell_shebang_line_endings(*args, **kwargs)
        invoke_source_function("checkShellShebangLineEndings", *args, **kwargs)
      end

      def self.check_workflow_order_gate(*args, **kwargs)
        invoke_source_function("checkWorkflowOrderGate", *args, **kwargs)
      end

      def self.check_workflow_shards(*args, **kwargs)
        invoke_source_function("checkWorkflowShards", *args, **kwargs)
      end

      def self.collect_unmerged_files(*args, **kwargs)
        invoke_source_function("collectUnmergedFiles", *args, **kwargs)
      end

      def self.ensure_parent_dir(*args, **kwargs)
        invoke_source_function("ensureParentDir", *args, **kwargs)
      end

      def self.list_text_files(*args, **kwargs)
        invoke_source_function("listTextFiles", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.run_swappable_check(*args, **kwargs)
        invoke_source_function("runSwappableCheck", *args, **kwargs)
      end

      def self.scan_conflict_markers(*args, **kwargs)
        invoke_source_function("scanConflictMarkers", *args, **kwargs)
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
