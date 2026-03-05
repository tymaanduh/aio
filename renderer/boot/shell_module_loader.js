import { SHELL_BASE_MODULES, SHELL_SCOPE_ENTRY, SHELL_SCOPE } from "./shell_module_manifest.js";

const LOADED_MODULES = new Set();

async function load_module(modulePath) {
  if (LOADED_MODULES.has(modulePath)) {
    return;
  }
  await import(modulePath);
  LOADED_MODULES.add(modulePath);
}

export async function load_shell_scope(windowScope = SHELL_SCOPE.MAIN) {
  const scopeKey = windowScope === SHELL_SCOPE.LOGS ? SHELL_SCOPE.LOGS : SHELL_SCOPE.MAIN;
  for (const modulePath of SHELL_BASE_MODULES) {
    // Keep import order deterministic for shell globals.
    // eslint-disable-next-line no-await-in-loop
    await load_module(modulePath);
  }
  const entryPath = SHELL_SCOPE_ENTRY[scopeKey];
  if (entryPath) {
    await load_module(entryPath);
  }
}

export { SHELL_SCOPE };
