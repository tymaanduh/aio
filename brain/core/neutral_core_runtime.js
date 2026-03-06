"use strict";

const path = require("path");
const { selectStartupRuntime } = require("./runtime_arbiter.js");

const GENERATED_JAVASCRIPT_NEUTRAL_CORE_PATH = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "output",
  "databases",
  "polyglot-default",
  "build",
  "generated",
  "javascript",
  "neutral_core.js"
);
const NEUTRAL_MATH_FUNCTION_KEY_ORDER = Object.freeze([
  "MATH_ASSIGN",
  "MATH_CHAIN_ASSIGN",
  "MATH_ADD",
  "MATH_SUBTRACT",
  "MATH_MULTIPLY",
  "MATH_DIVIDE",
  "MATH_EQUAL",
  "MATH_MAX",
  "MATH_MIN",
  "MATH_ABS",
  "MATH_CLAMP"
]);

function loadJavascriptNeutralCore() {
  try {
    return require(GENERATED_JAVASCRIPT_NEUTRAL_CORE_PATH);
  } catch (_error) {
    return null;
  }
}

function resolveMathCoreExecutionPlan(options = {}) {
  const selection = selectStartupRuntime("math_core", options);
  const javascriptCore = loadJavascriptNeutralCore();
  const requestedRuntime = String(selection.selected_runtime || "javascript");
  const executionRuntime = javascriptCore ? "javascript" : "";
  return {
    selection,
    requested_runtime: requestedRuntime,
    execution_runtime: executionRuntime,
    execution_mode:
      executionRuntime && requestedRuntime === executionRuntime
        ? "direct_selected_runtime"
        : executionRuntime
          ? "direct_javascript_fallback"
          : "unavailable"
  };
}

function runNeutralMathFunction(functionId, boundArgs = {}, options = {}) {
  const executionPlan = resolveMathCoreExecutionPlan(options);
  const javascriptCore = loadJavascriptNeutralCore();
  if (!javascriptCore || typeof javascriptCore.runMathFunction !== "function") {
    throw new Error("generated javascript neutral core runtime is unavailable");
  }
  const result = javascriptCore.runMathFunction(functionId, boundArgs, executionPlan);
  if (result && typeof result === "object" && Object.prototype.hasOwnProperty.call(result, "value")) {
    return result.value;
  }
  return result;
}

function buildNeutralMathFunctionRegistry() {
  const javascriptCore = loadJavascriptNeutralCore();
  const functionIds = javascriptCore && javascriptCore.FUNCTION_IDS && typeof javascriptCore.FUNCTION_IDS === "object"
    ? javascriptCore.FUNCTION_IDS
    : {};
  const registry = {};

  NEUTRAL_MATH_FUNCTION_KEY_ORDER.forEach((functionKey) => {
    const functionId = String(functionIds[functionKey] || "");
    if (!functionId) {
      return;
    }
    registry[functionId] = (boundArgs = {}) => runNeutralMathFunction(functionId, boundArgs);
  });

  return Object.freeze(registry);
}

module.exports = {
  GENERATED_JAVASCRIPT_NEUTRAL_CORE_PATH,
  buildNeutralMathFunctionRegistry,
  loadJavascriptNeutralCore,
  resolveMathCoreExecutionPlan,
  runNeutralMathFunction
};
