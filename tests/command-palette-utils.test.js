const test = require("node:test");
const assert = require("node:assert/strict");

const { rankCommands } = require("../brain/modules/command-palette-utils.js");

test("command ranking prefers prefix and exact matches", () => {
  const commands = [{ label: "Export JSON" }, { label: "Export CSV" }, { label: "Archive Selected Entries" }];
  const ranked = rankCommands("export", commands);
  assert.equal(ranked.length >= 2, true);
  assert.equal(ranked[0].label.startsWith("Export"), true);
});
