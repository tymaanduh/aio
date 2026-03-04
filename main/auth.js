"use strict";

const crypto = require("crypto");
const { cleanText, normalizeUsername, normalizePassword } = require("./normalize.js");
const { append_runtime_log: appendRuntimeLog } = require("./services/runtime_log_service.js");

const AUTH_RESULT = Object.freeze({
  OK: true,
  FAIL: false
});

const AUTH_ENV = Object.freeze({
  QUICK_LOGIN_ENABLED: "DICTIONARY_ENABLE_QUICK_LOGIN",
  ENABLED_VALUE: "1"
});

const AUTH_LOG_LEVEL = Object.freeze({
  INFO: "info",
  WARN: "warn"
});

const AUTH_LOG_SOURCE = Object.freeze({
  AUTH: "auth",
  LOOKUP: "lookup"
});

const AUTH_LOG_CONTEXT = Object.freeze({
  CREATE_ACCOUNT: "createAccount",
  LOGIN: "login",
  LOGOUT: "logout"
});

const AUTH_LOGIN_LIMITS = Object.freeze({
  ATTEMPT_WINDOW_MS: 60 * 1000,
  ATTEMPT_LIMIT: 10,
  USERNAME_MIN_LENGTH: 3,
  PASSWORD_MIN_LENGTH: 4
});

const AUTH_HASH = Object.freeze({
  HASH_OUTPUT_BYTES: 64,
  SALT_BYTES: 16,
  HEX_ENCODING: "hex"
});

const AUTH_PARSE_LIMITS = Object.freeze({
  ENTRY_COUNT_MAX: 2,
  DEFINITION_COUNT_MAX: 3,
  PART_OF_SPEECH_TEXT_MAX: 50,
  DEFINITION_TEXT_MAX: 500,
  DEFINITION_LIST_MAX: 12,
  DEFINITION_BLOCK_TEXT_MAX: 5000,
  PART_OF_SPEECH_LABEL_MAX: 60
});

const AUTH_LOOKUP = Object.freeze({
  BASE_URL: "https://api.dictionaryapi.dev/api/v2/entries/en/",
  REQUEST_METHOD: "GET",
  REQUEST_ACCEPT: "application/json",
  TIMEOUT_MS: 6000,
  WORD_TEXT_MAX: 120,
  API_ERROR_TEXT_MAX: 300,
  LOG_ERROR_CONTEXT_MAX: 260
});

const AUTH_TEXT = Object.freeze({
  AUTH_REQUIRED: "Authentication required.",
  QUICK_LOGIN_ACCEPTED: "Quick login accepted for",
  ACCOUNT_CREATED: "Account created for",
  LOGIN_SUCCESS: "Login successful for",
  LOGOUT_SUCCESS: "Session logged out.",
  USERNAME_TOO_SHORT: "Username must be at least 3 characters.",
  PASSWORD_TOO_SHORT: "Password must be at least 4 characters.",
  ACCOUNT_EXISTS: "Account already exists. Please log in.",
  LOGIN_RATE_LIMIT: "Too many login attempts. Wait one minute and try again.",
  NO_ACCOUNT: "No account found. Create an account first.",
  CREDENTIALS_REQUIRED: "Username and password are required.",
  INVALID_USERNAME_OR_PASSWORD: "Invalid username or password.",
  LOOKUP_ENTER_WORD: "Enter a word first.",
  LOOKUP_NOT_FOUND: "Definition not found.",
  LOOKUP_NO_USABLE_DEFINITION: "No usable definition returned.",
  LOOKUP_FAILED: "Lookup failed. Check your internet connection.",
  LOOKUP_FAILED_FOR: "Lookup failed for",
  INVALID_PART_OF_SPEECH_PREFIX_LEFT: "[",
  INVALID_PART_OF_SPEECH_PREFIX_RIGHT: "] "
});

const AUTH_BUILTIN_ACCOUNTS = Object.freeze([
  { username: "admin", password: "admin" },
  { username: "demo", password: "demo" },
  { username: "root", password: "root" },
  { username: "user", password: "user" },
  { username: "guest", password: "guest" }
]);

const AUTH_BUILTIN_ACCOUNT_MAP = new Map(
  AUTH_BUILTIN_ACCOUNTS.map((account) => [`${account.username}:${account.password}`, account.username])
);

let auth_session_unlocked = false;
const login_attempt_timestamps = [];

const AUTH_DATA_IO = {
  load_auth_state: null,
  save_auth_state: null
};

function now_iso() {
  return new Date().toISOString();
}

function create_auth_ok(fields = {}) {
  return {
    ok: AUTH_RESULT.OK,
    ...fields
  };
}

function create_auth_error(error_message) {
  return {
    ok: AUTH_RESULT.FAIL,
    error: error_message
  };
}

function append_auth_runtime_log(level, source, message, context) {
  appendRuntimeLog({
    level,
    source,
    message,
    context
  });
}

function format_quoted_message(prefix, value) {
  return `${prefix} "${value}".`;
}

function injectDataIo({ loadAuthState, saveAuthState }) {
  AUTH_DATA_IO.load_auth_state = loadAuthState;
  AUTH_DATA_IO.save_auth_state = saveAuthState;
}

function isQuickLoginEnabled() {
  return process.env[AUTH_ENV.QUICK_LOGIN_ENABLED] === AUTH_ENV.ENABLED_VALUE;
}

function resolve_builtin_account_username(username, password) {
  if (!isQuickLoginEnabled()) {
    return "";
  }
  return AUTH_BUILTIN_ACCOUNT_MAP.get(`${username}:${password}`) || "";
}

function prune_login_attempts(now_ms) {
  while (
    login_attempt_timestamps.length > 0 &&
    now_ms - login_attempt_timestamps[0] > AUTH_LOGIN_LIMITS.ATTEMPT_WINDOW_MS
  ) {
    login_attempt_timestamps.shift();
  }
}

function can_attempt_login() {
  const now_ms = Date.now();
  prune_login_attempts(now_ms);
  return login_attempt_timestamps.length < AUTH_LOGIN_LIMITS.ATTEMPT_LIMIT;
}

function record_failed_login_attempt() {
  const now_ms = Date.now();
  prune_login_attempts(now_ms);
  login_attempt_timestamps.push(now_ms);
}

function safeCompareHex(left_hex, right_hex) {
  if (typeof left_hex !== "string" || typeof right_hex !== "string") {
    return false;
  }

  try {
    const left = Buffer.from(left_hex, AUTH_HASH.HEX_ENCODING);
    const right = Buffer.from(right_hex, AUTH_HASH.HEX_ENCODING);
    if (left.length === 0 || right.length === 0 || left.length !== right.length) {
      return false;
    }
    return crypto.timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

function hashPassword(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, AUTH_HASH.HASH_OUTPUT_BYTES, (error, derived_key) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(derived_key.toString(AUTH_HASH.HEX_ENCODING));
    });
  });
}

function ensureAuthenticated() {
  if (!auth_session_unlocked) {
    throw new Error(AUTH_TEXT.AUTH_REQUIRED);
  }
}

async function load_auth_state() {
  return AUTH_DATA_IO.load_auth_state();
}

async function save_auth_state(state) {
  return AUTH_DATA_IO.save_auth_state(state);
}

function try_quick_login(username, password, context) {
  const builtin_username = resolve_builtin_account_username(username, password);
  if (!builtin_username) {
    return null;
  }

  auth_session_unlocked = true;
  append_auth_runtime_log(
    AUTH_LOG_LEVEL.INFO,
    AUTH_LOG_SOURCE.AUTH,
    format_quoted_message(AUTH_TEXT.QUICK_LOGIN_ACCEPTED, builtin_username),
    context
  );
  return create_auth_ok({ username: builtin_username });
}

function validate_new_account_credentials(username, password) {
  if (username.length < AUTH_LOGIN_LIMITS.USERNAME_MIN_LENGTH) {
    return AUTH_TEXT.USERNAME_TOO_SHORT;
  }
  if (password.length < AUTH_LOGIN_LIMITS.PASSWORD_MIN_LENGTH) {
    return AUTH_TEXT.PASSWORD_TOO_SHORT;
  }
  return "";
}

function create_login_error_response(error_message, should_record_attempt = true) {
  if (should_record_attempt) {
    record_failed_login_attempt();
  }
  return create_auth_error(error_message);
}

async function getAuthStatus() {
  const auth_state = await load_auth_state();
  return {
    hasAccount: Boolean(auth_state.account),
    username: auth_state.account?.username || null,
    quickLoginEnabled: isQuickLoginEnabled()
  };
}

async function createAccount(rawUsername, rawPassword) {
  const username = normalizeUsername(rawUsername);
  const password = normalizePassword(rawPassword);

  const quick_login_result = try_quick_login(username, password, AUTH_LOG_CONTEXT.CREATE_ACCOUNT);
  if (quick_login_result) {
    return quick_login_result;
  }

  const validation_error = validate_new_account_credentials(username, password);
  if (validation_error) {
    return create_auth_error(validation_error);
  }

  const auth_state = await load_auth_state();
  if (auth_state.account) {
    return create_auth_error(AUTH_TEXT.ACCOUNT_EXISTS);
  }

  const timestamp = now_iso();
  const salt = crypto.randomBytes(AUTH_HASH.SALT_BYTES).toString(AUTH_HASH.HEX_ENCODING);
  const password_hash = await hashPassword(password, salt);

  auth_state.account = {
    username,
    salt,
    passwordHash: password_hash,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  auth_state.lastAuthAt = timestamp;

  await save_auth_state(auth_state);
  auth_session_unlocked = true;
  append_auth_runtime_log(
    AUTH_LOG_LEVEL.INFO,
    AUTH_LOG_SOURCE.AUTH,
    format_quoted_message(AUTH_TEXT.ACCOUNT_CREATED, username),
    AUTH_LOG_CONTEXT.CREATE_ACCOUNT
  );

  return create_auth_ok({ username });
}

async function login(rawUsername, rawPassword) {
  if (!can_attempt_login()) {
    return create_auth_error(AUTH_TEXT.LOGIN_RATE_LIMIT);
  }

  const username = normalizeUsername(rawUsername);
  const password = normalizePassword(rawPassword);

  const quick_login_result = try_quick_login(username, password, AUTH_LOG_CONTEXT.LOGIN);
  if (quick_login_result) {
    return quick_login_result;
  }

  const auth_state = await load_auth_state();
  const account = auth_state.account;

  if (!account) {
    return create_login_error_response(AUTH_TEXT.NO_ACCOUNT);
  }
  if (!username || !password) {
    return create_login_error_response(AUTH_TEXT.CREDENTIALS_REQUIRED);
  }
  if (username !== account.username) {
    return create_login_error_response(AUTH_TEXT.INVALID_USERNAME_OR_PASSWORD);
  }

  const attempted_hash = await hashPassword(password, account.salt);
  if (!safeCompareHex(attempted_hash, account.passwordHash)) {
    return create_login_error_response(AUTH_TEXT.INVALID_USERNAME_OR_PASSWORD);
  }

  auth_state.lastAuthAt = now_iso();
  await save_auth_state(auth_state);
  auth_session_unlocked = true;
  append_auth_runtime_log(
    AUTH_LOG_LEVEL.INFO,
    AUTH_LOG_SOURCE.AUTH,
    format_quoted_message(AUTH_TEXT.LOGIN_SUCCESS, account.username),
    AUTH_LOG_CONTEXT.LOGIN
  );

  return create_auth_ok({ username: account.username });
}

function logout() {
  auth_session_unlocked = false;
  append_auth_runtime_log(AUTH_LOG_LEVEL.INFO, AUTH_LOG_SOURCE.AUTH, AUTH_TEXT.LOGOUT_SUCCESS, AUTH_LOG_CONTEXT.LOGOUT);
  return create_auth_ok();
}

function parseOnlineDefinitionResponse(payload) {
  if (!Array.isArray(payload) || payload.length === 0) {
    return null;
  }

  const lines = [];
  const part_of_speech_labels = new Set();
  let index = 1;

  for (const entry of payload.slice(0, AUTH_PARSE_LIMITS.ENTRY_COUNT_MAX)) {
    const meanings = Array.isArray(entry?.meanings) ? entry.meanings : [];
    for (const meaning of meanings) {
      const part_of_speech = cleanText(meaning?.partOfSpeech || "", AUTH_PARSE_LIMITS.PART_OF_SPEECH_TEXT_MAX);
      if (part_of_speech) {
        part_of_speech_labels.add(part_of_speech);
      }

      const definitions = Array.isArray(meaning?.definitions) ? meaning.definitions : [];
      for (const definition of definitions.slice(0, AUTH_PARSE_LIMITS.DEFINITION_COUNT_MAX)) {
        const text = cleanText(definition?.definition || "", AUTH_PARSE_LIMITS.DEFINITION_TEXT_MAX);
        if (!text) {
          continue;
        }
        const prefix = part_of_speech
          ? `${AUTH_TEXT.INVALID_PART_OF_SPEECH_PREFIX_LEFT}${part_of_speech}${AUTH_TEXT.INVALID_PART_OF_SPEECH_PREFIX_RIGHT}`
          : "";
        lines.push(`${index}. ${prefix}${text}`);
        index += 1;
        if (lines.length >= AUTH_PARSE_LIMITS.DEFINITION_LIST_MAX) {
          break;
        }
      }
      if (lines.length >= AUTH_PARSE_LIMITS.DEFINITION_LIST_MAX) {
        break;
      }
    }
    if (lines.length >= AUTH_PARSE_LIMITS.DEFINITION_LIST_MAX) {
      break;
    }
  }

  if (lines.length === 0) {
    return null;
  }

  return {
    definition: lines.join("\n").slice(0, AUTH_PARSE_LIMITS.DEFINITION_BLOCK_TEXT_MAX),
    labels: Array.from(part_of_speech_labels)
      .map((label) => cleanText(label, AUTH_PARSE_LIMITS.PART_OF_SPEECH_LABEL_MAX))
      .filter(Boolean)
  };
}

async function lookupDefinitionOnline(rawWord) {
  const word = cleanText(rawWord, AUTH_LOOKUP.WORD_TEXT_MAX);
  if (!word) {
    return create_auth_error(AUTH_TEXT.LOOKUP_ENTER_WORD);
  }

  const url = `${AUTH_LOOKUP.BASE_URL}${encodeURIComponent(word)}`;
  const abort_controller = new AbortController();
  const timeout_id = setTimeout(() => abort_controller.abort(), AUTH_LOOKUP.TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: AUTH_LOOKUP.REQUEST_METHOD,
      headers: { Accept: AUTH_LOOKUP.REQUEST_ACCEPT },
      signal: abort_controller.signal
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message = cleanText(payload?.message || "", AUTH_LOOKUP.API_ERROR_TEXT_MAX) || AUTH_TEXT.LOOKUP_NOT_FOUND;
      return create_auth_error(message);
    }

    const parsed = parseOnlineDefinitionResponse(payload);
    if (!parsed) {
      return create_auth_error(AUTH_TEXT.LOOKUP_NO_USABLE_DEFINITION);
    }

    return create_auth_ok({
      definition: parsed.definition,
      labels: parsed.labels
    });
  } catch (error) {
    append_auth_runtime_log(
      AUTH_LOG_LEVEL.WARN,
      AUTH_LOG_SOURCE.LOOKUP,
      format_quoted_message(AUTH_TEXT.LOOKUP_FAILED_FOR, word),
      cleanText(String(error?.message || error), AUTH_LOOKUP.LOG_ERROR_CONTEXT_MAX)
    );
    return create_auth_error(AUTH_TEXT.LOOKUP_FAILED);
  } finally {
    clearTimeout(timeout_id);
  }
}

module.exports = {
  injectDataIo,
  ensureAuthenticated,
  getAuthStatus,
  createAccount,
  login,
  logout,
  lookupDefinitionOnline
};
