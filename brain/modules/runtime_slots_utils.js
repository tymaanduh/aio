(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Runtime_Slots_Utils = __MODULE_API;
  root.DictionaryRuntimeSlotsUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function cloneSlotValue(value) {
    if (Array.isArray(value)) {
      return value.slice();
    }
    if (value instanceof Map) {
      return new Map(value);
    }
    if (value instanceof Set) {
      return new Set(value);
    }
    if (value && typeof value === "object") {
      return { ...value };
    }
    return value;
  }

  function createRuntimeSlots(spec = {}) {
    const source = spec && typeof spec === "object" ? spec : {};
    const slots = {};
    Object.keys(source).forEach((key) => {
      const seed = source[key];
      const value = typeof seed === "function" ? seed() : seed;
      slots[key] = cloneSlotValue(value);
    });
    return slots;
  }

  return {
    createRuntimeSlots
  };
});
