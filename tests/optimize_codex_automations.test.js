const test = require("node:test");
const assert = require("node:assert/strict");

const { mappedRRule } = require("../scripts/optimize-codex-automations");
const { mappedPrompt, estimateTokens } = require("../scripts/optimize-codex-automations");

test("mappedRRule returns condition-gated hourly interval for known automation ids", () => {
  assert.equal(
    mappedRRule("aio-1pm-governance-gate", "FREQ=WEEKLY;BYDAY=MO;BYHOUR=13;BYMINUTE=0"),
    "FREQ=HOURLY;INTERVAL=2"
  );
  assert.equal(
    mappedRRule("aio-wrapper-mini-regression", "FREQ=WEEKLY;BYDAY=MO;BYHOUR=12;BYMINUTE=0"),
    "FREQ=HOURLY;INTERVAL=4"
  );
});

test("mappedRRule normalizes hourly rules and leaves unknown non-hourly rules unchanged", () => {
  assert.equal(mappedRRule("unknown-id", "FREQ=HOURLY;INTERVAL=03;BYMINUTE=15"), "FREQ=HOURLY;INTERVAL=3");
  assert.equal(
    mappedRRule("unknown-id", "FREQ=WEEKLY;BYDAY=MO;BYHOUR=9;BYMINUTE=0"),
    "FREQ=WEEKLY;BYDAY=MO;BYHOUR=9;BYMINUTE=0"
  );
});

test("mappedPrompt compacts continuous automations under policy cap", () => {
  const ids = ["aio-continuous-research-planner", "aio-continuous-backlog-executor", "iso-standards-watch"];
  ids.forEach((id) => {
    const prompt = mappedPrompt(id, "Run something verbose here.");
    assert.equal(/^Run\s+/i.test(prompt), true);
    assert.equal(prompt.includes("Inbox<=120t:"), true);
    assert.equal(estimateTokens(prompt) <= 36, true);
  });
});
