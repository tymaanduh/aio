"use strict";

const fs = require("fs/promises");
const path = require("path");
const { ensure_data_dirs, get_data_paths } = require("./repository_manifest.js");
const { create_repository_result } = require("./repository_shared.js");

const rawStorageLimits = Object.freeze({
  ROOT_DIR_NAME: "raw_storage",
  MAX_PAYLOAD_BYTES: 16 * 1024 * 1024,
  MAX_WRITE_BYTES: 8 * 1024 * 1024,
  MAX_READ_BYTES: 8 * 1024 * 1024,
  RELATIVE_PATH_MAX: 512,
  LIST_LIMIT_DEFAULT: 500,
  LIST_LIMIT_MAX: 2000
});

const PATTERN_SLASHES = /\/+/g;
const PATTERN_LEADING_SLASHES = /^\/+/;
const PATTERN_NULL_BYTE = /\0/;
const PATTERN_ABSOLUTE_PATH = /^(?:[A-Za-z]:[\\/]|\/)/;

const ALLOWED_TEXT_ENCODINGS = new Set(["utf8", "ascii", "latin1", "utf16le"]);
const rawStorageErrorCodes = Object.freeze({
  INVALID_PAYLOAD: "RAW_STORAGE_INVALID_PAYLOAD",
  PATH_REQUIRED: "RAW_STORAGE_PATH_REQUIRED",
  PATH_TOO_LONG: "RAW_STORAGE_PATH_TOO_LONG",
  PATH_DOT_SEGMENT: "RAW_STORAGE_PATH_DOT_SEGMENT",
  PATH_INVALID_CHAR: "RAW_STORAGE_PATH_INVALID_CHAR",
  PATH_OUTSIDE_ROOT: "RAW_STORAGE_PATH_OUTSIDE_ROOT",
  UNSUPPORTED_ENCODING: "RAW_STORAGE_UNSUPPORTED_ENCODING",
  PAYLOAD_TOO_LARGE: "RAW_STORAGE_PAYLOAD_TOO_LARGE",
  CONTENT_TOO_LARGE: "RAW_STORAGE_CONTENT_TOO_LARGE",
  READ_TOO_LARGE: "RAW_STORAGE_READ_TOO_LARGE",
  LIST_TARGET_NOT_DIRECTORY: "RAW_STORAGE_LIST_TARGET_NOT_DIRECTORY",
  PATH_NOT_FOUND: "RAW_STORAGE_PATH_NOT_FOUND",
  DELETE_DIR_REQUIRES_RECURSIVE: "RAW_STORAGE_DELETE_DIR_REQUIRES_RECURSIVE",
  INTERNAL: "RAW_STORAGE_INTERNAL"
});

function create_raw_storage_error(code, message, details = {}) {
  const error = new Error(String(message || code || "raw storage error"));
  error.name = "RawStorageError";
  error.code = code || rawStorageErrorCodes.INTERNAL;
  error.details = details && typeof details === "object" ? details : {};
  return error;
}

function to_source_object(value, fallback = {}) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  if (value === undefined || value === null) {
    return fallback;
  }
  throw create_raw_storage_error(
    rawStorageErrorCodes.INVALID_PAYLOAD,
    "raw storage payload must be an object"
  );
}

function normalize_text_encoding(raw_encoding) {
  const token = String(raw_encoding || "utf8").trim().toLowerCase();
  const normalized = token === "utf-8" ? "utf8" : token;
  if (!ALLOWED_TEXT_ENCODINGS.has(normalized)) {
    throw create_raw_storage_error(
      rawStorageErrorCodes.UNSUPPORTED_ENCODING,
      `unsupported text encoding: ${token}`,
      { encoding: token }
    );
  }
  return normalized;
}

function normalize_relative_path(raw_relative_path, allow_empty = false) {
  const raw_path = String(raw_relative_path || "").trim();
  if (!raw_path) {
    if (allow_empty) {
      return "";
    }
    throw create_raw_storage_error(
      rawStorageErrorCodes.PATH_REQUIRED,
      "raw storage relative path is required"
    );
  }

  if (raw_path.length > rawStorageLimits.RELATIVE_PATH_MAX) {
    throw create_raw_storage_error(
      rawStorageErrorCodes.PATH_TOO_LONG,
      "raw storage relative path exceeds limit",
      { max: rawStorageLimits.RELATIVE_PATH_MAX }
    );
  }

  if (PATTERN_ABSOLUTE_PATH.test(raw_path)) {
    throw create_raw_storage_error(
      rawStorageErrorCodes.PATH_OUTSIDE_ROOT,
      "raw storage path must be relative"
    );
  }

  const slash_normalized = raw_path.replaceAll("\\", "/").replace(PATTERN_LEADING_SLASHES, "");
  const compacted = slash_normalized.replace(PATTERN_SLASHES, "/");
  const segments = compacted
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (!segments.length) {
    if (allow_empty) {
      return "";
    }
    throw create_raw_storage_error(
      rawStorageErrorCodes.PATH_REQUIRED,
      "raw storage relative path is required"
    );
  }

  for (const segment of segments) {
    if (segment === "." || segment === "..") {
      throw create_raw_storage_error(
        rawStorageErrorCodes.PATH_DOT_SEGMENT,
        "raw storage relative path cannot contain dot segments"
      );
    }
    if (PATTERN_NULL_BYTE.test(segment)) {
      throw create_raw_storage_error(
        rawStorageErrorCodes.PATH_INVALID_CHAR,
        "raw storage relative path contains invalid characters"
      );
    }
  }

  return segments.join("/");
}

function resolve_raw_storage_root(paths = get_data_paths()) {
  return path.join(paths.data_v1_root, rawStorageLimits.ROOT_DIR_NAME);
}

async function ensure_raw_storage_root() {
  const paths = await ensure_data_dirs();
  const raw_storage_root = resolve_raw_storage_root(paths);
  await fs.mkdir(raw_storage_root, { recursive: true });
  return raw_storage_root;
}

function resolve_raw_storage_path(raw_storage_root, raw_relative_path, { allow_empty = false } = {}) {
  const relative_path = normalize_relative_path(raw_relative_path, allow_empty);
  const absolute_path = relative_path
    ? path.resolve(raw_storage_root, relative_path)
    : path.resolve(raw_storage_root);
  const root_with_separator = raw_storage_root.endsWith(path.sep)
    ? raw_storage_root
    : `${raw_storage_root}${path.sep}`;

  if (absolute_path !== raw_storage_root && !absolute_path.startsWith(root_with_separator)) {
    throw create_raw_storage_error(
      rawStorageErrorCodes.PATH_OUTSIDE_ROOT,
      "raw storage path resolved outside storage root"
    );
  }

  return {
    relative_path,
    absolute_path
  };
}

function validate_payload_size(payload) {
  const serialized = JSON.stringify(payload ?? {});
  const payload_bytes = Buffer.byteLength(serialized, "utf8");
  if (payload_bytes > rawStorageLimits.MAX_PAYLOAD_BYTES) {
    throw create_raw_storage_error(
      rawStorageErrorCodes.PAYLOAD_TOO_LARGE,
      "raw storage payload exceeds max size",
      { maxBytes: rawStorageLimits.MAX_PAYLOAD_BYTES, payloadBytes: payload_bytes }
    );
  }
}

function assert_content_size(size_bytes, label) {
  if (size_bytes > rawStorageLimits.MAX_WRITE_BYTES) {
    throw create_raw_storage_error(
      rawStorageErrorCodes.CONTENT_TOO_LARGE,
      `${label} exceeds max write size`,
      { maxBytes: rawStorageLimits.MAX_WRITE_BYTES, contentBytes: size_bytes, contentLabel: label }
    );
  }
}

function resolve_write_content(source) {
  if (typeof source.content_base64 === "string" && source.content_base64.trim()) {
    const encoded = source.content_base64.trim();
    const encoded_bytes = Buffer.byteLength(encoded, "utf8");
    if (encoded_bytes > rawStorageLimits.MAX_WRITE_BYTES * 1.4) {
      throw create_raw_storage_error(
        rawStorageErrorCodes.CONTENT_TOO_LARGE,
        "base64 payload exceeds max size",
        { maxBytes: rawStorageLimits.MAX_WRITE_BYTES, encodedBytes: encoded_bytes }
      );
    }
    const buffer = Buffer.from(encoded, "base64");
    assert_content_size(buffer.byteLength, "content_base64");
    return {
      kind: "buffer",
      buffer,
      content_type: "base64",
      encoding: null
    };
  }

  if (source.content_json !== undefined) {
    const text = JSON.stringify(source.content_json, null, source.pretty_json === false ? 0 : 2);
    assert_content_size(Buffer.byteLength(text, "utf8"), "content_json");
    return {
      kind: "text",
      text,
      content_type: "json",
      encoding: "utf8"
    };
  }

  const content_value = source.content_text !== undefined ? source.content_text : source.content;
  if (Buffer.isBuffer(content_value)) {
    assert_content_size(content_value.byteLength, "content_buffer");
    return {
      kind: "buffer",
      buffer: content_value,
      content_type: "buffer",
      encoding: null
    };
  }

  if (typeof content_value === "string") {
    const encoding = normalize_text_encoding(source.encoding);
    assert_content_size(Buffer.byteLength(content_value, encoding), "content_text");
    return {
      kind: "text",
      text: content_value,
      content_type: "text",
      encoding
    };
  }

  if (content_value !== undefined) {
    const text = JSON.stringify(content_value, null, source.pretty_json === false ? 0 : 2);
    assert_content_size(Buffer.byteLength(text, "utf8"), "content");
    return {
      kind: "text",
      text,
      content_type: "json_auto",
      encoding: "utf8"
    };
  }

  return {
    kind: "text",
    text: "",
    content_type: "empty",
    encoding: normalize_text_encoding(source.encoding)
  };
}

async function write_raw_file(raw_payload = {}) {
  try {
    const source = to_source_object(raw_payload);
    validate_payload_size(source);
    const raw_storage_root = await ensure_raw_storage_root();
    const { relative_path, absolute_path } = resolve_raw_storage_path(
      raw_storage_root,
      source.relativePath || source.relative_path || source.path
    );

    if (source.ensure_parent_dirs !== false) {
      await fs.mkdir(path.dirname(absolute_path), { recursive: true });
    }

    const write_content = resolve_write_content(source);
    const append = Boolean(source.append);

    if (write_content.kind === "buffer") {
      if (append) {
        await fs.appendFile(absolute_path, write_content.buffer);
      } else {
        await fs.writeFile(absolute_path, write_content.buffer);
      }
    } else {
      if (append) {
        await fs.appendFile(absolute_path, write_content.text, write_content.encoding);
      } else {
        await fs.writeFile(absolute_path, write_content.text, write_content.encoding);
      }
    }

    const file_stat = await fs.stat(absolute_path);
    return create_repository_result({
      rootPath: raw_storage_root,
      relativePath: relative_path,
      filePath: absolute_path,
      sizeBytes: file_stat.size,
      append,
      contentType: write_content.content_type,
      encoding: write_content.encoding
    });
  } catch (error) {
    throw normalize_raw_storage_error(error);
  }
}

async function read_raw_file(raw_payload = {}) {
  try {
    const source = to_source_object(raw_payload);
    validate_payload_size(source);
    const raw_storage_root = await ensure_raw_storage_root();
    const { relative_path, absolute_path } = resolve_raw_storage_path(
      raw_storage_root,
      source.relativePath || source.relative_path || source.path
    );

    const file_stat = await fs.stat(absolute_path);
    if (!file_stat.isFile()) {
      throw create_raw_storage_error(
        rawStorageErrorCodes.PATH_NOT_FOUND,
        "raw storage read target must be a file"
      );
    }
    if (file_stat.size > rawStorageLimits.MAX_READ_BYTES) {
      throw create_raw_storage_error(
        rawStorageErrorCodes.READ_TOO_LARGE,
        "raw storage read exceeds max size",
        { maxBytes: rawStorageLimits.MAX_READ_BYTES, sizeBytes: file_stat.size }
      );
    }

    const as_base64 = Boolean(source.asBase64 || source.as_base64);
    const result = create_repository_result({
      rootPath: raw_storage_root,
      relativePath: relative_path,
      filePath: absolute_path,
      sizeBytes: file_stat.size,
      updatedAt: new Date(file_stat.mtimeMs).toISOString()
    });

    if (as_base64) {
      const buffer = await fs.readFile(absolute_path);
      result.contentBase64 = buffer.toString("base64");
      return result;
    }

    const encoding = normalize_text_encoding(source.encoding);
    result.encoding = encoding;
    result.contentText = await fs.readFile(absolute_path, encoding);
    return result;
  } catch (error) {
    throw normalize_raw_storage_error(error);
  }
}

function normalize_list_limit(raw_limit) {
  const parsed = Number(raw_limit);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return rawStorageLimits.LIST_LIMIT_DEFAULT;
  }
  return Math.min(Math.floor(parsed), rawStorageLimits.LIST_LIMIT_MAX);
}

async function list_raw_files(raw_payload = {}) {
  try {
    const source = to_source_object(raw_payload);
    validate_payload_size(source);
    const raw_storage_root = await ensure_raw_storage_root();
    const { relative_path, absolute_path } = resolve_raw_storage_path(
      raw_storage_root,
      source.relativeDir || source.relative_dir || source.dir || "",
      { allow_empty: true }
    );

    const recursive = source.recursive !== false;
    const include_directories = Boolean(source.includeDirectories || source.include_directories);
    const limit = normalize_list_limit(source.limit);
    const files = [];
    let truncated = false;

    const target_stat = await fs.stat(absolute_path).catch(() => null);
    if (!target_stat) {
      return create_repository_result({
        rootPath: raw_storage_root,
        relativeDir: relative_path,
        recursive,
        files,
        truncated
      });
    }

    if (!target_stat.isDirectory()) {
      throw create_raw_storage_error(
        rawStorageErrorCodes.LIST_TARGET_NOT_DIRECTORY,
        "raw storage list target must be a directory"
      );
    }

    const queue = [{ relative_path, absolute_path }];
    while (queue.length > 0 && files.length < limit) {
      const current = queue.shift();
      const entries = await fs.readdir(current.absolute_path, { withFileTypes: true });
      const sorted_entries = entries.sort((left, right) => left.name.localeCompare(right.name));

      for (const entry of sorted_entries) {
        const entry_relative = current.relative_path
          ? `${current.relative_path}/${entry.name}`
          : entry.name;
        const entry_absolute = path.join(current.absolute_path, entry.name);

        if (entry.isDirectory()) {
          if (include_directories) {
            files.push({
              kind: "directory",
              relativePath: entry_relative
            });
            if (files.length >= limit) {
              truncated = true;
              break;
            }
          }
          if (recursive) {
            queue.push({
              relative_path: entry_relative,
              absolute_path: entry_absolute
            });
          }
          continue;
        }

        if (!entry.isFile()) {
          continue;
        }

        const entry_stat = await fs.stat(entry_absolute);
        files.push({
          kind: "file",
          relativePath: entry_relative,
          sizeBytes: entry_stat.size,
          updatedAt: new Date(entry_stat.mtimeMs).toISOString()
        });

        if (files.length >= limit) {
          truncated = true;
          break;
        }
      }
    }

    return create_repository_result({
      rootPath: raw_storage_root,
      relativeDir: relative_path,
      recursive,
      files,
      truncated
    });
  } catch (error) {
    throw normalize_raw_storage_error(error);
  }
}

async function delete_raw_path(raw_payload = {}) {
  try {
    const source = to_source_object(raw_payload);
    validate_payload_size(source);
    const raw_storage_root = await ensure_raw_storage_root();
    const { relative_path, absolute_path } = resolve_raw_storage_path(
      raw_storage_root,
      source.relativePath || source.relative_path || source.path
    );

    const target_stat = await fs.stat(absolute_path).catch(() => null);
    if (!target_stat) {
      if (source.allowMissing === false || source.allow_missing === false) {
        throw create_raw_storage_error(
          rawStorageErrorCodes.PATH_NOT_FOUND,
          "raw storage path does not exist"
        );
      }
      return create_repository_result({
        rootPath: raw_storage_root,
        relativePath: relative_path,
        deleted: false,
        existed: false
      });
    }

    if (target_stat.isDirectory()) {
      const recursive = Boolean(source.recursive);
      if (!recursive) {
        throw create_raw_storage_error(
          rawStorageErrorCodes.DELETE_DIR_REQUIRES_RECURSIVE,
          "raw storage directory delete requires recursive=true"
        );
      }
      await fs.rm(absolute_path, { recursive: true, force: false });
      return create_repository_result({
        rootPath: raw_storage_root,
        relativePath: relative_path,
        deleted: true,
        existed: true,
        kind: "directory"
      });
    }

    await fs.unlink(absolute_path);
    return create_repository_result({
      rootPath: raw_storage_root,
      relativePath: relative_path,
      deleted: true,
      existed: true,
      kind: "file"
    });
  } catch (error) {
    throw normalize_raw_storage_error(error);
  }
}

async function ensure_raw_directory(raw_payload = {}) {
  try {
    const source = to_source_object(raw_payload);
    validate_payload_size(source);
    const raw_storage_root = await ensure_raw_storage_root();
    const { relative_path, absolute_path } = resolve_raw_storage_path(
      raw_storage_root,
      source.relativePath || source.relative_path || source.path || "",
      { allow_empty: true }
    );

    await fs.mkdir(absolute_path, { recursive: true });
    return create_repository_result({
      rootPath: raw_storage_root,
      relativePath: relative_path,
      directoryPath: absolute_path
    });
  } catch (error) {
    throw normalize_raw_storage_error(error);
  }
}

function normalize_raw_storage_error(error) {
  if (error && error.code && String(error.code).startsWith("RAW_STORAGE_")) {
    return error;
  }
  if (error && error.code === "ENOENT") {
    return create_raw_storage_error(
      rawStorageErrorCodes.PATH_NOT_FOUND,
      "raw storage path not found"
    );
  }
  return create_raw_storage_error(
    rawStorageErrorCodes.INTERNAL,
    error && error.message ? error.message : "raw storage internal error"
  );
}

module.exports = {
  RAW_STORAGE_SPEC: rawStorageLimits,
  RAW_STORAGE_ERROR_CODES: rawStorageErrorCodes,
  create_raw_storage_error,
  normalize_raw_storage_error,
  resolve_raw_storage_root,
  ensure_raw_storage_root,
  write_raw_file,
  read_raw_file,
  list_raw_files,
  delete_raw_path,
  ensure_raw_directory
};
