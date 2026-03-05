#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");

const WRAPPER_CONTRACTS_PATH = path.join("data", "input", "shared", "wrapper", "function_contracts.json");
const WRAPPER_SPECS_PATH = path.join("data", "input", "shared", "wrapper", "unified_wrapper_specs.json");
const SYMBOL_REGISTRY_PATH = path.join("data", "input", "shared", "wrapper", "wrapper_symbol_registry.json");
const GENERATED_BASE = path.join("data", "output", "databases", "polyglot-default", "build", "generated");

const GENERATED_PATHS = Object.freeze({
  javascript: path.join(GENERATED_BASE, "javascript", "wrapper_symbols.js"),
  typescript: path.join(GENERATED_BASE, "typescript", "wrapper_symbols.ts"),
  python: path.join(GENERATED_BASE, "python", "wrapper_symbols.py"),
  cppHeader: path.join(GENERATED_BASE, "cpp", "wrapper_symbols.hpp"),
  cppSource: path.join(GENERATED_BASE, "cpp", "wrapper_symbols.cpp"),
  ruby: path.join(GENERATED_BASE, "ruby", "wrapper_symbols.rb")
});

function parseArgs(argv) {
  return {
    checkOnly: argv.includes("--check"),
    quiet: argv.includes("--quiet")
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeText(value) {
  return String(value || "").trim();
}

function toConstKey(value) {
  const key = normalizeText(value)
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
  return key || "UNKNOWN";
}

function toSnake(value) {
  const snake = normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return snake || "unknown_function";
}

function toCamel(value) {
  const parts = toSnake(value).split("_").filter(Boolean);
  if (parts.length === 0) {
    return "unknownFunction";
  }
  return parts
    .map((part, index) => {
      if (index === 0) {
        return part;
      }
      return `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
    })
    .join("");
}

function sortedUnique(values) {
  return [...new Set(values.map((value) => normalizeText(value)).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right)
  );
}

function buildConstMap(items, prefix = "") {
  const out = {};
  const seen = new Set();
  items.forEach((item) => {
    const key = `${prefix}${toConstKey(item)}`;
    if (seen.has(key)) {
      throw new Error(`const map key collision: ${key}`);
    }
    seen.add(key);
    out[key] = item;
  });
  return out;
}

function buildFunctionEntry(contract) {
  const functionId = normalizeText(contract.function_id);
  const wrapperActionId = normalizeText(contract.wrapper_action_id);
  const output = contract.output && typeof contract.output === "object" ? contract.output : {};
  const inputs = Array.isArray(contract.inputs) ? contract.inputs : [];
  const camelName = toCamel(functionId);
  const snakeName = toSnake(functionId);

  return {
    function_id: functionId,
    wrapper_action_id: wrapperActionId,
    module_id: normalizeText(contract.module_id),
    inputs: inputs.map((input) => ({
      arg: normalizeText(input.arg),
      symbol: normalizeText(input.symbol),
      type: normalizeText(input.type || "number"),
      required: Boolean(input.required)
    })),
    output: {
      symbol: normalizeText(output.symbol),
      group: normalizeText(output.group || "output"),
      type: normalizeText(output.type || "number")
    },
    language_symbols: {
      javascript: camelName,
      typescript: camelName,
      python: snakeName,
      cpp: `aio::wrapper_symbols::${snakeName}`,
      ruby: `Aio::WrapperSymbols.${snakeName}`
    }
  };
}

function buildWrapperSymbolRegistry(contractDoc, wrapperDoc) {
  const contracts = Array.isArray(contractDoc.contracts) ? contractDoc.contracts : [];
  const operationIndex =
    wrapperDoc && typeof wrapperDoc.operation_index === "object" ? wrapperDoc.operation_index : {};
  const pipelineIndex =
    wrapperDoc && typeof wrapperDoc.pipeline_index === "object" ? wrapperDoc.pipeline_index : {};
  const runtimeDefaults =
    wrapperDoc && typeof wrapperDoc.runtime_defaults === "object" ? wrapperDoc.runtime_defaults : {};

  const functions = contracts.map((contract) => buildFunctionEntry(contract)).sort((left, right) =>
    left.function_id.localeCompare(right.function_id)
  );
  const functionIndex = {};
  functions.forEach((entry) => {
    functionIndex[entry.function_id] = entry;
  });

  const usedOperationIds = new Set(functions.map((entry) => entry.wrapper_action_id));
  const normalizedOperationIndex = {};
  Object.keys(operationIndex)
    .sort((left, right) => left.localeCompare(right))
    .forEach((operationId) => {
      if (!usedOperationIds.has(operationId)) {
        return;
      }
      const operation = operationIndex[operationId] && typeof operationIndex[operationId] === "object" ? operationIndex[operationId] : {};
      normalizedOperationIndex[operationId] = {
        operation_id: normalizeText(operation.operation_id || operationId),
        function_id: normalizeText(operation.function_id),
        input_args: (Array.isArray(operation.input_args) ? operation.input_args : []).map((entry) => ({
          arg: normalizeText(entry.arg),
          symbol: normalizeText(entry.symbol)
        })),
        output_symbol: normalizeText(operation.output_symbol),
        output_group: normalizeText(operation.output_group || "output")
      };
    });

  const normalizedPipelineIndex = {};
  Object.keys(pipelineIndex)
    .sort((left, right) => left.localeCompare(right))
    .forEach((pipelineId) => {
      const ids = Array.isArray(pipelineIndex[pipelineId]) ? pipelineIndex[pipelineId] : [];
      normalizedPipelineIndex[pipelineId] = ids.map((id) => normalizeText(id)).filter((id) => usedOperationIds.has(id));
    });

  const functionIds = functions.map((entry) => entry.function_id);
  const operationIds = functions.map((entry) => entry.wrapper_action_id);
  const pipelineIds = Object.keys(normalizedPipelineIndex);
  const objectNames = sortedUnique(functions.flatMap((entry) => entry.inputs.map((input) => input.arg)));
  const symbolNames = sortedUnique(
    functions.flatMap((entry) => [...entry.inputs.map((input) => input.symbol), entry.output.symbol])
  );

  const constIndex = {
    wrapper: {
      WRAPPER_ID: normalizeText(runtimeDefaults.wrapper_id || "wrapper_two_pass_unified"),
      GROUP_INPUT_ID: normalizeText(runtimeDefaults.input_group_id || "input"),
      GROUP_WORK_ID: normalizeText(runtimeDefaults.work_group_id || "work"),
      GROUP_OUTPUT_ID: normalizeText(runtimeDefaults.output_group_id || "output"),
      GROUP_META_ID: normalizeText(runtimeDefaults.meta_group_id || "meta")
    },
    function_ids: buildConstMap(functionIds),
    operation_ids: buildConstMap(operationIds),
    pipeline_ids: buildConstMap(pipelineIds),
    object_names: buildConstMap(objectNames, "OBJECT_"),
    symbol_names: buildConstMap(symbolNames, "SYMBOL_")
  };

  const constNames = sortedUnique([
    ...Object.keys(constIndex.wrapper),
    ...Object.keys(constIndex.function_ids),
    ...Object.keys(constIndex.operation_ids),
    ...Object.keys(constIndex.pipeline_ids),
    ...Object.keys(constIndex.object_names),
    ...Object.keys(constIndex.symbol_names)
  ]);

  return {
    schema_version: 1,
    catalog_id: "aio_wrapper_symbol_registry",
    source_files: {
      function_contracts: WRAPPER_CONTRACTS_PATH.replace(/\\/g, "/"),
      wrapper_specs: WRAPPER_SPECS_PATH.replace(/\\/g, "/")
    },
    runtime_defaults: {
      wrapper_id: constIndex.wrapper.WRAPPER_ID,
      input_group_id: constIndex.wrapper.GROUP_INPUT_ID,
      work_group_id: constIndex.wrapper.GROUP_WORK_ID,
      output_group_id: constIndex.wrapper.GROUP_OUTPUT_ID,
      meta_group_id: constIndex.wrapper.GROUP_META_ID
    },
    name_index: {
      function_ids: functionIds,
      object_names: objectNames,
      symbol_names: symbolNames,
      const_names: constNames
    },
    function_index: functionIndex,
    operation_index: normalizedOperationIndex,
    pipeline_index: normalizedPipelineIndex,
    const_index: constIndex
  };
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function renderJs(registry) {
  const functions = Object.values(registry.function_index).sort((left, right) =>
    left.function_id.localeCompare(right.function_id)
  );
  const wrapperFunctions = functions
    .map((entry) => {
      const constKey = toConstKey(entry.function_id);
      return `function ${entry.language_symbols.javascript}(boundArgs = {}) {\n  return runWrapperFunction(FUNCTION_IDS.${constKey}, boundArgs);\n}`;
    })
    .join("\n\n");
  const wrapperMapRows = functions
    .map((entry) => `  ${JSON.stringify(entry.function_id)}: ${entry.language_symbols.javascript}`)
    .join(",\n");
  const exportRows = functions.map((entry) => `  ${entry.language_symbols.javascript}`).join(",\n");
  return [
    '"use strict";',
    "",
    `const WRAPPER_SYMBOL_REGISTRY = Object.freeze(${JSON.stringify(registry, null, 2)});`,
    "const FUNCTION_IDS = Object.freeze(WRAPPER_SYMBOL_REGISTRY.const_index.function_ids);",
    "const OPERATION_IDS = Object.freeze(WRAPPER_SYMBOL_REGISTRY.const_index.operation_ids);",
    "const PIPELINE_IDS = Object.freeze(WRAPPER_SYMBOL_REGISTRY.const_index.pipeline_ids);",
    "const OBJECT_NAMES = Object.freeze(WRAPPER_SYMBOL_REGISTRY.const_index.object_names);",
    "const SYMBOL_NAMES = Object.freeze(WRAPPER_SYMBOL_REGISTRY.const_index.symbol_names);",
    "const WRAPPER_CONSTS = Object.freeze(WRAPPER_SYMBOL_REGISTRY.const_index.wrapper);",
    "",
    "function runWrapperFunction(functionId, boundArgs = {}) {",
    "  const contract = WRAPPER_SYMBOL_REGISTRY.function_index[functionId];",
    "  if (!contract) {",
    '    return { ok: false, function_id: functionId, wrapper_action_id: "", output_symbol: "", output_group: "", result: {}, value: null, missing_args: [], error_code: "E_UNKNOWN_FUNCTION" };',
    "  }",
    "  const missingArgs = contract.inputs",
    "    .filter((input) => input.required && (boundArgs[input.arg] === undefined || boundArgs[input.arg] === null))",
    "    .map((input) => input.arg);",
    "  if (missingArgs.length > 0) {",
    '    return { ok: false, function_id: functionId, wrapper_action_id: contract.wrapper_action_id, output_symbol: contract.output.symbol, output_group: contract.output.group, result: {}, value: null, missing_args: missingArgs, error_code: "E_MISSING_ARG" };',
    "  }",
    "  const value = {",
    "    function_id: functionId,",
    "    wrapper_action_id: contract.wrapper_action_id,",
    "    bound_args: { ...boundArgs }",
    "  };",
    "  return {",
    "    ok: true,",
    "    function_id: functionId,",
    "    wrapper_action_id: contract.wrapper_action_id,",
    "    output_symbol: contract.output.symbol,",
    "    output_group: contract.output.group,",
    "    result: { [contract.output.symbol]: value },",
    "    value,",
    "    missing_args: [],",
    '    error_code: ""',
    "  };",
    "}",
    "",
    wrapperFunctions,
    "",
    "const WRAPPER_FUNCTION_MAP = Object.freeze({",
    wrapperMapRows,
    "});",
    "",
    "module.exports = {",
    "  WRAPPER_SYMBOL_REGISTRY,",
    "  FUNCTION_IDS,",
    "  OPERATION_IDS,",
    "  PIPELINE_IDS,",
    "  OBJECT_NAMES,",
    "  SYMBOL_NAMES,",
    "  WRAPPER_CONSTS,",
    "  runWrapperFunction,",
    "  WRAPPER_FUNCTION_MAP,",
    exportRows,
    "};",
    ""
  ].join("\n");
}

function renderTs(registry) {
  const functions = Object.values(registry.function_index).sort((left, right) =>
    left.function_id.localeCompare(right.function_id)
  );
  const wrapperFunctions = functions
    .map((entry) => {
      const constKey = toConstKey(entry.function_id);
      return [
        `export function ${entry.language_symbols.typescript}(boundArgs: Record<string, unknown> = {}): WrapperResult {`,
        `  return runWrapperFunction(FUNCTION_IDS.${constKey}, boundArgs);`,
        "}"
      ].join("\n");
    })
    .join("\n\n");
  const wrapperMapRows = functions
    .map((entry) => `  "${entry.function_id}": ${entry.language_symbols.typescript}`)
    .join(",\n");
  return [
    `export const WRAPPER_SYMBOL_REGISTRY = ${JSON.stringify(registry, null, 2)} as const;`,
    "export const FUNCTION_IDS = WRAPPER_SYMBOL_REGISTRY.const_index.function_ids;",
    "export const OPERATION_IDS = WRAPPER_SYMBOL_REGISTRY.const_index.operation_ids;",
    "export const PIPELINE_IDS = WRAPPER_SYMBOL_REGISTRY.const_index.pipeline_ids;",
    "export const OBJECT_NAMES = WRAPPER_SYMBOL_REGISTRY.const_index.object_names;",
    "export const SYMBOL_NAMES = WRAPPER_SYMBOL_REGISTRY.const_index.symbol_names;",
    "export const WRAPPER_CONSTS = WRAPPER_SYMBOL_REGISTRY.const_index.wrapper;",
    "",
    "export type WrapperResult = {",
    "  ok: boolean;",
    "  function_id: string;",
    "  wrapper_action_id: string;",
    "  output_symbol: string;",
    "  output_group: string;",
    "  result: Record<string, unknown>;",
    "  value: unknown;",
    "  missing_args: string[];",
    "  error_code: string;",
    "};",
    "",
    "export function runWrapperFunction(functionId: string, boundArgs: Record<string, unknown> = {}): WrapperResult {",
    "  const contract = WRAPPER_SYMBOL_REGISTRY.function_index[functionId as keyof typeof WRAPPER_SYMBOL_REGISTRY.function_index];",
    "  if (!contract) {",
    '    return { ok: false, function_id: functionId, wrapper_action_id: "", output_symbol: "", output_group: "", result: {}, value: null, missing_args: [], error_code: "E_UNKNOWN_FUNCTION" };',
    "  }",
    "  const missingArgs = contract.inputs",
    "    .filter((input) => input.required && (boundArgs[input.arg] === undefined || boundArgs[input.arg] === null))",
    "    .map((input) => input.arg);",
    "  if (missingArgs.length > 0) {",
    '    return { ok: false, function_id: functionId, wrapper_action_id: contract.wrapper_action_id, output_symbol: contract.output.symbol, output_group: contract.output.group, result: {}, value: null, missing_args: missingArgs, error_code: "E_MISSING_ARG" };',
    "  }",
    "  const value = {",
    "    function_id: functionId,",
    "    wrapper_action_id: contract.wrapper_action_id,",
    "    bound_args: { ...boundArgs }",
    "  };",
    "  return {",
    "    ok: true,",
    "    function_id: functionId,",
    "    wrapper_action_id: contract.wrapper_action_id,",
    "    output_symbol: contract.output.symbol,",
    "    output_group: contract.output.group,",
    "    result: { [contract.output.symbol]: value },",
    "    value,",
    "    missing_args: [],",
    '    error_code: ""',
    "  };",
    "}",
    "",
    wrapperFunctions,
    "",
    "export const WRAPPER_FUNCTION_MAP: Record<string, (boundArgs?: Record<string, unknown>) => WrapperResult> = {",
    wrapperMapRows,
    "};",
    ""
  ].join("\n");
}

function renderPython(registry) {
  const functions = Object.values(registry.function_index).sort((left, right) =>
    left.function_id.localeCompare(right.function_id)
  );
  const wrapperFunctions = functions
    .map((entry) => {
      const constKey = toConstKey(entry.function_id);
      return [
        `def ${entry.language_symbols.python}(bound_args: dict | None = None) -> dict:`,
        "    args = bound_args if isinstance(bound_args, dict) else {}",
        `    return run_wrapper_function(FUNCTION_IDS["${constKey}"], args)`
      ].join("\n");
    })
    .join("\n\n");
  const wrapperMapRows = functions
    .map((entry) => `    "${entry.function_id}": ${entry.language_symbols.python}`)
    .join(",\n");
  const registryJson = JSON.stringify(registry, null, 2);
  return [
    '"""Generated wrapper symbol catalog for Python."""',
    "",
    "import json",
    "",
    "WRAPPER_SYMBOL_REGISTRY = json.loads(r'''",
    registryJson,
    "''')",
    "FUNCTION_IDS = WRAPPER_SYMBOL_REGISTRY[\"const_index\"][\"function_ids\"]",
    "OPERATION_IDS = WRAPPER_SYMBOL_REGISTRY[\"const_index\"][\"operation_ids\"]",
    "PIPELINE_IDS = WRAPPER_SYMBOL_REGISTRY[\"const_index\"][\"pipeline_ids\"]",
    "OBJECT_NAMES = WRAPPER_SYMBOL_REGISTRY[\"const_index\"][\"object_names\"]",
    "SYMBOL_NAMES = WRAPPER_SYMBOL_REGISTRY[\"const_index\"][\"symbol_names\"]",
    "WRAPPER_CONSTS = WRAPPER_SYMBOL_REGISTRY[\"const_index\"][\"wrapper\"]",
    "",
    "def run_wrapper_function(function_id: str, bound_args: dict | None = None) -> dict:",
    "    args = bound_args if isinstance(bound_args, dict) else {}",
    "    contract = WRAPPER_SYMBOL_REGISTRY[\"function_index\"].get(function_id)",
    "    if contract is None:",
    "        return {",
    "            \"ok\": False,",
    "            \"function_id\": function_id,",
    "            \"wrapper_action_id\": \"\",",
    "            \"output_symbol\": \"\",",
    "            \"output_group\": \"\",",
    "            \"result\": {},",
    "            \"value\": None,",
    "            \"missing_args\": [],",
    "            \"error_code\": \"E_UNKNOWN_FUNCTION\"",
    "        }",
    "    missing_args = [",
    "        input_spec[\"arg\"]",
    "        for input_spec in contract[\"inputs\"]",
    "        if input_spec[\"required\"] and (input_spec[\"arg\"] not in args or args[input_spec[\"arg\"]] is None)",
    "    ]",
    "    if missing_args:",
    "        return {",
    "            \"ok\": False,",
    "            \"function_id\": function_id,",
    "            \"wrapper_action_id\": contract[\"wrapper_action_id\"],",
    "            \"output_symbol\": contract[\"output\"][\"symbol\"],",
    "            \"output_group\": contract[\"output\"][\"group\"],",
    "            \"result\": {},",
    "            \"value\": None,",
    "            \"missing_args\": missing_args,",
    "            \"error_code\": \"E_MISSING_ARG\"",
    "        }",
    "    value = {",
    "        \"function_id\": function_id,",
    "        \"wrapper_action_id\": contract[\"wrapper_action_id\"],",
    "        \"bound_args\": dict(args)",
    "    }",
    "    return {",
    "        \"ok\": True,",
    "        \"function_id\": function_id,",
    "        \"wrapper_action_id\": contract[\"wrapper_action_id\"],",
    "        \"output_symbol\": contract[\"output\"][\"symbol\"],",
    "        \"output_group\": contract[\"output\"][\"group\"],",
    "        \"result\": {contract[\"output\"][\"symbol\"]: value},",
    "        \"value\": value,",
    "        \"missing_args\": [],",
    "        \"error_code\": \"\"",
    "    }",
    "",
    wrapperFunctions,
    "",
    "WRAPPER_FUNCTION_MAP = {",
    wrapperMapRows,
    "}",
    ""
  ].join("\n");
}

function renderCppHeader(registry) {
  const functions = Object.values(registry.function_index).sort((left, right) =>
    left.function_id.localeCompare(right.function_id)
  );
  const functionConstRows = Object.entries(registry.const_index.function_ids)
    .map(([constName, functionId]) => `inline constexpr const char* ${constName} = "${functionId}";`)
    .join("\n");
  const wrapperDeclarations = functions
    .map((entry) => `WrapperResult ${entry.language_symbols.python}(const std::map<std::string, std::string>& bound_args);`)
    .join("\n");
  return [
    "#pragma once",
    "",
    "#include <map>",
    "#include <string>",
    "#include <vector>",
    "",
    "namespace aio::wrapper_symbols::function_ids {",
    functionConstRows,
    "}  // namespace aio::wrapper_symbols::function_ids",
    "",
    "namespace aio::wrapper_symbols {",
    "struct WrapperResult {",
    "  bool ok = false;",
    "  std::string function_id;",
    "  std::string wrapper_action_id;",
    "  std::string output_symbol;",
    "  std::string output_group;",
    "  std::map<std::string, std::string> result;",
    "  std::string value;",
    "  std::vector<std::string> missing_args;",
    "  std::string error_code;",
    "};",
    "",
    "WrapperResult run_wrapper_function(const std::string& function_id, const std::map<std::string, std::string>& bound_args);",
    wrapperDeclarations,
    "}  // namespace aio::wrapper_symbols",
    ""
  ].join("\n");
}

function renderCppSource(registry) {
  const functions = Object.values(registry.function_index).sort((left, right) =>
    left.function_id.localeCompare(right.function_id)
  );
  const requiredRows = functions
    .map((entry) => {
      const args = entry.inputs.map((input) => `"${input.arg}"`).join(", ");
      return `  {"${entry.function_id}", {${args}}}`;
    })
    .join(",\n");
  const actionRows = functions
    .map((entry) => `  {"${entry.function_id}", "${entry.wrapper_action_id}"}`)
    .join(",\n");
  const outputSymbolRows = functions
    .map((entry) => `  {"${entry.function_id}", "${entry.output.symbol}"}`)
    .join(",\n");
  const outputGroupRows = functions
    .map((entry) => `  {"${entry.function_id}", "${entry.output.group}"}`)
    .join(",\n");
  const wrapperFunctions = functions
    .map((entry) => {
      const constKey = toConstKey(entry.function_id);
      return [
        `WrapperResult ${entry.language_symbols.python}(const std::map<std::string, std::string>& bound_args) {`,
        `  return run_wrapper_function(function_ids::${constKey}, bound_args);`,
        "}"
      ].join("\n");
    })
    .join("\n\n");
  return [
    '#include "wrapper_symbols.hpp"',
    "",
    "#include <sstream>",
    "#include <unordered_map>",
    "",
    "namespace aio::wrapper_symbols {",
    "",
    "namespace {",
    "const std::unordered_map<std::string, std::vector<std::string>> kRequiredArgs = {",
    requiredRows,
    "};",
    "const std::unordered_map<std::string, std::string> kWrapperActionByFunction = {",
    actionRows,
    "};",
    "const std::unordered_map<std::string, std::string> kOutputSymbolByFunction = {",
    outputSymbolRows,
    "};",
    "const std::unordered_map<std::string, std::string> kOutputGroupByFunction = {",
    outputGroupRows,
    "};",
    "std::string serializeBoundArgs(const std::map<std::string, std::string>& bound_args) {",
    "  std::ostringstream stream;",
    "  stream << \"{\";",
    "  bool first = true;",
    "  for (const auto& [key, value] : bound_args) {",
    "    if (!first) {",
    "      stream << \",\";",
    "    }",
    "    stream << key << \"=\" << value;",
    "    first = false;",
    "  }",
    "  stream << \"}\";",
    "  return stream.str();",
    "}",
    "}  // namespace",
    "",
    "WrapperResult run_wrapper_function(const std::string& function_id, const std::map<std::string, std::string>& bound_args) {",
    "  WrapperResult response;",
    "  response.function_id = function_id;",
    "  const auto args_it = kRequiredArgs.find(function_id);",
    "  if (args_it == kRequiredArgs.end()) {",
    "    response.error_code = \"E_UNKNOWN_FUNCTION\";",
    "    return response;",
    "  }",
    "  response.wrapper_action_id = kWrapperActionByFunction.at(function_id);",
    "  response.output_symbol = kOutputSymbolByFunction.at(function_id);",
    "  response.output_group = kOutputGroupByFunction.at(function_id);",
    "  for (const std::string& arg_name : args_it->second) {",
    "    if (bound_args.find(arg_name) == bound_args.end()) {",
    "      response.missing_args.push_back(arg_name);",
    "    }",
    "  }",
    "  if (!response.missing_args.empty()) {",
    "    response.error_code = \"E_MISSING_ARG\";",
    "    return response;",
    "  }",
    "  response.value = serializeBoundArgs(bound_args);",
    "  response.result[response.output_symbol] = response.value;",
    "  response.ok = true;",
    "  response.error_code.clear();",
    "  return response;",
    "}",
    "",
    wrapperFunctions,
    "",
    "}  // namespace aio::wrapper_symbols",
    ""
  ].join("\n");
}

function renderRuby(registry) {
  const functions = Object.values(registry.function_index).sort((left, right) =>
    left.function_id.localeCompare(right.function_id)
  );
  const wrapperFunctions = functions
    .map((entry) => {
      const constKey = toConstKey(entry.function_id);
      const methodName = entry.language_symbols.ruby.split(".").slice(-1)[0];
      return [
        `    def self.${methodName}(bound_args = {})`,
        `      run_wrapper_function(FUNCTION_IDS["${constKey}"], bound_args)`,
        "    end"
      ].join("\n");
    })
    .join("\n\n");
  const wrapperMapRows = functions
    .map((entry) => {
      const methodName = entry.language_symbols.ruby.split(".").slice(-1)[0];
      return `      "${entry.function_id}" => ${methodName}`;
    })
    .join(",\n");
  const registryJson = JSON.stringify(registry, null, 2);
  return [
    "# frozen_string_literal: true",
    "",
    "require \"json\"",
    "",
    "module Aio",
    "  module WrapperSymbols",
    "    WRAPPER_SYMBOL_REGISTRY = JSON.parse(<<~'JSON')",
    registryJson,
    "JSON",
    "    FUNCTION_IDS = WRAPPER_SYMBOL_REGISTRY[\"const_index\"][\"function_ids\"]",
    "    OPERATION_IDS = WRAPPER_SYMBOL_REGISTRY[\"const_index\"][\"operation_ids\"]",
    "    PIPELINE_IDS = WRAPPER_SYMBOL_REGISTRY[\"const_index\"][\"pipeline_ids\"]",
    "    OBJECT_NAMES = WRAPPER_SYMBOL_REGISTRY[\"const_index\"][\"object_names\"]",
    "    SYMBOL_NAMES = WRAPPER_SYMBOL_REGISTRY[\"const_index\"][\"symbol_names\"]",
    "    WRAPPER_CONSTS = WRAPPER_SYMBOL_REGISTRY[\"const_index\"][\"wrapper\"]",
    "",
    "    def self.run_wrapper_function(function_id, bound_args = {})",
    "      args = bound_args.is_a?(Hash) ? bound_args : {}",
    "      contract = WRAPPER_SYMBOL_REGISTRY[\"function_index\"][function_id]",
    "      unless contract",
    "        return {",
    "          \"ok\" => false,",
    "          \"function_id\" => function_id,",
    "          \"wrapper_action_id\" => \"\",",
    "          \"output_symbol\" => \"\",",
    "          \"output_group\" => \"\",",
    "          \"result\" => {},",
    "          \"value\" => nil,",
    "          \"missing_args\" => [],",
    "          \"error_code\" => \"E_UNKNOWN_FUNCTION\"",
    "        }",
    "      end",
    "      missing_args = contract[\"inputs\"]",
    "        .select { |input| input[\"required\"] && (!args.key?(input[\"arg\"]) || args[input[\"arg\"]].nil?) }",
    "        .map { |input| input[\"arg\"] }",
    "      unless missing_args.empty?",
    "        return {",
    "          \"ok\" => false,",
    "          \"function_id\" => function_id,",
    "          \"wrapper_action_id\" => contract[\"wrapper_action_id\"],",
    "          \"output_symbol\" => contract[\"output\"][\"symbol\"],",
    "          \"output_group\" => contract[\"output\"][\"group\"],",
    "          \"result\" => {},",
    "          \"value\" => nil,",
    "          \"missing_args\" => missing_args,",
    "          \"error_code\" => \"E_MISSING_ARG\"",
    "        }",
    "      end",
    "      value = {",
    "        \"function_id\" => function_id,",
    "        \"wrapper_action_id\" => contract[\"wrapper_action_id\"],",
    "        \"bound_args\" => args.dup",
    "      }",
    "      {",
    "        \"ok\" => true,",
    "        \"function_id\" => function_id,",
    "        \"wrapper_action_id\" => contract[\"wrapper_action_id\"],",
    "        \"output_symbol\" => contract[\"output\"][\"symbol\"],",
    "        \"output_group\" => contract[\"output\"][\"group\"],",
    "        \"result\" => { contract[\"output\"][\"symbol\"] => value },",
    "        \"value\" => value,",
    "        \"missing_args\" => [],",
    "        \"error_code\" => \"\"",
    "      }",
    "    end",
    "",
    wrapperFunctions,
    "",
    "    WRAPPER_FUNCTION_MAP = {",
    wrapperMapRows,
    "    }.freeze",
    "  end",
    "end",
    ""
  ].join("\n");
}

function buildArtifacts(root, registry) {
  return [
    {
      id: "wrapper_symbol_registry",
      relativePath: SYMBOL_REGISTRY_PATH.replace(/\\/g, "/"),
      absolutePath: path.join(root, SYMBOL_REGISTRY_PATH),
      content: stableJson(registry)
    },
    {
      id: "javascript_wrapper_symbols",
      relativePath: GENERATED_PATHS.javascript.replace(/\\/g, "/"),
      absolutePath: path.join(root, GENERATED_PATHS.javascript),
      content: `${renderJs(registry)}\n`
    },
    {
      id: "typescript_wrapper_symbols",
      relativePath: GENERATED_PATHS.typescript.replace(/\\/g, "/"),
      absolutePath: path.join(root, GENERATED_PATHS.typescript),
      content: `${renderTs(registry)}\n`
    },
    {
      id: "python_wrapper_symbols",
      relativePath: GENERATED_PATHS.python.replace(/\\/g, "/"),
      absolutePath: path.join(root, GENERATED_PATHS.python),
      content: `${renderPython(registry)}\n`
    },
    {
      id: "cpp_wrapper_symbols_hpp",
      relativePath: GENERATED_PATHS.cppHeader.replace(/\\/g, "/"),
      absolutePath: path.join(root, GENERATED_PATHS.cppHeader),
      content: `${renderCppHeader(registry)}\n`
    },
    {
      id: "cpp_wrapper_symbols_cpp",
      relativePath: GENERATED_PATHS.cppSource.replace(/\\/g, "/"),
      absolutePath: path.join(root, GENERATED_PATHS.cppSource),
      content: `${renderCppSource(registry)}\n`
    },
    {
      id: "ruby_wrapper_symbols",
      relativePath: GENERATED_PATHS.ruby.replace(/\\/g, "/"),
      absolutePath: path.join(root, GENERATED_PATHS.ruby),
      content: `${renderRuby(registry)}\n`
    }
  ];
}

function writeArtifacts(artifacts) {
  artifacts.forEach((artifact) => {
    fs.mkdirSync(path.dirname(artifact.absolutePath), { recursive: true });
    fs.writeFileSync(artifact.absolutePath, artifact.content, "utf8");
  });
}

function checkArtifacts(artifacts) {
  const issues = [];
  artifacts.forEach((artifact) => {
    if (!fs.existsSync(artifact.absolutePath)) {
      issues.push({
        type: "missing_artifact",
        file: artifact.relativePath,
        detail: "generated artifact file is missing"
      });
      return;
    }
    const current = fs.readFileSync(artifact.absolutePath, "utf8");
    if (current !== artifact.content) {
      issues.push({
        type: "artifact_out_of_date",
        file: artifact.relativePath,
        detail: "generated artifact differs from expected content"
      });
    }
  });
  return {
    ok: issues.length === 0,
    issues
  };
}

function generateWrapperBindingArtifacts(options = {}) {
  const root = findProjectRoot(options.root || process.cwd());
  const contracts = readJson(path.join(root, WRAPPER_CONTRACTS_PATH));
  const wrapperSpecs = readJson(path.join(root, WRAPPER_SPECS_PATH));
  const registry = buildWrapperSymbolRegistry(contracts, wrapperSpecs);
  const artifacts = buildArtifacts(root, registry);

  if (options.checkOnly) {
    const check = checkArtifacts(artifacts);
    return {
      status: check.ok ? "pass" : "fail",
      root,
      artifact_count: artifacts.length,
      check_only: true,
      issues: check.issues
    };
  }

  writeArtifacts(artifacts);
  return {
    status: "pass",
    root,
    artifact_count: artifacts.length,
    check_only: false,
    issues: []
  };
}

function checkWrapperBindingArtifacts(options = {}) {
  return generateWrapperBindingArtifacts({
    ...options,
    checkOnly: true
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = generateWrapperBindingArtifacts({
    root: process.cwd(),
    checkOnly: args.checkOnly
  });
  if (!args.quiet) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  }
  if (report.status !== "pass") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`generate-wrapper-polyglot-bindings failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  buildWrapperSymbolRegistry,
  generateWrapperBindingArtifacts,
  checkWrapperBindingArtifacts
};
