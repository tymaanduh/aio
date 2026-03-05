const test = require("node:test");
const assert = require("node:assert/strict");

const {
  UI_THEME_IDS,
  createDefaultUiPreferences,
  normalizeUiTheme,
  normalizeUiPreferences
} = require("../brain/modules/ui-preferences-utils.js");

test("ui preferences defaults are stable", () => {
  assert.deepEqual(UI_THEME_IDS, ["enterprise", "futuristic", "monochrome"]);
  assert.deepEqual(createDefaultUiPreferences(), {
    version: 1,
    theme: "futuristic",
    reduceMotion: false,
    updatedAt: null
  });
});

test("invalid ui theme falls back to futuristic", () => {
  assert.equal(normalizeUiTheme(""), "futuristic");
  assert.equal(normalizeUiTheme("nope"), "futuristic");
  assert.equal(normalizeUiTheme("futuristic"), "futuristic");
});

test("normalize ui preferences handles malformed payloads", () => {
  const normalized = normalizeUiPreferences({
    version: 99,
    theme: "invalid-theme",
    reduceMotion: "yes",
    updatedAt: 4
  });
  assert.deepEqual(normalized, {
    version: 1,
    theme: "futuristic",
    reduceMotion: true,
    updatedAt: null
  });
});
