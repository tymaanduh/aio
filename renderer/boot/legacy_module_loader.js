import { LEGACY_BASE_MODULES, LEGACY_SCOPE_ENTRY, LEGACY_SHELL_SCOPE } from "./legacy_module_manifest.js";

const LOADED_MODULES = new Set();

async function load_module(modulePath) {
  if (LOADED_MODULES.has(modulePath)) {
    return;
  }
  await import(modulePath);
  LOADED_MODULES.add(modulePath);
}

export async function load_legacy_shell_scope(windowScope = LEGACY_SHELL_SCOPE.MAIN) {
  const scopeKey = windowScope === LEGACY_SHELL_SCOPE.LOGS ? LEGACY_SHELL_SCOPE.LOGS : LEGACY_SHELL_SCOPE.MAIN;
  for (const modulePath of LEGACY_BASE_MODULES) {
    // Keep import order deterministic for legacy globals.
    // eslint-disable-next-line no-await-in-loop
    await load_module(modulePath);
  }
  const entryPath = LEGACY_SCOPE_ENTRY[scopeKey];
  if (entryPath) {
    await load_module(entryPath);
  }
}

export { LEGACY_SHELL_SCOPE };
