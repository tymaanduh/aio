"use strict";

const crypto = require("crypto");
const { cleanText, normalizeUsername, normalizePassword } = require("./normalize.js");
const { appendRuntimeLog } = require("./runtime-log.js");

const BUILTIN_ACCOUNTS = Object.freeze([
  { username: "admin", password: "admin" },
  { username: "demo", password: "demo" },
  { username: "root", password: "root" },
  { username: "user", password: "user" },
  { username: "guest", password: "guest" }
]);

const LOGIN_ATTEMPT_WINDOW_MS = 60 * 1000;
const LOGIN_ATTEMPT_LIMIT = 10;

let authSessionUnlocked = false;
const loginAttemptTimestamps = [];

// Injected from data-io at init time to avoid circular deps
let _loadAuthState = null;
let _saveAuthState = null;

function injectDataIo({ loadAuthState, saveAuthState }) {
  _loadAuthState = loadAuthState;
  _saveAuthState = saveAuthState;
}

function isQuickLoginEnabled() {
  return process.env.DICTIONARY_ENABLE_QUICK_LOGIN === "1";
}

function getBuiltinAccountUsername(username, password) {
  if (!isQuickLoginEnabled()) {
    return "";
  }
  const match = BUILTIN_ACCOUNTS.find((account) => account.username === username && account.password === password);
  return match ? match.username : "";
}

function pruneLoginAttempts(nowMs) {
  while (loginAttemptTimestamps.length > 0 && nowMs - loginAttemptTimestamps[0] > LOGIN_ATTEMPT_WINDOW_MS) {
    loginAttemptTimestamps.shift();
  }
}

function canAttemptLogin() {
  const now = Date.now();
  pruneLoginAttempts(now);
  return loginAttemptTimestamps.length < LOGIN_ATTEMPT_LIMIT;
}

function recordFailedLoginAttempt() {
  const now = Date.now();
  pruneLoginAttempts(now);
  loginAttemptTimestamps.push(now);
}

function safeCompareHex(leftHex, rightHex) {
  if (typeof leftHex !== "string" || typeof rightHex !== "string") {
    return false;
  }

  try {
    const left = Buffer.from(leftHex, "hex");
    const right = Buffer.from(rightHex, "hex");
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
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(derivedKey.toString("hex"));
    });
  });
}

function ensureAuthenticated() {
  if (!authSessionUnlocked) {
    throw new Error("Authentication required.");
  }
}

async function getAuthStatus() {
  const authState = await _loadAuthState();
  return {
    hasAccount: Boolean(authState.account),
    username: authState.account?.username || null,
    quickLoginEnabled: isQuickLoginEnabled()
  };
}

async function createAccount(rawUsername, rawPassword) {
  const username = normalizeUsername(rawUsername);
  const password = normalizePassword(rawPassword);
  const builtinUsername = getBuiltinAccountUsername(username, password);
  if (builtinUsername) {
    authSessionUnlocked = true;
    appendRuntimeLog({
      level: "info",
      source: "auth",
      message: `Quick login accepted for "${builtinUsername}".`,
      context: "createAccount"
    });
    return {
      ok: true,
      username: builtinUsername
    };
  }

  if (username.length < 3) {
    return {
      ok: false,
      error: "Username must be at least 3 characters."
    };
  }

  if (password.length < 4) {
    return {
      ok: false,
      error: "Password must be at least 4 characters."
    };
  }

  const authState = await _loadAuthState();
  if (authState.account) {
    return {
      ok: false,
      error: "Account already exists. Please log in."
    };
  }

  const timestamp = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = await hashPassword(password, salt);

  authState.account = {
    username,
    salt,
    passwordHash,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  authState.lastAuthAt = timestamp;

  await _saveAuthState(authState);
  authSessionUnlocked = true;
  appendRuntimeLog({
    level: "info",
    source: "auth",
    message: `Account created for "${username}".`,
    context: "createAccount"
  });

  return {
    ok: true,
    username
  };
}

async function login(rawUsername, rawPassword) {
  if (!canAttemptLogin()) {
    return {
      ok: false,
      error: "Too many login attempts. Wait one minute and try again."
    };
  }

  const username = normalizeUsername(rawUsername);
  const password = normalizePassword(rawPassword);
  const builtinUsername = getBuiltinAccountUsername(username, password);
  if (builtinUsername) {
    authSessionUnlocked = true;
    appendRuntimeLog({
      level: "info",
      source: "auth",
      message: `Quick login accepted for "${builtinUsername}".`,
      context: "login"
    });
    return {
      ok: true,
      username: builtinUsername
    };
  }

  const authState = await _loadAuthState();
  const account = authState.account;

  if (!account) {
    recordFailedLoginAttempt();
    return {
      ok: false,
      error: "No account found. Create an account first."
    };
  }

  if (!username || !password) {
    recordFailedLoginAttempt();
    return {
      ok: false,
      error: "Username and password are required."
    };
  }

  if (username !== account.username) {
    recordFailedLoginAttempt();
    return {
      ok: false,
      error: "Invalid username or password."
    };
  }

  const attemptedHash = await hashPassword(password, account.salt);
  if (!safeCompareHex(attemptedHash, account.passwordHash)) {
    recordFailedLoginAttempt();
    return {
      ok: false,
      error: "Invalid username or password."
    };
  }

  authState.lastAuthAt = new Date().toISOString();
  await _saveAuthState(authState);
  authSessionUnlocked = true;
  appendRuntimeLog({
    level: "info",
    source: "auth",
    message: `Login successful for "${account.username}".`,
    context: "login"
  });

  return {
    ok: true,
    username: account.username
  };
}

function logout() {
  authSessionUnlocked = false;
  appendRuntimeLog({
    level: "info",
    source: "auth",
    message: "Session logged out.",
    context: "logout"
  });
  return { ok: true };
}

function parseOnlineDefinitionResponse(payload) {
  if (!Array.isArray(payload) || payload.length === 0) {
    return null;
  }

  const lines = [];
  const partOfSpeechLabels = new Set();
  let index = 1;

  for (const entry of payload.slice(0, 2)) {
    const meanings = Array.isArray(entry?.meanings) ? entry.meanings : [];

    for (const meaning of meanings) {
      const partOfSpeech = cleanText(meaning?.partOfSpeech || "", 50);
      if (partOfSpeech) {
        partOfSpeechLabels.add(partOfSpeech);
      }

      const definitions = Array.isArray(meaning?.definitions) ? meaning.definitions : [];
      for (const definition of definitions.slice(0, 3)) {
        const text = cleanText(definition?.definition || "", 500);
        if (!text) {
          continue;
        }

        const prefix = partOfSpeech ? `[${partOfSpeech}] ` : "";
        lines.push(`${index}. ${prefix}${text}`);
        index += 1;

        if (lines.length >= 12) {
          break;
        }
      }

      if (lines.length >= 12) {
        break;
      }
    }

    if (lines.length >= 12) {
      break;
    }
  }

  if (lines.length === 0) {
    return null;
  }

  return {
    definition: lines.join("\n").slice(0, 5000),
    labels: Array.from(partOfSpeechLabels)
      .map((l) => cleanText(l, 60))
      .filter(Boolean)
  };
}

async function lookupDefinitionOnline(rawWord) {
  const word = cleanText(rawWord, 120);
  if (!word) {
    return {
      ok: false,
      error: "Enter a word first."
    };
  }

  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 6000);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      signal: abortController.signal
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message = cleanText(payload?.message || "", 300) || "Definition not found.";
      return {
        ok: false,
        error: message
      };
    }

    const parsed = parseOnlineDefinitionResponse(payload);
    if (!parsed) {
      return {
        ok: false,
        error: "No usable definition returned."
      };
    }

    return {
      ok: true,
      definition: parsed.definition,
      labels: parsed.labels
    };
  } catch (error) {
    appendRuntimeLog({
      level: "warn",
      source: "lookup",
      message: `Lookup failed for "${word}".`,
      context: cleanText(String(error?.message || error), 260)
    });
    return {
      ok: false,
      error: "Lookup failed. Check your internet connection."
    };
  } finally {
    clearTimeout(timeoutId);
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
