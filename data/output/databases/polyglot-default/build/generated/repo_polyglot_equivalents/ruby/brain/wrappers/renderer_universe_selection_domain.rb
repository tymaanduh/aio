# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_universe_selection_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "appendNodesToUniverseCustomSet",
  "applyCustomSet",
  "applyUniverseOptionsFromInputs",
  "applyUniversePathFinder",
  "buildUniverseEdgeKey",
  "centerUniverseOnNode",
  "clearUniverseNodeSelection",
  "createUniverseCustomSetFromSelection",
  "exportUniverseGraphJson",
  "exportUniversePng",
  "findPathIndices",
  "fitUniverseCamera",
  "focusNodeIndex",
  "getUniverseDragSelectionIndices",
  "getUniverseNodeDefinitionPreview",
  "getUniverseNodeLinkage",
  "getUniverseNodeOriginLabel",
  "getUniverseSelectedIndicesSorted",
  "getUniverseSelectedNodes",
  "getUniverseVisibleNodeIndices",
  "jumpToUniverseFilter",
  "loadUniverseBookmark",
  "parseUniverseDraggedSelectionPayload",
  "removeUniverseCustomSearchSet",
  "resetUniverseCamera",
  "resolveUniverseCustomSetNodeIndices",
  "saveUniverseBookmark",
  "selectAllUniverseVisibleNodes",
  "setNodeSelectionSet",
  "toggleUniverseEdgeMode",
  "toggleUniverseNodeSelection"
]
      SYMBOL_MAP = {
  "appendNodesToUniverseCustomSet": "append_nodes_to_universe_custom_set",
  "applyCustomSet": "apply_custom_set",
  "applyUniverseOptionsFromInputs": "apply_universe_options_from_inputs",
  "applyUniversePathFinder": "apply_universe_path_finder",
  "buildUniverseEdgeKey": "build_universe_edge_key",
  "centerUniverseOnNode": "center_universe_on_node",
  "clearUniverseNodeSelection": "clear_universe_node_selection",
  "createUniverseCustomSetFromSelection": "create_universe_custom_set_from_selection",
  "exportUniverseGraphJson": "export_universe_graph_json",
  "exportUniversePng": "export_universe_png",
  "findPathIndices": "find_path_indices",
  "fitUniverseCamera": "fit_universe_camera",
  "focusNodeIndex": "focus_node_index",
  "getUniverseDragSelectionIndices": "get_universe_drag_selection_indices",
  "getUniverseNodeDefinitionPreview": "get_universe_node_definition_preview",
  "getUniverseNodeLinkage": "get_universe_node_linkage",
  "getUniverseNodeOriginLabel": "get_universe_node_origin_label",
  "getUniverseSelectedIndicesSorted": "get_universe_selected_indices_sorted",
  "getUniverseSelectedNodes": "get_universe_selected_nodes",
  "getUniverseVisibleNodeIndices": "get_universe_visible_node_indices",
  "jumpToUniverseFilter": "jump_to_universe_filter",
  "loadUniverseBookmark": "load_universe_bookmark",
  "parseUniverseDraggedSelectionPayload": "parse_universe_dragged_selection_payload",
  "removeUniverseCustomSearchSet": "remove_universe_custom_search_set",
  "resetUniverseCamera": "reset_universe_camera",
  "resolveUniverseCustomSetNodeIndices": "resolve_universe_custom_set_node_indices",
  "saveUniverseBookmark": "save_universe_bookmark",
  "selectAllUniverseVisibleNodes": "select_all_universe_visible_nodes",
  "setNodeSelectionSet": "set_node_selection_set",
  "toggleUniverseEdgeMode": "toggle_universe_edge_mode",
  "toggleUniverseNodeSelection": "toggle_universe_node_selection"
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

      def self.append_nodes_to_universe_custom_set(*args, **kwargs)
        invoke_source_function("appendNodesToUniverseCustomSet", *args, **kwargs)
      end

      def self.apply_custom_set(*args, **kwargs)
        invoke_source_function("applyCustomSet", *args, **kwargs)
      end

      def self.apply_universe_options_from_inputs(*args, **kwargs)
        invoke_source_function("applyUniverseOptionsFromInputs", *args, **kwargs)
      end

      def self.apply_universe_path_finder(*args, **kwargs)
        invoke_source_function("applyUniversePathFinder", *args, **kwargs)
      end

      def self.build_universe_edge_key(*args, **kwargs)
        invoke_source_function("buildUniverseEdgeKey", *args, **kwargs)
      end

      def self.center_universe_on_node(*args, **kwargs)
        invoke_source_function("centerUniverseOnNode", *args, **kwargs)
      end

      def self.clear_universe_node_selection(*args, **kwargs)
        invoke_source_function("clearUniverseNodeSelection", *args, **kwargs)
      end

      def self.create_universe_custom_set_from_selection(*args, **kwargs)
        invoke_source_function("createUniverseCustomSetFromSelection", *args, **kwargs)
      end

      def self.export_universe_graph_json(*args, **kwargs)
        invoke_source_function("exportUniverseGraphJson", *args, **kwargs)
      end

      def self.export_universe_png(*args, **kwargs)
        invoke_source_function("exportUniversePng", *args, **kwargs)
      end

      def self.find_path_indices(*args, **kwargs)
        invoke_source_function("findPathIndices", *args, **kwargs)
      end

      def self.fit_universe_camera(*args, **kwargs)
        invoke_source_function("fitUniverseCamera", *args, **kwargs)
      end

      def self.focus_node_index(*args, **kwargs)
        invoke_source_function("focusNodeIndex", *args, **kwargs)
      end

      def self.get_universe_drag_selection_indices(*args, **kwargs)
        invoke_source_function("getUniverseDragSelectionIndices", *args, **kwargs)
      end

      def self.get_universe_node_definition_preview(*args, **kwargs)
        invoke_source_function("getUniverseNodeDefinitionPreview", *args, **kwargs)
      end

      def self.get_universe_node_linkage(*args, **kwargs)
        invoke_source_function("getUniverseNodeLinkage", *args, **kwargs)
      end

      def self.get_universe_node_origin_label(*args, **kwargs)
        invoke_source_function("getUniverseNodeOriginLabel", *args, **kwargs)
      end

      def self.get_universe_selected_indices_sorted(*args, **kwargs)
        invoke_source_function("getUniverseSelectedIndicesSorted", *args, **kwargs)
      end

      def self.get_universe_selected_nodes(*args, **kwargs)
        invoke_source_function("getUniverseSelectedNodes", *args, **kwargs)
      end

      def self.get_universe_visible_node_indices(*args, **kwargs)
        invoke_source_function("getUniverseVisibleNodeIndices", *args, **kwargs)
      end

      def self.jump_to_universe_filter(*args, **kwargs)
        invoke_source_function("jumpToUniverseFilter", *args, **kwargs)
      end

      def self.load_universe_bookmark(*args, **kwargs)
        invoke_source_function("loadUniverseBookmark", *args, **kwargs)
      end

      def self.parse_universe_dragged_selection_payload(*args, **kwargs)
        invoke_source_function("parseUniverseDraggedSelectionPayload", *args, **kwargs)
      end

      def self.remove_universe_custom_search_set(*args, **kwargs)
        invoke_source_function("removeUniverseCustomSearchSet", *args, **kwargs)
      end

      def self.reset_universe_camera(*args, **kwargs)
        invoke_source_function("resetUniverseCamera", *args, **kwargs)
      end

      def self.resolve_universe_custom_set_node_indices(*args, **kwargs)
        invoke_source_function("resolveUniverseCustomSetNodeIndices", *args, **kwargs)
      end

      def self.save_universe_bookmark(*args, **kwargs)
        invoke_source_function("saveUniverseBookmark", *args, **kwargs)
      end

      def self.select_all_universe_visible_nodes(*args, **kwargs)
        invoke_source_function("selectAllUniverseVisibleNodes", *args, **kwargs)
      end

      def self.set_node_selection_set(*args, **kwargs)
        invoke_source_function("setNodeSelectionSet", *args, **kwargs)
      end

      def self.toggle_universe_edge_mode(*args, **kwargs)
        invoke_source_function("toggleUniverseEdgeMode", *args, **kwargs)
      end

      def self.toggle_universe_node_selection(*args, **kwargs)
        invoke_source_function("toggleUniverseNodeSelection", *args, **kwargs)
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
