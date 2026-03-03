(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  root.DictionaryAutosaveUtils = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createDebouncedTask(delayMs, handler) {
    let timerId = null;

    const clear = () => {
      if (timerId === null) {
        return;
      }
      clearTimeout(timerId);
      timerId = null;
    };

    const run = () => {
      timerId = null;
      if (typeof handler === "function") {
        handler();
      }
    };

    const schedule = (overrideDelayMs) => {
      clear();
      const delay = Number.isFinite(overrideDelayMs) ? Math.max(0, overrideDelayMs) : delayMs;
      timerId = setTimeout(run, delay);
    };

    const flush = () => {
      if (timerId === null) {
        return;
      }
      clear();
      run();
    };

    const isScheduled = () => timerId !== null;

    return {
      clear,
      schedule,
      flush,
      isScheduled
    };
  }

  return {
    createDebouncedTask
  };
});
