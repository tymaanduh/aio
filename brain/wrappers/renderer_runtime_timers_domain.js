/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Runtime_Timers_Domain = __MODULE_API;
  root.DictionaryRendererRuntimeTimersDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function scheduleIndexWarmup() {
    G_RT.indexWarmupTimer && window.clearTimeout(G_RT.indexWarmupTimer);
    G_RT.indexWarmupTimer = window.setTimeout(() => {
      G_RT.indexWarmupTimer = 0;
      G_PAGE.dictionary.getEntriesIndex();
      G_PAGE.sentence.getIndex();
    }, 40);
  }

  function scheduleGraphBuild() {
    if (!G_RT.uBuildTask) {
      return;
    }
    G_RT.uBuildTask.schedule();
  }

  function clearAutosaveTimer() {
    G_RT.autosaveTask && G_RT.autosaveTask.clear();
  }

  function clearLookupTimer() {
    G_RT.lookupTask && G_RT.lookupTask.clear();
  }

  function clearEntryCommitTimer() {
    G_RT.entryCommitTask && G_RT.entryCommitTask.clear();
  }

  function clearTreeSearchTimer() {
    G_RT.treeSearchTask && G_RT.treeSearchTask.clear();
  }

  function clearStatsWorkerTimer() {
    G_RT.statsWorkerTask && G_RT.statsWorkerTask.clear();
  }

  function clearUniverseBuildTimer() {
    G_RT.uBuildTask && G_RT.uBuildTask.clear();
  }

  function clearUniverseCacheSaveTimer(flush = false) {
    G_RT.uCacheSaveTimer && (window.clearTimeout(G_RT.uCacheSaveTimer), (G_RT.uCacheSaveTimer = 0));
    if (flush && window.app_api?.saveUniverseCache) {
      window.app_api.saveUniverseCache(buildUniverseCachePayload()).catch(() => {});
    }
  }

  return {
    clearAutosaveTimer,
    modular_clearAutosaveTimer: clearAutosaveTimer,
    clearLookupTimer,
    modular_clearLookupTimer: clearLookupTimer,
    clearEntryCommitTimer,
    modular_clearEntryCommitTimer: clearEntryCommitTimer,
    clearTreeSearchTimer,
    modular_clearTreeSearchTimer: clearTreeSearchTimer,
    clearStatsWorkerTimer,
    modular_clearStatsWorkerTimer: clearStatsWorkerTimer,
    clearUniverseBuildTimer,
    modular_clearUniverseBuildTimer: clearUniverseBuildTimer,
    clearUniverseCacheSaveTimer,
    modular_clearUniverseCacheSaveTimer: clearUniverseCacheSaveTimer,
    scheduleIndexWarmup,
    modular_scheduleIndexWarmup: scheduleIndexWarmup,
    scheduleGraphBuild,
    modular_scheduleGraphBuild: scheduleGraphBuild
  };
});
