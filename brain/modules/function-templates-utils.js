(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Function_Templates_Utils = __MODULE_API;
  root.DictionaryFunctionTemplatesUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function typeOfValue(value) {
    if (value === null) {
      return "null";
    }
    if (Array.isArray(value)) {
      return "array";
    }
    if (value instanceof Map) {
      return "map";
    }
    if (value instanceof Set) {
      return "set";
    }
    if (value instanceof Uint8Array) {
      return "uint8array";
    }
    if (value instanceof Float32Array) {
      return "float32array";
    }
    return typeof value;
  }

  function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function cloneValue(value) {
    if (Array.isArray(value)) {
      return value.slice();
    }
    if (value instanceof Map) {
      return new Map(value);
    }
    if (value instanceof Set) {
      return new Set(value);
    }
    if (isPlainObject(value)) {
      return { ...value };
    }
    return value;
  }

  function normalizeText(value, fallback = "", maxLength = 120) {
    if (typeof value !== "string") {
      return fallback;
    }
    const cleaned = value.trim().slice(0, maxLength);
    return cleaned || fallback;
  }

  function isTypeMatch(value, expected) {
    if (expected === "any") {
      return true;
    }
    if (typeof expected === "function") {
      return Boolean(expected(value));
    }
    if (Array.isArray(expected)) {
      return expected.some((entry) => isTypeMatch(value, entry));
    }
    const type = normalizeText(String(expected || "any"), "any", 60).toLowerCase();
    if (type === "integer") {
      return Number.isInteger(value);
    }
    if (type === "number") {
      return Number.isFinite(value);
    }
    if (type === "array") {
      return Array.isArray(value);
    }
    if (type === "object") {
      return isPlainObject(value);
    }
    return typeOfValue(value) === type;
  }

  function normalizeArgSpec(rawArg, index = 0) {
    const source = isPlainObject(rawArg) ? rawArg : {};
    const hasDefault = Object.prototype.hasOwnProperty.call(source, "defaultValue");
    return {
      name: normalizeText(source.name, `arg${index + 1}`, 100),
      type: source.type === null || source.type === undefined ? "any" : source.type,
      required: source.required !== false && !hasDefault,
      hasDefault,
      defaultValue: source.defaultValue
    };
  }

  function normalizeArgs(spec) {
    const source = Array.isArray(spec) ? spec : [];
    return source.map((entry, index) => normalizeArgSpec(entry, index));
  }

  function normalizeReturnSpec(rawReturn) {
    const source = isPlainObject(rawReturn) ? rawReturn : {};
    return {
      type: source.type === null || source.type === undefined ? "any" : source.type,
      label: normalizeText(source.label, "result", 100)
    };
  }

  function materializeInputs(args, input, templateName) {
    const source = isPlainObject(input) ? input : {};
    const output = {};
    args.forEach((arg) => {
      const hasValue = Object.prototype.hasOwnProperty.call(source, arg.name);
      if (!hasValue && arg.hasDefault) {
        output[arg.name] = cloneValue(arg.defaultValue);
        return;
      }
      if (!hasValue && arg.required) {
        throw new Error(`${templateName}: missing required input "${arg.name}"`);
      }
      const value = hasValue ? source[arg.name] : undefined;
      if (value === undefined && !arg.required) {
        output[arg.name] = value;
        return;
      }
      if (!isTypeMatch(value, arg.type)) {
        throw new Error(
          `${templateName}: invalid input "${arg.name}" type, expected ${String(arg.type)} got ${typeOfValue(value)}`
        );
      }
      output[arg.name] = value;
    });
    return output;
  }

  function assertReturnType(returnSpec, value, templateName) {
    if (!isTypeMatch(value, returnSpec.type)) {
      throw new Error(
        `${templateName}: invalid return type for ${returnSpec.label}, expected ${String(returnSpec.type)} got ${typeOfValue(value)}`
      );
    }
  }

  function createTemplateFunction(meta, run) {
    const fn = function templateExecutor(input = {}, context = {}) {
      return run(input, context);
    };
    fn.meta = meta;
    fn.describe = () => meta;
    fn.run = fn;
    return fn;
  }

  function createIoTemplate(spec = {}) {
    const name = normalizeText(spec.name, "ioTemplate", 120);
    const args = normalizeArgs(spec.inputs || spec.args);
    const returnSpec = normalizeReturnSpec(spec.returns);
    const logic = typeof spec.logic === "function" ? spec.logic : (payload) => payload;

    const meta = {
      kind: "io",
      name,
      args,
      returns: returnSpec
    };

    return createTemplateFunction(meta, (input, context) => {
      const payload = materializeInputs(args, input, name);
      const result = logic(payload, context, meta);
      assertReturnType(returnSpec, result, name);
      return result;
    });
  }

  function normalizeStep(rawStep, index = 0) {
    if (typeof rawStep === "function") {
      return {
        name: `step${index + 1}`,
        when: null,
        run: rawStep
      };
    }
    const source = isPlainObject(rawStep) ? rawStep : {};
    return {
      name: normalizeText(source.name, `step${index + 1}`, 120),
      when: typeof source.when === "function" ? source.when : null,
      run: typeof source.run === "function" ? source.run : () => source.value
    };
  }

  function createControlTemplate(spec = {}) {
    const name = normalizeText(spec.name, "controlTemplate", 120);
    const mode = normalizeText(spec.mode, "pipeline", 30).toLowerCase() === "fanout" ? "fanout" : "pipeline";
    const args = normalizeArgs(spec.inputs || spec.args);
    const returnSpec = normalizeReturnSpec(spec.returns);
    const steps = (Array.isArray(spec.steps) ? spec.steps : []).map((step, index) => normalizeStep(step, index));
    const initial = typeof spec.initial === "function" ? spec.initial : (payload) => payload;
    const logic = typeof spec.logic === "function" ? spec.logic : null;

    const meta = {
      kind: "control",
      name,
      mode,
      args,
      returns: returnSpec,
      steps: steps.map((step) => step.name)
    };

    return createTemplateFunction(meta, (input, context) => {
      const payload = materializeInputs(args, input, name);
      const trace = [];
      let current = initial(payload, context, meta);

      if (mode === "fanout") {
        const output = {};
        steps.forEach((step, index) => {
          const canRun = !step.when || step.when({ input: payload, value: current, output, index, context, trace });
          if (!canRun) {
            return;
          }
          const value = step.run({ input: payload, value: current, output, index, context, trace, step: step.name });
          output[step.name] = value;
          trace.push(step.name);
        });
        const result = logic ? logic({ input: payload, value: current, output, trace, context, meta }) : output;
        assertReturnType(returnSpec, result, name);
        return result;
      }

      steps.forEach((step, index) => {
        const canRun = !step.when || step.when({ input: payload, value: current, index, context, trace });
        if (!canRun) {
          return;
        }
        current = step.run({ input: payload, value: current, index, context, trace, step: step.name });
        trace.push(step.name);
      });

      const result = logic ? logic({ input: payload, value: current, trace, context, meta }) : current;
      assertReturnType(returnSpec, result, name);
      return result;
    });
  }

  function createTemplateRegistry() {
    const map = new Map();

    function add(template) {
      const fn = typeof template === "function" ? template : null;
      const name = normalizeText(fn?.meta?.name, "", 120);
      if (!fn || !name) {
        throw new Error("template registry: template with meta.name is required");
      }
      map.set(name, fn);
      return fn;
    }

    function get(name) {
      return map.get(normalizeText(name, "", 120)) || null;
    }

    function has(name) {
      return map.has(normalizeText(name, "", 120));
    }

    function list() {
      return [...map.values()].map((entry) => entry.meta);
    }

    function run(name, input, context) {
      const template = get(name);
      if (!template) {
        throw new Error(`template registry: unknown template "${name}"`);
      }
      return template(input, context);
    }

    return {
      add,
      get,
      has,
      list,
      run
    };
  }

  return {
    createIoTemplate,
    createControlTemplate,
    createTemplateRegistry,
    typeOfValue,
    isTypeMatch
  };
});
