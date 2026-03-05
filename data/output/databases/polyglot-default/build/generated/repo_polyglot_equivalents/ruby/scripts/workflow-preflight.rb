# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/workflow-preflight.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.build_report(*args)
        raise NotImplementedError, "Equivalent stub for 'buildReport' from scripts/workflow-preflight.js"
      end

      def self.check_hard_governance_gate(*args)
        raise NotImplementedError, "Equivalent stub for 'checkHardGovernanceGate' from scripts/workflow-preflight.js"
      end

      def self.check_required_files(*args)
        raise NotImplementedError, "Equivalent stub for 'checkRequiredFiles' from scripts/workflow-preflight.js"
      end

      def self.check_required_json(*args)
        raise NotImplementedError, "Equivalent stub for 'checkRequiredJson' from scripts/workflow-preflight.js"
      end

      def self.check_routing_keyword_conflicts(*args)
        raise NotImplementedError, "Equivalent stub for 'checkRoutingKeywordConflicts' from scripts/workflow-preflight.js"
      end

      def self.check_script_swap_catalog(*args)
        raise NotImplementedError, "Equivalent stub for 'checkScriptSwapCatalog' from scripts/workflow-preflight.js"
      end

      def self.check_shell_shebang_line_endings(*args)
        raise NotImplementedError, "Equivalent stub for 'checkShellShebangLineEndings' from scripts/workflow-preflight.js"
      end

      def self.check_workflow_order_gate(*args)
        raise NotImplementedError, "Equivalent stub for 'checkWorkflowOrderGate' from scripts/workflow-preflight.js"
      end

      def self.check_workflow_shards(*args)
        raise NotImplementedError, "Equivalent stub for 'checkWorkflowShards' from scripts/workflow-preflight.js"
      end

      def self.collect_unmerged_files(*args)
        raise NotImplementedError, "Equivalent stub for 'collectUnmergedFiles' from scripts/workflow-preflight.js"
      end

      def self.ensure_parent_dir(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureParentDir' from scripts/workflow-preflight.js"
      end

      def self.list_text_files(*args)
        raise NotImplementedError, "Equivalent stub for 'listTextFiles' from scripts/workflow-preflight.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/workflow-preflight.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/workflow-preflight.js"
      end

      def self.run_swappable_check(*args)
        raise NotImplementedError, "Equivalent stub for 'runSwappableCheck' from scripts/workflow-preflight.js"
      end

      def self.scan_conflict_markers(*args)
        raise NotImplementedError, "Equivalent stub for 'scanConflictMarkers' from scripts/workflow-preflight.js"
      end
    end
  end
end
