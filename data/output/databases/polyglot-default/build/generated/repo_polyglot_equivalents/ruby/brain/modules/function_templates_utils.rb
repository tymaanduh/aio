# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/modules/function_templates_utils.js"
      EQUIVALENT_KIND = "repo_module_proxy"
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

      def self.add(*args, **kwargs)
        invoke_source_function("add", *args, **kwargs)
      end

      def self.assert_return_type(*args, **kwargs)
        invoke_source_function("assertReturnType", *args, **kwargs)
      end

      def self.clone_value(*args, **kwargs)
        invoke_source_function("cloneValue", *args, **kwargs)
      end

      def self.create_control_template(*args, **kwargs)
        invoke_source_function("createControlTemplate", *args, **kwargs)
      end

      def self.create_io_template(*args, **kwargs)
        invoke_source_function("createIoTemplate", *args, **kwargs)
      end

      def self.create_template_function(*args, **kwargs)
        invoke_source_function("createTemplateFunction", *args, **kwargs)
      end

      def self.create_template_registry(*args, **kwargs)
        invoke_source_function("createTemplateRegistry", *args, **kwargs)
      end

      def self.fn(*args, **kwargs)
        invoke_source_function("fn", *args, **kwargs)
      end

      def self.get(*args, **kwargs)
        invoke_source_function("get", *args, **kwargs)
      end

      def self.has(*args, **kwargs)
        invoke_source_function("has", *args, **kwargs)
      end

      def self.is_plain_object(*args, **kwargs)
        invoke_source_function("isPlainObject", *args, **kwargs)
      end

      def self.is_type_match(*args, **kwargs)
        invoke_source_function("isTypeMatch", *args, **kwargs)
      end

      def self.list(*args, **kwargs)
        invoke_source_function("list", *args, **kwargs)
      end

      def self.materialize_inputs(*args, **kwargs)
        invoke_source_function("materializeInputs", *args, **kwargs)
      end

      def self.normalize_args(*args, **kwargs)
        invoke_source_function("normalizeArgs", *args, **kwargs)
      end

      def self.normalize_arg_spec(*args, **kwargs)
        invoke_source_function("normalizeArgSpec", *args, **kwargs)
      end

      def self.normalize_return_spec(*args, **kwargs)
        invoke_source_function("normalizeReturnSpec", *args, **kwargs)
      end

      def self.normalize_step(*args, **kwargs)
        invoke_source_function("normalizeStep", *args, **kwargs)
      end

      def self.normalize_text(*args, **kwargs)
        invoke_source_function("normalizeText", *args, **kwargs)
      end

      def self.run(*args, **kwargs)
        invoke_source_function("run", *args, **kwargs)
      end

      def self.template_executor(*args, **kwargs)
        invoke_source_function("templateExecutor", *args, **kwargs)
      end

      def self.type_of_value(*args, **kwargs)
        invoke_source_function("typeOfValue", *args, **kwargs)
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
