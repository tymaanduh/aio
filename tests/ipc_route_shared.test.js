"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  create_service_method_handler,
  create_ipc_route_specs_from_service_catalog
} = require("../main/ipc/ipc_route_shared.js");

test("create_service_method_handler delegates args to service method", () => {
  const calls = [];
  const service = {
    ping: (...args) => {
      calls.push(args);
      return "pong";
    }
  };

  const handler = create_service_method_handler(service, "ping");
  const result = handler("a", "b");
  assert.equal(result, "pong");
  assert.deepEqual(calls, [["a", "b"]]);
});

test("create_ipc_route_specs_from_service_catalog builds route specs", () => {
  const service = {
    one: () => 1,
    two: (value) => value * 2
  };
  const specs = create_ipc_route_specs_from_service_catalog({
    channel_lookup: {
      C_ONE: "route:one",
      C_TWO: "route:two"
    },
    route_rows: [
      { channel_key: "C_ONE", method_name: "one" },
      { channel_key: "C_TWO", method_name: "two" }
    ],
    requires_auth: true,
    service
  });

  assert.equal(specs.length, 2);
  assert.equal(specs[0].channel, "route:one");
  assert.equal(specs[0].requires_auth, true);
  assert.equal(specs[0].handler(), 1);
  assert.equal(specs[1].handler(4), 8);
});
