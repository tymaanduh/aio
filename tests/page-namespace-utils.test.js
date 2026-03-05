const test = require("node:test");
const assert = require("node:assert/strict");

const { bindPageNamespace } = require("../brain/modules/page-namespace-utils.js");

test("bindPageNamespace binds handlers into window.page buckets", () => {
  const host = { page: { tree: { keep: true } } };
  const bound = bindPageNamespace(host, {
    tree: { reqRender: () => "tree" },
    universe: { reqRender: () => "universe" }
  });

  assert.equal(typeof host.page.tree.reqRender, "function");
  assert.equal(host.page.tree.keep, true);
  assert.equal(host.page.universe.reqRender(), "universe");
  assert.equal(bound.tree, host.page.tree);
  assert.equal(bound.universe, host.page.universe);
});
