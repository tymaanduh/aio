(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Unified_Io_Wrapper = __MODULE_API;
  root.DictionaryUnifiedIoWrapper = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const PATTERN_NODE_WRAPPER_SPEC_PATH = "../../data/input/shared/wrapper/unified_wrapper_specs.json";

  function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function toArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function normalizeText(value, fallback = "", maxLength = 120) {
    if (typeof value !== "string") {
      return fallback;
    }
    const normalized = value.trim().toLowerCase().slice(0, maxLength);
    return normalized || fallback;
  }

  function toFiniteNumber(value, fallback = 0) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return parsed;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function toUniqueTextList(values, maxLength = 120, maxItems = 400) {
    const source = toArray(values);
    const dedup = [];
    const seen = new Set();
    for (let index = 0; index < source.length; index += 1) {
      const text = normalizeText(source[index], "", maxLength);
      if (!text || seen.has(text)) {
        continue;
      }
      seen.add(text);
      dedup.push(text);
      if (dedup.length >= maxItems) {
        break;
      }
    }
    return dedup;
  }

  function loadRuntimeSpec() {
    const host = typeof globalThis !== "undefined" ? globalThis : {};
    const runtimeSpec = host.Dictionary_Unified_Io_Wrapper_Spec;
    return isPlainObject(runtimeSpec) ? runtimeSpec : {};
  }

  function loadNodeSpec() {
    const nodeEnabled = typeof module === "object" && module && module.exports && typeof require === "function";
    if (!nodeEnabled) {
      return {};
    }
    try {
      const spec = require(PATTERN_NODE_WRAPPER_SPEC_PATH);
      return isPlainObject(spec) ? spec : {};
    } catch (_error) {
      return {};
    }
  }

  function loadDefaultSpec() {
    const runtimeSpec = loadRuntimeSpec();
    if (Object.keys(runtimeSpec).length > 0) {
      return runtimeSpec;
    }
    return loadNodeSpec();
  }

  const PATTERN_UNIFIED_WRAPPER_SPEC_DEFAULTS = Object.freeze(loadDefaultSpec());

  function normalizeGroupIndex(rawGroupIndex) {
    const source = isPlainObject(rawGroupIndex) ? rawGroupIndex : {};
    const normalized = {};
    Object.entries(source).forEach(([rawKey, rawGroup]) => {
      const group = isPlainObject(rawGroup) ? rawGroup : {};
      const group_id = normalizeText(group.group_id || rawKey, "", 120);
      if (!group_id) {
        return;
      }
      normalized[group_id] = {
        group_id,
        label: String(group.label || group_id),
        aliases: toUniqueTextList([group_id, ...toArray(group.aliases)], 120, 120)
      };
    });
    return normalized;
  }

  function normalizeLabelIndex(rawLabelIndex) {
    const source = isPlainObject(rawLabelIndex) ? rawLabelIndex : {};
    const normalized = {};
    Object.entries(source).forEach(([rawKey, rawLabel]) => {
      const label = isPlainObject(rawLabel) ? rawLabel : {};
      const label_id = normalizeText(label.label_id || rawKey, "", 120);
      if (!label_id) {
        return;
      }
      normalized[label_id] = {
        label_id,
        text: String(label.text || label_id),
        aliases: toUniqueTextList([label_id, ...toArray(label.aliases)], 120, 160)
      };
    });
    return normalized;
  }

  function normalizeAliasIndex(rawAliasIndex) {
    const source = isPlainObject(rawAliasIndex) ? rawAliasIndex : {};
    const normalized = {};
    Object.entries(source).forEach(([rawCanonical, rawAliases]) => {
      const canonical = normalizeText(rawCanonical, "", 120);
      if (!canonical) {
        return;
      }
      normalized[canonical] = toUniqueTextList([canonical, ...toArray(rawAliases)], 120, 320);
    });
    return normalized;
  }

  function buildAliasLookup(aliasIndex) {
    const lookup = {};
    Object.entries(aliasIndex).forEach(([canonical, aliases]) => {
      toUniqueTextList([canonical, ...toArray(aliases)], 120, 320).forEach((alias) => {
        lookup[alias] = canonical;
      });
    });
    return lookup;
  }

  function normalizeRuntimeDefaults(rawRuntimeDefaults) {
    const source = isPlainObject(rawRuntimeDefaults) ? rawRuntimeDefaults : {};
    const resolutionOrder = toUniqueTextList(source.group_resolution_order, 120, 20);
    return {
      wrapper_id: normalizeText(source.wrapper_id, "wrapper_two_pass_unified", 120),
      input_group_id: normalizeText(source.input_group_id, "input", 120),
      work_group_id: normalizeText(source.work_group_id, "work", 120),
      output_group_id: normalizeText(source.output_group_id, "output", 120),
      meta_group_id: normalizeText(source.meta_group_id, "meta", 120),
      group_resolution_order: resolutionOrder.length > 0 ? resolutionOrder : ["input", "work", "output"]
    };
  }

  function normalizeInputArgs(rawInputArgs) {
    return toArray(rawInputArgs)
      .map((rawArg) => {
        const arg = isPlainObject(rawArg) ? rawArg : {};
        return {
          arg: normalizeText(arg.arg, "", 120),
          symbol: normalizeText(arg.symbol, "", 120)
        };
      })
      .filter((arg) => arg.arg && arg.symbol);
  }

  function normalizeOperationIndex(rawOperationIndex, runtimeDefaults) {
    const source = isPlainObject(rawOperationIndex) ? rawOperationIndex : {};
    const normalized = {};
    Object.entries(source).forEach(([rawKey, rawOperation]) => {
      const operation = isPlainObject(rawOperation) ? rawOperation : {};
      const operation_id = normalizeText(operation.operation_id || rawKey, "", 120);
      if (!operation_id) {
        return;
      }
      normalized[operation_id] = {
        operation_id,
        function_id: normalizeText(operation.function_id, "", 160),
        input_args: normalizeInputArgs(operation.input_args),
        output_symbol: normalizeText(operation.output_symbol, runtimeDefaults.output_group_id, 120),
        output_group: normalizeText(operation.output_group, runtimeDefaults.output_group_id, 120)
      };
    });
    return normalized;
  }

  function buildFunctionSignatureIndexFromOperations(operation_index, runtimeDefaults) {
    const signatures = {};
    Object.values(isPlainObject(operation_index) ? operation_index : {}).forEach((operation) => {
      const function_id = normalizeText(operation.function_id, "", 160);
      if (!function_id) {
        return;
      }
      const existing = isPlainObject(signatures[function_id]) ? signatures[function_id] : null;
      const next = existing || {
        function_id,
        input_args: [],
        default_output_symbol: normalizeText(runtimeDefaults.output_group_id, "result", 120),
        default_output_group: normalizeText(runtimeDefaults.output_group_id, "output", 120),
        operation_ids: []
      };

      if (!next.input_args.length) {
        next.input_args = normalizeInputArgs(operation.input_args);
      }
      if (!existing || !existing.default_output_symbol) {
        next.default_output_symbol = normalizeText(
          operation.output_symbol,
          normalizeText(runtimeDefaults.output_group_id, "result", 120),
          120
        );
      }
      if (!existing || !existing.default_output_group) {
        next.default_output_group = normalizeText(
          operation.output_group,
          normalizeText(runtimeDefaults.output_group_id, "output", 120),
          120
        );
      }

      const operation_id = normalizeText(operation.operation_id, "", 120);
      if (operation_id && !next.operation_ids.includes(operation_id)) {
        next.operation_ids.push(operation_id);
      }
      signatures[function_id] = next;
    });
    return signatures;
  }

  function normalizeFunctionSignatureIndex(rawFunctionSignatureIndex, runtimeDefaults, operation_index) {
    const source = isPlainObject(rawFunctionSignatureIndex) ? rawFunctionSignatureIndex : {};
    const normalized = {};
    const derived = buildFunctionSignatureIndexFromOperations(operation_index, runtimeDefaults);

    Object.entries(derived).forEach(([function_id, signature]) => {
      normalized[function_id] = {
        function_id,
        input_args: normalizeInputArgs(signature.input_args),
        default_output_symbol: normalizeText(
          signature.default_output_symbol,
          normalizeText(runtimeDefaults.output_group_id, "result", 120),
          120
        ),
        default_output_group: normalizeText(
          signature.default_output_group,
          normalizeText(runtimeDefaults.output_group_id, "output", 120),
          120
        ),
        operation_ids: toUniqueTextList(signature.operation_ids, 120, 120)
      };
    });

    Object.entries(source).forEach(([rawFunctionId, rawSignature]) => {
      const function_id = normalizeText(rawFunctionId, "", 160);
      if (!function_id) {
        return;
      }
      const signature = isPlainObject(rawSignature) ? rawSignature : {};
      const existing = normalized[function_id] || {
        function_id,
        input_args: [],
        default_output_symbol: normalizeText(runtimeDefaults.output_group_id, "result", 120),
        default_output_group: normalizeText(runtimeDefaults.output_group_id, "output", 120),
        operation_ids: []
      };
      normalized[function_id] = {
        function_id,
        input_args: normalizeInputArgs(signature.input_args).length
          ? normalizeInputArgs(signature.input_args)
          : existing.input_args,
        default_output_symbol: normalizeText(signature.default_output_symbol, existing.default_output_symbol, 120),
        default_output_group: normalizeText(signature.default_output_group, existing.default_output_group, 120),
        operation_ids: toUniqueTextList(
          [...toArray(existing.operation_ids), ...toArray(signature.operation_ids)],
          120,
          120
        )
      };
    });

    return normalized;
  }

  function normalizePipelineIndex(rawPipelineIndex) {
    const source = isPlainObject(rawPipelineIndex) ? rawPipelineIndex : {};
    const normalized = {};
    Object.entries(source).forEach(([rawKey, rawPipeline]) => {
      const pipeline_id = normalizeText(rawKey, "", 120);
      if (!pipeline_id) {
        return;
      }
      normalized[pipeline_id] = toUniqueTextList(rawPipeline, 120, 200);
    });
    return normalized;
  }

  function normalizeWrapperIndex(rawWrapperIndex, runtimeDefaults) {
    const source = isPlainObject(rawWrapperIndex) ? rawWrapperIndex : {};
    const normalized = {};
    Object.entries(source).forEach(([rawKey, rawWrapper]) => {
      const wrapper = isPlainObject(rawWrapper) ? rawWrapper : {};
      const wrapper_id = normalizeText(wrapper.wrapper_id || rawKey, "", 120);
      if (!wrapper_id) {
        return;
      }
      normalized[wrapper_id] = {
        wrapper_id,
        description: String(wrapper.description || wrapper_id),
        passes: toArray(wrapper.passes)
          .map((rawPass) => {
            const pass = isPlainObject(rawPass) ? rawPass : {};
            return {
              pass_id: normalizeText(pass.pass_id, "", 120),
              pass_type: normalizeText(pass.pass_type, "", 120)
            };
          })
          .filter((pass) => pass.pass_id && pass.pass_type)
      };
    });

    if (!normalized[runtimeDefaults.wrapper_id]) {
      normalized[runtimeDefaults.wrapper_id] = {
        wrapper_id: runtimeDefaults.wrapper_id,
        description: "Two-pass unified wrapper",
        passes: [
          { pass_id: "pass_identify", pass_type: "identify_arguments" },
          { pass_id: "pass_execute", pass_type: "execute_pipeline" }
        ]
      };
    }

    return normalized;
  }

  function create_unified_wrapper_catalog(rawSpec = {}) {
    const source = isPlainObject(rawSpec) ? rawSpec : {};
    const defaults = PATTERN_UNIFIED_WRAPPER_SPEC_DEFAULTS;

    const runtime_defaults = normalizeRuntimeDefaults({
      ...(isPlainObject(defaults.runtime_defaults) ? defaults.runtime_defaults : {}),
      ...(isPlainObject(source.runtime_defaults) ? source.runtime_defaults : {})
    });

    const group_index = normalizeGroupIndex({
      ...(isPlainObject(defaults.group_index) ? defaults.group_index : {}),
      ...(isPlainObject(source.group_index) ? source.group_index : {})
    });

    const label_index = normalizeLabelIndex({
      ...(isPlainObject(defaults.label_index) ? defaults.label_index : {}),
      ...(isPlainObject(source.label_index) ? source.label_index : {})
    });

    const alias_index = normalizeAliasIndex({
      ...(isPlainObject(defaults.alias_index) ? defaults.alias_index : {}),
      ...(isPlainObject(source.alias_index) ? source.alias_index : {})
    });

    const operation_index = normalizeOperationIndex(
      {
        ...(isPlainObject(defaults.operation_index) ? defaults.operation_index : {}),
        ...(isPlainObject(source.operation_index) ? source.operation_index : {})
      },
      runtime_defaults
    );

    const function_signature_index = normalizeFunctionSignatureIndex(
      {
        ...(isPlainObject(defaults.function_signature_index) ? defaults.function_signature_index : {}),
        ...(isPlainObject(source.function_signature_index) ? source.function_signature_index : {})
      },
      runtime_defaults,
      operation_index
    );

    const pipeline_index = normalizePipelineIndex({
      ...(isPlainObject(defaults.pipeline_index) ? defaults.pipeline_index : {}),
      ...(isPlainObject(source.pipeline_index) ? source.pipeline_index : {})
    });

    const wrapper_index = normalizeWrapperIndex(
      {
        ...(isPlainObject(defaults.wrapper_index) ? defaults.wrapper_index : {}),
        ...(isPlainObject(source.wrapper_index) ? source.wrapper_index : {})
      },
      runtime_defaults
    );

    return {
      version: Number(source.version || defaults.version || 1),
      runtime_defaults,
      group_index,
      label_index,
      alias_index,
      alias_lookup: buildAliasLookup(alias_index),
      operation_index,
      function_signature_index,
      pipeline_index,
      wrapper_index,
      updated_at: nowIso()
    };
  }

  function create_default_function_registry() {
    return {
      "math.assign": ({ x }) => x,
      "math.chain_assign": ({ a }) => a,
      "math.add": ({ x, y }) => toFiniteNumber(x, 0) + toFiniteNumber(y, 0),
      "math.subtract": ({ x, y }) => toFiniteNumber(x, 0) - toFiniteNumber(y, 0),
      "math.multiply": ({ x, y }) => toFiniteNumber(x, 0) * toFiniteNumber(y, 0),
      "math.divide": ({ x, y }) => toFiniteNumber(toFiniteNumber(x, 0) / toFiniteNumber(y, 0), 0),
      "math.equal": ({ x, y }) => (toFiniteNumber(x, 0) === toFiniteNumber(y, 0) ? 1 : 0)
    };
  }

  function resolveCanonicalSymbol(catalog, value) {
    const token = normalizeText(value, "", 120);
    if (!token) {
      return "";
    }
    return catalog.alias_lookup[token] || token;
  }

  function initializeRuntimeBanks(catalog, seedInput = {}) {
    const runtime = {
      input: {},
      work: {},
      output: {},
      meta: {
        started_at: nowIso(),
        pass_results: []
      }
    };

    Object.entries(isPlainObject(seedInput) ? seedInput : {}).forEach(([rawKey, value]) => {
      const canonical = resolveCanonicalSymbol(catalog, rawKey);
      if (!canonical) {
        return;
      }
      runtime.input[canonical] = value;
    });

    return runtime;
  }

  function resolveSymbolValue(catalog, runtime, symbol) {
    const canonical = resolveCanonicalSymbol(catalog, symbol);
    if (!canonical) {
      return undefined;
    }

    const order = toArray(catalog.runtime_defaults.group_resolution_order);
    for (let index = 0; index < order.length; index += 1) {
      const group_id = normalizeText(order[index], "", 120);
      const bank = isPlainObject(runtime[group_id]) ? runtime[group_id] : null;
      if (bank && Object.prototype.hasOwnProperty.call(bank, canonical)) {
        return bank[canonical];
      }
    }

    return undefined;
  }

  function writeSymbolValue(catalog, runtime, symbol, group, value) {
    const canonical = resolveCanonicalSymbol(catalog, symbol);
    const group_id = normalizeText(group, catalog.runtime_defaults.output_group_id, 120);
    if (!canonical || !group_id) {
      return "";
    }

    if (!isPlainObject(runtime[group_id])) {
      runtime[group_id] = {};
    }

    runtime[group_id][canonical] = value;
    return canonical;
  }

  function normalizeOperationList(catalog, rawOperationList) {
    return toArray(rawOperationList)
      .map((operationId) => resolveCanonicalSymbol(catalog, operationId))
      .map((operationId) => catalog.operation_index[operationId])
      .filter((operation) => isPlainObject(operation));
  }

  function build_pipeline_from_operation_ids(catalog, rawOperationIds = []) {
    return normalizeOperationList(catalog, rawOperationIds).map((operation) => ({ ...operation }));
  }

  function resolve_operation_by_function_id(catalog, function_id) {
    const key = normalizeText(function_id, "", 160);
    if (!key) {
      return null;
    }
    const signature = isPlainObject(catalog.function_signature_index[key]) ? catalog.function_signature_index[key] : null;
    if (!signature) {
      return null;
    }
    const operation_id = toArray(signature.operation_ids)[0];
    if (!operation_id) {
      return null;
    }
    const operation = catalog.operation_index[operation_id];
    return isPlainObject(operation) ? { ...operation } : null;
  }

  function normalize_stage_from_function_spec(catalog, rawStage, stageIndex = 0) {
    if (typeof rawStage === "string") {
      const operation = resolve_operation_by_function_id(catalog, rawStage);
      if (operation) {
        return operation;
      }
      const function_id = normalizeText(rawStage, "", 160);
      const signature = isPlainObject(catalog.function_signature_index[function_id])
        ? catalog.function_signature_index[function_id]
        : null;
      if (!signature) {
        return null;
      }
      return {
        operation_id: `auto_${function_id}_${stageIndex + 1}`,
        function_id,
        input_args: normalizeInputArgs(signature.input_args),
        output_symbol: normalizeText(signature.default_output_symbol, "result", 120),
        output_group: normalizeText(signature.default_output_group, catalog.runtime_defaults.output_group_id, 120)
      };
    }

    const stage = isPlainObject(rawStage) ? rawStage : {};
    const operation_id = normalizeText(stage.operation_id, "", 120);
    if (operation_id && isPlainObject(catalog.operation_index[operation_id])) {
      const operation = { ...catalog.operation_index[operation_id] };
      if (stage.output_symbol) {
        operation.output_symbol = normalizeText(stage.output_symbol, operation.output_symbol, 120);
      }
      if (stage.output_group) {
        operation.output_group = normalizeText(stage.output_group, operation.output_group, 120);
      }
      return operation;
    }

    const function_id = normalizeText(stage.function_id, "", 160);
    if (!function_id) {
      return null;
    }
    const operation = resolve_operation_by_function_id(catalog, function_id);
    if (operation) {
      if (stage.output_symbol) {
        operation.output_symbol = normalizeText(stage.output_symbol, operation.output_symbol, 120);
      }
      if (stage.output_group) {
        operation.output_group = normalizeText(stage.output_group, operation.output_group, 120);
      }
      if (toArray(stage.input_args).length > 0) {
        operation.input_args = normalizeInputArgs(stage.input_args);
      }
      return operation;
    }

    const signature = isPlainObject(catalog.function_signature_index[function_id])
      ? catalog.function_signature_index[function_id]
      : null;
    const input_args = normalizeInputArgs(stage.input_args);
    return {
      operation_id: normalizeText(stage.operation_id, `auto_${function_id}_${stageIndex + 1}`, 120),
      function_id,
      input_args: input_args.length
        ? input_args
        : signature
        ? normalizeInputArgs(signature.input_args)
        : [],
      output_symbol: normalizeText(
        stage.output_symbol,
        signature ? signature.default_output_symbol : "result",
        120
      ),
      output_group: normalizeText(
        stage.output_group,
        signature ? signature.default_output_group : catalog.runtime_defaults.output_group_id,
        120
      )
    };
  }

  function build_pipeline_from_function_specs(catalog, rawFunctionSequence = []) {
    return toArray(rawFunctionSequence)
      .map((rawStage, index) => normalize_stage_from_function_spec(catalog, rawStage, index))
      .filter((stage) => isPlainObject(stage));
  }

  function identify_arguments(catalog, runtime, rawPipeline = []) {
    const pipeline = toArray(rawPipeline);
    const stage_plan = [];
    const missing = [];

    pipeline.forEach((rawStage, stage_index) => {
      const stage = isPlainObject(rawStage) ? rawStage : {};
      const operation_key = resolveCanonicalSymbol(catalog, stage.operation_id);
      const catalog_operation = isPlainObject(catalog.operation_index[operation_key])
        ? catalog.operation_index[operation_key]
        : null;
      const has_stage_overrides =
        Boolean(normalizeText(stage.function_id, "", 160)) ||
        toArray(stage.input_args).length > 0 ||
        Boolean(normalizeText(stage.output_symbol, "", 120)) ||
        Boolean(normalizeText(stage.output_group, "", 120));
      const operation = has_stage_overrides
        ? {
            ...(catalog_operation || {}),
            ...stage,
            input_args:
              toArray(stage.input_args).length > 0
                ? normalizeInputArgs(stage.input_args)
                : normalizeInputArgs(catalog_operation ? catalog_operation.input_args : [])
          }
        : catalog_operation || stage;
      const input_args = toArray(operation.input_args);
      const call_args = {};

      input_args.forEach((argSpec) => {
        const arg = isPlainObject(argSpec) ? argSpec : {};
        const arg_name = normalizeText(arg.arg, "", 120);
        const symbol = normalizeText(arg.symbol, "", 120);
        if (!arg_name || !symbol) {
          return;
        }
        const value = resolveSymbolValue(catalog, runtime, symbol);
        if (value === undefined) {
          missing.push({
            stage_index,
            operation_id: operation.operation_id,
            arg: arg_name,
            symbol: symbol
          });
          return;
        }
        call_args[arg_name] = value;
      });

      stage_plan.push({
        stage_index,
        operation_id: operation.operation_id,
        function_id: normalizeText(operation.function_id, "", 160),
        output_symbol: normalizeText(operation.output_symbol, catalog.runtime_defaults.output_group_id, 120),
        output_group: normalizeText(operation.output_group, catalog.runtime_defaults.output_group_id, 120),
        call_args
      });
    });

    return {
      ok: missing.length === 0,
      stage_plan,
      missing
    };
  }

  function execute_pipeline(catalog, runtime, function_registry, stage_plan) {
    const steps = toArray(stage_plan);
    const stage_results = [];

    steps.forEach((stage) => {
      const function_id = normalizeText(stage.function_id, "", 160);
      const runner = function_registry[function_id];
      if (typeof runner !== "function") {
        throw new Error(`missing function runner: ${function_id}`);
      }

      const output_value = runner({ ...stage.call_args }, { runtime, stage });
      const output_symbol = writeSymbolValue(catalog, runtime, stage.output_symbol, stage.output_group, output_value);

      stage_results.push({
        stage_index: stage.stage_index,
        operation_id: stage.operation_id,
        function_id,
        output_symbol,
        output_group: stage.output_group,
        output_value
      });
    });

    return stage_results;
  }

  function create_unified_wrapper(rawSpec = {}, rawFunctionRegistry = {}) {
    const catalog = create_unified_wrapper_catalog(rawSpec);
    const function_registry = {
      ...create_default_function_registry(),
      ...(isPlainObject(rawFunctionRegistry) ? rawFunctionRegistry : {})
    };

    function run_two_pass(rawPipeline = [], rawInput = {}) {
      const runtime = initializeRuntimeBanks(catalog, rawInput);
      const pass_identify = identify_arguments(catalog, runtime, rawPipeline);
      runtime.meta.pass_results.push({
        pass_id: "pass_identify",
        ok: pass_identify.ok,
        missing_count: pass_identify.missing.length
      });

      if (!pass_identify.ok) {
        return {
          ok: false,
          error: "missing_input_arguments",
          pass_identify,
          runtime
        };
      }

      const stage_results = execute_pipeline(catalog, runtime, function_registry, pass_identify.stage_plan);
      runtime.meta.pass_results.push({
        pass_id: "pass_execute",
        ok: true,
        stage_count: stage_results.length,
        finished_at: nowIso()
      });

      const final_result = stage_results[stage_results.length - 1] || null;
      return {
        ok: true,
        pass_identify,
        pass_execute: {
          stage_count: stage_results.length,
          stage_results
        },
        final_output: final_result ? final_result.output_value : null,
        final_symbol: final_result ? final_result.output_symbol : "",
        runtime
      };
    }

    function run_pipeline_by_id(pipeline_id, rawInput = {}) {
      const key = resolveCanonicalSymbol(catalog, pipeline_id);
      const operation_ids = catalog.pipeline_index[key] || [];
      const pipeline = build_pipeline_from_operation_ids(catalog, operation_ids);
      return run_two_pass(pipeline, rawInput);
    }

    function run_auto_pipeline(rawFunctionSequence = [], rawInput = {}) {
      const pipeline = build_pipeline_from_function_specs(catalog, rawFunctionSequence);
      return run_two_pass(pipeline, rawInput);
    }

    return {
      catalog,
      function_registry,
      resolve_canonical_symbol: (value) => resolveCanonicalSymbol(catalog, value),
      build_pipeline_from_operation_ids: (operation_ids) => build_pipeline_from_operation_ids(catalog, operation_ids),
      build_pipeline_from_function_specs: (functionSequence) => build_pipeline_from_function_specs(catalog, functionSequence),
      auto_build_pipeline: (functionSequence) => build_pipeline_from_function_specs(catalog, functionSequence),
      identify_arguments: (pipeline, input) => identify_arguments(catalog, initializeRuntimeBanks(catalog, input), pipeline),
      run_two_pass,
      run_pipeline_by_id,
      run_auto_pipeline
    };
  }

  return {
    PATTERN_UNIFIED_WRAPPER_SPEC_DEFAULTS,
    create_unified_wrapper_catalog,
    create_default_function_registry,
    build_pipeline_from_operation_ids,
    build_pipeline_from_function_specs,
    create_unified_wrapper
  };
});
