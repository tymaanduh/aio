# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_dispatch_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "create_domain_dispatch_by_function",
  "create_domain_dispatch_by_module",
  "createRendererDispatch",
  "freeze_list"
]
      SYMBOL_MAP = {
  "create_domain_dispatch_by_function": "create_domain_dispatch_by_function",
  "create_domain_dispatch_by_module": "create_domain_dispatch_by_module",
  "createRendererDispatch": "create_renderer_dispatch",
  "freeze_list": "freeze_list"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_domain_dispatch_by_function(*args)
        raise NotImplementedError, "Equivalent stub for 'create_domain_dispatch_by_function' from brain/wrappers/renderer_dispatch_domain.js"
      end

      def self.create_domain_dispatch_by_module(*args)
        raise NotImplementedError, "Equivalent stub for 'create_domain_dispatch_by_module' from brain/wrappers/renderer_dispatch_domain.js"
      end

      def self.create_renderer_dispatch(*args)
        raise NotImplementedError, "Equivalent stub for 'createRendererDispatch' from brain/wrappers/renderer_dispatch_domain.js"
      end

      def self.freeze_list(*args)
        raise NotImplementedError, "Equivalent stub for 'freeze_list' from brain/wrappers/renderer_dispatch_domain.js"
      end
    end
  end
end
