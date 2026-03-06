# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_tree_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "buildActivityGroup",
  "buildEntryFilterContext",
  "buildGroupDescriptor",
  "buildLabelGroup",
  "buildTreeModel",
  "captureBatchWordsFromQuickInput",
  "captureSingleWord",
  "captureWordFromQuickInput",
  "collapseAllGroups",
  "createCategoryGroup",
  "createFileRow",
  "createTreeGroup",
  "createVirtualizedFileList",
  "entryPassesAdvancedFilters",
  "expandAllGroups",
  "getAllGroupKeys",
  "getFilteredArchivedEntries",
  "getTopLabelCount",
  "getTopTreeLabels",
  "onAllSelect",
  "onLabelSelect",
  "parseQuickBatchWords",
  "parseSentenceInputWords",
  "purgeFilteredArchivedEntries",
  "renderArchivePanel",
  "renderTopLabelBar",
  "renderTree",
  "renderTreeSummary",
  "renderVirtualizedGroupRows",
  "restoreFilteredArchivedEntries",
  "selectTopLabel",
  "selectTopLabelByIndex"
]
      SYMBOL_MAP = {
  "buildActivityGroup": "build_activity_group",
  "buildEntryFilterContext": "build_entry_filter_context",
  "buildGroupDescriptor": "build_group_descriptor",
  "buildLabelGroup": "build_label_group",
  "buildTreeModel": "build_tree_model",
  "captureBatchWordsFromQuickInput": "capture_batch_words_from_quick_input",
  "captureSingleWord": "capture_single_word",
  "captureWordFromQuickInput": "capture_word_from_quick_input",
  "collapseAllGroups": "collapse_all_groups",
  "createCategoryGroup": "create_category_group",
  "createFileRow": "create_file_row",
  "createTreeGroup": "create_tree_group",
  "createVirtualizedFileList": "create_virtualized_file_list",
  "entryPassesAdvancedFilters": "entry_passes_advanced_filters",
  "expandAllGroups": "expand_all_groups",
  "getAllGroupKeys": "get_all_group_keys",
  "getFilteredArchivedEntries": "get_filtered_archived_entries",
  "getTopLabelCount": "get_top_label_count",
  "getTopTreeLabels": "get_top_tree_labels",
  "onAllSelect": "on_all_select",
  "onLabelSelect": "on_label_select",
  "parseQuickBatchWords": "parse_quick_batch_words",
  "parseSentenceInputWords": "parse_sentence_input_words",
  "purgeFilteredArchivedEntries": "purge_filtered_archived_entries",
  "renderArchivePanel": "render_archive_panel",
  "renderTopLabelBar": "render_top_label_bar",
  "renderTree": "render_tree",
  "renderTreeSummary": "render_tree_summary",
  "renderVirtualizedGroupRows": "render_virtualized_group_rows",
  "restoreFilteredArchivedEntries": "restore_filtered_archived_entries",
  "selectTopLabel": "select_top_label",
  "selectTopLabelByIndex": "select_top_label_by_index"
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

      def self.build_activity_group(*args, **kwargs)
        invoke_source_function("buildActivityGroup", *args, **kwargs)
      end

      def self.build_entry_filter_context(*args, **kwargs)
        invoke_source_function("buildEntryFilterContext", *args, **kwargs)
      end

      def self.build_group_descriptor(*args, **kwargs)
        invoke_source_function("buildGroupDescriptor", *args, **kwargs)
      end

      def self.build_label_group(*args, **kwargs)
        invoke_source_function("buildLabelGroup", *args, **kwargs)
      end

      def self.build_tree_model(*args, **kwargs)
        invoke_source_function("buildTreeModel", *args, **kwargs)
      end

      def self.capture_batch_words_from_quick_input(*args, **kwargs)
        invoke_source_function("captureBatchWordsFromQuickInput", *args, **kwargs)
      end

      def self.capture_single_word(*args, **kwargs)
        invoke_source_function("captureSingleWord", *args, **kwargs)
      end

      def self.capture_word_from_quick_input(*args, **kwargs)
        invoke_source_function("captureWordFromQuickInput", *args, **kwargs)
      end

      def self.collapse_all_groups(*args, **kwargs)
        invoke_source_function("collapseAllGroups", *args, **kwargs)
      end

      def self.create_category_group(*args, **kwargs)
        invoke_source_function("createCategoryGroup", *args, **kwargs)
      end

      def self.create_file_row(*args, **kwargs)
        invoke_source_function("createFileRow", *args, **kwargs)
      end

      def self.create_tree_group(*args, **kwargs)
        invoke_source_function("createTreeGroup", *args, **kwargs)
      end

      def self.create_virtualized_file_list(*args, **kwargs)
        invoke_source_function("createVirtualizedFileList", *args, **kwargs)
      end

      def self.entry_passes_advanced_filters(*args, **kwargs)
        invoke_source_function("entryPassesAdvancedFilters", *args, **kwargs)
      end

      def self.expand_all_groups(*args, **kwargs)
        invoke_source_function("expandAllGroups", *args, **kwargs)
      end

      def self.get_all_group_keys(*args, **kwargs)
        invoke_source_function("getAllGroupKeys", *args, **kwargs)
      end

      def self.get_filtered_archived_entries(*args, **kwargs)
        invoke_source_function("getFilteredArchivedEntries", *args, **kwargs)
      end

      def self.get_top_label_count(*args, **kwargs)
        invoke_source_function("getTopLabelCount", *args, **kwargs)
      end

      def self.get_top_tree_labels(*args, **kwargs)
        invoke_source_function("getTopTreeLabels", *args, **kwargs)
      end

      def self.on_all_select(*args, **kwargs)
        invoke_source_function("onAllSelect", *args, **kwargs)
      end

      def self.on_label_select(*args, **kwargs)
        invoke_source_function("onLabelSelect", *args, **kwargs)
      end

      def self.parse_quick_batch_words(*args, **kwargs)
        invoke_source_function("parseQuickBatchWords", *args, **kwargs)
      end

      def self.parse_sentence_input_words(*args, **kwargs)
        invoke_source_function("parseSentenceInputWords", *args, **kwargs)
      end

      def self.purge_filtered_archived_entries(*args, **kwargs)
        invoke_source_function("purgeFilteredArchivedEntries", *args, **kwargs)
      end

      def self.render_archive_panel(*args, **kwargs)
        invoke_source_function("renderArchivePanel", *args, **kwargs)
      end

      def self.render_top_label_bar(*args, **kwargs)
        invoke_source_function("renderTopLabelBar", *args, **kwargs)
      end

      def self.render_tree(*args, **kwargs)
        invoke_source_function("renderTree", *args, **kwargs)
      end

      def self.render_tree_summary(*args, **kwargs)
        invoke_source_function("renderTreeSummary", *args, **kwargs)
      end

      def self.render_virtualized_group_rows(*args, **kwargs)
        invoke_source_function("renderVirtualizedGroupRows", *args, **kwargs)
      end

      def self.restore_filtered_archived_entries(*args, **kwargs)
        invoke_source_function("restoreFilteredArchivedEntries", *args, **kwargs)
      end

      def self.select_top_label(*args, **kwargs)
        invoke_source_function("selectTopLabel", *args, **kwargs)
      end

      def self.select_top_label_by_index(*args, **kwargs)
        invoke_source_function("selectTopLabelByIndex", *args, **kwargs)
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
