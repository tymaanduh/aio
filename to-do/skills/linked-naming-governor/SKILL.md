---
name: linked-naming-governor
description: Enforce semantic, linked naming across objects, functions, groups, folders, and modules using a Window_Page_Control_Module chain and language-aware casing rules.
---

# Linked Naming Governor

Use this skill whenever names are created or renamed for:
- folders/files
- object keys and namespaces
- function names
- registries/config maps
- page/window/control/module group labels

## Naming Model

All names must map to a linked chain:

1. `window`
2. `page`
3. `control`
4. `module`

Every new name should keep that relationship visible in at least one of:
- path segment (`renderer/pages/universe_page/...`)
- registry key (`WINDOW_MAIN_PAGE_UNIVERSE_CONTROL_CANVAS_MODULE_RENDER`)
- object path (`window.page.universe.canvas.render`)
- function ownership (`universeCanvasRenderFrame`)

## Required Format by Scope

1. Folders/files:
- `snake_case`
- include layer suffix where applicable: `_window`, `_page`, `_control`, `_module`

2. Top-level registries/config maps:
- `UPPER_SNAKE`
- include linked chain labels if cross-layer (`WINDOW_*_PAGE_*_CONTROL_*_MODULE_*`)

3. Runtime namespaces:
- `G_*` for runtime groups
- `PATTERN_*` for reusable literals/maps

4. Functions:
- `camelCase`
- start with verb (`build`, `render`, `update`, `normalize`, `bind`, `create`, `resolve`)
- end with owned target noun (`renderUniverseCanvas`, `normalizeEntryLabels`)

5. Object keys:
- `camelCase` local keys
- explicit ownership for nested keys (`window.page.universe.controls.graph`)

## Blocking Rules

1. No ambiguous names:
- forbidden: `data`, `utils`, `helper`, `manager` without domain prefix.
- required: `entryData`, `treeUtils`, `universeControlBindings`.

2. No layer drift:
- same entity cannot be renamed with conflicting word order.
- if registry uses `WINDOW_MAIN_PAGE_UNIVERSE`, path and namespace must reflect same chain.

3. No orphan names:
- any `*_control` must map to a page/window owner.
- any `*_module` must map to a control/page owner.

4. No alias-only names unless documented:
- if abbreviated (`pg`, `ctrl`, `mod`, `cfg`, `idx`, `fx`), update in same pass:
  - `brain/modules/alias-index.js`
  - `data/input/shared/alias/alias_groups.js`

## Workflow

1. Build a naming spec first:
- `window_key`, `page_key`, `control_key`, `module_key`
- canonical English words before abbreviation.

2. Derive all name forms:
- folder/file name
- registry key
- object path
- function base names

3. Apply edit pass once:
- rename code + folder labels + pattern/group constants in one pass.

4. Run required validation:
- `npm run lint --silent`
- `npm test --silent`
- `npm run refactor:gate --silent` (or `npm run refactor:gate`)

## Template

```js
function createLinkedNameSpec({ windowKey, pageKey, controlKey, moduleKey, action }) {
  const upper = (value) => String(value || "").trim().replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase();
  const camel = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+([a-z0-9])/g, (_, char) => char.toUpperCase());

  const chainUpper = `WINDOW_${upper(windowKey)}_PAGE_${upper(pageKey)}_CONTROL_${upper(controlKey)}_MODULE_${upper(
    moduleKey
  )}`;

  return {
    folderPath: `windows/${windowKey}_window/pages/${pageKey}_page/controls/${controlKey}_control`,
    registryKey: chainUpper,
    objectPath: `window.page.${camel(pageKey)}.${camel(controlKey)}.${camel(moduleKey)}`,
    functionName: `${camel(action)}${camel(pageKey)[0].toUpperCase() + camel(pageKey).slice(1)}${
      camel(controlKey)[0].toUpperCase() + camel(controlKey).slice(1)
    }${camel(moduleKey)[0].toUpperCase() + camel(moduleKey).slice(1)}`
  };
}
```

## Completion Criteria

- Every introduced/renamed name follows scope casing rules.
- Linked ownership chain is preserved (`Window_Page_Control_Module`).
- Alias files updated in same pass when abbreviations are used.
- Lint/tests/refactor gate are green.

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
