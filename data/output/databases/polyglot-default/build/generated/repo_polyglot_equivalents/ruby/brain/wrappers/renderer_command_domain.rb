# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_command_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildCommandPaletteActions",
  "closeCmdPalette",
  "createCommandItem",
  "createCommandLabel",
  "createCommandRunner",
  "executeCommandPaletteItem",
  "filterCommandPalette",
  "isCommandPaletteVisible",
  "openCommandPalette",
  "renderCmdList"
]
      SYMBOL_MAP = {
  "buildCommandPaletteActions": "build_command_palette_actions",
  "closeCmdPalette": "close_cmd_palette",
  "createCommandItem": "create_command_item",
  "createCommandLabel": "create_command_label",
  "createCommandRunner": "create_command_runner",
  "executeCommandPaletteItem": "execute_command_palette_item",
  "filterCommandPalette": "filter_command_palette",
  "isCommandPaletteVisible": "is_command_palette_visible",
  "openCommandPalette": "open_command_palette",
  "renderCmdList": "render_cmd_list"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_command_palette_actions(*args)
        raise NotImplementedError, "Equivalent stub for 'buildCommandPaletteActions' from brain/wrappers/renderer_command_domain.js"
      end

      def self.close_cmd_palette(*args)
        raise NotImplementedError, "Equivalent stub for 'closeCmdPalette' from brain/wrappers/renderer_command_domain.js"
      end

      def self.create_command_item(*args)
        raise NotImplementedError, "Equivalent stub for 'createCommandItem' from brain/wrappers/renderer_command_domain.js"
      end

      def self.create_command_label(*args)
        raise NotImplementedError, "Equivalent stub for 'createCommandLabel' from brain/wrappers/renderer_command_domain.js"
      end

      def self.create_command_runner(*args)
        raise NotImplementedError, "Equivalent stub for 'createCommandRunner' from brain/wrappers/renderer_command_domain.js"
      end

      def self.execute_command_palette_item(*args)
        raise NotImplementedError, "Equivalent stub for 'executeCommandPaletteItem' from brain/wrappers/renderer_command_domain.js"
      end

      def self.filter_command_palette(*args)
        raise NotImplementedError, "Equivalent stub for 'filterCommandPalette' from brain/wrappers/renderer_command_domain.js"
      end

      def self.is_command_palette_visible(*args)
        raise NotImplementedError, "Equivalent stub for 'isCommandPaletteVisible' from brain/wrappers/renderer_command_domain.js"
      end

      def self.open_command_palette(*args)
        raise NotImplementedError, "Equivalent stub for 'openCommandPalette' from brain/wrappers/renderer_command_domain.js"
      end

      def self.render_cmd_list(*args)
        raise NotImplementedError, "Equivalent stub for 'renderCmdList' from brain/wrappers/renderer_command_domain.js"
      end
    end
  end
end
