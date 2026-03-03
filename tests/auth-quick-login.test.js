"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const AUTH_MODULE_PATH = require.resolve("../main/auth.js");
const QUICK_LOGIN_ENV = "DICTIONARY_ENABLE_QUICK_LOGIN";

const authStateStub = Object.freeze({
  version: 1,
  account: null,
  lastAuthAt: null
});

function loadAuthModule() {
  delete require.cache[AUTH_MODULE_PATH];
  const auth = require("../main/auth.js");
  auth.injectDataIo({
    loadAuthState: async () => authStateStub,
    saveAuthState: async (state) => state
  });
  return auth;
}

test("quick login is disabled by default", async () => {
  const previous = process.env[QUICK_LOGIN_ENV];
  delete process.env[QUICK_LOGIN_ENV];
  try {
    const auth = loadAuthModule();
    const status = await auth.getAuthStatus();
    assert.equal(status.quickLoginEnabled, false);
  } finally {
    if (typeof previous === "undefined") {
      delete process.env[QUICK_LOGIN_ENV];
    } else {
      process.env[QUICK_LOGIN_ENV] = previous;
    }
  }
});

test("quick login can be enabled with DICTIONARY_ENABLE_QUICK_LOGIN=1", async () => {
  const previous = process.env[QUICK_LOGIN_ENV];
  process.env[QUICK_LOGIN_ENV] = "1";
  try {
    const auth = loadAuthModule();
    const status = await auth.getAuthStatus();
    assert.equal(status.quickLoginEnabled, true);
  } finally {
    if (typeof previous === "undefined") {
      delete process.env[QUICK_LOGIN_ENV];
    } else {
      process.env[QUICK_LOGIN_ENV] = previous;
    }
  }
});
