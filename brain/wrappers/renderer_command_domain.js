/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Command_Domain = __MODULE_API;
  root.DictionaryRendererCommandDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function isCommandPaletteVisible() {
    return !(G_DOM.commandPalette instanceof HTMLElement) ? false : !G_DOM.commandPalette.classList.contains("hidden");
  }

  function closeCmdPalette() {
    if (!(G_DOM.commandPalette instanceof HTMLElement)) {
      return;
    }
    G_DOM.commandPalette.classList.add("hidden");
    G_RT.cmdItems = [];
    G_RT.cmdIdx = 0;
  }

  function executeCommandPaletteItem(item) {
    if (!item || typeof item.run !== "function") {
      return;
    }
    closeCmdPalette();
    Promise.resolve(item.run()).catch((error) => {
      setStatus("Command failed.", true);
      recordDiagnosticError("command_failed", String(error?.message || error), item.label || "palette");
    });
  }

  function renderCmdList() {
    if (!(G_DOM.commandPaletteList instanceof HTMLElement)) {
      return;
    }
    G_DOM.commandPaletteList.innerHTML = "";
    if (G_RT.cmdItems.length === 0) {
      const empty = document.createElement("li");
      empty.className = "commandPaletteItem";
      empty.textContent = "No matching commands.";
      G_DOM.commandPaletteList.appendChild(empty);
      return;
    }
    G_RT.cmdItems.forEach((item, index) => {
      const row = document.createElement("li");
      row.className = `commandPaletteItem${index === G_RT.cmdIdx ? " active" : ""}`;
      row.textContent = item.label;
      row.addEventListener("click", () => executeCommandPaletteItem(item));
      G_DOM.commandPaletteList.appendChild(row);
    });
  }

  function createCommandLabel(sectionLabel, actionLabel) {
    return `[${sectionLabel}] ${actionLabel}`;
  }

  function createCommandRunner(runFn, argsArray = []) {
    if (typeof runFn !== "function") {
      return () => {};
    }
    return Array.isArray(argsArray) && argsArray.length > 0 ? () => runFn(...argsArray) : runFn;
  }

  function createCommandItem(sectionLabel, actionLabel, runFn, ...runArgs) {
    return {
      label: createCommandLabel(sectionLabel, actionLabel),
      run: createCommandRunner(runFn, runArgs)
    };
  }

  function buildCommandPaletteActions() {
    return [
      createCommandItem(PATTERN_CMD_SECTION.VIEW, "Focus Lexicon Explorer", () => G_DOM.treeView?.focus()),
      createCommandItem(PATTERN_CMD_SECTION.ENTRY, "New Entry", beginNewEntryInLabel, ""),
      createCommandItem(PATTERN_CMD_SECTION.ENTRY, "Save Entry and Next", () =>
        saveEntryFromForm({ forceNewAfterSave: true })
      ),
      createCommandItem(PATTERN_CMD_SECTION.ENTRY, "Archive Selected Entries", deleteSelectedEntries),
      createCommandItem(PATTERN_CMD_SECTION.ENTRY, "Restore Selected Entries", () => {
        getSelectedEntries().forEach((entry) => restoreEntryById(entry.id));
        G_PAGE.tree.reqRender();
      }),
      createCommandItem(PATTERN_CMD_SECTION.ENTRY, "Restore Filtered Archived Entries", restoreFilteredArchivedEntries),
      createCommandItem(PATTERN_CMD_SECTION.ENTRY, "Purge Filtered Archived Entries", purgeFilteredArchivedEntries),
      createCommandItem(
        PATTERN_CMD_SECTION.ENTRY,
        "Toggle Favorite",
        () => G_APP.s.selectedEntryId && toggleFavoriteEntry(G_APP.s.selectedEntryId)
      ),
      createCommandItem(PATTERN_CMD_SECTION.VIEW, "Show Workbench", setActiveView, VIEW_WORKBENCH),
      createCommandItem(PATTERN_CMD_SECTION.VIEW, "Show Sentence Graph", setActiveView, VIEW_SENTENCE_GRAPH),
      createCommandItem(PATTERN_CMD_SECTION.VIEW, "Show Statistics", setActiveView, VIEW_STATISTICS),
      createCommandItem(PATTERN_CMD_SECTION.VIEW, "Show Universe", setActiveView, VIEW_UNIVERSE),
      createCommandItem(
        PATTERN_CMD_SECTION.VIEW,
        "Explorer Layout: Standard",
        setExplorerLayoutMode,
        EXPLORER_LAYOUT_NORMAL
      ),
      createCommandItem(
        PATTERN_CMD_SECTION.VIEW,
        "Explorer Layout: Compact",
        setExplorerLayoutMode,
        EXPLORER_LAYOUT_COMPACT
      ),
      createCommandItem(
        PATTERN_CMD_SECTION.VIEW,
        "Explorer Layout: Focus",
        setExplorerLayoutMode,
        EXPLORER_LAYOUT_MAXIMIZED
      ),
      createCommandItem(PATTERN_CMD_SECTION.APPEARANCE, "Theme: Enterprise", updateUiThemePreference, "enterprise"),
      createCommandItem(
        PATTERN_CMD_SECTION.APPEARANCE,
        "Theme: Windows 11 Dark",
        updateUiThemePreference,
        "futuristic"
      ),
      createCommandItem(PATTERN_CMD_SECTION.APPEARANCE, "Theme: Monochrome", updateUiThemePreference, "monochrome"),
      createCommandItem(PATTERN_CMD_SECTION.APPEARANCE, "Toggle Settings Popover", toggleUiSettingsPopover),
      createCommandItem(PATTERN_CMD_SECTION.APPEARANCE, "Toggle Reduce Motion", () =>
        updateReduceMotionPreference(!G_UNI.ui.prefs?.reduceMotion)
      ),
      createCommandItem(PATTERN_CMD_SECTION.UNIVERSE, "Jump to Filter Match", jumpToUniverseFilter),
      createCommandItem(PATTERN_CMD_SECTION.UNIVERSE, "Select All Visible Nodes", () =>
        selectAllUniverseVisibleNodes({ announce: true })
      ),
      createCommandItem(PATTERN_CMD_SECTION.UNIVERSE, "Clear Node Selection", () =>
        clearUniverseNodeSelection({ announce: true })
      ),
      createCommandItem(
        PATTERN_CMD_SECTION.UNIVERSE,
        "Create Custom Set from Selection",
        createUniverseCustomSetFromSelection,
        ""
      ),
      createCommandItem(PATTERN_CMD_SECTION.UNIVERSE, "Use Canvas Renderer", () =>
        setUniverseRenderMode(UNIVERSE_VIEW_MODE_CANVAS, { announce: true })
      ),
      createCommandItem(PATTERN_CMD_SECTION.UNIVERSE, "Try WebGL Renderer", () =>
        setUniverseRenderMode(UNIVERSE_VIEW_MODE_WEBGL, { allowUnsafe: true, announce: true })
      ),
      createCommandItem(PATTERN_CMD_SECTION.UNIVERSE, "Start 3D Benchmark", startUniverseBenchmark),
      createCommandItem(PATTERN_CMD_SECTION.UNIVERSE, "Stop 3D Benchmark", stopUniverseBenchmark, "stopped"),
      createCommandItem(PATTERN_CMD_SECTION.GRAPH, "Toggle Graph Lock", toggleGraphLock),
      createCommandItem(PATTERN_CMD_SECTION.GRAPH, "Auto Layout Graph", autoLayoutGraph),
      createCommandItem(PATTERN_CMD_SECTION.GRAPH, "Build Sentence from Selection", buildSentenceFromSelectedEntries),
      createCommandItem(PATTERN_CMD_SECTION.GRAPH, "Jump Between Selected Entry/Node", jumpBetweenEntryAndGraph),
      createCommandItem(PATTERN_CMD_SECTION.GRAPH, "Open Selected Node Source Entry", () => {
        const node = G_PAGE.sentence.getNode(G_APP.s.selectedGraphNodeId);
        if (!node?.entryId) {
          setSentenceStatus("Selected node has no source entry.");
          return;
        }
        selectEntry(node.entryId);
      }),
      createCommandItem(PATTERN_CMD_SECTION.GRAPH, "Attach Selected Entry to Selected Node", () => {
        const node = G_PAGE.sentence.getNode(G_APP.s.selectedGraphNodeId);
        const entry = getSelectedEntry();
        if (!node || !entry) {
          setSentenceStatus("Select both a graph node and a tree entry.");
          return;
        }
        G_APP.st.setGraph({
          ...G_APP.s.sentenceGraph,
          nodes: G_APP.s.sentenceGraph.nodes.map((item) =>
            item.id === node.id
              ? {
                  ...item,
                  entryId: entry.id,
                  word: entry.word
                }
              : item
          )
        });
        G_PAGE.sentence.reqRender();
        scheduleAutosave();
      }),
      createCommandItem(PATTERN_CMD_SECTION.SYSTEM, "Undo", runUndo),
      createCommandItem(PATTERN_CMD_SECTION.SYSTEM, "Redo", runRedo),
      createCommandItem(PATTERN_CMD_SECTION.SYSTEM, "Expand All Folders", expandAllGroups),
      createCommandItem(PATTERN_CMD_SECTION.SYSTEM, "Collapse All Folders", collapseAllGroups),
      createCommandItem(PATTERN_CMD_SECTION.SYSTEM, "Open Runtime Console", async () => {
        if (!window.app_api?.openRuntimeLogConsole) {
          return;
        }
        const result = await window.app_api.openRuntimeLogConsole();
        !result?.ok && setStatus("Runtime console disabled.", true);
      }),
      createCommandItem(PATTERN_CMD_SECTION.SYSTEM, "Show GPU Status", async () => {
        await showUniverseGpuStatus(true);
      }),
      createCommandItem(PATTERN_CMD_SECTION.SYSTEM, "Toggle Runtime Logging", async () => {
        if (!window.app_api?.setRuntimeLogEnabled) {
          return;
        }
        const next = await window.app_api.setRuntimeLogEnabled(!G_RT.runtimeLogEnabled);
        G_RT.runtimeLogEnabled = next?.enabled !== false;
        setStatus(G_RT.runtimeLogEnabled ? "Runtime logging enabled." : "Runtime logging disabled.");
      }),
      createCommandItem(PATTERN_CMD_SECTION.SYSTEM, "Compact Data", async () => {
        if (!window.app_api?.compact) {
          return;
        }
        const compacted = await window.app_api.compact(buildSnapshot());
        hydrateState(compacted);
        G_PAGE.tree.reqRender();
        G_PAGE.sentence.reqRender();
        scheduleAutosave();
        setStatus("Data compacted.");
      }),
      createCommandItem(PATTERN_CMD_SECTION.SYSTEM, "Export Diagnostics", async () => {
        if (!window.app_api?.exportDiagnostics) {
          return;
        }
        const result = await window.app_api.exportDiagnostics();
        setStatus(result?.ok ? `Diagnostics exported: ${result.filePath}` : "Diagnostics export failed.");
      }),
      createCommandItem(PATTERN_CMD_SECTION.EXPORT, "Export JSON", exportCurrentData, "json"),
      createCommandItem(PATTERN_CMD_SECTION.EXPORT, "Export CSV", exportCurrentData, "csv")
    ];
  }

  function openCommandPalette() {
    if (!(G_DOM.commandPalette instanceof HTMLElement) || !(G_DOM.commandPaletteInput instanceof HTMLInputElement)) {
      return;
    }
    G_DOM.commandPalette.classList.remove("hidden");
    G_DOM.commandPaletteInput.value = "";
    G_RT.cmdItems = buildCommandPaletteActions();
    G_RT.cmdIdx = 0;
    renderCmdList();
    G_DOM.commandPaletteInput.focus();
  }

  function filterCommandPalette(query) {
    const all = buildCommandPaletteActions();
    const ranked = rankCommands(query, all);
    G_RT.cmdItems = ranked.slice(0, 40);
    G_RT.cmdIdx = 0;
    renderCmdList();
  }

  return {
    isCommandPaletteVisible,
    legacy_isCommandPaletteVisible: isCommandPaletteVisible,
    modular_isCommandPaletteVisible: isCommandPaletteVisible,
    closeCmdPalette,
    legacy_closeCmdPalette: closeCmdPalette,
    modular_closeCmdPalette: closeCmdPalette,
    executeCommandPaletteItem,
    legacy_executeCommandPaletteItem: executeCommandPaletteItem,
    modular_executeCommandPaletteItem: executeCommandPaletteItem,
    renderCmdList,
    legacy_renderCmdList: renderCmdList,
    modular_renderCmdList: renderCmdList,
    createCommandLabel,
    legacy_createCommandLabel: createCommandLabel,
    modular_createCommandLabel: createCommandLabel,
    createCommandRunner,
    legacy_createCommandRunner: createCommandRunner,
    modular_createCommandRunner: createCommandRunner,
    createCommandItem,
    legacy_createCommandItem: createCommandItem,
    modular_createCommandItem: createCommandItem,
    buildCommandPaletteActions,
    legacy_buildCommandPaletteActions: buildCommandPaletteActions,
    modular_buildCommandPaletteActions: buildCommandPaletteActions,
    openCommandPalette,
    legacy_openCommandPalette: openCommandPalette,
    modular_openCommandPalette: openCommandPalette,
    filterCommandPalette,
    legacy_filterCommandPalette: filterCommandPalette,
    modular_filterCommandPalette: filterCommandPalette
  };
});
