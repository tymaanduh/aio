(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Math_Io_Assembly_Line = __MODULE_API;
  root.DictionaryMathIoAssemblyLine = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const PATTERN_NODE_CATALOG_PATH = "../../data/input/shared/math/io_assembly_line_math.json";

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

  function toUniqueTextList(values, maxLength = 120, maxItems = 200) {
    const source = toArray(values);
    const dedup = [];
    const seen = new Set();
    for (let index = 0; index < source.length; index += 1) {
      const value = normalizeText(source[index], "", maxLength);
      if (!value || seen.has(value)) {
        continue;
      }
      seen.add(value);
      dedup.push(value);
      if (dedup.length >= maxItems) {
        break;
      }
    }
    return dedup;
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

  function loadRuntimeCatalogSpec() {
    const host = typeof globalThis !== "undefined" ? globalThis : {};
    const runtimeCatalog = host.Dictionary_Math_Io_Assembly_Line_Catalog;
    return isPlainObject(runtimeCatalog) ? runtimeCatalog : {};
  }

  function loadNodeCatalogSpec() {
    const nodeEnabled = typeof module === "object" && module && module.exports && typeof require === "function";
    if (!nodeEnabled) {
      return {};
    }
    try {
      const catalog = require(PATTERN_NODE_CATALOG_PATH);
      return isPlainObject(catalog) ? catalog : {};
    } catch (_error) {
      return {};
    }
  }

  function loadDefaultCatalogSpec() {
    const runtimeCatalog = loadRuntimeCatalogSpec();
    if (Object.keys(runtimeCatalog).length > 0) {
      return runtimeCatalog;
    }
    return loadNodeCatalogSpec();
  }

  const PATTERN_MATH_IO_DATABASE_DEFAULTS = Object.freeze(loadDefaultCatalogSpec());
  const PATTERN_MATH_RUNTIME_DEFAULTS = Object.freeze(
    isPlainObject(PATTERN_MATH_IO_DATABASE_DEFAULTS.runtime_defaults)
      ? PATTERN_MATH_IO_DATABASE_DEFAULTS.runtime_defaults
      : {}
  );
  const PATTERN_MATH_GROUP_INDEX = Object.freeze(
    isPlainObject(PATTERN_MATH_IO_DATABASE_DEFAULTS.group_index) ? PATTERN_MATH_IO_DATABASE_DEFAULTS.group_index : {}
  );
  const PATTERN_MATH_LABEL_INDEX = Object.freeze(
    isPlainObject(PATTERN_MATH_IO_DATABASE_DEFAULTS.label_index) ? PATTERN_MATH_IO_DATABASE_DEFAULTS.label_index : {}
  );
  const PATTERN_MATH_ALIAS_INDEX = Object.freeze(
    isPlainObject(PATTERN_MATH_IO_DATABASE_DEFAULTS.alias_index) ? PATTERN_MATH_IO_DATABASE_DEFAULTS.alias_index : {}
  );
  const PATTERN_MATH_INSTRUCTION_TEMPLATE_INDEX = Object.freeze(
    isPlainObject(PATTERN_MATH_IO_DATABASE_DEFAULTS.instruction_templates)
      ? PATTERN_MATH_IO_DATABASE_DEFAULTS.instruction_templates
      : {}
  );
  const PATTERN_MATH_OPERATION_INDEX = Object.freeze(
    isPlainObject(PATTERN_MATH_IO_DATABASE_DEFAULTS.operation_index) ? PATTERN_MATH_IO_DATABASE_DEFAULTS.operation_index : {}
  );

  function normalizeRuntimeDefaults(rawRuntimeDefaults = {}) {
    const source = isPlainObject(rawRuntimeDefaults) ? rawRuntimeDefaults : {};
    return {
      input_group_id: normalizeText(source.input_group_id, "io_input", 120),
      work_group_id: normalizeText(source.work_group_id, "io_work", 120),
      output_symbol: normalizeText(source.output_symbol, "result", 120),
      stage_name_prefix: normalizeText(source.stage_name_prefix, "stage", 80)
    };
  }

  function normalizeAliasIndex(rawAliasIndex) {
    const source = isPlainObject(rawAliasIndex) ? rawAliasIndex : {};
    const normalized = {};
    Object.entries(source).forEach(([rawCanonical, rawAliases]) => {
      const canonical = normalizeText(rawCanonical, "", 120);
      if (!canonical) {
        return;
      }
      normalized[canonical] = toUniqueTextList([canonical, ...toArray(rawAliases)], 120, 300);
    });
    return normalized;
  }

  function buildAliasLookup(aliasIndex) {
    const lookup = {};
    Object.entries(aliasIndex).forEach(([canonical, aliases]) => {
      toUniqueTextList([canonical, ...toArray(aliases)], 120, 300).forEach((alias) => {
        lookup[alias] = canonical;
      });
    });
    return lookup;
  }

  function normalizeGroupIndex(rawGroupIndex) {
    const source = isPlainObject(rawGroupIndex) ? rawGroupIndex : {};
    const normalized = {};
    Object.entries(source).forEach(([rawKey, rawGroup]) => {
      const group = isPlainObject(rawGroup) ? rawGroup : {};
      const key = normalizeText(group.group_id || rawKey, "", 120);
      if (!key) {
        return;
      }
      normalized[key] = {
        group_id: key,
        label: String(group.label || key),
        aliases: toUniqueTextList([key, ...toArray(group.aliases)], 120, 100)
      };
    });
    return normalized;
  }

  function normalizeLabelIndex(rawLabelIndex) {
    const source = isPlainObject(rawLabelIndex) ? rawLabelIndex : {};
    const normalized = {};
    Object.entries(source).forEach(([rawKey, rawLabel]) => {
      const label = isPlainObject(rawLabel) ? rawLabel : {};
      const key = normalizeText(label.label_id || rawKey, "", 120);
      if (!key) {
        return;
      }
      normalized[key] = {
        label_id: key,
        text: String(label.text || key),
        aliases: toUniqueTextList([key, ...toArray(label.aliases)], 120, 160)
      };
    });
    return normalized;
  }

  function normalizeInstructionSet(rawInstructionSet) {
    return toArray(rawInstructionSet)
      .map((rawInstruction) => {
        const instruction = isPlainObject(rawInstruction) ? rawInstruction : {};
        return {
          action_id: normalizeText(instruction.action_id, "", 120),
          source_symbol: normalizeText(instruction.source_symbol, "", 120),
          left_symbol: normalizeText(instruction.left_symbol, "", 120),
          right_symbol: normalizeText(instruction.right_symbol, "", 120),
          target_symbol: normalizeText(instruction.target_symbol, "", 120)
        };
      })
      .filter((instruction) => instruction.action_id);
  }

  function normalizeInstructionTemplateIndex(rawInstructionTemplateIndex) {
    const source = isPlainObject(rawInstructionTemplateIndex) ? rawInstructionTemplateIndex : {};
    const normalized = {};
    Object.entries(source).forEach(([rawTemplateId, rawInstructionSet]) => {
      const templateId = normalizeText(rawTemplateId, "", 120);
      if (!templateId) {
        return;
      }
      normalized[templateId] = normalizeInstructionSet(rawInstructionSet);
    });
    return normalized;
  }

  function resolveInstructionSet(instructionTemplateIndex, templateRefs, instructionSet) {
    const resolved = [];
    toUniqueTextList(templateRefs, 120, 80).forEach((templateId) => {
      resolved.push(...toArray(instructionTemplateIndex[templateId]));
    });
    resolved.push(...normalizeInstructionSet(instructionSet));
    return normalizeInstructionSet(resolved);
  }

  function normalizeOperationIndex(rawOperationIndex, instructionTemplateIndex, runtimeDefaults) {
    const source = isPlainObject(rawOperationIndex) ? rawOperationIndex : {};
    const normalized = {};
    Object.entries(source).forEach(([rawKey, rawOperation]) => {
      const operation = isPlainObject(rawOperation) ? rawOperation : {};
      const operationId = normalizeText(operation.operation_id || rawKey, "", 120);
      if (!operationId) {
        return;
      }
      const instructionTemplateRefs = toUniqueTextList(operation.instruction_template_refs, 120, 40);
      const instructionSet = resolveInstructionSet(
        instructionTemplateIndex,
        instructionTemplateRefs,
        operation.instruction_set
      );
      normalized[operationId] = {
        operation_id: operationId,
        operation_label: String(operation.operation_label || operationId),
        input_symbols: toUniqueTextList(operation.input_symbols, 120, 20),
        output_symbol: normalizeText(operation.output_symbol, runtimeDefaults.output_symbol, 120),
        result_symbol: normalizeText(operation.result_symbol, runtimeDefaults.output_symbol, 120),
        instruction_template_refs: instructionTemplateRefs,
        instruction_set: instructionSet
      };
    });
    return normalized;
  }

  function create_math_io_database(spec = {}) {
    const source = isPlainObject(spec) ? spec : {};
    const defaults = PATTERN_MATH_IO_DATABASE_DEFAULTS;

    const runtime_defaults = normalizeRuntimeDefaults({
      ...(isPlainObject(defaults.runtime_defaults) ? defaults.runtime_defaults : {}),
      ...(isPlainObject(source.runtime_defaults) ? source.runtime_defaults : {})
    });
    const group_index = normalizeGroupIndex({
      ...PATTERN_MATH_GROUP_INDEX,
      ...(isPlainObject(source.group_index) ? source.group_index : {})
    });
    const label_index = normalizeLabelIndex({
      ...PATTERN_MATH_LABEL_INDEX,
      ...(isPlainObject(source.label_index) ? source.label_index : {})
    });
    const alias_index = normalizeAliasIndex({
      ...PATTERN_MATH_ALIAS_INDEX,
      ...(isPlainObject(source.alias_index) ? source.alias_index : {})
    });
    const instruction_template_index = normalizeInstructionTemplateIndex({
      ...PATTERN_MATH_INSTRUCTION_TEMPLATE_INDEX,
      ...(isPlainObject(source.instruction_templates) ? source.instruction_templates : {})
    });
    const operation_index = normalizeOperationIndex(
      {
        ...PATTERN_MATH_OPERATION_INDEX,
        ...(isPlainObject(source.operation_index) ? source.operation_index : {})
      },
      instruction_template_index,
      runtime_defaults
    );

    return {
      version: Number(source.version) || Number(defaults.version) || 1,
      runtime_defaults,
      group_index,
      label_index,
      alias_index,
      alias_lookup: buildAliasLookup(alias_index),
      instruction_template_index,
      operation_index,
      slot_store: isPlainObject(source.slot_store) ? { ...source.slot_store } : {},
      updated_at: nowIso()
    };
  }

  function resolveSymbolFromAlias(database, value) {
    const token = normalizeText(value, "", 120);
    if (!token) {
      return "";
    }
    return database.alias_lookup[token] || token;
  }

  function readRuntimeSymbol(runtime, symbol) {
    const key = normalizeText(symbol, "", 120);
    return runtime.value_index[key];
  }

  function writeRuntimeSymbol(runtime, symbol, value) {
    const key = normalizeText(symbol, "", 120);
    if (!key) {
      return "";
    }
    runtime.value_index[key] = value;
    return key;
  }

  const actionRunnerIndex = Object.freeze({
    read_symbol(runtime, instruction) {
      const sourceSymbol = normalizeText(instruction.source_symbol, "", 120);
      const targetSymbol = normalizeText(instruction.target_symbol, sourceSymbol, 120);
      return writeRuntimeSymbol(runtime, targetSymbol, readRuntimeSymbol(runtime, sourceSymbol));
    },
    assign_symbol(runtime, instruction) {
      const sourceSymbol = normalizeText(instruction.source_symbol, "", 120);
      const targetSymbol = normalizeText(instruction.target_symbol, sourceSymbol, 120);
      return writeRuntimeSymbol(runtime, targetSymbol, readRuntimeSymbol(runtime, sourceSymbol));
    },
    to_number(runtime, instruction) {
      const sourceSymbol = normalizeText(instruction.source_symbol, "", 120);
      const targetSymbol = normalizeText(instruction.target_symbol, sourceSymbol, 120);
      return writeRuntimeSymbol(runtime, targetSymbol, toFiniteNumber(readRuntimeSymbol(runtime, sourceSymbol), 0));
    },
    math_add(runtime, instruction) {
      const left = toFiniteNumber(readRuntimeSymbol(runtime, instruction.left_symbol), 0);
      const right = toFiniteNumber(readRuntimeSymbol(runtime, instruction.right_symbol), 0);
      return writeRuntimeSymbol(runtime, instruction.target_symbol, left + right);
    },
    math_subtract(runtime, instruction) {
      const left = toFiniteNumber(readRuntimeSymbol(runtime, instruction.left_symbol), 0);
      const right = toFiniteNumber(readRuntimeSymbol(runtime, instruction.right_symbol), 0);
      return writeRuntimeSymbol(runtime, instruction.target_symbol, left - right);
    },
    math_multiply(runtime, instruction) {
      const left = toFiniteNumber(readRuntimeSymbol(runtime, instruction.left_symbol), 0);
      const right = toFiniteNumber(readRuntimeSymbol(runtime, instruction.right_symbol), 0);
      return writeRuntimeSymbol(runtime, instruction.target_symbol, left * right);
    },
    math_divide(runtime, instruction) {
      const left = toFiniteNumber(readRuntimeSymbol(runtime, instruction.left_symbol), 0);
      const right = toFiniteNumber(readRuntimeSymbol(runtime, instruction.right_symbol), 0);
      return writeRuntimeSymbol(runtime, instruction.target_symbol, toFiniteNumber(left / right, 0));
    },
    math_equal(runtime, instruction) {
      const left = toFiniteNumber(readRuntimeSymbol(runtime, instruction.left_symbol), 0);
      const right = toFiniteNumber(readRuntimeSymbol(runtime, instruction.right_symbol), 0);
      return writeRuntimeSymbol(runtime, instruction.target_symbol, left === right ? 1 : 0);
    }
  });

  function create_math_io_handler(rawDatabase) {
    const database = isPlainObject(rawDatabase) ? rawDatabase : create_math_io_database();

    function resolveStageSlotToken(stageInputSlots, canonicalSymbol) {
      if (Object.prototype.hasOwnProperty.call(stageInputSlots, canonicalSymbol)) {
        return stageInputSlots[canonicalSymbol];
      }
      return canonicalSymbol;
    }

    function load_data(rawPayload = {}, options = {}) {
      const payload = isPlainObject(rawPayload) ? rawPayload : {};
      const group_id = normalizeText(options.group_id, database.runtime_defaults.input_group_id, 120);
      const label_id = normalizeText(options.label_id, "", 120);
      const loaded_slots = [];
      Object.entries(payload).forEach(([rawSlot, rawValue]) => {
        const slot_key = normalizeText(rawSlot, "", 120);
        if (!slot_key) {
          return;
        }
        const canonical = resolveSymbolFromAlias(database, slot_key);
        database.slot_store[slot_key] = {
          slot_key,
          canonical_symbol: canonical,
          value: rawValue,
          group_id,
          label_id: label_id || canonical,
          loaded_at: nowIso()
        };
        loaded_slots.push(slot_key);
      });
      database.updated_at = nowIso();
      return loaded_slots;
    }

    function unload_data(rawSlotKeys = []) {
      const slot_keys = toUniqueTextList(rawSlotKeys, 120, 500);
      const removed_slots = [];
      slot_keys.forEach((slot_key) => {
        if (!Object.prototype.hasOwnProperty.call(database.slot_store, slot_key)) {
          return;
        }
        delete database.slot_store[slot_key];
        removed_slots.push(slot_key);
      });
      database.updated_at = nowIso();
      return removed_slots;
    }

    function get_slot_value(slotToken) {
      if (isPlainObject(slotToken) && Object.prototype.hasOwnProperty.call(slotToken, "literal")) {
        return slotToken.literal;
      }
      if (typeof slotToken === "number") {
        return slotToken;
      }
      const slot_key = normalizeText(String(slotToken || ""), "", 120);
      if (!slot_key) {
        return undefined;
      }
      if (Object.prototype.hasOwnProperty.call(database.slot_store, slot_key)) {
        return database.slot_store[slot_key].value;
      }
      const canonical = resolveSymbolFromAlias(database, slot_key);
      const matching_slot = Object.values(database.slot_store).find((slot) => slot.canonical_symbol === canonical);
      return matching_slot ? matching_slot.value : undefined;
    }

    function resolve_operation(operation_id) {
      const key = normalizeText(operation_id, "", 120);
      if (!key) {
        return null;
      }
      return database.operation_index[key] || null;
    }

    function identify_needed_data(stage_spec = {}) {
      const spec = isPlainObject(stage_spec) ? stage_spec : {};
      const operation = resolve_operation(spec.operation_id);
      if (!operation) {
        return {
          ok: false,
          error: "unknown operation"
        };
      }
      const stage_input_slots = isPlainObject(spec.input_slots) ? spec.input_slots : {};
      const needed_symbols = operation.input_symbols.map((symbol) => resolveSymbolFromAlias(database, symbol));
      const needed_slots = needed_symbols.map((symbol) => resolveStageSlotToken(stage_input_slots, symbol));
      return {
        ok: true,
        operation_id: operation.operation_id,
        needed_symbols,
        needed_slots
      };
    }

    function createStageRuntime(stage_spec, stage_index, operation) {
      const spec = isPlainObject(stage_spec) ? stage_spec : {};
      const stage_input_slots = isPlainObject(spec.input_slots) ? spec.input_slots : {};
      const value_index = {};
      operation.input_symbols.forEach((symbol) => {
        const canonical = resolveSymbolFromAlias(database, symbol);
        const stageToken = resolveStageSlotToken(stage_input_slots, canonical);
        const value = get_slot_value(stageToken);
        if (value === undefined) {
          throw new Error(`stage ${stage_index + 1}: missing value for symbol "${canonical}"`);
        }
        value_index[canonical] = value;
      });
      return {
        value_index
      };
    }

    function runInstructionSet(runtime, instructionSet) {
      toArray(instructionSet).forEach((instruction) => {
        const action_id = normalizeText(instruction.action_id, "", 120);
        const action_runner = actionRunnerIndex[action_id];
        if (typeof action_runner !== "function") {
          throw new Error(`unknown action_id: ${String(action_id || "")}`);
        }
        action_runner(runtime, instruction);
      });
    }

    function execute_stage(stage_spec = {}, stage_index = 0) {
      const spec = isPlainObject(stage_spec) ? stage_spec : {};
      const operation = resolve_operation(spec.operation_id);
      if (!operation) {
        throw new Error(`unknown operation: ${String(spec.operation_id || "")}`);
      }
      const runtime = createStageRuntime(spec, stage_index, operation);
      runInstructionSet(runtime, operation.instruction_set);

      const result_symbol = normalizeText(operation.result_symbol, database.runtime_defaults.output_symbol, 120);
      const output_value = runtime.value_index[result_symbol];
      if (output_value === undefined) {
        throw new Error(`stage ${stage_index + 1}: missing result symbol "${result_symbol}"`);
      }
      const output_slot =
        normalizeText(spec.output_slot, "", 120) ||
        normalizeText(spec.output_alias, "", 120) ||
        normalizeText(operation.output_symbol, database.runtime_defaults.output_symbol, 120);
      const output_group = normalizeText(spec.output_group, database.runtime_defaults.work_group_id, 120);
      load_data({ [output_slot]: output_value }, { group_id: output_group, label_id: output_slot });

      return {
        stage_index,
        stage_name: normalizeText(
          spec.stage_name,
          `${database.runtime_defaults.stage_name_prefix}_${stage_index + 1}`,
          120
        ),
        operation_id: operation.operation_id,
        output_slot,
        output_value,
        input_args: { ...runtime.value_index }
      };
    }

    function run_assembly_line(rawStages = [], seed_payload = {}) {
      const stages = Array.isArray(rawStages) ? rawStages : [];
      if (isPlainObject(seed_payload) && Object.keys(seed_payload).length > 0) {
        load_data(seed_payload, { group_id: database.runtime_defaults.input_group_id });
      }
      const stage_results = stages.map((stage_spec, index) => execute_stage(stage_spec, index));
      const last_stage = stage_results[stage_results.length - 1] || null;
      return {
        ok: true,
        stage_count: stage_results.length,
        stage_results,
        final_output: last_stage ? last_stage.output_value : null,
        final_output_slot: last_stage ? last_stage.output_slot : ""
      };
    }

    function get_database_snapshot() {
      return {
        version: database.version,
        runtime_defaults: database.runtime_defaults,
        group_index: database.group_index,
        label_index: database.label_index,
        alias_index: database.alias_index,
        instruction_template_index: database.instruction_template_index,
        operation_index: Object.fromEntries(
          Object.entries(database.operation_index).map(([key, operation]) => [
            key,
            {
              operation_id: operation.operation_id,
              operation_label: operation.operation_label,
              input_symbols: operation.input_symbols,
              output_symbol: operation.output_symbol,
              result_symbol: operation.result_symbol,
              instruction_template_refs: operation.instruction_template_refs,
              instruction_set: operation.instruction_set
            }
          ])
        ),
        slot_store: { ...database.slot_store },
        updated_at: database.updated_at
      };
    }

    return {
      database,
      load_data,
      unload_data,
      get_slot_value,
      identify_needed_data,
      resolve_canonical_symbol: (value) => resolveSymbolFromAlias(database, value),
      execute_stage,
      run_assembly_line,
      get_database_snapshot
    };
  }

  return {
    PATTERN_MATH_IO_DATABASE_DEFAULTS,
    PATTERN_MATH_RUNTIME_DEFAULTS,
    PATTERN_MATH_GROUP_INDEX,
    PATTERN_MATH_LABEL_INDEX,
    PATTERN_MATH_ALIAS_INDEX,
    PATTERN_MATH_INSTRUCTION_TEMPLATE_INDEX,
    PATTERN_MATH_OPERATION_INDEX,
    create_math_io_database,
    create_math_io_handler
  };
});
