"use strict";

const auth = require("../auth.js");

const authRepositoryBinding = Object.freeze({
  LOAD_AUTH_STATE: "loadAuthState",
  SAVE_AUTH_STATE: "saveAuthState"
});

function inject_auth_repository(deps) {
  auth.injectDataIo({
    [authRepositoryBinding.LOAD_AUTH_STATE]: deps.load_auth_state,
    [authRepositoryBinding.SAVE_AUTH_STATE]: deps.save_auth_state
  });
}

const authServiceApi = Object.freeze({
  inject_auth_repository,
  ensure_authenticated: auth.ensureAuthenticated,
  get_auth_status: auth.getAuthStatus,
  create_account: auth.createAccount,
  login: auth.login,
  logout: auth.logout,
  lookup_definition_online: auth.lookupDefinitionOnline
});

module.exports = authServiceApi;
