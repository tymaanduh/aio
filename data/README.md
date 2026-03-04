# Data

Data is split into two databases:

- `data/input/`: inbound datasets, datastream banks, and request queues.
- `data/output/`: generated artifacts, reports, and change-log outputs.

Input stream placeholders:

- `data/input/datastreams/text/`
- `data/input/datastreams/audio/`
- `data/input/datastreams/visual/`

## Internal Raw Storage Contract

Raw storage is an internal persistence utility rooted under Electron user data:

- root folder: `userData/data/v1/raw_storage`
- main module: `main/data/repository_raw_storage.js`
- IPC routes: `storage:writeFile`, `storage:readFile`, `storage:listFiles`, `storage:deletePath`, `storage:ensureDirectory`

Payload compatibility:

- `write_file`: `relativePath`, one of `content`/`content_text`/`content_json`/`content_base64`, optional `encoding`, `append`, `ensure_parent_dirs`, `pretty_json`
- `read_file`: `relativePath`, optional `encoding`, `asBase64`
- `list_files`: optional `relativeDir`, `recursive`, `includeDirectories`, `limit`
- `delete_path`: `relativePath`, optional `recursive`, `allowMissing`
- `ensure_directory`: optional `relativePath`

Safety and limits:

- only relative paths are allowed; absolute paths and traversal segments are rejected
- max payload bytes and max write/read bytes are enforced by repository limits
- errors use normalized `RAW_STORAGE_*` code values for deterministic handling
