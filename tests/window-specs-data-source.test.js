"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const catalog = require("../data/input/shared/main/window_specs_catalog.json");
const {
  WINDOW_KEYS,
  WINDOW_SPEC_KEYS,
  WINDOW_RUNTIME_RULE_KEYS,
  WINDOW_DEFINITIONS,
  get_window_spec,
  get_window_runtime_rules
} = require("../main/windows/window_specs.js");

test("window specs load from data/input catalog", () => {
  assert.equal(WINDOW_KEYS.MAIN, catalog.window_keys.MAIN);
  assert.equal(WINDOW_KEYS.LOGS, catalog.window_keys.LOGS);

  assert.equal(
    WINDOW_DEFINITIONS[catalog.window_keys.MAIN][WINDOW_SPEC_KEYS.VIEW_FILE_NAME],
    catalog.window_definitions[catalog.window_keys.MAIN].view_file_name
  );
  assert.equal(
    WINDOW_DEFINITIONS[catalog.window_keys.LOGS][WINDOW_SPEC_KEYS.VIEW_FILE_NAME],
    catalog.window_definitions[catalog.window_keys.LOGS].view_file_name
  );
});

test("window spec/runtime fallbacks are returned for unknown keys", () => {
  const unknownSpec = get_window_spec("unknown_window_key");
  const unknownRules = get_window_runtime_rules("unknown_window_key");

  assert.equal(typeof unknownSpec[WINDOW_SPEC_KEYS.WINDOW_STYLE], "object");
  assert.equal(typeof unknownSpec[WINDOW_SPEC_KEYS.WEB_PREFERENCES], "object");
  assert.equal(typeof unknownSpec[WINDOW_SPEC_KEYS.VIEW_FILE_NAME], "string");
  assert.equal(Boolean(unknownRules[WINDOW_RUNTIME_RULE_KEYS.AUTO_SHOW_ON_READY]), false);
  assert.equal(Boolean(unknownRules[WINDOW_RUNTIME_RULE_KEYS.FORWARD_ON_CLOSED_CALLBACK]), false);
});
