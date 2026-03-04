(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Graph_Utils = __MODULE_API;
  root.DictionaryGraphUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function normalizeWordLower(word) {
    return String(word || "")
      .trim()
      .toLowerCase();
  }

  function buildGraphIndex(nodes, links) {
    const safeNodes = Array.isArray(nodes) ? nodes : [];
    const safeLinks = Array.isArray(links) ? links : [];

    const nodeById = new Map();
    const outgoingIdsByNodeId = new Map();
    const incomingIdsByNodeId = new Map();
    const linkKeySet = new Set();
    const linkedTargetsByWordLower = new Map();
    const linkedEntryIds = new Set();
    const backlinkCountByEntryId = new Map();

    safeNodes.forEach((node) => {
      if (!node || typeof node !== "object") {
        return;
      }
      if (!node.id) {
        return;
      }
      nodeById.set(node.id, node);
      const entryId = String(node.entryId || "").trim();
      if (entryId) {
        linkedEntryIds.add(entryId);
        backlinkCountByEntryId.set(entryId, (backlinkCountByEntryId.get(entryId) || 0) + 1);
      }
    });

    safeLinks.forEach((link) => {
      if (!link || typeof link !== "object") {
        return;
      }
      const fromNode = nodeById.get(link.fromNodeId);
      const toNode = nodeById.get(link.toNodeId);
      if (!fromNode || !toNode) {
        return;
      }

      linkKeySet.add(`${fromNode.id}->${toNode.id}`);

      if (!outgoingIdsByNodeId.has(fromNode.id)) {
        outgoingIdsByNodeId.set(fromNode.id, []);
      }
      outgoingIdsByNodeId.get(fromNode.id).push(toNode.id);

      if (!incomingIdsByNodeId.has(toNode.id)) {
        incomingIdsByNodeId.set(toNode.id, []);
      }
      incomingIdsByNodeId.get(toNode.id).push(fromNode.id);

      const fromWordLower = normalizeWordLower(fromNode.word);
      if (!fromWordLower) {
        return;
      }

      if (!linkedTargetsByWordLower.has(fromWordLower)) {
        linkedTargetsByWordLower.set(fromWordLower, []);
      }
      linkedTargetsByWordLower.get(fromWordLower).push({
        word: toNode.word,
        entryId: toNode.entryId || "",
        reason: "graph"
      });
    });

    return {
      nodeById,
      outgoingIdsByNodeId,
      incomingIdsByNodeId,
      linkKeySet,
      linkedTargetsByWordLower,
      linkedEntryIds,
      backlinkCountByEntryId
    };
  }

  return {
    buildGraphIndex,
    normalizeWordLower
  };
});
