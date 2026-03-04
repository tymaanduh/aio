"use strict";

const crypto = require("crypto");
const { cleanText, normalizeUsername, normalizePassword } = require("./normalize.js");
const { append_runtime_log: appendRuntimeLog } = require("./services/runtime_log_service.js");
const AUTH_CATALOG = require("../data/input/shared/main/auth_catalog.json");

function as_object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function as_non_empty_text(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function as_positive_integer(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
}

const authResult = (() => {
  const source = as_object(AUTH_CATALOG.result);
  return Object.freeze({
    OK: source.ok !== false,
    FAIL: false
  });
})();

const authEnv = (() => {
  const source = as_object(AUTH_CATALOG.env);
  return Object.freeze({
    QUICK_LOGIN_ENABLED: as_non_empty_text(source.quick_login_enabled, "DICTIONARY_ENABLE_QUICK_LOGIN"),
    ENABLED_VALUE: as_non_empty_text(source.enabled_value, "1")
  });
})();

const authLogLevel = (() => {
  const source = as_object(AUTH_CATALOG.log_level);
  return Object.freeze({
    INFO: as_non_empty_text(source.info, "info"),
    WARN: as_non_empty_text(source.warn, "warn")
  });
})();

const authLogSource = (() => {
  const source = as_object(AUTH_CATALOG.log_source);
  return Object.freeze({
    AUTH: as_non_empty_text(source.auth, "auth"),
    LOOKUP: as_non_empty_text(source.lookup, "lookup")
  });
})();

const authLogContext = (() => {
  const source = as_object(AUTH_CATALOG.log_context);
  return Object.freeze({
    CREATE_ACCOUNT: as_non_empty_text(source.create_account, "createAccount"),
    LOGIN: as_non_empty_text(source.login, "login"),
    LOGOUT: as_non_empty_text(source.logout, "logout")
  });
})();

const authLoginLimits = (() => {
  const source = as_object(AUTH_CATALOG.login_limits);
  return Object.freeze({
    ATTEMPT_WINDOW_MS: as_positive_integer(source.attempt_window_ms, 60 * 1000),
    ATTEMPT_LIMIT: as_positive_integer(source.attempt_limit, 10),
    USERNAME_MIN_LENGTH: as_positive_integer(source.username_min_length, 3),
    PASSWORD_MIN_LENGTH: as_positive_integer(source.password_min_length, 4)
  });
})();

const authHash = (() => {
  const source = as_object(AUTH_CATALOG.hash);
  return Object.freeze({
    HASH_OUTPUT_BYTES: as_positive_integer(source.hash_output_bytes, 64),
    SALT_BYTES: as_positive_integer(source.salt_bytes, 16),
    HEX_ENCODING: as_non_empty_text(source.hex_encoding, "hex")
  });
})();

const authParseLimits = (() => {
  const source = as_object(AUTH_CATALOG.parse_limits);
  return Object.freeze({
    ENTRY_COUNT_MAX: as_positive_integer(source.entry_count_max, 2),
    DEFINITION_COUNT_MAX: as_positive_integer(source.definition_count_max, 3),
    PART_OF_SPEECH_TEXT_MAX: as_positive_integer(source.part_of_speech_text_max, 50),
    DEFINITION_TEXT_MAX: as_positive_integer(source.definition_text_max, 500),
    DEFINITION_LIST_MAX: as_positive_integer(source.definition_list_max, 12),
    DEFINITION_BLOCK_TEXT_MAX: as_positive_integer(source.definition_block_text_max, 5000),
    PART_OF_SPEECH_LABEL_MAX: as_positive_integer(source.part_of_speech_label_max, 60)
  });
})();

const authLookup = (() => {
  const source = as_object(AUTH_CATALOG.lookup);
  return Object.freeze({
    BASE_URL: as_non_empty_text(source.base_url, "https://api.dictionaryapi.dev/api/v2/entries/en/"),
    REQUEST_METHOD: as_non_empty_text(source.request_method, "GET"),
    REQUEST_ACCEPT: as_non_empty_text(source.request_accept, "application/json"),
    TIMEOUT_MS: as_positive_integer(source.timeout_ms, 6000),
    WORD_TEXT_MAX: as_positive_integer(source.word_text_max, 120),
    API_ERROR_TEXT_MAX: as_positive_integer(source.api_error_text_max, 300),
    LOG_ERROR_CONTEXT_MAX: as_positive_integer(source.log_error_context_max, 260)
  });
})();

const authText = (() => {
  const source = as_object(AUTH_CATALOG.text);
  return Object.freeze({
    AUTH_REQUIRED: as_non_empty_text(source.auth_required, "Authentication required."),
    QUICK_LOGIN_ACCEPTED: as_non_empty_text(source.quick_login_accepted, "Quick login accepted for"),
    ACCOUNT_CREATED: as_non_empty_text(source.account_created, "Account created for"),
    LOGIN_SUCCESS: as_non_empty_text(source.login_success, "Login successful for"),
    LOGOUT_SUCCESS: as_non_empty_text(source.logout_success, "Session logged out."),
    USERNAME_TOO_SHORT: as_non_empty_text(source.username_too_short, "Username must be at least 3 characters."),
    PASSWORD_TOO_SHORT: as_non_empty_text(source.password_too_short, "Password must be at least 4 characters."),
    ACCOUNT_EXISTS: as_non_empty_text(source.account_exists, "Account already exists. Please log in."),
    LOGIN_RATE_LIMIT: as_non_empty_text(
      source.login_rate_limit,
      "Too many login attempts. Wait one minute and try again."
    ),
    NO_ACCOUNT: as_non_empty_text(source.no_account, "No account found. Create an account first."),
    CREDENTIALS_REQUIRED: as_non_empty_text(source.credentials_required, "Username and password are required."),
    INVALID_USERNAME_OR_PASSWORD: as_non_empty_text(
      source.invalid_username_or_password,
      "Invalid username or password."
    ),
    LOOKUP_ENTER_WORD: as_non_empty_text(source.lookup_enter_word, "Enter a word first."),
    LOOKUP_NOT_FOUND: as_non_empty_text(source.lookup_not_found, "Definition not found."),
    LOOKUP_NO_USABLE_DEFINITION: as_non_empty_text(
      source.lookup_no_usable_definition,
      "No usable definition returned."
    ),
    LOOKUP_FAILED: as_non_empty_text(source.lookup_failed, "Lookup failed. Check your internet connection."),
    LOOKUP_FAILED_FOR: as_non_empty_text(source.lookup_failed_for, "Lookup failed for"),
    INVALID_PART_OF_SPEECH_PREFIX_LEFT: typeof source.invalid_part_of_speech_prefix_left === "string"
      ? source.invalid_part_of_speech_prefix_left
      : "[",
    INVALID_PART_OF_SPEECH_PREFIX_RIGHT: typeof source.invalid_part_of_speech_prefix_right === "string"
      ? source.invalid_part_of_speech_prefix_right
      : "] "
  });
})();

const builtinAccounts = Object.freeze(
  (Array.isArray(AUTH_CATALOG.builtin_accounts) ? AUTH_CATALOG.builtin_accounts : [])
    .map((entry) => as_object(entry))
    .map((entry) => ({
      username: as_non_empty_text(entry.username, ""),
      password: as_non_empty_text(entry.password, "")
    }))
    .filter((entry) => entry.username && entry.password)
);

const builtinAccountMap = new Map(
  builtinAccounts.map((account) => [`${account.username}:${account.password}`, account.username])
);

let auth_session_unlocked = false;
const login_attempt_timestamps = [];

const authDataIo = {
  load_auth_state: null,
  save_auth_state: null
};

function now_iso() {
  return new Date().toISOString();
}

function create_auth_ok(fields = {}) {
  return {
    ok: authResult.OK,
    ...fields
  };
}

function create_auth_error(error_message) {
  return {
    ok: authResult.FAIL,
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
  authDataIo.load_auth_state = loadAuthState;
  authDataIo.save_auth_state = saveAuthState;
}

function isQuickLoginEnabled() {
  return process.env[authEnv.QUICK_LOGIN_ENABLED] === authEnv.ENABLED_VALUE;
}

function resolve_builtin_account_username(username, password) {
  if (!isQuickLoginEnabled()) {
    return "";
  }
  return builtinAccountMap.get(`${username}:${password}`) || "";
}

function prune_login_attempts(now_ms) {
  while (
    login_attempt_timestamps.length > 0 &&
    now_ms - login_attempt_timestamps[0] > authLoginLimits.ATTEMPT_WINDOW_MS
  ) {
    login_attempt_timestamps.shift();
  }
}

function can_attempt_login() {
  const now_ms = Date.now();
  prune_login_attempts(now_ms);
  return login_attempt_timestamps.length < authLoginLimits.ATTEMPT_LIMIT;
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
    const left = Buffer.from(left_hex, authHash.HEX_ENCODING);
    const right = Buffer.from(right_hex, authHash.HEX_ENCODING);
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
    crypto.scrypt(password, salt, authHash.HASH_OUTPUT_BYTES, (error, derived_key) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(derived_key.toString(authHash.HEX_ENCODING));
    });
  });
}

function ensureAuthenticated() {
  if (!auth_session_unlocked) {
    throw new Error(authText.AUTH_REQUIRED);
  }
}

async function load_auth_state() {
  return authDataIo.load_auth_state();
}

async function save_auth_state(state) {
  return authDataIo.save_auth_state(state);
}

function try_quick_login(username, password, context) {
  const builtin_username = resolve_builtin_account_username(username, password);
  if (!builtin_username) {
    return null;
  }

  auth_session_unlocked = true;
  append_auth_runtime_log(
    authLogLevel.INFO,
    authLogSource.AUTH,
    format_quoted_message(authText.QUICK_LOGIN_ACCEPTED, builtin_username),
    context
  );
  return create_auth_ok({ username: builtin_username });
}

function validate_new_account_credentials(username, password) {
  if (username.length < authLoginLimits.USERNAME_MIN_LENGTH) {
    return authText.USERNAME_TOO_SHORT;
  }
  if (password.length < authLoginLimits.PASSWORD_MIN_LENGTH) {
    return authText.PASSWORD_TOO_SHORT;
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

  const quick_login_result = try_quick_login(username, password, authLogContext.CREATE_ACCOUNT);
  if (quick_login_result) {
    return quick_login_result;
  }

  const validation_error = validate_new_account_credentials(username, password);
  if (validation_error) {
    return create_auth_error(validation_error);
  }

  const auth_state = await load_auth_state();
  if (auth_state.account) {
    return create_auth_error(authText.ACCOUNT_EXISTS);
  }

  const timestamp = now_iso();
  const salt = crypto.randomBytes(authHash.SALT_BYTES).toString(authHash.HEX_ENCODING);
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
    authLogLevel.INFO,
    authLogSource.AUTH,
    format_quoted_message(authText.ACCOUNT_CREATED, username),
    authLogContext.CREATE_ACCOUNT
  );

  return create_auth_ok({ username });
}

async function login(rawUsername, rawPassword) {
  if (!can_attempt_login()) {
    return create_auth_error(authText.LOGIN_RATE_LIMIT);
  }

  const username = normalizeUsername(rawUsername);
  const password = normalizePassword(rawPassword);

  const quick_login_result = try_quick_login(username, password, authLogContext.LOGIN);
  if (quick_login_result) {
    return quick_login_result;
  }

  const auth_state = await load_auth_state();
  const account = auth_state.account;

  if (!account) {
    return create_login_error_response(authText.NO_ACCOUNT);
  }
  if (!username || !password) {
    return create_login_error_response(authText.CREDENTIALS_REQUIRED);
  }
  if (username !== account.username) {
    return create_login_error_response(authText.INVALID_USERNAME_OR_PASSWORD);
  }

  const attempted_hash = await hashPassword(password, account.salt);
  if (!safeCompareHex(attempted_hash, account.passwordHash)) {
    return create_login_error_response(authText.INVALID_USERNAME_OR_PASSWORD);
  }

  auth_state.lastAuthAt = now_iso();
  await save_auth_state(auth_state);
  auth_session_unlocked = true;
  append_auth_runtime_log(
    authLogLevel.INFO,
    authLogSource.AUTH,
    format_quoted_message(authText.LOGIN_SUCCESS, account.username),
    authLogContext.LOGIN
  );

  return create_auth_ok({ username: account.username });
}

function logout() {
  auth_session_unlocked = false;
  append_auth_runtime_log(authLogLevel.INFO, authLogSource.AUTH, authText.LOGOUT_SUCCESS, authLogContext.LOGOUT);
  return create_auth_ok();
}

function parseOnlineDefinitionResponse(payload) {
  if (!Array.isArray(payload) || payload.length === 0) {
    return null;
  }

  const lines = [];
  const part_of_speech_labels = new Set();
  let index = 1;

  for (const entry of payload.slice(0, authParseLimits.ENTRY_COUNT_MAX)) {
    const meanings = Array.isArray(entry?.meanings) ? entry.meanings : [];
    for (const meaning of meanings) {
      const part_of_speech = cleanText(meaning?.partOfSpeech || "", authParseLimits.PART_OF_SPEECH_TEXT_MAX);
      if (part_of_speech) {
        part_of_speech_labels.add(part_of_speech);
      }

      const definitions = Array.isArray(meaning?.definitions) ? meaning.definitions : [];
      for (const definition of definitions.slice(0, authParseLimits.DEFINITION_COUNT_MAX)) {
        const text = cleanText(definition?.definition || "", authParseLimits.DEFINITION_TEXT_MAX);
        if (!text) {
          continue;
        }
        const prefix = part_of_speech
          ? `${authText.INVALID_PART_OF_SPEECH_PREFIX_LEFT}${part_of_speech}${authText.INVALID_PART_OF_SPEECH_PREFIX_RIGHT}`
          : "";
        lines.push(`${index}. ${prefix}${text}`);
        index += 1;
        if (lines.length >= authParseLimits.DEFINITION_LIST_MAX) {
          break;
        }
      }
      if (lines.length >= authParseLimits.DEFINITION_LIST_MAX) {
        break;
      }
    }
    if (lines.length >= authParseLimits.DEFINITION_LIST_MAX) {
      break;
    }
  }

  if (lines.length === 0) {
    return null;
  }

  return {
    definition: lines.join("\n").slice(0, authParseLimits.DEFINITION_BLOCK_TEXT_MAX),
    labels: Array.from(part_of_speech_labels)
      .map((label) => cleanText(label, authParseLimits.PART_OF_SPEECH_LABEL_MAX))
      .filter(Boolean)
  };
}

async function lookupDefinitionOnline(rawWord) {
  const word = cleanText(rawWord, authLookup.WORD_TEXT_MAX);
  if (!word) {
    return create_auth_error(authText.LOOKUP_ENTER_WORD);
  }

  const url = `${authLookup.BASE_URL}${encodeURIComponent(word)}`;
  const abort_controller = new AbortController();
  const timeout_id = setTimeout(() => abort_controller.abort(), authLookup.TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: authLookup.REQUEST_METHOD,
      headers: { Accept: authLookup.REQUEST_ACCEPT },
      signal: abort_controller.signal
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message = cleanText(payload?.message || "", authLookup.API_ERROR_TEXT_MAX) || authText.LOOKUP_NOT_FOUND;
      return create_auth_error(message);
    }

    const parsed = parseOnlineDefinitionResponse(payload);
    if (!parsed) {
      return create_auth_error(authText.LOOKUP_NO_USABLE_DEFINITION);
    }

    return create_auth_ok({
      definition: parsed.definition,
      labels: parsed.labels
    });
  } catch (error) {
    append_auth_runtime_log(
      authLogLevel.WARN,
      authLogSource.LOOKUP,
      format_quoted_message(authText.LOOKUP_FAILED_FOR, word),
      cleanText(String(error?.message || error), authLookup.LOG_ERROR_CONTEXT_MAX)
    );
    return create_auth_error(authText.LOOKUP_FAILED);
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
