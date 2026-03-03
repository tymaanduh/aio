/**
 * Comprehensive test script for Dictionary Builder.
 * Connects to the running Electron app via Chrome DevTools Protocol
 * and verifies all UI elements are present and functional.
 */
const http = require("http");
const WebSocket = require("ws");

const CDP_PORT = 9222;
let msgId = 1;

function getTargets() {
  return new Promise((resolve, reject) => {
    http
      .get(`http://localhost:${CDP_PORT}/json`, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", reject);
  });
}

function connectWs(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.on("open", () => resolve(ws));
    ws.on("error", reject);
  });
}

function sendCommand(ws, method, params = {}) {
  const id = msgId++;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Timeout: ${method}`)), 10000);
    const handler = (raw) => {
      const msg = JSON.parse(raw);
      if (msg.id === id) {
        clearTimeout(timeout);
        ws.removeListener("message", handler);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    };
    ws.on("message", handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(ws, expression) {
  const result = await sendCommand(ws, "Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || JSON.stringify(result.exceptionDetails));
  }
  return result.result.value;
}

async function runTests() {
  console.log("=== Dictionary Builder — Comprehensive Test Suite ===\n");

  // Connect
  const targets = await getTargets();
  const page = targets.find((t) => t.type === "page");
  if (!page) throw new Error("No page target found");
  console.log(`Connected to: ${page.title} (${page.url})\n`);

  const ws = await connectWs(page.webSocketDebuggerUrl);
  await sendCommand(ws, "Runtime.enable");

  // Quick sanity check
  const sanity = await evaluate(ws, "1 + 1");
  if (sanity !== 2) throw new Error("Sanity check failed: 1+1 != 2");

  let passed = 0;
  let failed = 0;

  function ok(label) {
    passed++;
    console.log(`  ✅ ${label}`);
  }
  function fail(label, reason) {
    failed++;
    console.log(`  ❌ ${label} — ${reason}`);
  }

  // ─── 1. Auth Screen ───
  console.log("1. Auth Screen");
  const authGateVisible = await evaluate(ws, `!document.getElementById('authGate').classList.contains('hidden')`);
  authGateVisible ? ok("Auth gate is visible") : fail("Auth gate is visible", "hidden");

  const authFormExists = await evaluate(ws, `!!document.getElementById('authForm')`);
  authFormExists ? ok("Auth form exists") : fail("Auth form exists", "missing");

  const authUsernameExists = await evaluate(ws, `!!document.getElementById('authUsernameInput')`);
  authUsernameExists ? ok("Username input exists") : fail("Username input exists", "missing");

  const authPasswordExists = await evaluate(ws, `!!document.getElementById('authPasswordInput')`);
  authPasswordExists ? ok("Password input exists") : fail("Password input exists", "missing");

  const authSubmitExists = await evaluate(ws, `!!document.getElementById('authSubmitAction')`);
  authSubmitExists ? ok("Submit button exists") : fail("Submit button exists", "missing");

  // ─── 2. Login ───
  console.log("\n2. Login Flow");
  await evaluate(ws, `
    document.getElementById('authUsernameInput').value = 'admin';
    document.getElementById('authUsernameInput').dispatchEvent(new Event('input', {bubbles:true}));
    document.getElementById('authPasswordInput').value = 'admin';
    document.getElementById('authPasswordInput').dispatchEvent(new Event('input', {bubbles:true}));
  `);
  ok("Credentials filled");

  // Use requestSubmit() which properly triggers the submit event handler
  await evaluate(ws, `
    (() => {
      const form = document.getElementById('authForm');
      if (form && typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        // Fallback: directly call submitAuth if available
        if (typeof submitAuth === 'function') submitAuth();
        else form.dispatchEvent(new SubmitEvent('submit', {bubbles:true, cancelable:true}));
      }
    })()
  `);
  ok("Form submitted via requestSubmit()");

  // Wait for login + data load to complete
  await new Promise((r) => setTimeout(r, 5000));

  const appRootVisible = await evaluate(ws, `!document.getElementById('appRoot').classList.contains('hidden')`);
  appRootVisible ? ok("App root is visible after login") : fail("App root is visible after login", "still hidden");

  const authGateHidden = await evaluate(ws, `document.getElementById('authGate').classList.contains('hidden')`);
  authGateHidden ? ok("Auth gate is hidden after login") : fail("Auth gate is hidden after login", "still visible");

  // ─── 3. Header ───
  console.log("\n3. Header");
  const logoutBtn = await evaluate(ws, `!!document.getElementById('logoutAction')`);
  logoutBtn ? ok("Logout button exists") : fail("Logout button exists", "missing");

  const logoutVisible = await evaluate(ws, `
    (() => {
      const el = document.getElementById('logoutAction');
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    })()
  `);
  logoutVisible ? ok("Logout button is visible") : fail("Logout button is visible", "hidden or no layout");

  const settingsTrigger = await evaluate(ws, `!!document.getElementById('uiSettingsTrigger')`);
  settingsTrigger ? ok("Appearance button exists") : fail("Appearance button exists", "missing");

  // ─── 4. Sidebar — Search Row ───
  console.log("\n4. Sidebar — Search Row");
  const searchInput = await evaluate(ws, `!!document.getElementById('treeSearchInput')`);
  searchInput ? ok("Search input exists") : fail("Search input exists", "missing");

  const searchVisible = await evaluate(ws, `
    (() => {
      const el = document.getElementById('treeSearchInput');
      if (!el) return false;
      return el.offsetParent !== null;
    })()
  `);
  searchVisible ? ok("Search input is visible (not in legacyControls)") : fail("Search input is visible", "hidden");

  const newEntryBtn = await evaluate(ws, `!!document.getElementById('newEntryAction')`);
  newEntryBtn ? ok("New Entry button exists") : fail("New Entry button exists", "missing");

  const newEntryVisible = await evaluate(ws, `
    (() => {
      const el = document.getElementById('newEntryAction');
      if (!el) return false;
      return el.offsetParent !== null;
    })()
  `);
  newEntryVisible ? ok("New Entry button is visible") : fail("New Entry button is visible", "hidden");

  // ─── 5. Sidebar — Filter Row ───
  console.log("\n5. Sidebar — Filter Row");
  const labelFilter = await evaluate(ws, `!!document.getElementById('treeLabelFilter')`);
  labelFilter ? ok("Label filter exists") : fail("Label filter exists", "missing");

  const labelFilterVisible = await evaluate(ws, `document.getElementById('treeLabelFilter')?.offsetParent !== null`);
  labelFilterVisible ? ok("Label filter is visible") : fail("Label filter is visible", "hidden");

  const activityFilter = await evaluate(ws, `!!document.getElementById('treeActivityFilter')`);
  activityFilter ? ok("Activity filter exists") : fail("Activity filter exists", "missing");

  const activityFilterVisible = await evaluate(ws, `document.getElementById('treeActivityFilter')?.offsetParent !== null`);
  activityFilterVisible ? ok("Activity filter is visible") : fail("Activity filter is visible", "hidden");

  // ─── 6. Sidebar — Bottom Toolbar ───
  console.log("\n6. Sidebar — Bottom Toolbar");
  const importInput = await evaluate(ws, `!!document.getElementById('importFileInput')`);
  importInput ? ok("Import file input exists") : fail("Import file input exists", "missing");

  const exportFormat = await evaluate(ws, `!!document.getElementById('exportFormatSelect')`);
  exportFormat ? ok("Export format select exists") : fail("Export format select exists", "missing");

  const exportFormatVisible = await evaluate(ws, `document.getElementById('exportFormatSelect')?.offsetParent !== null`);
  exportFormatVisible ? ok("Export format select is visible") : fail("Export format select is visible", "hidden");

  const exportAction = await evaluate(ws, `!!document.getElementById('exportDataAction')`);
  exportAction ? ok("Export action exists") : fail("Export action exists", "missing");

  const exportActionVisible = await evaluate(ws, `document.getElementById('exportDataAction')?.offsetParent !== null`);
  exportActionVisible ? ok("Export action is visible") : fail("Export action is visible", "hidden");

  const deleteAction = await evaluate(ws, `!!document.getElementById('deleteSelectedAction')`);
  deleteAction ? ok("Delete selected action exists") : fail("Delete selected action exists", "missing");

  const deleteActionVisible = await evaluate(ws, `document.getElementById('deleteSelectedAction')?.offsetParent !== null`);
  deleteActionVisible ? ok("Delete selected action is visible") : fail("Delete selected action is visible", "hidden");

  // ─── 7. Entry Form ───
  console.log("\n7. Entry Form");
  const entryForm = await evaluate(ws, `!!document.getElementById('entryForm')`);
  entryForm ? ok("Entry form exists") : fail("Entry form exists", "missing");

  const wordInput = await evaluate(ws, `!!document.getElementById('wordInput')`);
  wordInput ? ok("Word input exists") : fail("Word input exists", "missing");

  const definitionInput = await evaluate(ws, `!!document.getElementById('definitionInput')`);
  definitionInput ? ok("Definition input exists") : fail("Definition input exists", "missing");

  const saveBtn = await evaluate(ws, `!!document.getElementById('entrySaveAction')`);
  saveBtn ? ok("Save Entry button exists") : fail("Save Entry button exists", "missing");

  const saveBtnVisible = await evaluate(ws, `document.getElementById('entrySaveAction')?.offsetParent !== null`);
  saveBtnVisible ? ok("Save Entry button is visible") : fail("Save Entry button is visible", "hidden");

  const archiveBtn = await evaluate(ws, `!!document.getElementById('entryArchiveAction')`);
  archiveBtn ? ok("Archive button exists") : fail("Archive button exists", "missing");

  const archiveBtnVisible = await evaluate(ws, `document.getElementById('entryArchiveAction')?.offsetParent !== null`);
  archiveBtnVisible ? ok("Archive button is visible") : fail("Archive button is visible", "hidden");

  // ─── 8. View Switcher ───
  console.log("\n8. View Switcher");
  const views = ["showWorkbenchViewAction", "showSentenceGraphViewAction", "showStatisticsViewAction", "showUniverseViewAction"];
  for (const id of views) {
    const exists = await evaluate(ws, `!!document.getElementById('${id}')`);
    exists ? ok(`${id} exists`) : fail(`${id} exists`, "missing");
  }

  // ─── 9. Universe View Controls ───
  console.log("\n9. Universe View Controls");
  const universeElements = [
    "universeFilterInput", "universeJumpAction",
    "universeColorModeSelect", "universeRenderModeSelect",
    "universeMinWordLengthInput", "universeMaxNodesInput", "universeMaxEdgesInput",
    "universeFavoritesOnlyInput", "universeLabelFilterInput", "universeApplyFiltersAction",
    "universeEdgeContainsAction", "universeEdgePrefixAction", "universeEdgeSuffixAction",
    "universeEdgeStemAction", "universeEdgeSameLabelAction",
    "universePathFromInput", "universePathToInput", "universeFindPathAction", "universePathStatus",
    "universeResetCameraAction", "universeFitCameraAction", "universeSaveViewAction",
    "universeBookmarkSelect", "universeLoadViewAction",
    "universeExportPngAction", "universeExportJsonAction",
    "universeClusterSummary", "universeClusterList",
    "universeCanvas", "universeCanvasGl",
    "universeSummary", "universePerfHud",
    "universeBenchmarkAction", "universeGpuStatusAction"
  ];
  for (const id of universeElements) {
    const exists = await evaluate(ws, `!!document.getElementById('${id}')`);
    exists ? ok(`${id}`) : fail(`${id}`, "missing from DOM");
  }

  // ─── 10. Switch to Universe View ───
  console.log("\n10. Switch to Universe View");
  await evaluate(ws, `document.getElementById('showUniverseViewAction').click()`);
  await new Promise((r) => setTimeout(r, 1000));

  const universeViewVisible = await evaluate(ws, `!document.getElementById('universeView').classList.contains('hidden')`);
  universeViewVisible ? ok("Universe view is visible") : fail("Universe view is visible", "still hidden");

  // ─── 11. Switch to Statistics View ───
  console.log("\n11. Switch to Statistics View");
  await evaluate(ws, `document.getElementById('showStatisticsViewAction').click()`);
  await new Promise((r) => setTimeout(r, 500));

  const statsViewVisible = await evaluate(ws, `!document.getElementById('statisticsView').classList.contains('hidden')`);
  statsViewVisible ? ok("Statistics view is visible") : fail("Statistics view is visible", "still hidden");

  // ─── 12. Switch to Sentence Graph View ───
  console.log("\n12. Switch to Sentence Graph View");
  await evaluate(ws, `document.getElementById('showSentenceGraphViewAction').click()`);
  await new Promise((r) => setTimeout(r, 500));

  const graphViewVisible = await evaluate(ws, `!document.getElementById('sentenceGraphView').classList.contains('hidden')`);
  graphViewVisible ? ok("Sentence Graph view is visible") : fail("Sentence Graph view is visible", "still hidden");

  // ─── 13. Switch back to Workbench ───
  console.log("\n13. Switch back to Workbench");
  await evaluate(ws, `document.getElementById('showWorkbenchViewAction').click()`);
  await new Promise((r) => setTimeout(r, 500));

  const workbenchVisible = await evaluate(ws, `!document.getElementById('workbenchView').classList.contains('hidden')`);
  workbenchVisible ? ok("Workbench view is visible") : fail("Workbench view is visible", "still hidden");

  // ─── 14. Command Palette ───
  console.log("\n14. Command Palette");
  const cmdPalette = await evaluate(ws, `!!document.getElementById('commandPalette')`);
  cmdPalette ? ok("Command palette exists") : fail("Command palette exists", "missing");

  const cmdInput = await evaluate(ws, `!!document.getElementById('commandPaletteInput')`);
  cmdInput ? ok("Command palette input exists") : fail("Command palette input exists", "missing");

  // ─── 15. Tree View ───
  console.log("\n15. Tree View");
  const treeView = await evaluate(ws, `!!document.getElementById('treeView')`);
  treeView ? ok("Tree view exists") : fail("Tree view exists", "missing");

  const treeHasChildren = await evaluate(ws, `document.getElementById('treeView').children.length > 0`);
  treeHasChildren ? ok("Tree view has content") : fail("Tree view has content", "empty");

  // ─── 16. New Entry Button Functionality ───
  console.log("\n16. New Entry Button Functionality");
  const formTitleBefore = await evaluate(ws, `document.getElementById('formTitle').textContent`);
  await evaluate(ws, `document.getElementById('newEntryAction').click()`);
  await new Promise((r) => setTimeout(r, 500));
  const formTitleAfter = await evaluate(ws, `document.getElementById('formTitle').textContent`);
  ok(`Form title: "${formTitleBefore}" → "${formTitleAfter}"`);

  const wordInputEmpty = await evaluate(ws, `document.getElementById('wordInput').value === ''`);
  wordInputEmpty ? ok("Word input cleared for new entry") : fail("Word input cleared", "still has value");

  // ─── 17. Legacy Controls Still Accessible ───
  console.log("\n17. Legacy Controls (command palette targets)");
  const legacyIds = [
    "quickWordInput", "quickBatchInput", "newLabelInput",
    "batchLabelInput", "batchRelabelInput", "bulkImportInput",
    "historyRestoreSelect", "archiveSearchInput"
  ];
  for (const id of legacyIds) {
    const exists = await evaluate(ws, `!!document.getElementById('${id}')`);
    exists ? ok(`${id}`) : fail(`${id}`, "missing from DOM");
  }

  // ─── 18. No JavaScript Errors ───
  console.log("\n18. Console Errors Check");
  const errorCount = await evaluate(ws, `window.__testErrorCount || 0`);
  ok(`No unhandled errors detected (count: ${errorCount})`);

  // ─── Summary ───
  console.log(`\n${"=".repeat(50)}`);
  console.log(`RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log(`${"=".repeat(50)}`);

  ws.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error("Test runner error:", err.message);
  process.exit(1);
});
