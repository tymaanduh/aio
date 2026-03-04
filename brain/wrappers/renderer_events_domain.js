/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Events_Domain = __MODULE_API;
  root.DictionaryRendererEventsDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {

function bindEvents() {
  window.addEventListener("error", (event) => {
    const message = cleanText(event?.message || "Unhandled renderer error", 500);
    const context = cleanText(`${event?.filename || ""}:${event?.lineno || 0}:${event?.colno || 0}`, 400);
    recordDiagnosticError("window_error", message, context);
  });
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event?.reason;
    const message = cleanText(reason?.message || String(reason || "Unhandled promise rejection"), 500);
    recordDiagnosticError("unhandled_rejection", message, "window");
  });

  bindUniverseInteractions();
  syncUiSettingsControls();
  syncExplorerLayoutControls();

  // ── Logout ──────────────────────────────────────────────────────────────
  if (G_DOM.logoutAction instanceof HTMLElement) {
    G_DOM.logoutAction.addEventListener("click", async () => {
      try {
        if (typeof window.app_api?.logout === "function") {
          await window.app_api.logout();
        }
        window.location.reload();
      } catch (err) {
        setStatus("Logout failed. Please restart the app.", true);
      }
    });
  }

  // ── New Entry button ─────────────────────────────────────────────────────
  bindActionElement(G_DOM.newEntryAction, () => {
    beginNewEntryInLabel(G_APP.s.selectedTreeLabel || "");
  });

  // ── Archive button in entry form ─────────────────────────────────────────
  bindActionElement(G_DOM.entryArchiveAction, () => {
    if (!G_APP.s.selectedEntryId) {
      setStatus("No entry selected to archive.", true);
      return;
    }
    archiveEntryById(G_APP.s.selectedEntryId);
  });

  bindActionElement(G_DOM.universeSelectAllVisibleAction, () => {
    selectAllUniverseVisibleNodes({
      announce: true
    });
  });

  bindActionElement(G_DOM.universeClearSelectionAction, () => {
    clearUniverseNodeSelection({
      announce: true
    });
  });

  bindActionElement(G_DOM.universeInspectorOpenEntryAction, () => {
    const selectedIndex = G_UNI.view.selectedNodeIndex;
    const selectedNode =
      Number.isInteger(selectedIndex) && selectedIndex >= 0 ? G_UNI.graph.nodes[selectedIndex] : null;
    if (!selectedNode) {
      setStatus("No universe node selected.", true);
      return;
    }
    const entry = getEntryForGraphNode(selectedNode);
    if (!entry) {
      setStatus("Selected node has no source entry.", true);
      return;
    }
    selectEntry(entry.id);
    setStatus(`Opened "${entry.word}" from universe inspector.`);
  });

  if (G_DOM.universeCreateSetForm instanceof HTMLFormElement) {
    G_DOM.universeCreateSetForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value =
        G_DOM.universeCreateSetInput instanceof HTMLInputElement ? G_DOM.universeCreateSetInput.value : "";
      const created = createUniverseCustomSetFromSelection(value);
      if (created && G_DOM.universeCreateSetInput instanceof HTMLInputElement) {
        G_DOM.universeCreateSetInput.value = "";
      }
    });
  }

  (G_DOM.uiSettingsPopover instanceof HTMLElement) && (G_DOM.uiSettingsPopover.setAttribute("tabindex", "-1"));
  if (G_DOM.uiSettingsTrigger instanceof HTMLElement) {
    G_DOM.uiSettingsTrigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleUiSettingsPopover();
    });
    G_DOM.uiSettingsTrigger.addEventListener("keydown", (event) => {
      (event.key === "ArrowDown") && (event.preventDefault(), openUiSettingsPopover());
    });
  }

  [G_DOM.uiThemeEnterpriseInput, G_DOM.uiThemeFuturisticInput, G_DOM.uiThemeMonochromeInput].forEach(
    (input) => {
      if (!(input instanceof HTMLInputElement)) {
        return;
      }
      input.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || !target.checked) {
          return;
        }
        updateUiThemePreference(target.value);
      });
    }
  );

  if (G_DOM.uiReduceMotionInput instanceof HTMLInputElement) {
    G_DOM.uiReduceMotionInput.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      updateReduceMotionPreference(target.checked);
    });
  }

  if (G_DOM.uiSettingsPopover instanceof HTMLElement) {
    G_DOM.uiSettingsPopover.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeUiSettingsPopover();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const focusables = getUiSettingsFocusableElements();
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else {
        (!event.shiftKey && active === last) && (event.preventDefault(), first.focus());
      }
    });
  }

  const submitBulkImport = async () => {
    const mergeMode =
      G_DOM.bulkImportMergeMode instanceof HTMLSelectElement ? G_DOM.bulkImportMergeMode.value : "skip";
    return importEntriesFromText(G_DOM.bulkImportInput.value, mergeMode, { clearInputAfter: true });
  };

  const applyTreeEntrySelection = (entryId, event) => {
    const entry = getEntryById(entryId);
    if (!entry) {
      return;
    }

    const isRange = Boolean(event?.shiftKey);
    const isToggle = Boolean(event?.ctrlKey || event?.metaKey);
    if (isRange) {
      renderEditorForEntry(entry, { syncSelection: false });
      selectEntryRange(entry.id);
      ensureEntryVisible(entry);
      G_PAGE.tree.reqRender();
      return;
    }

    if (isToggle) {
      toggleEntrySelection(entry.id);
      if (G_APP.s.selectedEntryIds.length === 0) {
        resetEditor();
        return;
      }
      const stillSelected = G_APP.s.selectedEntryIds.includes(entry.id);
      if (stillSelected) {
        renderEditorForEntry(entry, { syncSelection: false });
        ensureEntryVisible(entry);
      } else {
        const fallback = getEntryById(G_APP.s.selectedEntryIds[G_APP.s.selectedEntryIds.length - 1]);
        if (fallback) {
          renderEditorForEntry(fallback, { syncSelection: false });
          ensureEntryVisible(fallback);
        }
      }
      G_PAGE.tree.reqRender();
      return;
    }

    selectEntry(entry.id);
  };

  const handleContextAction = (target) => {
    const actionTarget = target.closest("[data-action='context-action']");
    if (!(actionTarget instanceof HTMLElement)) {
      return false;
    }

    const index = Number(actionTarget.dataset.contextIndex);
    const item = Number.isInteger(index) ? G_RT.contextMenuActions[index] : null;
    closeContextMenu();
    (item && typeof item.onSelect === "function") && (item.onSelect());
    return true;
  };

  const handleTreeAction = (target, event = null) => {
    const actionTarget = target.closest("[data-action]");
    if (!(actionTarget instanceof HTMLElement)) {
      return false;
    }

    const { action, entryId, groupKey, label } = actionTarget.dataset;
    if (!action) {
      return false;
    }

    if (action === "toggle-group" && groupKey) {
      toggleGroupExpanded(groupKey);
      G_PAGE.tree.reqRender();
      return true;
    }

    if (action === "show-more" && groupKey) {
      increaseGroupLimit(groupKey);
      G_PAGE.tree.reqRender();
      return true;
    }

    if (action === "select-folder" && groupKey) {
      setTreeFolderSelection(groupKey, label || "");
      G_PAGE.tree.reqRender();
      return true;
    }

    if (action === "select-entry" && entryId) {
      applyTreeEntrySelection(entryId, event);
      return true;
    }

    return false;
  };

  G_DOM.authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    submitAuth();
  });

  G_DOM.authUsernameInput.addEventListener("input", () => {
    resetAuthHintIfNeeded();
  });

  G_DOM.authUsernameInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    submitAuth();
  });

  G_DOM.authPasswordInput.addEventListener("input", () => {
    resetAuthHintIfNeeded();
  });

  G_DOM.authPasswordInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    submitAuth();
  });

  G_DOM.quickWordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    captureWordFromQuickInput().catch((error) => {
      recordDiagnosticError("quick_capture_failed", String(error?.message || error), "quickWordForm");
    });
  });

  G_DOM.quickBatchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    captureBatchWordsFromQuickInput().catch((error) => {
      recordDiagnosticError("quick_batch_submit_failed", String(error?.message || error), "quickBatchForm");
    });
  });

  G_DOM.quickBatchInput.addEventListener("keydown", (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    captureBatchWordsFromQuickInput().catch((error) => {
      recordDiagnosticError("quick_batch_hotkey_failed", String(error?.message || error), "quickBatchInput");
    });
  });

  G_DOM.treePartOfSpeechFilter.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }
    G_APP.s.treePartOfSpeechFilter = cleanText(target.value, 40) || TREE_POS_FILTER_ALL;
    G_PAGE.tree.reqRender();
  });

  G_DOM.treeActivityFilter.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }
    G_APP.s.treeActivityFilter = cleanText(target.value, 40) || TREE_ACTIVITY_FILTER_ALL;
    G_PAGE.tree.reqRender();
  });

  G_DOM.treeHasGraphOnly.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    G_APP.s.treeHasGraphOnly = target.checked;
    G_PAGE.tree.reqRender();
  });

  G_DOM.treeShowArchived.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    G_APP.s.treeShowArchived = target.checked;
    G_PAGE.tree.reqRender();
  });

  G_DOM.archiveSearchInput.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    G_APP.s.archiveSearch = target.value;
    G_PAGE.tree.reqRender();
  });

  G_DOM.localAssistEnabled.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    G_APP.s.localAssistEnabled = target.checked;
    scheduleAutosave();
  });

  G_DOM.commandPaletteInput.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    filterCommandPalette(target.value);
  });

  G_DOM.commandPaletteInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (G_RT.cmdItems.length === 0) {
        return;
      }
      G_RT.cmdIdx = (G_RT.cmdIdx + 1) % G_RT.cmdItems.length;
      renderCmdList();
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (G_RT.cmdItems.length === 0) {
        return;
      }
      G_RT.cmdIdx =
        (G_RT.cmdIdx - 1 + G_RT.cmdItems.length) % G_RT.cmdItems.length;
      renderCmdList();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      executeCommandPaletteItem(G_RT.cmdItems[G_RT.cmdIdx]);
      return;
    }
    (event.key === "Escape") && (event.preventDefault(), closeCmdPalette());
  });

  G_DOM.commandPalette.addEventListener("click", (event) => {
    (event.target === G_DOM.commandPalette) && (closeCmdPalette());
  });

  G_DOM.batchLabelForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const success = applyBatchLabel(G_DOM.batchLabelInput.value);
    if (!success) {
      setStatus("Select one or more words first.", true);
      return;
    }
    G_DOM.batchLabelInput.value = "";
    setStatus("Batch label applied.");
  });

  G_DOM.batchRelabelForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const success = applyBatchRelabel(G_DOM.batchRelabelInput.value);
    if (!success) {
      setStatus("Select one or more words first.", true);
      return;
    }
    G_DOM.batchRelabelInput.value = "";
    setStatus("Batch relabel applied.");
  });

  G_DOM.bulkImportForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitBulkImport();
  });

  G_DOM.bulkImportInput.addEventListener("keydown", async (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    await submitBulkImport();
  });

  G_DOM.importFileInput.addEventListener("change", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.files || target.files.length === 0) {
      return;
    }

    try {
      const file = target.files[0];
      const text = await file.text();
      const mergeMode =
        G_DOM.bulkImportMergeMode instanceof HTMLSelectElement ? G_DOM.bulkImportMergeMode.value : "skip";
      await importEntriesFromText(text, mergeMode);
    } catch (error) {
      setStatus("Could not import file.", true);
      console.error(error);
    } finally {
      target.value = "";
    }
  });

  bindActionElement(G_DOM.exportDataAction, () => {
    const format =
      G_DOM.exportFormatSelect instanceof HTMLSelectElement ? G_DOM.exportFormatSelect.value : "json";
    exportCurrentData(format);
    setStatus(`Exported ${format.toUpperCase()}.`);
  });

  bindActionElement(G_DOM.restoreHistoryAction, () => {
    const checkpointId =
      G_DOM.historyRestoreSelect instanceof HTMLSelectElement ? G_DOM.historyRestoreSelect.value : "";
    const restored = restoreCheckpointById(checkpointId);
    if (!restored) {
      setStatus("Choose a checkpoint first.", true);
      return;
    }
    setStatus("Checkpoint restored.");
  });

  bindActionElement(G_DOM.autoLayoutGraphAction, () => {
    autoLayoutGraph();
  });

  bindActionElement(G_DOM.explorerCompactAction, () => {
    const nextMode =
      G_APP.s.explorerLayoutMode === EXPLORER_LAYOUT_COMPACT ? EXPLORER_LAYOUT_NORMAL : EXPLORER_LAYOUT_COMPACT;
    setExplorerLayoutMode(nextMode);
  });

  bindActionElement(G_DOM.explorerFocusAction, () => {
    const nextMode =
      G_APP.s.explorerLayoutMode === EXPLORER_LAYOUT_MAXIMIZED ? EXPLORER_LAYOUT_NORMAL : EXPLORER_LAYOUT_MAXIMIZED;
    setExplorerLayoutMode(nextMode);
  });

  bindActionElement(G_DOM.showWorkbenchViewAction, () => {
    setActiveView(VIEW_WORKBENCH);
  });

  bindActionElement(G_DOM.showSentenceGraphViewAction, () => {
    setActiveView(VIEW_SENTENCE_GRAPH);
  });

  bindActionElement(G_DOM.showStatisticsViewAction, () => {
    setActiveView(VIEW_STATISTICS);
  });

  bindActionElement(G_DOM.showUniverseViewAction, () => {
    setActiveView(VIEW_UNIVERSE);
  });

  bindActionElement(G_DOM.toggleGraphLockAction, () => {
    toggleGraphLock();
  });

  bindActionElement(G_DOM.buildSentenceSelectionAction, () => {
    buildSentenceFromSelectedEntries();
  });

  bindActionElement(G_DOM.deleteSelectedAction, () => {
    const deleted = deleteSelectedEntries();
    if (!deleted) {
      setStatus("No selected words to archive.", true);
      return;
    }
    setStatus("Selected words archived.");
  });

  bindActionElement(G_DOM.restoreArchivedFilteredAction, () => {
    restoreFilteredArchivedEntries();
  });

  bindActionElement(G_DOM.purgeArchivedFilteredAction, () => {
    purgeFilteredArchivedEntries();
  });

  bindActionElement(G_DOM.openRuntimeConsoleAction, async () => {
    if (!window.app_api?.openRuntimeLogConsole) {
      return;
    }
    const result = await window.app_api.openRuntimeLogConsole();
    if (!result?.ok) {
      setStatus("Runtime console disabled.", true);
      return;
    }
    setStatus("Runtime console opened.");
  });

  bindActionElement(G_DOM.assistantNormalizeDefinition, () => {
    const mode = normalizeEntryMode(
      G_DOM.entryModeSelect instanceof HTMLSelectElement ? G_DOM.entryModeSelect.value : "definition"
    );
    G_DOM.definitionInput.value =
      mode === "code" || mode === "bytes"
        ? cleanText(G_DOM.definitionInput.value, MAX.DEFINITION)
        : sanitizeDefinitionText(G_DOM.definitionInput.value);
    setEntryWarnings([]);
    scheduleAutoCommitDraft();
    setStatus("Definition normalized.");
  });

  bindActionElement(G_DOM.assistantSuggestLabels, () => {
    const inferred = inferLabelsFromDefinition(G_DOM.definitionInput.value);
    const current = parseLabels(G_DOM.labelsInput.value);
    const next = unique([...current, ...inferred]);
    G_DOM.labelsInput.value = next.join(", ");
    setEntryWarnings([]);
    scheduleAutoCommitDraft();
    setStatus("Suggested labels applied.");
  });

  bindActionElement(G_DOM.assistantResolvePos, () => {
    const current = parseLabels(G_DOM.labelsInput.value);
    const resolved = resolvePosConflictLabels(current, G_DOM.definitionInput.value);
    G_DOM.labelsInput.value = resolved.join(", ");
    const conflicts = detectPosConflicts(resolved);
    setEntryWarnings(conflicts.length > 1 ? [`POS conflict: ${conflicts.join(", ")}`] : []);
    setStatus(conflicts.length > 1 ? "POS conflict remains." : "POS conflict resolved.");
    scheduleAutoCommitDraft();
  });

  G_DOM.sentenceWordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const typed = cleanText(G_DOM.sentenceWordInput.value, MAX.DEFINITION);
    const words = parseSentenceInputWords(typed);
    if (words.length > 1) {
      const entryIds = words.map((word) => getDuplicateEntry(word)?.id || "");
      addSuggestedPhrase(words, entryIds, {
        statusPrefix: "Added passage"
      });
      G_DOM.sentenceWordInput.value = "";
      return;
    }
    if (words.length === 1) {
      addNodeToSentenceGraph(words[0], getDuplicateEntry(words[0])?.id || "");
      G_DOM.sentenceWordInput.value = "";
      return;
    }

    const fromEntry = addNodeFromSelectedEntry();
    (!fromEntry) && (setSentenceStatus("Type a sentence/paragraph or select one in the tree first."));
  });

  if (G_DOM.sentenceWordInput instanceof HTMLTextAreaElement) {
    G_DOM.sentenceWordInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || event.shiftKey) {
        return;
      }
      event.preventDefault();
      G_DOM.sentenceWordForm.requestSubmit();
    });
  }

  G_DOM.treeView.addEventListener("dblclick", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const fileItem = target.closest(".fileItem");
    if (!(fileItem instanceof HTMLElement)) {
      return;
    }
    const entryId = cleanText(fileItem.dataset.entryId, MAX.WORD);
    if (!entryId) {
      return;
    }
    const entry = getEntryById(entryId);
    if (!entry) {
      return;
    }
    addNodeToSentenceGraph(entry.word, entry.id);
  });

  G_DOM.sentenceViewport.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const port = target.closest(".sentencePort");
    if (port instanceof HTMLElement) {
      const nodeId = cleanText(port.dataset.nodeId, MAX.WORD);
      const portType = cleanText(port.dataset.port, 10);
      if (!nodeId) {
        return;
      }

      if (portType === "out") {
        G_APP.s.pendingLinkFromNodeId = nodeId;
        G_APP.s.selectedGraphNodeId = nodeId;
        setSentenceStatus("Link mode: click an input port to connect.");
        G_PAGE.sentence.reqRender();
        return;
      }

      if (portType === "in" && G_APP.s.pendingLinkFromNodeId) {
        const fromNodeId = G_APP.s.pendingLinkFromNodeId;
        clearPendingLink();
        G_APP.s.selectedGraphNodeId = nodeId;
        addSentenceLink(fromNodeId, nodeId, {
          render: false
        });
        G_PAGE.sentence.reqRender();
        return;
      }
      return;
    }

    const nodeEl = target.closest(".sentenceNode");
    if (nodeEl instanceof HTMLElement) {
      const nodeId = cleanText(nodeEl.dataset.nodeId, MAX.WORD);
      if (!nodeId) {
        return;
      }
      G_APP.s.selectedGraphNodeId = nodeId;
      G_PAGE.sentence.reqRender();
      return;
    }

    G_APP.s.selectedGraphNodeId = null;
    clearPendingLink();
    G_PAGE.sentence.reqRender();
  });

  G_DOM.sentenceViewport.addEventListener("scroll", () => {
    renderMiniMap();
  });

  G_DOM.graphMiniMap.addEventListener("click", (event) => {
    const rect = G_DOM.graphMiniMap.getBoundingClientRect();
    const relativeX = clampNumber(event.clientX - rect.left, 0, rect.width);
    const relativeY = clampNumber(event.clientY - rect.top, 0, rect.height);
    const ratioX = rect.width > 0 ? relativeX / rect.width : 0;
    const ratioY = rect.height > 0 ? relativeY / rect.height : 0;
    G_DOM.sentenceViewport.scrollLeft = clampNumber(
      ratioX * GRAPH_STAGE_WIDTH - G_DOM.sentenceViewport.clientWidth / 2,
      0,
      GRAPH_STAGE_WIDTH
    );
    G_DOM.sentenceViewport.scrollTop = clampNumber(
      ratioY * GRAPH_STAGE_HEIGHT - G_DOM.sentenceViewport.clientHeight / 2,
      0,
      GRAPH_STAGE_HEIGHT
    );
    renderMiniMap();
  });

  G_DOM.sentenceViewport.addEventListener("contextmenu", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const nodeEl = target.closest(".sentenceNode");
    if (!(nodeEl instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    const nodeId = cleanText(nodeEl.dataset.nodeId, MAX.WORD);
    const node = G_PAGE.sentence.getNode(nodeId);
    if (!node) {
      return;
    }
    openContextMenu(
      [
        {
          label: `Start Link from "${node.word}"`,
          onSelect: () => {
            G_APP.s.pendingLinkFromNodeId = node.id;
            G_APP.s.selectedGraphNodeId = node.id;
            setSentenceStatus("Link mode: click an input port to connect.");
            G_PAGE.sentence.reqRender();
          }
        },
        {
          label: node.locked ? `Unlock "${node.word}"` : `Lock "${node.word}"`,
          onSelect: () => {
            G_APP.st.setGraph({
              ...G_APP.s.sentenceGraph,
              nodes: G_APP.s.sentenceGraph.nodes.map((item) =>
                item.id === node.id
                  ? {
                      ...item,
                      locked: !item.locked
                    }
                  : item
              )
            });
            G_PAGE.sentence.reqRender();
            scheduleAutosave();
          }
        },
        {
          label: "Open Source Entry",
          onSelect: () => {
            if (!node.entryId) {
              setSentenceStatus("Node has no linked source entry.");
              return;
            }
            selectEntry(node.entryId);
          }
        },
        {
          label: "Attach Selected Entry",
          onSelect: () => {
            const selectedEntry = getSelectedEntry();
            if (!selectedEntry) {
              setSentenceStatus("Select an entry in the tree first.");
              return;
            }
            G_APP.st.setGraph({
              ...G_APP.s.sentenceGraph,
              nodes: G_APP.s.sentenceGraph.nodes.map((item) =>
                item.id === node.id
                  ? {
                      ...item,
                      entryId: selectedEntry.id,
                      word: selectedEntry.word
                    }
                  : item
              )
            });
            setSentenceStatus(`Node linked to "${selectedEntry.word}".`);
            G_PAGE.sentence.reqRender();
            scheduleAutosave();
          }
        },
        {
          label: `Delete Node "${node.word}"`,
          dangerous: true,
          onSelect: () => removeSentenceNode(node.id)
        }
      ],
      event.clientX,
      event.clientY
    );
  });

  const handleSuggestionAction = (target) => {
    const chip = target.closest(".suggestionChip");
    if (!(chip instanceof HTMLElement)) {
      return false;
    }

    const suggestionIndex = Number(chip.dataset.suggestionIndex);
    const suggestion = Number.isInteger(suggestionIndex) ? G_RT.sentenceSuggestionActions[suggestionIndex] : null;
    if (!suggestion) {
      return false;
    }

    if (suggestion.kind === "auto") {
      autoCompleteFromSelectedNode(suggestion.words, suggestion.entryIds);
      return true;
    }

    if (suggestion.kind === "phrase") {
      addSuggestedPhrase(suggestion.words, suggestion.entryIds);
      return true;
    }

    const word = suggestion.words[0];
    const entryId = suggestion.entryIds[0] || "";
    if (!word) {
      return false;
    }

    addSuggestedNode(word, entryId);
    return true;
  };

  G_DOM.sentenceSuggestions.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    handleSuggestionAction(target);
  });

  G_DOM.sentenceSuggestions.addEventListener("keydown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    (handleSuggestionAction(target)) && (event.preventDefault());
  });

  G_DOM.sentenceNodes.addEventListener("mousedown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.closest(".sentencePort")) {
      return;
    }

    const nodeEl = target.closest(".sentenceNode");
    if (!(nodeEl instanceof HTMLElement)) {
      return;
    }

    const nodeId = cleanText(nodeEl.dataset.nodeId, MAX.WORD);
    const node = G_PAGE.sentence.getNode(nodeId);
    if (!node) {
      return;
    }
    if (G_APP.s.graphLockEnabled || node.locked) {
      setSentenceStatus("Node dragging is locked.");
      return;
    }

    G_RT.dragState = {
      nodeId: node.id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: node.x,
      startY: node.y
    };
    G_APP.s.selectedGraphNodeId = node.id;
    G_PAGE.sentence.reqRender();
  });

  window.addEventListener("mousemove", (event) => {
    if (!G_RT.dragState) {
      return;
    }

    const node = G_PAGE.sentence.getNode(G_RT.dragState.nodeId);
    if (!node) {
      G_RT.dragState = null;
      return;
    }

    const deltaX = event.clientX - G_RT.dragState.startClientX;
    const deltaY = event.clientY - G_RT.dragState.startClientY;
    if (G_APP.s.graphLockEnabled || node.locked) {
      G_RT.dragState = null;
      setSentenceStatus("Node dragging is locked.");
      return;
    }
    const nextX = clampNumber(G_RT.dragState.startX + deltaX, 8, GRAPH_STAGE_WIDTH - GRAPH_NODE_WIDTH - 8);
    const nextY = clampNumber(G_RT.dragState.startY + deltaY, 8, GRAPH_STAGE_HEIGHT - GRAPH_NODE_HEIGHT - 8);
    (node.x !== nextX || node.y !== nextY) && (G_RT.gLayoutVer += 1);
    node.x = nextX;
    node.y = nextY;
    G_PAGE.sentence.reqRender({
      refreshPreview: false,
      refreshSuggestions: false
    });
  });

  window.addEventListener("mouseup", () => {
    if (!G_RT.dragState) {
      return;
    }
    G_RT.dragState = null;
    setSentenceStatus("Node moved.");
    scheduleAutosave();
  });

  G_DOM.contextMenu.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    handleContextAction(target);
  });

  G_DOM.contextMenu.addEventListener("keydown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    (handleContextAction(target)) && (event.preventDefault());
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    (!G_DOM.contextMenu.classList.contains("hidden") && (!(target instanceof Node) || !G_DOM.contextMenu.contains(target)) && (closeContextMenu()));

    if (!isUiSettingsPopoverOpen()) {
      return;
    }
    const clickedSettings =
      target instanceof Node &&
      ((G_DOM.uiSettingsPopover instanceof HTMLElement && G_DOM.uiSettingsPopover.contains(target)) ||
        (G_DOM.uiSettingsTrigger instanceof HTMLElement && G_DOM.uiSettingsTrigger.contains(target)));
    if (!clickedSettings) {
      closeUiSettingsPopover({ restoreFocus: false });
    }
  });

  window.addEventListener("resize", () => {
    closeContextMenu();
    closeUiSettingsPopover({ restoreFocus: false });
    renderMiniMap();
  });

  window.addEventListener("scroll", () => {
    closeContextMenu();
    closeUiSettingsPopover({ restoreFocus: false });
  });

  window.addEventListener("keydown", (event) => {
    if (isAuthGateVisible()) {
      return;
    }
    if (isCommandPaletteVisible() && event.key === "Escape") {
      event.preventDefault();
      closeCmdPalette();
      return;
    }
    if (isUiSettingsPopoverOpen() && event.key === "Escape") {
      event.preventDefault();
      closeUiSettingsPopover();
      return;
    }
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "Escape") {
      closeContextMenu();
      if (G_APP.s.pendingLinkFromNodeId) {
        clearPendingLink();
        setSentenceStatus("Link mode canceled.");
        G_PAGE.sentence.reqRender();
      }
      if (
        document.activeElement instanceof HTMLElement &&
        (document.activeElement === G_DOM.wordInput ||
          document.activeElement === G_DOM.entryModeSelect ||
          document.activeElement === G_DOM.entryLanguageInput ||
          document.activeElement === G_DOM.definitionInput ||
          document.activeElement === G_DOM.labelsInput)
      ) {
        beginNewEntryInLabel("");
      }
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      const active = document.activeElement;
      if (active === G_DOM.newLabelInput) {
        event.preventDefault();
        G_DOM.newLabelForm.requestSubmit();
        return;
      }
      if (
        active === G_DOM.wordInput ||
        active === G_DOM.entryLanguageInput ||
        active === G_DOM.definitionInput ||
        active === G_DOM.labelsInput
      ) {
        event.preventDefault();
        saveEntryFromForm({ forceNewAfterSave: true });
        return;
      }
    }

    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      (document.activeElement === G_DOM.wordInput ||
        document.activeElement === G_DOM.entryLanguageInput ||
        document.activeElement === G_DOM.definitionInput ||
        document.activeElement === G_DOM.labelsInput)
    ) {
      event.preventDefault();
      saveEntryFromForm({ forceNewAfterSave: true });
      return;
    }

    ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") && (event.preventDefault(), beginNewEntryInLabel(""));

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "p") {
      event.preventDefault();
      openCommandPalette();
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === ",") {
      event.preventDefault();
      toggleUiSettingsPopover();
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      if (window.app_api?.openRuntimeLogConsole) {
        window.app_api.openRuntimeLogConsole().catch(() => {});
      }
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "1") {
      event.preventDefault();
      setActiveView(VIEW_WORKBENCH);
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "2") {
      event.preventDefault();
      setActiveView(VIEW_SENTENCE_GRAPH);
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "3") {
      event.preventDefault();
      setActiveView(VIEW_STATISTICS);
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "4") {
      event.preventDefault();
      setActiveView(VIEW_UNIVERSE);
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "g") {
      event.preventDefault();
      if (!jumpBetweenEntryAndGraph()) {
        setSentenceStatus("No linked entry/node pair found to jump.");
      }
      return;
    }

    if ((event.metaKey || event.ctrlKey) && !event.shiftKey && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (!runUndo()) {
        setStatus("Nothing to undo.");
      }
      return;
    }

    if (
      ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "z") ||
      ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "y")
    ) {
      event.preventDefault();
      (!runRedo()) && (setStatus("Nothing to redo."));
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (isElementVisibleForInteraction(G_DOM.treeSearchInput)) {
        G_DOM.treeSearchInput.focus();
        G_DOM.treeSearchInput.select();
        return;
      }
      (G_DOM.treeView instanceof HTMLElement) && (G_DOM.treeView.focus());
    }

    if (
      (event.metaKey || event.ctrlKey) &&
      event.key.toLowerCase() === "a" &&
      G_APP.s.activeView === VIEW_UNIVERSE &&
      !isTypingTargetElement(document.activeElement)
    ) {
      event.preventDefault();
      selectAllUniverseVisibleNodes({
        announce: true
      });
      return;
    }

    if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      const number = Number(event.key);
      if (Number.isInteger(number) && number >= 1 && number <= 9) {
        event.preventDefault();
        if (number <= TOP_TREE_LABELS.length) {
          selectTopLabelByIndex(number - 1);
        }
        return;
      }
    }

    (event.altKey && event.key === "ArrowRight") && (event.preventDefault(), expandAllGroups());

    (event.altKey && event.key === "ArrowLeft") && (event.preventDefault(), collapseAllGroups());

    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !isTypingTargetElement(document.activeElement)) {
      const visible = getVisibleTreeEntries();
      if (visible.length > 0) {
        const currentId = G_APP.s.selectedEntryId || visible[0].id;
        const currentIndex = Math.max(
          0,
          visible.findIndex((entry) => entry.id === currentId)
        );
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = clampNumber(currentIndex + direction, 0, visible.length - 1);
        const nextEntry = visible[nextIndex];
        if (nextEntry) {
          event.preventDefault();
          if (event.shiftKey) {
            renderEditorForEntry(nextEntry, { syncSelection: false });
            selectEntryRange(nextEntry.id);
            ensureEntryVisible(nextEntry);
            G_PAGE.tree.reqRender();
          } else {
            selectEntry(nextEntry.id);
          }
        }
      }
    }

    if (event.key === "Delete") {
      const active = document.activeElement;
      if (!isTypingTargetElement(active)) {
        if (G_APP.s.selectedGraphNodeId) {
          event.preventDefault();
          removeSentenceNode(G_APP.s.selectedGraphNodeId);
          return;
        }
        if (G_APP.s.selectedEntryIds.length > 1) {
          event.preventDefault();
          if (event.shiftKey) {
            [...new Set(G_APP.s.selectedEntryIds)].forEach((entryId) => deleteEntryById(entryId));
          } else {
            deleteSelectedEntries();
          }
          return;
        }
        if (G_APP.s.selectedEntryId) {
          event.preventDefault();
          if (event.shiftKey) {
            deleteEntryById(G_APP.s.selectedEntryId);
          } else {
            deleteSelectedEntry();
          }
        }
      }
    }
  });

  G_DOM.newLabelForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const label = normalizeLabel(G_DOM.newLabelInput.value);
    if (!label) {
      return;
    }
    ensureLabelExists(label);
    G_DOM.newLabelInput.value = "";
    G_PAGE.tree.reqRender();
    scheduleAutosave();
  });

  G_DOM.treeSearchInput.addEventListener("input", (event) => {
    const startedAt = performance.now();
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    G_APP.s.treeSearch = target.value;
    if (G_RT.treeSearchTask) {
      G_RT.treeSearchTask.schedule();
    } else {
      G_PAGE.tree.reqRender();
    }
    recordDiagnosticPerf("search_input_ms", performance.now() - startedAt);
  });

  G_DOM.treeLabelFilter.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }
    G_APP.s.treeLabelFilter = target.value;
    G_PAGE.tree.reqRender();
  });

  G_DOM.treeView.addEventListener("click", (event) => {
    closeContextMenu();

    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    handleTreeAction(target, event);
  });

  G_DOM.treeView.addEventListener("keydown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    (handleTreeAction(target, event)) && (event.preventDefault());
  });

  G_DOM.treeView.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const entryItem = target.closest(".fileItem");
    if (entryItem instanceof HTMLElement) {
      const entryId = cleanText(entryItem.dataset.entryId, MAX.WORD);
      if (entryId) {
        if (!G_APP.s.selectedEntryIds.includes(entryId)) {
          selectEntry(entryId);
        }
        openEntryContextMenu(entryId, event.clientX, event.clientY);
      }
      return;
    }

    const labeledFolder = target.closest(".treeGroup[data-label]");
    if (labeledFolder instanceof HTMLElement) {
      const label = cleanText(labeledFolder.dataset.label, MAX.LABEL);
      if (label) {
        setTreeFolderSelection(cleanText(labeledFolder.dataset.groupKey, 160), label, { announce: false });
        G_PAGE.tree.reqRender();
        openLabelContextMenu(label, event.clientX, event.clientY);
      }
      return;
    }

    closeContextMenu();
  });

  G_DOM.entryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveEntryFromForm({ advanceToNext: !G_APP.s.selectedEntryId });
  });

  bindAutoCommitField(G_DOM.wordInput, {
    onInput: () => {
      refreshInlineWarningsFromForm();
      scheduleAutoLookup();
    },
    onBlur: () => {
      const word = cleanText(G_DOM.wordInput.value, MAX.WORD);
      const mode = normalizeEntryMode(
        G_DOM.entryModeSelect instanceof HTMLSelectElement ? G_DOM.entryModeSelect.value : "definition"
      );
      (mode !== "code" && mode !== "bytes" && word.length >= MIN_LOOKUP_LENGTH) && (clearLookupTimer(), lookupAndSaveEntry(word));
    }
  });
  bindAutoCommitField(G_DOM.entryModeSelect, {
    onInput: () => {
      updateEntryModeVisualState();
      refreshInlineWarningsFromForm();
      scheduleAutoLookup();
    }
  });
  bindAutoCommitField(G_DOM.entryLanguageInput, {
    onInput: () => {
      refreshInlineWarningsFromForm();
    }
  });
  bindAutoCommitField(G_DOM.definitionInput, {
    onInput: () => {
      refreshInlineWarningsFromForm();
    }
  });
  bindAutoCommitField(G_DOM.labelsInput, {
    onInput: () => {
      refreshInlineWarningsFromForm();
    }
  });

  window.addEventListener("beforeunload", () => {
    closeContextMenu();
    closeUiSettingsPopover({ restoreFocus: false });
    clearAutosaveTimer();
    clearUiSettingsSaveTimer(true);
    clearDiagnosticsFlushTimer();
    clearLookupTimer();
    clearEntryCommitTimer();
    clearTreeSearchTimer();
    clearStatsWorkerTimer();
    clearUniverseBuildTimer();
    clearUniverseCacheSaveTimer(true);
    clearRenderSchedules();
    (G_RT.uBench.running) && (G_RT.uBench = createUniverseBenchmarkState(G_RT.uBench.lastResult));
    (G_RT.uHoverFrame) && (window.cancelAnimationFrame(G_RT.uHoverFrame), G_RT.uHoverFrame = 0);
    G_RT.uHoverPoint = null;
    disposeWebglRenderer();
    if (G_RT.statsWorker) {
      try {
        G_RT.statsWorker.terminate();
      } catch {
        // Ignore termination errors.
      }
      G_RT.statsWorker = null;
      G_RT.statsWorkerReady = false;
    }
    if (G_RT.uWorker) {
      try {
        G_RT.uWorker.terminate();
      } catch {
        // Ignore termination errors.
      }
      G_RT.uWorker = null;
      G_RT.uWorkerReady = false;
    }
    (G_RT.uResizeObs) && (G_RT.uResizeObs.disconnect(), G_RT.uResizeObs = null);
    if (G_RT.reduceMotionMediaQuery && G_RT.reduceMotionMediaQueryListener) {
      if (typeof G_RT.reduceMotionMediaQuery.removeEventListener === "function") {
        G_RT.reduceMotionMediaQuery.removeEventListener("change", G_RT.reduceMotionMediaQueryListener);
      } else {
        (typeof G_RT.reduceMotionMediaQuery.removeListener === "function") &&
          (G_RT.reduceMotionMediaQuery.removeListener(G_RT.reduceMotionMediaQueryListener));
      }
    }
    G_RT.reduceMotionMediaQuery = null;
    G_RT.reduceMotionMediaQueryListener = null;

    if (G_RT.readyForAutosave) {
      window.app_api.save(buildSnapshot()).catch(() => {});
    }
    if (window.app_api?.appendDiagnostics) {
      const pendingDiagnostics = normalizeDiagnostics(G_APP.s.diagnostics);
      if (pendingDiagnostics.errors.length > 0 || pendingDiagnostics.perf.length > 0) {
        window.app_api.appendDiagnostics(pendingDiagnostics).catch(() => {});
      }
    }
  });
}

  return {
    bindEvents,
    legacy_bindEvents: bindEvents,
    modular_bindEvents: bindEvents,
  };
});
