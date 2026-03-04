/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Dispatch_Domain = __MODULE_API;
  root.DictionaryRendererDispatchDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function freeze_list(values) {
    return Object.freeze(Array.isArray(values) ? values.slice() : []);
  }

  function create_domain_dispatch_by_module(moduleKey, functionNames, callByModule) {
    const names = freeze_list(functionNames);
    const dispatch = {};
    names.forEach((functionName) => {
      dispatch[functionName] = (...args) => callByModule(moduleKey, functionName, args);
    });
    return Object.freeze(dispatch);
  }

  function create_domain_dispatch_by_function(moduleKey, functionMap, callByFunction) {
    const dispatch = {};
    const entries = Object.entries(functionMap || {});
    entries.forEach(([aliasName, functionName]) => {
      dispatch[aliasName] = (...args) => callByFunction(moduleKey, functionName, args);
    });
    return Object.freeze(dispatch);
  }

  function createRendererDispatch({
    moduleKeyMap = {},
    dispatchSpecMap = {},
    functionDispatchSpec = {},
    callByModule = () => undefined,
    callByFunction = () => undefined
  } = {}) {
    const moduleDispatch = {};
    Object.entries(dispatchSpecMap || {}).forEach(([moduleAlias, functionNames]) => {
      moduleDispatch[moduleAlias] = create_domain_dispatch_by_module(
        moduleKeyMap[moduleAlias],
        functionNames,
        callByModule
      );
    });

    Object.entries(functionDispatchSpec || {}).forEach(([moduleAlias, spec]) => {
      if (!spec || typeof spec !== "object" || spec.kind !== "by_function") {
        return;
      }
      moduleDispatch[moduleAlias] = create_domain_dispatch_by_function(
        moduleKeyMap[moduleAlias],
        spec.map,
        callByFunction
      );
    });

    return Object.freeze(moduleDispatch);
  }

  return {
    createRendererDispatch,
    create_domain_dispatch_by_module,
    create_domain_dispatch_by_function
  };
});
