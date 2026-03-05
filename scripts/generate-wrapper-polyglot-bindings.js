#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");

const WRAPPER_CONTRACTS_PATH = path.join("data", "input", "shared", "wrapper", "function_contracts.json");
const WRAPPER_SPECS_PATH = path.join("data", "input", "shared", "wrapper", "unified_wrapper_specs.json");
const FUNCTION_BEHAVIOR_SPECS_PATH = path.join(
  "data",
  "input",
  "shared",
  "wrapper",
  "function_behavior_specs.json"
);
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

function toCppStringLiteral(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
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

function normalizeBoolean(value, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }
  return fallback;
}

function normalizeBehavior(rawBehavior, numericPolicies = {}) {
  const behavior = rawBehavior && typeof rawBehavior === "object" ? rawBehavior : {};
  const kind = normalizeText(behavior.kind);
  return {
    kind,
    operator: normalizeText(behavior.operator),
    arg: normalizeText(behavior.arg),
    left: normalizeText(behavior.left),
    right: normalizeText(behavior.right),
    value_arg: normalizeText(behavior.value_arg),
    min_arg: normalizeText(behavior.min_arg),
    max_arg: normalizeText(behavior.max_arg),
    swap_bounds_when_inverted:
      normalizeBoolean(behavior.swap_bounds_when_inverted, numericPolicies.swap_clamp_bounds_when_inverted !== false),
    true_value: Number.isFinite(Number(behavior.true_value))
      ? Number(behavior.true_value)
      : Number(numericPolicies.equal_true_value || 1),
    false_value: Number.isFinite(Number(behavior.false_value))
      ? Number(behavior.false_value)
      : Number(numericPolicies.equal_false_value || 0)
  };
}

function buildFunctionEntry(contract, behaviorSpec, numericPolicies = {}) {
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
    function_behavior: normalizeBehavior(behaviorSpec, numericPolicies),
    language_symbols: {
      javascript: camelName,
      typescript: camelName,
      python: snakeName,
      cpp: `aio::wrapper_symbols::${snakeName}`,
      ruby: `Aio::WrapperSymbols.${snakeName}`
    }
  };
}

function buildWrapperSymbolRegistry(contractDoc, wrapperDoc, behaviorDoc) {
  const contracts = Array.isArray(contractDoc.contracts) ? contractDoc.contracts : [];
  const operationIndex =
    wrapperDoc && typeof wrapperDoc.operation_index === "object" ? wrapperDoc.operation_index : {};
  const pipelineIndex =
    wrapperDoc && typeof wrapperDoc.pipeline_index === "object" ? wrapperDoc.pipeline_index : {};
  const runtimeDefaults =
    wrapperDoc && typeof wrapperDoc.runtime_defaults === "object" ? wrapperDoc.runtime_defaults : {};
  const behaviorIndexRaw =
    behaviorDoc && behaviorDoc.function_behavior_index && typeof behaviorDoc.function_behavior_index === "object"
      ? behaviorDoc.function_behavior_index
      : {};
  const numericPoliciesRaw =
    behaviorDoc && behaviorDoc.numeric_policies && typeof behaviorDoc.numeric_policies === "object"
      ? behaviorDoc.numeric_policies
      : {};
  const numericPolicies = {
    require_finite_numbers: normalizeBoolean(numericPoliciesRaw.require_finite_numbers, true),
    invalid_number_error_code: normalizeText(numericPoliciesRaw.invalid_number_error_code || "E_INVALID_NUMBER"),
    divide_by_zero_error_code: normalizeText(numericPoliciesRaw.divide_by_zero_error_code || "E_DIVIDE_BY_ZERO"),
    swap_clamp_bounds_when_inverted: normalizeBoolean(
      numericPoliciesRaw.swap_clamp_bounds_when_inverted,
      true
    ),
    equal_true_value: Number.isFinite(Number(numericPoliciesRaw.equal_true_value))
      ? Number(numericPoliciesRaw.equal_true_value)
      : 1,
    equal_false_value: Number.isFinite(Number(numericPoliciesRaw.equal_false_value))
      ? Number(numericPoliciesRaw.equal_false_value)
      : 0
  };

  const functions = contracts
    .map((contract) => {
      const functionId = normalizeText(contract && contract.function_id ? contract.function_id : "");
      const behaviorSpec = behaviorIndexRaw[functionId];
      if (!behaviorSpec || typeof behaviorSpec !== "object") {
        throw new Error(`missing function behavior spec for '${functionId}'`);
      }
      return buildFunctionEntry(contract, behaviorSpec, numericPolicies);
    })
    .sort((left, right) => left.function_id.localeCompare(right.function_id));
  const functionIndex = {};
  const functionBehaviorIndex = {};
  functions.forEach((entry) => {
    functionIndex[entry.function_id] = entry;
    functionBehaviorIndex[entry.function_id] = entry.function_behavior;
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
      wrapper_specs: WRAPPER_SPECS_PATH.replace(/\\/g, "/"),
      function_behavior_specs: FUNCTION_BEHAVIOR_SPECS_PATH.replace(/\\/g, "/")
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
    function_behavior_index: functionBehaviorIndex,
    numeric_policies: numericPolicies,
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
    "const FUNCTION_BEHAVIOR_INDEX = Object.freeze(WRAPPER_SYMBOL_REGISTRY.function_behavior_index || {});",
    "const NUMERIC_POLICIES = Object.freeze(WRAPPER_SYMBOL_REGISTRY.numeric_policies || {});",
    "",
    "function parseNumericArg(boundArgs, argName) {",
    "  const raw = boundArgs[argName];",
    "  const value = Number(raw);",
    "  const requireFinite = NUMERIC_POLICIES.require_finite_numbers !== false;",
    "  if (Number.isNaN(value) || (requireFinite && !Number.isFinite(value))) {",
    "    return { ok: false, error_code: NUMERIC_POLICIES.invalid_number_error_code || \"E_INVALID_NUMBER\" };",
    "  }",
    "  return { ok: true, value };",
    "}",
    "",
    "function computeWrapperValue(functionId, boundArgs = {}) {",
    "  const behavior = FUNCTION_BEHAVIOR_INDEX[functionId];",
    "  if (!behavior || !behavior.kind) {",
    "    return { ok: false, error_code: \"E_UNIMPLEMENTED_BEHAVIOR\", value: null };",
    "  }",
    "  if (behavior.kind === \"pass_through\") {",
    "    const parsed = parseNumericArg(boundArgs, behavior.arg);",
    "    if (!parsed.ok) return { ok: false, error_code: parsed.error_code, value: null };",
    "    return { ok: true, error_code: \"\", value: parsed.value };",
    "  }",
    "  if (behavior.kind === \"unary_math\") {",
    "    const parsed = parseNumericArg(boundArgs, behavior.arg);",
    "    if (!parsed.ok) return { ok: false, error_code: parsed.error_code, value: null };",
    "    if (behavior.operator === \"abs\") {",
    "      return { ok: true, error_code: \"\", value: Math.abs(parsed.value) };",
    "    }",
    "  }",
    "  if (behavior.kind === \"binary_arithmetic\") {",
    "    const left = parseNumericArg(boundArgs, behavior.left);",
    "    const right = parseNumericArg(boundArgs, behavior.right);",
    "    if (!left.ok) return { ok: false, error_code: left.error_code, value: null };",
    "    if (!right.ok) return { ok: false, error_code: right.error_code, value: null };",
    "    if (behavior.operator === \"add\") return { ok: true, error_code: \"\", value: left.value + right.value };",
    "    if (behavior.operator === \"subtract\") return { ok: true, error_code: \"\", value: left.value - right.value };",
    "    if (behavior.operator === \"multiply\") return { ok: true, error_code: \"\", value: left.value * right.value };",
    "    if (behavior.operator === \"divide\") {",
    "      if (right.value === 0) {",
    "        return { ok: false, error_code: NUMERIC_POLICIES.divide_by_zero_error_code || \"E_DIVIDE_BY_ZERO\", value: null };",
    "      }",
    "      return { ok: true, error_code: \"\", value: left.value / right.value };",
    "    }",
    "  }",
    "  if (behavior.kind === \"binary_compare\") {",
    "    const left = parseNumericArg(boundArgs, behavior.left);",
    "    const right = parseNumericArg(boundArgs, behavior.right);",
    "    if (!left.ok) return { ok: false, error_code: left.error_code, value: null };",
    "    if (!right.ok) return { ok: false, error_code: right.error_code, value: null };",
    "    if (behavior.operator === \"equal\") {",
    "      const trueValue = Number.isFinite(Number(behavior.true_value)) ? Number(behavior.true_value) : Number(NUMERIC_POLICIES.equal_true_value || 1);",
    "      const falseValue = Number.isFinite(Number(behavior.false_value)) ? Number(behavior.false_value) : Number(NUMERIC_POLICIES.equal_false_value || 0);",
    "      return { ok: true, error_code: \"\", value: left.value === right.value ? trueValue : falseValue };",
    "    }",
    "    if (behavior.operator === \"min\") return { ok: true, error_code: \"\", value: Math.min(left.value, right.value) };",
    "    if (behavior.operator === \"max\") return { ok: true, error_code: \"\", value: Math.max(left.value, right.value) };",
    "  }",
    "  if (behavior.kind === \"clamp\") {",
    "    const source = parseNumericArg(boundArgs, behavior.value_arg);",
    "    const min = parseNumericArg(boundArgs, behavior.min_arg);",
    "    const max = parseNumericArg(boundArgs, behavior.max_arg);",
    "    if (!source.ok) return { ok: false, error_code: source.error_code, value: null };",
    "    if (!min.ok) return { ok: false, error_code: min.error_code, value: null };",
    "    if (!max.ok) return { ok: false, error_code: max.error_code, value: null };",
    "    let lower = min.value;",
    "    let upper = max.value;",
    "    const swapBounds = behavior.swap_bounds_when_inverted !== false;",
    "    if (swapBounds && lower > upper) {",
    "      const temp = lower;",
    "      lower = upper;",
    "      upper = temp;",
    "    }",
    "    return { ok: true, error_code: \"\", value: Math.min(Math.max(source.value, lower), upper) };",
    "  }",
    "  return { ok: false, error_code: \"E_UNIMPLEMENTED_BEHAVIOR\", value: null };",
    "}",
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
    "  const computed = computeWrapperValue(functionId, boundArgs);",
    "  if (!computed.ok) {",
    "    return {",
    "      ok: false,",
    "      function_id: functionId,",
    "      wrapper_action_id: contract.wrapper_action_id,",
    "      output_symbol: contract.output.symbol,",
    "      output_group: contract.output.group,",
    "      result: {},",
    "      value: null,",
    "      missing_args: [],",
    "      error_code: computed.error_code || \"E_RUNTIME\"",
    "    };",
    "  }",
    "  const value = computed.value;",
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
    "export const FUNCTION_BEHAVIOR_INDEX = WRAPPER_SYMBOL_REGISTRY.function_behavior_index;",
    "export const NUMERIC_POLICIES = WRAPPER_SYMBOL_REGISTRY.numeric_policies;",
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
    "function parseNumericArg(boundArgs: Record<string, unknown>, argName: string): { ok: boolean; value: number; error_code: string } {",
    "  const raw = boundArgs[argName];",
    "  const value = Number(raw);",
    "  const requireFinite = NUMERIC_POLICIES.require_finite_numbers !== false;",
    "  if (Number.isNaN(value) || (requireFinite && !Number.isFinite(value))) {",
    "    return { ok: false, value: 0, error_code: NUMERIC_POLICIES.invalid_number_error_code || \"E_INVALID_NUMBER\" };",
    "  }",
    "  return { ok: true, value, error_code: \"\" };",
    "}",
    "",
    "function computeWrapperValue(functionId: string, boundArgs: Record<string, unknown>): { ok: boolean; value: number | null; error_code: string } {",
    "  const behavior = FUNCTION_BEHAVIOR_INDEX[functionId as keyof typeof FUNCTION_BEHAVIOR_INDEX] as any;",
    "  if (!behavior || !behavior.kind) {",
    "    return { ok: false, value: null, error_code: \"E_UNIMPLEMENTED_BEHAVIOR\" };",
    "  }",
    "  if (behavior.kind === \"pass_through\") {",
    "    const parsed = parseNumericArg(boundArgs, behavior.arg);",
    "    return parsed.ok ? { ok: true, value: parsed.value, error_code: \"\" } : { ok: false, value: null, error_code: parsed.error_code };",
    "  }",
    "  if (behavior.kind === \"unary_math\") {",
    "    const parsed = parseNumericArg(boundArgs, behavior.arg);",
    "    if (!parsed.ok) return { ok: false, value: null, error_code: parsed.error_code };",
    "    if (behavior.operator === \"abs\") return { ok: true, value: Math.abs(parsed.value), error_code: \"\" };",
    "  }",
    "  if (behavior.kind === \"binary_arithmetic\") {",
    "    const left = parseNumericArg(boundArgs, behavior.left);",
    "    const right = parseNumericArg(boundArgs, behavior.right);",
    "    if (!left.ok) return { ok: false, value: null, error_code: left.error_code };",
    "    if (!right.ok) return { ok: false, value: null, error_code: right.error_code };",
    "    if (behavior.operator === \"add\") return { ok: true, value: left.value + right.value, error_code: \"\" };",
    "    if (behavior.operator === \"subtract\") return { ok: true, value: left.value - right.value, error_code: \"\" };",
    "    if (behavior.operator === \"multiply\") return { ok: true, value: left.value * right.value, error_code: \"\" };",
    "    if (behavior.operator === \"divide\") {",
    "      if (right.value === 0) return { ok: false, value: null, error_code: NUMERIC_POLICIES.divide_by_zero_error_code || \"E_DIVIDE_BY_ZERO\" };",
    "      return { ok: true, value: left.value / right.value, error_code: \"\" };",
    "    }",
    "  }",
    "  if (behavior.kind === \"binary_compare\") {",
    "    const left = parseNumericArg(boundArgs, behavior.left);",
    "    const right = parseNumericArg(boundArgs, behavior.right);",
    "    if (!left.ok) return { ok: false, value: null, error_code: left.error_code };",
    "    if (!right.ok) return { ok: false, value: null, error_code: right.error_code };",
    "    if (behavior.operator === \"equal\") {",
    "      const trueValue = Number.isFinite(Number(behavior.true_value)) ? Number(behavior.true_value) : Number(NUMERIC_POLICIES.equal_true_value || 1);",
    "      const falseValue = Number.isFinite(Number(behavior.false_value)) ? Number(behavior.false_value) : Number(NUMERIC_POLICIES.equal_false_value || 0);",
    "      return { ok: true, value: left.value === right.value ? trueValue : falseValue, error_code: \"\" };",
    "    }",
    "    if (behavior.operator === \"min\") return { ok: true, value: Math.min(left.value, right.value), error_code: \"\" };",
    "    if (behavior.operator === \"max\") return { ok: true, value: Math.max(left.value, right.value), error_code: \"\" };",
    "  }",
    "  if (behavior.kind === \"clamp\") {",
    "    const source = parseNumericArg(boundArgs, behavior.value_arg);",
    "    const min = parseNumericArg(boundArgs, behavior.min_arg);",
    "    const max = parseNumericArg(boundArgs, behavior.max_arg);",
    "    if (!source.ok) return { ok: false, value: null, error_code: source.error_code };",
    "    if (!min.ok) return { ok: false, value: null, error_code: min.error_code };",
    "    if (!max.ok) return { ok: false, value: null, error_code: max.error_code };",
    "    let lower = min.value;",
    "    let upper = max.value;",
    "    if (behavior.swap_bounds_when_inverted !== false && lower > upper) {",
    "      const temp = lower;",
    "      lower = upper;",
    "      upper = temp;",
    "    }",
    "    return { ok: true, value: Math.min(Math.max(source.value, lower), upper), error_code: \"\" };",
    "  }",
    "  return { ok: false, value: null, error_code: \"E_UNIMPLEMENTED_BEHAVIOR\" };",
    "}",
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
    "  const computed = computeWrapperValue(functionId, boundArgs);",
    "  if (!computed.ok) {",
    "    return {",
    "      ok: false,",
    "      function_id: functionId,",
    "      wrapper_action_id: contract.wrapper_action_id,",
    "      output_symbol: contract.output.symbol,",
    "      output_group: contract.output.group,",
    "      result: {},",
    "      value: null,",
    "      missing_args: [],",
    "      error_code: computed.error_code || \"E_RUNTIME\"",
    "    };",
    "  }",
    "  const value = computed.value;",
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
    "import math",
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
    "FUNCTION_BEHAVIOR_INDEX = WRAPPER_SYMBOL_REGISTRY.get(\"function_behavior_index\", {})",
    "NUMERIC_POLICIES = WRAPPER_SYMBOL_REGISTRY.get(\"numeric_policies\", {})",
    "",
    "def _parse_numeric_arg(bound_args: dict, arg_name: str) -> dict:",
    "    raw = bound_args.get(arg_name)",
    "    try:",
    "        value = float(raw)",
    "    except (TypeError, ValueError):",
    "        return {",
    "            \"ok\": False,",
    "            \"value\": 0.0,",
    "            \"error_code\": NUMERIC_POLICIES.get(\"invalid_number_error_code\", \"E_INVALID_NUMBER\")",
    "        }",
    "    require_finite = NUMERIC_POLICIES.get(\"require_finite_numbers\", True) is not False",
    "    if math.isnan(value) or (require_finite and not math.isfinite(value)):",
    "        return {",
    "            \"ok\": False,",
    "            \"value\": 0.0,",
    "            \"error_code\": NUMERIC_POLICIES.get(\"invalid_number_error_code\", \"E_INVALID_NUMBER\")",
    "        }",
    "    return {\"ok\": True, \"value\": value, \"error_code\": \"\"}",
    "",
    "def _compute_wrapper_value(function_id: str, bound_args: dict) -> dict:",
    "    behavior = FUNCTION_BEHAVIOR_INDEX.get(function_id)",
    "    if not isinstance(behavior, dict) or not behavior.get(\"kind\"):",
    "        return {\"ok\": False, \"value\": None, \"error_code\": \"E_UNIMPLEMENTED_BEHAVIOR\"}",
    "",
    "    kind = str(behavior.get(\"kind\", \"\"))",
    "    if kind == \"pass_through\":",
    "      parsed = _parse_numeric_arg(bound_args, str(behavior.get(\"arg\", \"\")))",
    "      return {\"ok\": True, \"value\": parsed[\"value\"], \"error_code\": \"\"} if parsed[\"ok\"] else {\"ok\": False, \"value\": None, \"error_code\": parsed[\"error_code\"]}",
    "",
    "    if kind == \"unary_math\":",
    "      parsed = _parse_numeric_arg(bound_args, str(behavior.get(\"arg\", \"\")))",
    "      if not parsed[\"ok\"]:",
    "        return {\"ok\": False, \"value\": None, \"error_code\": parsed[\"error_code\"]}",
    "      if str(behavior.get(\"operator\", \"\")) == \"abs\":",
    "        return {\"ok\": True, \"value\": abs(parsed[\"value\"]), \"error_code\": \"\"}",
    "",
    "    if kind == \"binary_arithmetic\":",
    "      left = _parse_numeric_arg(bound_args, str(behavior.get(\"left\", \"\")))",
    "      right = _parse_numeric_arg(bound_args, str(behavior.get(\"right\", \"\")))",
    "      if not left[\"ok\"]:",
    "        return {\"ok\": False, \"value\": None, \"error_code\": left[\"error_code\"]}",
    "      if not right[\"ok\"]:",
    "        return {\"ok\": False, \"value\": None, \"error_code\": right[\"error_code\"]}",
    "      operator = str(behavior.get(\"operator\", \"\"))",
    "      if operator == \"add\":",
    "        return {\"ok\": True, \"value\": left[\"value\"] + right[\"value\"], \"error_code\": \"\"}",
    "      if operator == \"subtract\":",
    "        return {\"ok\": True, \"value\": left[\"value\"] - right[\"value\"], \"error_code\": \"\"}",
    "      if operator == \"multiply\":",
    "        return {\"ok\": True, \"value\": left[\"value\"] * right[\"value\"], \"error_code\": \"\"}",
    "      if operator == \"divide\":",
    "        if right[\"value\"] == 0:",
    "          return {\"ok\": False, \"value\": None, \"error_code\": NUMERIC_POLICIES.get(\"divide_by_zero_error_code\", \"E_DIVIDE_BY_ZERO\")}",
    "        return {\"ok\": True, \"value\": left[\"value\"] / right[\"value\"], \"error_code\": \"\"}",
    "",
    "    if kind == \"binary_compare\":",
    "      left = _parse_numeric_arg(bound_args, str(behavior.get(\"left\", \"\")))",
    "      right = _parse_numeric_arg(bound_args, str(behavior.get(\"right\", \"\")))",
    "      if not left[\"ok\"]:",
    "        return {\"ok\": False, \"value\": None, \"error_code\": left[\"error_code\"]}",
    "      if not right[\"ok\"]:",
    "        return {\"ok\": False, \"value\": None, \"error_code\": right[\"error_code\"]}",
    "      operator = str(behavior.get(\"operator\", \"\"))",
    "      if operator == \"equal\":",
    "        true_value = float(behavior.get(\"true_value\", NUMERIC_POLICIES.get(\"equal_true_value\", 1)))",
    "        false_value = float(behavior.get(\"false_value\", NUMERIC_POLICIES.get(\"equal_false_value\", 0)))",
    "        return {\"ok\": True, \"value\": true_value if left[\"value\"] == right[\"value\"] else false_value, \"error_code\": \"\"}",
    "      if operator == \"min\":",
    "        return {\"ok\": True, \"value\": min(left[\"value\"], right[\"value\"]), \"error_code\": \"\"}",
    "      if operator == \"max\":",
    "        return {\"ok\": True, \"value\": max(left[\"value\"], right[\"value\"]), \"error_code\": \"\"}",
    "",
    "    if kind == \"clamp\":",
    "      source = _parse_numeric_arg(bound_args, str(behavior.get(\"value_arg\", \"\")))",
    "      minimum = _parse_numeric_arg(bound_args, str(behavior.get(\"min_arg\", \"\")))",
    "      maximum = _parse_numeric_arg(bound_args, str(behavior.get(\"max_arg\", \"\")))",
    "      if not source[\"ok\"]:",
    "        return {\"ok\": False, \"value\": None, \"error_code\": source[\"error_code\"]}",
    "      if not minimum[\"ok\"]:",
    "        return {\"ok\": False, \"value\": None, \"error_code\": minimum[\"error_code\"]}",
    "      if not maximum[\"ok\"]:",
    "        return {\"ok\": False, \"value\": None, \"error_code\": maximum[\"error_code\"]}",
    "      lower = minimum[\"value\"]",
    "      upper = maximum[\"value\"]",
    "      swap_bounds = behavior.get(\"swap_bounds_when_inverted\", True) is not False",
    "      if swap_bounds and lower > upper:",
    "        lower, upper = upper, lower",
    "      return {\"ok\": True, \"value\": min(max(source[\"value\"], lower), upper), \"error_code\": \"\"}",
    "",
    "    return {\"ok\": False, \"value\": None, \"error_code\": \"E_UNIMPLEMENTED_BEHAVIOR\"}",
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
    "    computed = _compute_wrapper_value(function_id, args)",
    "    if not computed[\"ok\"]:",
    "        return {",
    "            \"ok\": False,",
    "            \"function_id\": function_id,",
    "            \"wrapper_action_id\": contract[\"wrapper_action_id\"],",
    "            \"output_symbol\": contract[\"output\"][\"symbol\"],",
    "            \"output_group\": contract[\"output\"][\"group\"],",
    "            \"result\": {},",
    "            \"value\": None,",
    "            \"missing_args\": [],",
    "            \"error_code\": computed.get(\"error_code\", \"E_RUNTIME\")",
    "        }",
    "    value = computed[\"value\"]",
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
    .map((entry) => `WrapperResult ${toSnake(entry.function_id)}(const std::map<std::string, std::string>& bound_args);`)
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
  const requireFiniteNumbers = registry.numeric_policies && registry.numeric_policies.require_finite_numbers !== false;
  const invalidNumberErrorCode = toCppStringLiteral(
    (registry.numeric_policies && registry.numeric_policies.invalid_number_error_code) || "E_INVALID_NUMBER"
  );
  const divideByZeroErrorCode = toCppStringLiteral(
    (registry.numeric_policies && registry.numeric_policies.divide_by_zero_error_code) || "E_DIVIDE_BY_ZERO"
  );
  const equalTrueValue = Number.isFinite(
    Number(registry.numeric_policies && registry.numeric_policies.equal_true_value)
  )
    ? Number(registry.numeric_policies.equal_true_value)
    : 1;
  const equalFalseValue = Number.isFinite(
    Number(registry.numeric_policies && registry.numeric_policies.equal_false_value)
  )
    ? Number(registry.numeric_policies.equal_false_value)
    : 0;
  const requiredRows = functions
    .map((entry) => {
      const args = entry.inputs
        .filter((input) => Boolean(input.required))
        .map((input) => `"${toCppStringLiteral(input.arg)}"`)
        .join(", ");
      return `  {"${entry.function_id}", {${args}}}`;
    })
    .join(",\n");
  const actionRows = functions
    .map((entry) => `  {"${toCppStringLiteral(entry.function_id)}", "${toCppStringLiteral(entry.wrapper_action_id)}"}`)
    .join(",\n");
  const outputSymbolRows = functions
    .map((entry) => `  {"${toCppStringLiteral(entry.function_id)}", "${toCppStringLiteral(entry.output.symbol)}"}`)
    .join(",\n");
  const outputGroupRows = functions
    .map((entry) => `  {"${toCppStringLiteral(entry.function_id)}", "${toCppStringLiteral(entry.output.group)}"}`)
    .join(",\n");
  const behaviorRows = functions
    .map((entry) => {
      const behavior = entry.function_behavior && typeof entry.function_behavior === "object" ? entry.function_behavior : {};
      const kind = toCppStringLiteral(behavior.kind || "");
      const operatorName = toCppStringLiteral(behavior.operator || "");
      const arg = toCppStringLiteral(behavior.arg || "");
      const left = toCppStringLiteral(behavior.left || "");
      const right = toCppStringLiteral(behavior.right || "");
      const valueArg = toCppStringLiteral(behavior.value_arg || "");
      const minArg = toCppStringLiteral(behavior.min_arg || "");
      const maxArg = toCppStringLiteral(behavior.max_arg || "");
      const swapBounds = behavior.swap_bounds_when_inverted !== false;
      const trueValue = Number.isFinite(Number(behavior.true_value)) ? Number(behavior.true_value) : equalTrueValue;
      const falseValue = Number.isFinite(Number(behavior.false_value)) ? Number(behavior.false_value) : equalFalseValue;
      return `  {"${toCppStringLiteral(entry.function_id)}", {"${kind}", "${operatorName}", "${arg}", "${left}", "${right}", "${valueArg}", "${minArg}", "${maxArg}", ${swapBounds ? "true" : "false"}, ${trueValue}, ${falseValue}}}`;
    })
    .join(",\n");
  const wrapperFunctions = functions
    .map((entry) => {
      const constKey = toConstKey(entry.function_id);
      const functionName = toSnake(entry.function_id);
      return [
        `WrapperResult ${functionName}(const std::map<std::string, std::string>& bound_args) {`,
        `  return run_wrapper_function(function_ids::${constKey}, bound_args);`,
        "}"
      ].join("\n");
    })
    .join("\n\n");
  return [
    '#include "wrapper_symbols.hpp"',
    "",
    "#include <cmath>",
    "#include <cstdlib>",
    "#include <iomanip>",
    "#include <limits>",
    "#include <sstream>",
    "#include <unordered_map>",
    "",
    "namespace aio::wrapper_symbols {",
    "",
    "namespace {",
    `constexpr bool kRequireFiniteNumbers = ${requireFiniteNumbers ? "true" : "false"};`,
    `const std::string kInvalidNumberErrorCode = "${invalidNumberErrorCode}";`,
    `const std::string kDivideByZeroErrorCode = "${divideByZeroErrorCode}";`,
    "",
    "struct BehaviorSpec {",
    "  std::string kind;",
    "  std::string operator_name;",
    "  std::string arg;",
    "  std::string left;",
    "  std::string right;",
    "  std::string value_arg;",
    "  std::string min_arg;",
    "  std::string max_arg;",
    "  bool swap_bounds_when_inverted = true;",
    "  double true_value = 1.0;",
    "  double false_value = 0.0;",
    "};",
    "",
    "struct NumericResult {",
    "  bool ok = false;",
    "  double value = 0.0;",
    "  std::string error_code;",
    "};",
    "",
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
    "const std::unordered_map<std::string, BehaviorSpec> kBehaviorByFunction = {",
    behaviorRows,
    "};",
    "",
    "NumericResult parseNumericArg(const std::map<std::string, std::string>& bound_args, const std::string& arg_name) {",
    "  auto it = bound_args.find(arg_name);",
    "  if (it == bound_args.end()) {",
    "    return {false, 0.0, kInvalidNumberErrorCode};",
    "  }",
    "  const std::string raw = it->second;",
    "  if (raw.empty()) {",
    "    return {false, 0.0, kInvalidNumberErrorCode};",
    "  }",
    "  char* end_ptr = nullptr;",
    "  const double value = std::strtod(raw.c_str(), &end_ptr);",
    "  if (end_ptr == raw.c_str() || (end_ptr != nullptr && *end_ptr != '\\0')) {",
    "    return {false, 0.0, kInvalidNumberErrorCode};",
    "  }",
    "  if (std::isnan(value) || (kRequireFiniteNumbers && !std::isfinite(value))) {",
    "    return {false, 0.0, kInvalidNumberErrorCode};",
    "  }",
    "  return {true, value, \"\"};",
    "}",
    "",
    "std::string formatNumber(double value) {",
    "  std::ostringstream stream;",
    "  stream << std::setprecision(17) << value;",
    "  return stream.str();",
    "}",
    "",
    "NumericResult computeWrapperValue(const std::string& function_id, const std::map<std::string, std::string>& bound_args) {",
    "  const auto behaviorIt = kBehaviorByFunction.find(function_id);",
    "  if (behaviorIt == kBehaviorByFunction.end()) {",
    "    return {false, 0.0, \"E_UNIMPLEMENTED_BEHAVIOR\"};",
    "  }",
    "  const BehaviorSpec& behavior = behaviorIt->second;",
    "",
    "  if (behavior.kind == \"pass_through\") {",
    "    return parseNumericArg(bound_args, behavior.arg);",
    "  }",
    "",
    "  if (behavior.kind == \"unary_math\") {",
    "    const NumericResult parsed = parseNumericArg(bound_args, behavior.arg);",
    "    if (!parsed.ok) {",
    "      return parsed;",
    "    }",
    "    if (behavior.operator_name == \"abs\") {",
    "      return {true, std::fabs(parsed.value), \"\"};",
    "    }",
    "  }",
    "",
    "  if (behavior.kind == \"binary_arithmetic\") {",
    "    const NumericResult left = parseNumericArg(bound_args, behavior.left);",
    "    const NumericResult right = parseNumericArg(bound_args, behavior.right);",
    "    if (!left.ok) {",
    "      return left;",
    "    }",
    "    if (!right.ok) {",
    "      return right;",
    "    }",
    "    if (behavior.operator_name == \"add\") {",
    "      return {true, left.value + right.value, \"\"};",
    "    }",
    "    if (behavior.operator_name == \"subtract\") {",
    "      return {true, left.value - right.value, \"\"};",
    "    }",
    "    if (behavior.operator_name == \"multiply\") {",
    "      return {true, left.value * right.value, \"\"};",
    "    }",
    "    if (behavior.operator_name == \"divide\") {",
    "      if (right.value == 0.0) {",
    "        return {false, 0.0, kDivideByZeroErrorCode};",
    "      }",
    "      return {true, left.value / right.value, \"\"};",
    "    }",
    "  }",
    "",
    "  if (behavior.kind == \"binary_compare\") {",
    "    const NumericResult left = parseNumericArg(bound_args, behavior.left);",
    "    const NumericResult right = parseNumericArg(bound_args, behavior.right);",
    "    if (!left.ok) {",
    "      return left;",
    "    }",
    "    if (!right.ok) {",
    "      return right;",
    "    }",
    "    if (behavior.operator_name == \"equal\") {",
    "      return {true, left.value == right.value ? behavior.true_value : behavior.false_value, \"\"};",
    "    }",
    "    if (behavior.operator_name == \"min\") {",
    "      return {true, left.value < right.value ? left.value : right.value, \"\"};",
    "    }",
    "    if (behavior.operator_name == \"max\") {",
    "      return {true, left.value > right.value ? left.value : right.value, \"\"};",
    "    }",
    "  }",
    "",
    "  if (behavior.kind == \"clamp\") {",
    "    const NumericResult source = parseNumericArg(bound_args, behavior.value_arg);",
    "    const NumericResult minValue = parseNumericArg(bound_args, behavior.min_arg);",
    "    const NumericResult maxValue = parseNumericArg(bound_args, behavior.max_arg);",
    "    if (!source.ok) {",
    "      return source;",
    "    }",
    "    if (!minValue.ok) {",
    "      return minValue;",
    "    }",
    "    if (!maxValue.ok) {",
    "      return maxValue;",
    "    }",
    "    double lower = minValue.value;",
    "    double upper = maxValue.value;",
    "    if (behavior.swap_bounds_when_inverted && lower > upper) {",
    "      const double tmp = lower;",
    "      lower = upper;",
    "      upper = tmp;",
    "    }",
    "    const double clamped = source.value < lower ? lower : (source.value > upper ? upper : source.value);",
    "    return {true, clamped, \"\"};",
    "  }",
    "",
    "  return {false, 0.0, \"E_UNIMPLEMENTED_BEHAVIOR\"};",
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
    "  const NumericResult computed = computeWrapperValue(function_id, bound_args);",
    "  if (!computed.ok) {",
    "    response.error_code = computed.error_code.empty() ? \"E_RUNTIME\" : computed.error_code;",
    "    return response;",
    "  }",
    "  response.value = formatNumber(computed.value);",
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
      return `      "${entry.function_id}" => method(:${methodName})`;
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
    "    FUNCTION_BEHAVIOR_INDEX = WRAPPER_SYMBOL_REGISTRY[\"function_behavior_index\"] || {}",
    "    NUMERIC_POLICIES = WRAPPER_SYMBOL_REGISTRY[\"numeric_policies\"] || {}",
    "",
    "    def self.parse_numeric_arg(bound_args, arg_name)",
    "      raw = bound_args[arg_name]",
    "      begin",
    "        value = Float(raw)",
    "      rescue StandardError",
    "        return { \"ok\" => false, \"value\" => 0.0, \"error_code\" => NUMERIC_POLICIES.fetch(\"invalid_number_error_code\", \"E_INVALID_NUMBER\") }",
    "      end",
    "      require_finite = NUMERIC_POLICIES.fetch(\"require_finite_numbers\", true) != false",
    "      if value.nan? || (require_finite && !value.finite?)",
    "        return { \"ok\" => false, \"value\" => 0.0, \"error_code\" => NUMERIC_POLICIES.fetch(\"invalid_number_error_code\", \"E_INVALID_NUMBER\") }",
    "      end",
    "      { \"ok\" => true, \"value\" => value, \"error_code\" => \"\" }",
    "    end",
    "",
    "    def self.compute_wrapper_value(function_id, bound_args)",
    "      behavior = FUNCTION_BEHAVIOR_INDEX[function_id]",
    "      unless behavior.is_a?(Hash) && behavior[\"kind\"]",
    "        return { \"ok\" => false, \"value\" => nil, \"error_code\" => \"E_UNIMPLEMENTED_BEHAVIOR\" }",
    "      end",
    "      kind = behavior[\"kind\"].to_s",
    "",
    "      if kind == \"pass_through\"",
    "        parsed = parse_numeric_arg(bound_args, behavior[\"arg\"].to_s)",
    "        return parsed[\"ok\"] ? { \"ok\" => true, \"value\" => parsed[\"value\"], \"error_code\" => \"\" } : { \"ok\" => false, \"value\" => nil, \"error_code\" => parsed[\"error_code\"] }",
    "      end",
    "",
    "      if kind == \"unary_math\"",
    "        parsed = parse_numeric_arg(bound_args, behavior[\"arg\"].to_s)",
    "        return { \"ok\" => false, \"value\" => nil, \"error_code\" => parsed[\"error_code\"] } unless parsed[\"ok\"]",
    "        if behavior[\"operator\"].to_s == \"abs\"",
    "          return { \"ok\" => true, \"value\" => parsed[\"value\"].abs, \"error_code\" => \"\" }",
    "        end",
    "      end",
    "",
    "      if kind == \"binary_arithmetic\"",
    "        left = parse_numeric_arg(bound_args, behavior[\"left\"].to_s)",
    "        right = parse_numeric_arg(bound_args, behavior[\"right\"].to_s)",
    "        return { \"ok\" => false, \"value\" => nil, \"error_code\" => left[\"error_code\"] } unless left[\"ok\"]",
    "        return { \"ok\" => false, \"value\" => nil, \"error_code\" => right[\"error_code\"] } unless right[\"ok\"]",
    "        operator = behavior[\"operator\"].to_s",
    "        return { \"ok\" => true, \"value\" => left[\"value\"] + right[\"value\"], \"error_code\" => \"\" } if operator == \"add\"",
    "        return { \"ok\" => true, \"value\" => left[\"value\"] - right[\"value\"], \"error_code\" => \"\" } if operator == \"subtract\"",
    "        return { \"ok\" => true, \"value\" => left[\"value\"] * right[\"value\"], \"error_code\" => \"\" } if operator == \"multiply\"",
    "        if operator == \"divide\"",
    "          return { \"ok\" => false, \"value\" => nil, \"error_code\" => NUMERIC_POLICIES.fetch(\"divide_by_zero_error_code\", \"E_DIVIDE_BY_ZERO\") } if right[\"value\"] == 0",
    "          return { \"ok\" => true, \"value\" => left[\"value\"] / right[\"value\"], \"error_code\" => \"\" }",
    "        end",
    "      end",
    "",
    "      if kind == \"binary_compare\"",
    "        left = parse_numeric_arg(bound_args, behavior[\"left\"].to_s)",
    "        right = parse_numeric_arg(bound_args, behavior[\"right\"].to_s)",
    "        return { \"ok\" => false, \"value\" => nil, \"error_code\" => left[\"error_code\"] } unless left[\"ok\"]",
    "        return { \"ok\" => false, \"value\" => nil, \"error_code\" => right[\"error_code\"] } unless right[\"ok\"]",
    "        operator = behavior[\"operator\"].to_s",
    "        if operator == \"equal\"",
    "          true_value = Float(behavior.fetch(\"true_value\", NUMERIC_POLICIES.fetch(\"equal_true_value\", 1)))",
    "          false_value = Float(behavior.fetch(\"false_value\", NUMERIC_POLICIES.fetch(\"equal_false_value\", 0)))",
    "          return { \"ok\" => true, \"value\" => left[\"value\"] == right[\"value\"] ? true_value : false_value, \"error_code\" => \"\" }",
    "        end",
    "        return { \"ok\" => true, \"value\" => [left[\"value\"], right[\"value\"]].min, \"error_code\" => \"\" } if operator == \"min\"",
    "        return { \"ok\" => true, \"value\" => [left[\"value\"], right[\"value\"]].max, \"error_code\" => \"\" } if operator == \"max\"",
    "      end",
    "",
    "      if kind == \"clamp\"",
    "        source = parse_numeric_arg(bound_args, behavior[\"value_arg\"].to_s)",
    "        min_value = parse_numeric_arg(bound_args, behavior[\"min_arg\"].to_s)",
    "        max_value = parse_numeric_arg(bound_args, behavior[\"max_arg\"].to_s)",
    "        return { \"ok\" => false, \"value\" => nil, \"error_code\" => source[\"error_code\"] } unless source[\"ok\"]",
    "        return { \"ok\" => false, \"value\" => nil, \"error_code\" => min_value[\"error_code\"] } unless min_value[\"ok\"]",
    "        return { \"ok\" => false, \"value\" => nil, \"error_code\" => max_value[\"error_code\"] } unless max_value[\"ok\"]",
    "        lower = min_value[\"value\"]",
    "        upper = max_value[\"value\"]",
    "        swap_bounds = behavior.fetch(\"swap_bounds_when_inverted\", true) != false",
    "        if swap_bounds && lower > upper",
    "          lower, upper = upper, lower",
    "        end",
    "        return { \"ok\" => true, \"value\" => [[source[\"value\"], lower].max, upper].min, \"error_code\" => \"\" }",
    "      end",
    "",
    "      { \"ok\" => false, \"value\" => nil, \"error_code\" => \"E_UNIMPLEMENTED_BEHAVIOR\" }",
    "    end",
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
    "      computed = compute_wrapper_value(function_id, args)",
    "      unless computed[\"ok\"]",
    "        return {",
    "          \"ok\" => false,",
    "          \"function_id\" => function_id,",
    "          \"wrapper_action_id\" => contract[\"wrapper_action_id\"],",
    "          \"output_symbol\" => contract[\"output\"][\"symbol\"],",
    "          \"output_group\" => contract[\"output\"][\"group\"],",
    "          \"result\" => {},",
    "          \"value\" => nil,",
    "          \"missing_args\" => [],",
    "          \"error_code\" => computed.fetch(\"error_code\", \"E_RUNTIME\")",
    "        }",
    "      end",
    "      value = computed[\"value\"]",
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
  const behaviorSpecs = readJson(path.join(root, FUNCTION_BEHAVIOR_SPECS_PATH));
  const registry = buildWrapperSymbolRegistry(contracts, wrapperSpecs, behaviorSpecs);
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
