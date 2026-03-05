"use strict";

const fs = require("fs");
const path = require("path");

const RETRYABLE_WRITE_ERROR_CODES = new Set(["UNKNOWN", "EBUSY", "EPERM", "EACCES", "ETXTBSY"]);

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function sleepSync(milliseconds) {
  const delayMs = Number(milliseconds);
  if (!Number.isFinite(delayMs) || delayMs <= 0) {
    return;
  }

  try {
    const cell = new Int32Array(new SharedArrayBuffer(4));
    Atomics.wait(cell, 0, 0, delayMs);
  } catch {
    const start = Date.now();
    while (Date.now() - start < delayMs) {
      // fallback busy-wait only when Atomics.wait is unavailable
    }
  }
}

function isRetryableFileWriteError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }
  const code = String(error.code || "").toUpperCase();
  return RETRYABLE_WRITE_ERROR_CODES.has(code);
}

function writeTextFileRobust(filePath, content, options = {}) {
  const encoding = String(options.encoding || "utf8");
  const retries = Number.isFinite(Number(options.retries)) ? Math.max(0, Number(options.retries)) : 6;
  const backoffMs = Number.isFinite(Number(options.backoffMs)) ? Math.max(0, Number(options.backoffMs)) : 25;
  const atomic = options.atomic !== false;

  ensureDirForFile(filePath);
  const attempts = retries + 1;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const tempPath = atomic ? `${filePath}.tmp-${process.pid}-${Date.now()}-${attempt}` : filePath;
    try {
      if (atomic) {
        fs.writeFileSync(tempPath, content, { encoding });
        fs.renameSync(tempPath, filePath);
      } else {
        fs.writeFileSync(filePath, content, { encoding });
      }
      return;
    } catch (error) {
      if (atomic && fs.existsSync(tempPath)) {
        try {
          fs.unlinkSync(tempPath);
        } catch {
          // ignore temporary cleanup failures
        }
      }
      if (!isRetryableFileWriteError(error) || attempt >= attempts - 1) {
        throw error;
      }
      const delay = Math.min(1000, backoffMs * Math.pow(2, attempt));
      sleepSync(delay);
    }
  }
}

module.exports = {
  ensureDirForFile,
  isRetryableFileWriteError,
  writeTextFileRobust
};
