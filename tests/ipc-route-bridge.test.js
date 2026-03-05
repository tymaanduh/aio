"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { create_ipc_route_bridge } = require("../main/ipc/ipc_route_bridge.js");
const { IPC_CHANNELS } = require("../main/ipc/ipc_channels.js");

test("create_ipc_route_bridge creates catalog-driven service routes", async () => {
  const calls = [];
  const language_bridge_service = {
    load_bridge_state: () => ({ ok: true }),
    capture_sources: (payload) => ({ capture: payload }),
    compile_machine_descriptors: (payload) => ({ compile: payload }),
    search_keyword: (query, options) => ({ kind: "keyword", query, options }),
    search_triad: (query, options) => ({ kind: "triad", query, options }),
    search_glossary: (query, options) => ({ kind: "glossary", query, options }),
    search_machine_descriptor: (query, options) => ({ kind: "machine", query, options }),
    link_entry_artifacts: (entry_id, artifact_refs) => {
      calls.push([entry_id, artifact_refs]);
      return { linked: true };
    }
  };

  const specs = create_ipc_route_bridge({ language_bridge_service });
  assert.equal(specs.length, 8);

  const linkRoute = specs.find((route) => route.channel === IPC_CHANNELS.BRIDGE_LINK_ENTRY_ARTIFACTS);
  assert.ok(linkRoute);
  assert.equal(linkRoute.requires_auth, true);
  const result = await linkRoute.handler("entry_1", ["k1", "k2"]);
  assert.deepEqual(result, { linked: true });
  assert.deepEqual(calls, [["entry_1", ["k1", "k2"]]]);
});
