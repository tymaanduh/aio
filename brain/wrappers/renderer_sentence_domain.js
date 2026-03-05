/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Sentence_Domain = __MODULE_API;
  root.DictionaryRendererSentenceDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function analyzeGraphQuality() {
    const nodes = G_APP.s.sentenceGraph.nodes;
    const links = G_APP.s.sentenceGraph.links;
    if (nodes.length === 0) {
      return {
        islands: 0,
        cycles: 0,
        orphanedNodes: 0
      };
    }
    const nodeIds = new Set(nodes.map((node) => node.id));
    const outgoing = new Map();
    const incomingCount = new Map();
    nodes.forEach((node) => {
      outgoing.set(node.id, []);
      incomingCount.set(node.id, 0);
    });
    links.forEach((link) => {
      if (!nodeIds.has(link.fromNodeId) || !nodeIds.has(link.toNodeId)) {
        return;
      }
      outgoing.get(link.fromNodeId).push(link.toNodeId);
      incomingCount.set(link.toNodeId, (incomingCount.get(link.toNodeId) || 0) + 1);
    });

    const undirected = new Map();
    nodes.forEach((node) => undirected.set(node.id, new Set()));
    links.forEach((link) => {
      if (!nodeIds.has(link.fromNodeId) || !nodeIds.has(link.toNodeId)) {
        return;
      }
      undirected.get(link.fromNodeId).add(link.toNodeId);
      undirected.get(link.toNodeId).add(link.fromNodeId);
    });
    const visited = new Set();
    let components = 0;
    nodes.forEach((node) => {
      if (visited.has(node.id)) {
        return;
      }
      components += 1;
      const stack = [node.id];
      while (stack.length > 0) {
        const current = stack.pop();
        if (visited.has(current)) {
          continue;
        }
        visited.add(current);
        undirected.get(current).forEach((next) => {
          !visited.has(next) && stack.push(next);
        });
      }
    });

    let cycleCount = 0;
    const perm = new Set();
    const temp = new Set();
    const visit = (nodeId) => {
      if (perm.has(nodeId)) {
        return;
      }
      if (temp.has(nodeId)) {
        cycleCount += 1;
        return;
      }
      temp.add(nodeId);
      (outgoing.get(nodeId) || []).forEach((nextId) => visit(nextId));
      temp.delete(nodeId);
      perm.add(nodeId);
    };
    nodes.forEach((node) => visit(node.id));

    const orphanedNodes = nodes.filter((node) => !node.entryId).length;
    return {
      islands: Math.max(0, components - 1),
      cycles: cycleCount,
      orphanedNodes
    };
  }

  function collectWordSuggestionsForContext(contextNode, posIndex, limit = 12) {
    const suggestions = [];
    const seen = new Set();

    const pushSuggestion = (word, entryId = "", reason = "") => {
      const normalizedWord = cleanText(word, MAX.WORD);
      if (!normalizedWord) {
        return;
      }
      const key = normalizeWordLower(normalizedWord);
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      suggestions.push({
        kind: "word",
        label: normalizedWord,
        reason,
        words: [normalizedWord],
        entryIds: [cleanText(entryId, MAX.WORD)]
      });
    };

    if (!contextNode) {
      return suggestions;
    }

    if (contextNode.id) {
      getOutgoingNodeIds(contextNode.id)
        .map((nodeId) => G_PAGE.sentence.getNode(nodeId))
        .filter(Boolean)
        .forEach((node) => {
          pushSuggestion(node.word, node.entryId, "next");
        });
    }

    collectLinkedTargetsForWord(normalizeWordLower(contextNode.word)).forEach((item) => {
      pushSuggestion(item.word, item.entryId, item.reason);
    });

    const contextEntry = getEntryForGraphNode(contextNode);
    const contextPos = getPrimaryPartOfSpeech(contextEntry);
    const preferredPos = POS_FOLLOW_RULES[contextPos] || ["noun", "verb", "adjective", "adverb", "pronoun"];

    preferredPos.forEach((pos) => {
      getEntriesForPartOfSpeech(posIndex, pos)
        .slice(0, 8)
        .forEach((entry) => {
          let word = entry.word;
          pos === "verb" &&
            (contextPos === "noun" || contextPos === "pronoun") &&
            (word = inflectVerbForSubject(entry.word, contextNode.word, contextPos));
          if (normalizeWordLower(word) === normalizeWordLower(contextNode.word)) {
            return;
          }
          pushSuggestion(word, entry.id, pos);
        });
    });

    if (suggestions.length < limit) {
      G_APP.s.entries.slice(0, 40).forEach((entry) => {
        if (normalizeWordLower(entry.word) === normalizeWordLower(contextNode.word)) {
          return;
        }
        pushSuggestion(entry.word, entry.id, "word");
      });
    }

    return suggestions.slice(0, limit);
  }

  function collectPhraseSuggestionsForContext(contextNode, posIndex, limit = 6) {
    const phrases = [];
    const seen = new Set();

    const pushPhrase = (words, entryIds, reason) => {
      const normalizedWords = (Array.isArray(words) ? words : [])
        .map((word) => cleanText(word, MAX.WORD))
        .filter(Boolean);
      if (normalizedWords.length < 2) {
        return;
      }
      const key = normalizedWords.map(normalizeWordLower).join(" ");
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      phrases.push({
        kind: "phrase",
        label: normalizedWords.join(" "),
        reason,
        words: normalizedWords,
        entryIds: Array.isArray(entryIds) ? entryIds.map((entryId) => cleanText(entryId, MAX.WORD)) : []
      });
    };

    if (contextNode?.id) {
      const byId = G_PAGE.sentence.getIndex().nodeById;
      const traverse = (nodeId, depth, words, entryIds, visited) => {
        if (depth <= 0) {
          return;
        }

        const outgoing = getOutgoingNodeIds(nodeId)
          .map((targetId) => byId.get(targetId))
          .filter(Boolean)
          .sort((left, right) => left.x - right.x || left.y - right.y);

        outgoing.forEach((nextNode) => {
          if (visited.has(nextNode.id)) {
            return;
          }
          const nextWords = [...words, nextNode.word];
          const nextEntryIds = [...entryIds, nextNode.entryId || ""];
          nextWords.length >= 2 && pushPhrase(nextWords, nextEntryIds, "graph phrase");
          traverse(nextNode.id, depth - 1, nextWords, nextEntryIds, new Set([...visited, nextNode.id]));
        });
      };

      traverse(contextNode.id, 4, [], [], new Set([contextNode.id]));
    }

    if (contextNode) {
      const contextEntry = getEntryForGraphNode(contextNode);
      const contextPos = getPrimaryPartOfSpeech(contextEntry);
      const firstOptions = (POS_FOLLOW_RULES[contextPos] || []).slice(0, 3);

      firstOptions.forEach((firstPos) => {
        const secondPos = (POS_FOLLOW_RULES[firstPos] || ["noun"])[0];
        const thirdPos = (POS_FOLLOW_RULES[secondPos] || [])[0];
        const pattern = thirdPos ? [firstPos, secondPos, thirdPos] : [firstPos, secondPos];
        const phrase = buildPhraseFromPattern(pattern, posIndex, contextNode);
        if (phrase) {
          pushPhrase(phrase.words, phrase.entryIds, "phrase");
        }
      });
    }

    if (phrases.length < limit) {
      PHRASE_PATTERNS.forEach((pattern) => {
        const phrase = buildPhraseFromPattern(pattern, posIndex, contextNode);
        if (phrase) {
          pushPhrase(phrase.words, phrase.entryIds, "template");
        }
      });
    }

    return phrases.slice(0, limit);
  }

  function buildPhraseFromPattern(pattern, posIndex, contextNode = null) {
    if (!Array.isArray(pattern) || pattern.length === 0) {
      return null;
    }

    const words = [];
    const entryIds = [];
    const used = new Set();
    const contextEntry = contextNode ? getEntryForGraphNode(contextNode) : null;
    const contextPos = getPrimaryPartOfSpeech(contextEntry);

    for (let index = 0; index < pattern.length; index += 1) {
      const pos = cleanText(pattern[index], 30).toLowerCase();
      if (!pos) {
        return null;
      }

      const entry = getEntriesForPartOfSpeech(posIndex, pos).find(
        (candidate) => !used.has(normalizeWordLower(candidate.word))
      );
      if (!entry) {
        return null;
      }

      let word = entry.word;
      index === 0 &&
        pos === "verb" &&
        contextNode &&
        (contextPos === "noun" || contextPos === "pronoun") &&
        (word = inflectVerbForSubject(entry.word, contextNode.word, contextPos));

      words.push(word);
      entryIds.push(entry.id);
      used.add(normalizeWordLower(word));
    }

    return {
      words,
      entryIds
    };
  }

  function collectStarterWordSuggestions(posIndex, limit = 10) {
    const starters = [];
    const seen = new Set();

    const push = (entry, reason) => {
      if (!entry) {
        return;
      }
      const key = normalizeWordLower(entry.word);
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      starters.push({
        kind: "word",
        label: entry.word,
        reason,
        words: [entry.word],
        entryIds: [entry.id]
      });
    };

    ["article", "pronoun", "noun", "verb", "adjective"].forEach((pos) => {
      getEntriesForPartOfSpeech(posIndex, pos)
        .slice(0, 4)
        .forEach((entry) => {
          push(entry, pos);
        });
    });

    if (starters.length < limit) {
      G_APP.s.entries.slice(0, 30).forEach((entry) => {
        push(entry, "word");
      });
    }

    return starters.slice(0, limit);
  }

  function getSentenceSuggestions(limit = 18) {
    if (G_APP.s.entries.length === 0) {
      return [];
    }

    const cacheKey = `${G_RT.entriesVersion}|${G_RT.gVer}|${G_APP.s.selectedGraphNodeId || ""}|${limit}`;
    if (G_RT.sentenceSugKey === cacheKey) {
      return G_RT.sentenceSugVal;
    }

    const posIndex = buildEntriesByPartOfSpeechIndex();
    const selectedNode = G_PAGE.sentence.getNode(G_APP.s.selectedGraphNodeId);
    const suggestions = [];

    const pushSuggestion = (item) => {
      if (!item || !Array.isArray(item.words) || item.words.length === 0) {
        return;
      }
      suggestions.push(item);
    };

    if (selectedNode) {
      const autoPlan = buildAutoCompletePlan(selectedNode, posIndex);
      if (autoPlan.length > 0) {
        pushSuggestion({
          kind: "auto",
          label: `Auto-complete +${autoPlan.length}`,
          reason: "sentence flow",
          words: autoPlan.map((item) => item.word),
          entryIds: autoPlan.map((item) => item.entryId)
        });
      }

      collectWordSuggestionsForContext(selectedNode, posIndex, 12).forEach(pushSuggestion);
      collectPhraseSuggestionsForContext(selectedNode, posIndex, 8).forEach(pushSuggestion);
    } else {
      collectStarterWordSuggestions(posIndex, 12).forEach(pushSuggestion);
      collectStarterPhraseSuggestions(posIndex, 4).forEach(pushSuggestion);
    }

    const nextSuggestions = suggestions.slice(0, limit);
    G_RT.sentenceSugKey = cacheKey;
    G_RT.sentenceSugVal = nextSuggestions;
    return nextSuggestions;
  }

  function buildAutoCompletePlan(startNode, posIndex, maxSteps = AUTO_COMPLETE_STEPS) {
    if (!startNode) {
      return [];
    }

    const plan = [];
    const seen = new Set([normalizeWordLower(startNode.word)]);
    let context = startNode;

    for (let step = 0; step < maxSteps; step += 1) {
      const candidates = collectWordSuggestionsForContext(context, posIndex, 10).filter((item) => {
        const word = item.words[0] || "";
        return !seen.has(normalizeWordLower(word));
      });

      const next = candidates[0];
      if (!next) {
        break;
      }

      const nextWord = next.words[0];
      const nextEntryId = next.entryIds[0] || "";
      plan.push({
        word: nextWord,
        entryId: nextEntryId
      });
      seen.add(normalizeWordLower(nextWord));
      context = {
        id: "",
        word: nextWord,
        entryId: nextEntryId
      };

      const nextEntry = nextEntryId ? getEntryById(nextEntryId) : null;
      const nextPos = getPrimaryPartOfSpeech(nextEntry);
      if (plan.length >= 3 && (nextPos === "noun" || nextPos === "interjection")) {
        break;
      }
    }

    return plan;
  }

  function addSuggestedNode(word, entryId = "") {
    const fromNodeId = G_APP.s.selectedGraphNodeId;
    const fromNode = G_PAGE.sentence.getNode(fromNodeId);

    const offsetX = fromNode ? fromNode.x + 240 : undefined;
    const offsetY = fromNode ? fromNode.y : undefined;
    const created = addNodeToSentenceGraph(word, entryId, offsetX, offsetY, {
      render: false,
      autosave: false,
      updateStatus: false
    });
    if (!created) {
      return;
    }

    if (fromNodeId) {
      addSentenceLink(fromNodeId, created.id, {
        render: false,
        autosave: false,
        updateStatus: false
      });
    }

    G_APP.s.selectedGraphNodeId = created.id;
    clearPendingLink();
    setSentenceStatus(`Added: ${created.word}`);
    scheduleAutosave();
    G_PAGE.sentence.reqRender();
  }

  function addSuggestedPhrase(words, entryIds = [], options = {}) {
    const { statusPrefix = "Added phrase" } = options;
    const normalizedWords = (Array.isArray(words) ? words : [])
      .map((word) => cleanText(word, MAX.WORD))
      .filter(Boolean);
    if (normalizedWords.length === 0) {
      return;
    }

    let fromNodeId = G_APP.s.selectedGraphNodeId;
    let anchor = G_PAGE.sentence.getNode(fromNodeId);
    let lastNode = null;

    normalizedWords.forEach((word, index) => {
      const created = addNodeToSentenceGraph(
        word,
        Array.isArray(entryIds) ? cleanText(entryIds[index], MAX.WORD) : "",
        anchor ? anchor.x + 240 : undefined,
        anchor ? anchor.y + ((index % 2) * 58 - 20) : undefined,
        {
          render: false,
          autosave: false,
          updateStatus: false
        }
      );
      if (!created) {
        return;
      }

      if (fromNodeId) {
        addSentenceLink(fromNodeId, created.id, {
          render: false,
          autosave: false,
          updateStatus: false
        });
      }

      fromNodeId = created.id;
      anchor = created;
      lastNode = created;
    });

    if (!lastNode) {
      return;
    }

    G_APP.s.selectedGraphNodeId = lastNode.id;
    clearPendingLink();
    setSentenceStatus(`${statusPrefix}: ${normalizedWords.join(" ")}`);
    scheduleAutosave();
    G_PAGE.sentence.reqRender();
  }

  function autoCompleteFromSelectedNode(precomputedWords = [], precomputedEntryIds = []) {
    const selectedNode = G_PAGE.sentence.getNode(G_APP.s.selectedGraphNodeId);
    if (!selectedNode) {
      setSentenceStatus("Select a node first to auto-complete.");
      return;
    }

    const words = Array.isArray(precomputedWords) ? precomputedWords.filter(Boolean) : [];
    if (words.length > 0) {
      addSuggestedPhrase(words, precomputedEntryIds, {
        statusPrefix: "Auto-complete"
      });
      return;
    }

    const posIndex = buildEntriesByPartOfSpeechIndex();
    const plan = buildAutoCompletePlan(selectedNode, posIndex);
    if (plan.length === 0) {
      setSentenceStatus("No auto-complete path available yet.");
      return;
    }

    addSuggestedPhrase(
      plan.map((item) => item.word),
      plan.map((item) => item.entryId),
      {
        statusPrefix: "Auto-complete"
      }
    );
  }

  function buildSentencePreviewLines(limit = 12) {
    const nodesById = G_PAGE.sentence.getIndex().nodeById;
    if (nodesById.size === 0) {
      return [];
    }

    const startNodes = G_APP.s.sentenceGraph.nodes
      .filter((node) => getIncomingNodeIds(node.id).length === 0)
      .sort((a, b) => a.y - b.y || a.x - b.x);

    const seeds =
      startNodes.length > 0 ? startNodes : [...G_APP.s.sentenceGraph.nodes].sort((a, b) => a.y - b.y || a.x - b.x);
    const lines = [];

    const walk = (nodeId, words, visited) => {
      if (lines.length >= limit) {
        return;
      }

      const node = nodesById.get(nodeId);
      if (!node) {
        return;
      }

      const nextWords = [...words, node.word];
      const nextVisited = new Set(visited);
      nextVisited.add(nodeId);

      const outgoing = getOutgoingNodeIds(nodeId)
        .filter((candidate) => !nextVisited.has(candidate))
        .map((candidate) => nodesById.get(candidate))
        .filter(Boolean)
        .sort((a, b) => a.x - b.x || a.y - b.y)
        .map((candidate) => candidate.id);

      if (outgoing.length === 0) {
        lines.push(nextWords.join(" "));
        return;
      }

      outgoing.forEach((nextNodeId) => {
        walk(nextNodeId, nextWords, nextVisited);
      });
    };

    seeds.forEach((seed) => {
      if (lines.length >= limit) {
        return;
      }
      walk(seed.id, [], new Set());
    });

    return unique(lines).slice(0, limit);
  }

  function renderSentenceGraph(options = {}) {
    const startedAt = performance.now();
    const { refreshPreview = true, refreshSuggestions = true } = options;
    if (!G_DOM.sentenceNodes || !G_DOM.sentenceEdges || !G_DOM.sentenceSuggestions || !G_DOM.sentencePreview) {
      return;
    }

    syncGraphNodeWordsFromEntries();

    G_DOM.sentenceNodes.innerHTML = "";
    G_DOM.sentenceEdges.innerHTML = "";
    const stageWidthText = `${GRAPH_STAGE_WIDTH}px`;
    const stageHeightText = `${GRAPH_STAGE_HEIGHT}px`;
    G_DOM.sentenceStage.style.width !== stageWidthText && (G_DOM.sentenceStage.style.width = stageWidthText);
    G_DOM.sentenceStage.style.height !== stageHeightText && (G_DOM.sentenceStage.style.height = stageHeightText);
    const graphViewBox = `0 0 ${GRAPH_STAGE_WIDTH} ${GRAPH_STAGE_HEIGHT}`;
    G_DOM.sentenceEdges.getAttribute("viewBox") !== graphViewBox &&
      G_DOM.sentenceEdges.setAttribute("viewBox", graphViewBox);

    const nodeById = G_PAGE.sentence.getIndex().nodeById;
    const nodesFragment = document.createDocumentFragment();
    G_APP.s.sentenceGraph.nodes.forEach((node) => {
      const nodeEl = document.createElement("div");
      nodeEl.className = "sentenceNode";
      node.id === G_APP.s.selectedGraphNodeId && nodeEl.classList.add("selected");
      node.id === G_APP.s.pendingLinkFromNodeId && nodeEl.classList.add("pending");
      (G_APP.s.graphLockEnabled || node.locked) && nodeEl.classList.add("locked");
      nodeEl.dataset.nodeId = node.id;
      nodeEl.style.left = `${node.x}px`;
      nodeEl.style.top = `${node.y}px`;

      const inputPort = document.createElement("span");
      inputPort.className = "sentencePort";
      inputPort.dataset.port = "in";
      inputPort.dataset.nodeId = node.id;

      const word = document.createElement("span");
      word.className = "sentenceNodeWord";
      word.dataset.nodeId = node.id;
      word.textContent = node.word;

      const outputPort = document.createElement("span");
      outputPort.className = "sentencePort";
      outputPort.dataset.port = "out";
      outputPort.dataset.nodeId = node.id;
      G_APP.s.pendingLinkFromNodeId === node.id && outputPort.classList.add("active");

      nodeEl.appendChild(inputPort);
      nodeEl.appendChild(word);
      nodeEl.appendChild(outputPort);
      nodesFragment.appendChild(nodeEl);
    });
    G_DOM.sentenceNodes.appendChild(nodesFragment);

    const edgesFragment = document.createDocumentFragment();
    G_APP.s.sentenceGraph.links.forEach((link) => {
      const from = nodeById.get(link.fromNodeId);
      const to = nodeById.get(link.toNodeId);
      if (!from || !to) {
        return;
      }

      const startX = from.x + GRAPH_NODE_WIDTH - 6;
      const startY = from.y + GRAPH_NODE_HEIGHT / 2;
      const endX = to.x + 6;
      const endY = to.y + GRAPH_NODE_HEIGHT / 2;
      const bend = Math.max(44, Math.abs(endX - startX) * 0.35);

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.classList.add("sentenceEdge");
      path.setAttribute(
        "d",
        `M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`
      );
      edgesFragment.appendChild(path);
    });
    G_DOM.sentenceEdges.appendChild(edgesFragment);

    refreshPreview && renderSentencePreview();
    refreshSuggestions && renderSentenceSuggestions();
    renderMiniMap();
    G_APP.s.activeView === VIEW_STATISTICS && renderStatisticsView();
    recordDiagnosticPerf("render_graph_ms", performance.now() - startedAt);
  }

  function renderMiniMap() {
    if (
      !(G_DOM.graphMiniMapSvg instanceof SVGElement) ||
      !(G_DOM.graphMiniMapViewport instanceof HTMLElement) ||
      !(G_DOM.sentenceViewport instanceof HTMLElement)
    ) {
      return;
    }

    const miniSvg = G_DOM.graphMiniMapSvg;
    const miniMapKey = `${G_RT.gVer}|${G_RT.gLayoutVer}|${G_APP.s.selectedGraphNodeId || ""}`;
    if (G_RT.gMiniKey !== miniMapKey) {
      G_RT.gMiniKey = miniMapKey;
      miniSvg.innerHTML = "";
      const miniFragment = document.createDocumentFragment();

      G_APP.s.sentenceGraph.links.forEach((link) => {
        const from = G_PAGE.sentence.getNode(link.fromNodeId);
        const to = G_PAGE.sentence.getNode(link.toNodeId);
        if (!from || !to) {
          return;
        }
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", String(from.x + GRAPH_NODE_WIDTH / 2));
        line.setAttribute("y1", String(from.y + GRAPH_NODE_HEIGHT / 2));
        line.setAttribute("x2", String(to.x + GRAPH_NODE_WIDTH / 2));
        line.setAttribute("y2", String(to.y + GRAPH_NODE_HEIGHT / 2));
        line.setAttribute("stroke", "rgba(170, 160, 245, 0.7)");
        line.setAttribute("stroke-width", "8");
        miniFragment.appendChild(line);
      });

      const densityCells = new Map();
      G_APP.s.sentenceGraph.nodes.forEach((node) => {
        const cellX = Math.floor(node.x / 220);
        const cellY = Math.floor(node.y / 120);
        const key = `${cellX}:${cellY}`;
        densityCells.set(key, (densityCells.get(key) || 0) + 1);
      });
      densityCells.forEach((count, key) => {
        if (count < 3) {
          return;
        }
        const [cellX, cellY] = key.split(":").map(Number);
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", String(cellX * 220 + 110));
        circle.setAttribute("cy", String(cellY * 120 + 60));
        circle.setAttribute("r", String(Math.min(56, 16 + count * 4)));
        circle.setAttribute("fill", "rgba(85,230,190,0.18)");
        miniFragment.appendChild(circle);
      });

      G_APP.s.sentenceGraph.nodes.forEach((node) => {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", String(node.x));
        rect.setAttribute("y", String(node.y));
        rect.setAttribute("width", String(GRAPH_NODE_WIDTH));
        rect.setAttribute("height", String(GRAPH_NODE_HEIGHT));
        rect.setAttribute("rx", "20");
        rect.setAttribute(
          "fill",
          node.id === G_APP.s.selectedGraphNodeId ? "rgba(99,169,255,0.95)" : "rgba(95,120,165,0.85)"
        );
        miniFragment.appendChild(rect);
      });
      miniSvg.appendChild(miniFragment);
    }

    const viewport = G_DOM.sentenceViewport;
    const leftRatio = viewport.scrollLeft / GRAPH_STAGE_WIDTH;
    const topRatio = viewport.scrollTop / GRAPH_STAGE_HEIGHT;
    const widthRatio = viewport.clientWidth / GRAPH_STAGE_WIDTH;
    const heightRatio = viewport.clientHeight / GRAPH_STAGE_HEIGHT;
    G_DOM.graphMiniMapViewport.style.left = `${leftRatio * 100}%`;
    G_DOM.graphMiniMapViewport.style.top = `${topRatio * 100}%`;
    G_DOM.graphMiniMapViewport.style.width = `${Math.min(100, widthRatio * 100)}%`;
    G_DOM.graphMiniMapViewport.style.height = `${Math.min(100, heightRatio * 100)}%`;
  }

  return {
    analyzeGraphQuality,
    legacy_analyzeGraphQuality: analyzeGraphQuality,
    modular_analyzeGraphQuality: analyzeGraphQuality,
    collectWordSuggestionsForContext,
    legacy_collectWordSuggestionsForContext: collectWordSuggestionsForContext,
    modular_collectWordSuggestionsForContext: collectWordSuggestionsForContext,
    collectPhraseSuggestionsForContext,
    legacy_collectPhraseSuggestionsForContext: collectPhraseSuggestionsForContext,
    modular_collectPhraseSuggestionsForContext: collectPhraseSuggestionsForContext,
    buildPhraseFromPattern,
    legacy_buildPhraseFromPattern: buildPhraseFromPattern,
    modular_buildPhraseFromPattern: buildPhraseFromPattern,
    collectStarterWordSuggestions,
    legacy_collectStarterWordSuggestions: collectStarterWordSuggestions,
    modular_collectStarterWordSuggestions: collectStarterWordSuggestions,
    getSentenceSuggestions,
    legacy_getSentenceSuggestions: getSentenceSuggestions,
    modular_getSentenceSuggestions: getSentenceSuggestions,
    buildAutoCompletePlan,
    legacy_buildAutoCompletePlan: buildAutoCompletePlan,
    modular_buildAutoCompletePlan: buildAutoCompletePlan,
    addSuggestedNode,
    legacy_addSuggestedNode: addSuggestedNode,
    modular_addSuggestedNode: addSuggestedNode,
    addSuggestedPhrase,
    legacy_addSuggestedPhrase: addSuggestedPhrase,
    modular_addSuggestedPhrase: addSuggestedPhrase,
    autoCompleteFromSelectedNode,
    legacy_autoCompleteFromSelectedNode: autoCompleteFromSelectedNode,
    modular_autoCompleteFromSelectedNode: autoCompleteFromSelectedNode,
    buildSentencePreviewLines,
    legacy_buildSentencePreviewLines: buildSentencePreviewLines,
    modular_buildSentencePreviewLines: buildSentencePreviewLines,
    renderSentenceGraph,
    legacy_renderSentenceGraph: renderSentenceGraph,
    modular_renderSentenceGraph: renderSentenceGraph,
    renderMiniMap,
    legacy_renderMiniMap: renderMiniMap,
    modular_renderMiniMap: renderMiniMap
  };
});
