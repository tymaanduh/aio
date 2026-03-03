(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  root.DictionaryStore = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createStateStore(state, hooks = {}) {
    const activeHooks = {
      onEntriesMutation: hooks.onEntriesMutation,
      onGraphMutation: hooks.onGraphMutation,
      onAnyMutation: hooks.onAnyMutation
    };

    const callHook = (name) => {
      const hook = activeHooks[name];
      if (typeof hook === "function") {
        hook(state);
      }
    };

    const notifyMutated = (flags) => {
      if (flags.entries || flags.labels) {
        callHook("onEntriesMutation");
      }
      if (flags.graph) {
        callHook("onGraphMutation");
      }
      callHook("onAnyMutation");
    };

    const updateState = (mutator, flags = {}) => {
      if (typeof mutator === "function") {
        mutator(state);
      }
      notifyMutated(flags);
      return state;
    };

    const setHooks = (nextHooks = {}) => {
      if (Object.prototype.hasOwnProperty.call(nextHooks, "onEntriesMutation")) {
        activeHooks.onEntriesMutation = nextHooks.onEntriesMutation;
      }
      if (Object.prototype.hasOwnProperty.call(nextHooks, "onGraphMutation")) {
        activeHooks.onGraphMutation = nextHooks.onGraphMutation;
      }
      if (Object.prototype.hasOwnProperty.call(nextHooks, "onAnyMutation")) {
        activeHooks.onAnyMutation = nextHooks.onAnyMutation;
      }
    };

    const mutateEntries = (updater) => {
      if (typeof updater !== "function") {
        return state.entries;
      }
      const next = updater([...state.entries]);
      if (Array.isArray(next)) {
        state.entries = next;
      }
      notifyMutated({ entries: true });
      return state.entries;
    };

    const setEntries = (entries) => {
      state.entries = Array.isArray(entries) ? entries : [];
      notifyMutated({ entries: true });
      return state.entries;
    };

    const addEntry = (entry) => {
      state.entries.push(entry);
      notifyMutated({ entries: true });
      return entry;
    };

    const updateEntryById = (entryId, updater) => {
      if (!entryId || typeof updater !== "function") {
        return false;
      }
      let changed = false;
      state.entries = state.entries.map((entry) => {
        if (entry.id !== entryId) {
          return entry;
        }
        changed = true;
        return updater(entry);
      });
      if (changed) {
        notifyMutated({ entries: true });
      }
      return changed;
    };

    const removeEntryById = (entryId) => {
      if (!entryId) {
        return false;
      }
      const before = state.entries.length;
      state.entries = state.entries.filter((entry) => entry.id !== entryId);
      const changed = state.entries.length !== before;
      if (changed) {
        notifyMutated({ entries: true });
      }
      return changed;
    };

    const mutateLabels = (updater) => {
      if (typeof updater !== "function") {
        return state.labels;
      }
      const next = updater([...state.labels]);
      if (Array.isArray(next)) {
        state.labels = next;
      }
      notifyMutated({ labels: true });
      return state.labels;
    };

    const setLabels = (labels) => {
      state.labels = Array.isArray(labels) ? labels : [];
      notifyMutated({ labels: true });
      return state.labels;
    };

    const addLabel = (label) => {
      if (!label || state.labels.includes(label)) {
        return false;
      }
      state.labels.push(label);
      notifyMutated({ labels: true });
      return true;
    };

    const removeLabel = (label) => {
      if (!label) {
        return false;
      }
      const before = state.labels.length;
      state.labels = state.labels.filter((item) => item !== label);
      const changed = state.labels.length !== before;
      if (changed) {
        notifyMutated({ labels: true });
      }
      return changed;
    };

    const mutateGraph = (updater) => {
      if (typeof updater !== "function") {
        return state.sentenceGraph;
      }
      const next = updater(state.sentenceGraph);
      if (next && typeof next === "object") {
        state.sentenceGraph = next;
      }
      notifyMutated({ graph: true });
      return state.sentenceGraph;
    };

    const setGraph = (graph) => {
      state.sentenceGraph = graph && typeof graph === "object" ? graph : { nodes: [], links: [] };
      notifyMutated({ graph: true });
      return state.sentenceGraph;
    };

    const addGraphNode = (node) => {
      state.sentenceGraph.nodes.push(node);
      notifyMutated({ graph: true });
      return node;
    };

    const addGraphLink = (link) => {
      state.sentenceGraph.links.push(link);
      notifyMutated({ graph: true });
      return link;
    };

    return {
      state,
      setHooks,
      updateState,
      mutateEntries,
      setEntries,
      addEntry,
      updateEntryById,
      removeEntryById,
      mutateLabels,
      setLabels,
      addLabel,
      removeLabel,
      mutateGraph,
      setGraph,
      addGraphNode,
      addGraphLink
    };
  }

  return {
    createStateStore
  };
});
