# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_tree_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.build_activity_group(*args)
        raise NotImplementedError, "Equivalent stub for 'buildActivityGroup' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.build_entry_filter_context(*args)
        raise NotImplementedError, "Equivalent stub for 'buildEntryFilterContext' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.build_group_descriptor(*args)
        raise NotImplementedError, "Equivalent stub for 'buildGroupDescriptor' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.build_label_group(*args)
        raise NotImplementedError, "Equivalent stub for 'buildLabelGroup' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.build_tree_model(*args)
        raise NotImplementedError, "Equivalent stub for 'buildTreeModel' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.capture_batch_words_from_quick_input(*args)
        raise NotImplementedError, "Equivalent stub for 'captureBatchWordsFromQuickInput' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.capture_single_word(*args)
        raise NotImplementedError, "Equivalent stub for 'captureSingleWord' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.capture_word_from_quick_input(*args)
        raise NotImplementedError, "Equivalent stub for 'captureWordFromQuickInput' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.collapse_all_groups(*args)
        raise NotImplementedError, "Equivalent stub for 'collapseAllGroups' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.create_category_group(*args)
        raise NotImplementedError, "Equivalent stub for 'createCategoryGroup' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.create_file_row(*args)
        raise NotImplementedError, "Equivalent stub for 'createFileRow' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.create_tree_group(*args)
        raise NotImplementedError, "Equivalent stub for 'createTreeGroup' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.create_virtualized_file_list(*args)
        raise NotImplementedError, "Equivalent stub for 'createVirtualizedFileList' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.entry_passes_advanced_filters(*args)
        raise NotImplementedError, "Equivalent stub for 'entryPassesAdvancedFilters' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.expand_all_groups(*args)
        raise NotImplementedError, "Equivalent stub for 'expandAllGroups' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.get_all_group_keys(*args)
        raise NotImplementedError, "Equivalent stub for 'getAllGroupKeys' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.get_filtered_archived_entries(*args)
        raise NotImplementedError, "Equivalent stub for 'getFilteredArchivedEntries' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.get_top_label_count(*args)
        raise NotImplementedError, "Equivalent stub for 'getTopLabelCount' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.get_top_tree_labels(*args)
        raise NotImplementedError, "Equivalent stub for 'getTopTreeLabels' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.on_all_select(*args)
        raise NotImplementedError, "Equivalent stub for 'onAllSelect' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.on_label_select(*args)
        raise NotImplementedError, "Equivalent stub for 'onLabelSelect' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.parse_quick_batch_words(*args)
        raise NotImplementedError, "Equivalent stub for 'parseQuickBatchWords' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.parse_sentence_input_words(*args)
        raise NotImplementedError, "Equivalent stub for 'parseSentenceInputWords' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.purge_filtered_archived_entries(*args)
        raise NotImplementedError, "Equivalent stub for 'purgeFilteredArchivedEntries' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.render_archive_panel(*args)
        raise NotImplementedError, "Equivalent stub for 'renderArchivePanel' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.render_top_label_bar(*args)
        raise NotImplementedError, "Equivalent stub for 'renderTopLabelBar' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.render_tree(*args)
        raise NotImplementedError, "Equivalent stub for 'renderTree' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.render_tree_summary(*args)
        raise NotImplementedError, "Equivalent stub for 'renderTreeSummary' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.render_virtualized_group_rows(*args)
        raise NotImplementedError, "Equivalent stub for 'renderVirtualizedGroupRows' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.restore_filtered_archived_entries(*args)
        raise NotImplementedError, "Equivalent stub for 'restoreFilteredArchivedEntries' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.select_top_label(*args)
        raise NotImplementedError, "Equivalent stub for 'selectTopLabel' from brain/wrappers/renderer_tree_domain.js"
      end

      def self.select_top_label_by_index(*args)
        raise NotImplementedError, "Equivalent stub for 'selectTopLabelByIndex' from brain/wrappers/renderer_tree_domain.js"
      end
    end
  end
end
