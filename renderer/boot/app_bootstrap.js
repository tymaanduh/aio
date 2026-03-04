import { run_app_pre_load } from "./app_pre_load.js";
import { run_app_post_load } from "./app_post_load.js";
import { PATTERN_HOOK_SCOPE } from "../core/pattern_registry.js";
import { TEXT_TERM } from "../core/text_dictionary.js";
import {
  create_load_hook_api,
  ensure_load_hook_registry,
  publish_load_hook_api,
  register_post_load_hook,
  register_pre_load_hook
} from "../core/load_hook_registry.js";
import { APP_POST_LOAD_HOOK_ENTRY, APP_PRE_LOAD_HOOK_ENTRY, WINDOW_REGISTRY } from "./specs/app_hook_specs.js";
import {
  CONTROL_POST_LOAD_BINDINGS,
  CONTROL_PRE_LOAD_BINDINGS,
  PAGE_POST_LOAD_BINDINGS,
  PAGE_PRE_LOAD_BINDINGS
} from "./specs/hook_binding_specs.js";
import { LEGACY_SHELL_SCOPE, load_legacy_shell_scope } from "./legacy_module_loader.js";

const T = TEXT_TERM;

let ACTIVE_RENDERER_CTX = {};
const LOAD_HOOK_API = create_load_hook_api(() => ACTIVE_RENDERER_CTX);

function publish_renderer_ctx(ctx) {
  ACTIVE_RENDERER_CTX = ctx && typeof ctx === "object" ? ctx : {};
  globalThis.renderer_load_hook_ctx = ACTIVE_RENDERER_CTX;
  publish_load_hook_api(globalThis, LOAD_HOOK_API);
  return ACTIVE_RENDERER_CTX;
}

function append_hook_trace(ctx, label) {
  const trace = Array.isArray(ctx?.hook_trace) ? ctx.hook_trace.slice() : [];
  trace.push(String(label));
  return {
    ...ctx,
    hook_trace: trace
  };
}

function run_pre_load_bindings(ctx, bindings = []) {
  let next_ctx = ctx;
  (Array.isArray(bindings) ? bindings : []).forEach((binding) => {
    next_ctx = binding.runner(next_ctx);
    next_ctx = register_pre_load_hook(next_ctx, binding.hook_spec);
    next_ctx = append_hook_trace(next_ctx, `${binding.hook_spec.scope}.pre_load:${binding.hook_spec.key}`);
  });
  return next_ctx;
}

function run_post_load_bindings(ctx, bindings = []) {
  let next_ctx = ctx;
  (Array.isArray(bindings) ? bindings : []).forEach((binding) => {
    next_ctx = binding.runner(next_ctx);
    next_ctx = register_post_load_hook(next_ctx, binding.hook_spec);
    next_ctx = append_hook_trace(next_ctx, `${binding.hook_spec.scope}.post_load:${binding.hook_spec.key}`);
  });
  return next_ctx;
}

function to_legacy_scope(windowScope) {
  return windowScope === WINDOW_REGISTRY.LOGS ? LEGACY_SHELL_SCOPE.LOGS : LEGACY_SHELL_SCOPE.MAIN;
}

export function sync_renderer_hook_ctx(ctx = {}) {
  return publish_renderer_ctx(ensure_load_hook_registry(ctx));
}

export async function run_renderer_app_bootstrap(options = {}) {
  const input = options && typeof options === "object" ? options : {};
  let ctx = {
    ...input,
    window_scope: input.window_scope || WINDOW_REGISTRY.MAIN,
    hook_trace: Array.isArray(input.hook_trace) ? input.hook_trace.slice() : []
  };
  ctx = ensure_load_hook_registry(ctx);
  sync_renderer_hook_ctx(ctx);

  ctx = run_app_pre_load(ctx);
  ctx = register_pre_load_hook(ctx, APP_PRE_LOAD_HOOK_ENTRY);
  ctx = append_hook_trace(ctx, `${PATTERN_HOOK_SCOPE.APP}.${T.PRE_LOAD}:${APP_PRE_LOAD_HOOK_ENTRY.key}`);
  sync_renderer_hook_ctx(ctx);

  if (ctx.window_scope === WINDOW_REGISTRY.MAIN) {
    ctx = run_pre_load_bindings(ctx, PAGE_PRE_LOAD_BINDINGS);
    ctx = run_pre_load_bindings(ctx, CONTROL_PRE_LOAD_BINDINGS);
    sync_renderer_hook_ctx(ctx);
  }

  await load_legacy_shell_scope(to_legacy_scope(ctx.window_scope));

  if (ctx.window_scope === WINDOW_REGISTRY.MAIN) {
    ctx = run_post_load_bindings(ctx, CONTROL_POST_LOAD_BINDINGS);
    ctx = run_post_load_bindings(ctx, PAGE_POST_LOAD_BINDINGS);
    sync_renderer_hook_ctx(ctx);
  }

  ctx = run_app_post_load(ctx);
  ctx = register_post_load_hook(ctx, APP_POST_LOAD_HOOK_ENTRY);
  ctx = append_hook_trace(ctx, `${PATTERN_HOOK_SCOPE.APP}.${T.POST_LOAD}:${APP_POST_LOAD_HOOK_ENTRY.key}`);
  sync_renderer_hook_ctx(ctx);
  return ctx;
}
