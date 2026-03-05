# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/function_templates_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "add",
  "assertReturnType",
  "cloneValue",
  "createControlTemplate",
  "createIoTemplate",
  "createTemplateFunction",
  "createTemplateRegistry",
  "fn",
  "get",
  "has",
  "isPlainObject",
  "isTypeMatch",
  "list",
  "materializeInputs",
  "normalizeArgs",
  "normalizeArgSpec",
  "normalizeReturnSpec",
  "normalizeStep",
  "normalizeText",
  "run",
  "templateExecutor",
  "typeOfValue"
]
      SYMBOL_MAP = {
  "add": "add",
  "assertReturnType": "assert_return_type",
  "cloneValue": "clone_value",
  "createControlTemplate": "create_control_template",
  "createIoTemplate": "create_io_template",
  "createTemplateFunction": "create_template_function",
  "createTemplateRegistry": "create_template_registry",
  "fn": "fn",
  "get": "get",
  "has": "has",
  "isPlainObject": "is_plain_object",
  "isTypeMatch": "is_type_match",
  "list": "list",
  "materializeInputs": "materialize_inputs",
  "normalizeArgs": "normalize_args",
  "normalizeArgSpec": "normalize_arg_spec",
  "normalizeReturnSpec": "normalize_return_spec",
  "normalizeStep": "normalize_step",
  "normalizeText": "normalize_text",
  "run": "run",
  "templateExecutor": "template_executor",
  "typeOfValue": "type_of_value"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.add(*args)
        raise NotImplementedError, "Equivalent stub for 'add' from brain/modules/function_templates_utils.js"
      end

      def self.assert_return_type(*args)
        raise NotImplementedError, "Equivalent stub for 'assertReturnType' from brain/modules/function_templates_utils.js"
      end

      def self.clone_value(*args)
        raise NotImplementedError, "Equivalent stub for 'cloneValue' from brain/modules/function_templates_utils.js"
      end

      def self.create_control_template(*args)
        raise NotImplementedError, "Equivalent stub for 'createControlTemplate' from brain/modules/function_templates_utils.js"
      end

      def self.create_io_template(*args)
        raise NotImplementedError, "Equivalent stub for 'createIoTemplate' from brain/modules/function_templates_utils.js"
      end

      def self.create_template_function(*args)
        raise NotImplementedError, "Equivalent stub for 'createTemplateFunction' from brain/modules/function_templates_utils.js"
      end

      def self.create_template_registry(*args)
        raise NotImplementedError, "Equivalent stub for 'createTemplateRegistry' from brain/modules/function_templates_utils.js"
      end

      def self.fn(*args)
        raise NotImplementedError, "Equivalent stub for 'fn' from brain/modules/function_templates_utils.js"
      end

      def self.get(*args)
        raise NotImplementedError, "Equivalent stub for 'get' from brain/modules/function_templates_utils.js"
      end

      def self.has(*args)
        raise NotImplementedError, "Equivalent stub for 'has' from brain/modules/function_templates_utils.js"
      end

      def self.is_plain_object(*args)
        raise NotImplementedError, "Equivalent stub for 'isPlainObject' from brain/modules/function_templates_utils.js"
      end

      def self.is_type_match(*args)
        raise NotImplementedError, "Equivalent stub for 'isTypeMatch' from brain/modules/function_templates_utils.js"
      end

      def self.list(*args)
        raise NotImplementedError, "Equivalent stub for 'list' from brain/modules/function_templates_utils.js"
      end

      def self.materialize_inputs(*args)
        raise NotImplementedError, "Equivalent stub for 'materializeInputs' from brain/modules/function_templates_utils.js"
      end

      def self.normalize_args(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeArgs' from brain/modules/function_templates_utils.js"
      end

      def self.normalize_arg_spec(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeArgSpec' from brain/modules/function_templates_utils.js"
      end

      def self.normalize_return_spec(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeReturnSpec' from brain/modules/function_templates_utils.js"
      end

      def self.normalize_step(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeStep' from brain/modules/function_templates_utils.js"
      end

      def self.normalize_text(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeText' from brain/modules/function_templates_utils.js"
      end

      def self.run(*args)
        raise NotImplementedError, "Equivalent stub for 'run' from brain/modules/function_templates_utils.js"
      end

      def self.template_executor(*args)
        raise NotImplementedError, "Equivalent stub for 'templateExecutor' from brain/modules/function_templates_utils.js"
      end

      def self.type_of_value(*args)
        raise NotImplementedError, "Equivalent stub for 'typeOfValue' from brain/modules/function_templates_utils.js"
      end
    end
  end
end
