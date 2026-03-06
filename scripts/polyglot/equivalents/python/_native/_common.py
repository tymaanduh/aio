#!/usr/bin/env python3
"""Shared helpers for native Python script equivalents."""

from __future__ import annotations

import json
import os
import pathlib
import subprocess
import sys
import time
import errno
from typing import Any

RETRYABLE_WRITE_ERROR_CODES = {"UNKNOWN", "EBUSY", "EPERM", "EACCES", "ETXTBSY", "EINVAL"}
RETRYABLE_WRITE_ERRNOS = {
    code
    for code in (
        getattr(errno, "EBUSY", None),
        getattr(errno, "EPERM", None),
        getattr(errno, "EACCES", None),
        getattr(errno, "ETXTBSY", None),
        getattr(errno, "EINVAL", None),
    )
    if code is not None
}
RETRYABLE_WRITE_WINERRORS = {5, 32}


def normalize_path(value: Any) -> str:
    return str(value or "").replace("\\", "/")


def to_snake_case_base_name(file_name: str) -> str:
    return str(file_name or "").replace(".js", "").replace("-", "_")


def script_relative_to_equivalent_relative(script_relative_path: str, extension: str = "py") -> pathlib.PurePosixPath:
    source = pathlib.PurePosixPath(normalize_path(script_relative_path))
    parts = list(source.parts)
    if parts and parts[0] == "scripts":
        parts = parts[1:]
    if not parts:
        raise ValueError("script_relative_path is required")
    file_name = parts.pop()
    normalized_extension = str(extension or "py").lstrip(".")
    return pathlib.PurePosixPath(*parts, f"{to_snake_case_base_name(file_name)}.{normalized_extension}")


def script_relative_to_native_impl_relative(script_relative_path: str) -> pathlib.PurePosixPath:
    return pathlib.PurePosixPath("_native") / script_relative_to_equivalent_relative(script_relative_path, "py")


def find_repo_root(start_path: pathlib.Path | str) -> pathlib.Path:
    current = pathlib.Path(start_path).resolve()
    if current.is_file():
        current = current.parent
    while True:
        if (current / "package.json").exists() and (current / "scripts").exists():
            return current
        parent = current.parent
        if parent == current:
            raise RuntimeError("repository root not found")
        current = parent


def parse_truthy(value: Any) -> bool:
    return str(value or "").strip().lower() in {"1", "true", "yes", "on"}


def load_json(file_path: pathlib.Path, fallback: Any = None) -> Any:
    try:
        return json.loads(file_path.read_text(encoding="utf8"))
    except Exception:
        return fallback


def ensure_dir_for_file(file_path: pathlib.Path) -> None:
    file_path.parent.mkdir(parents=True, exist_ok=True)


def is_retryable_file_write_error(error: BaseException) -> bool:
    code = str(getattr(error, "code", "") or "").upper()
    if code in RETRYABLE_WRITE_ERROR_CODES:
        return True
    errno_value = getattr(error, "errno", None)
    if isinstance(errno_value, int) and errno_value in RETRYABLE_WRITE_ERRNOS:
        return True
    winerror_value = getattr(error, "winerror", None)
    return isinstance(winerror_value, int) and winerror_value in RETRYABLE_WRITE_WINERRORS


def replace_file_robust(temp_path: pathlib.Path, file_path: pathlib.Path, content: str, encoding: str) -> None:
    try:
        os.replace(temp_path, file_path)
        return
    except Exception as error:  # pragma: no cover - platform dependent
        if not is_retryable_file_write_error(error):
            raise
    file_path.write_text(content, encoding=encoding)
    if temp_path.exists():
        try:
            temp_path.unlink()
        except Exception:
            pass


def write_text_file_robust(
    file_path: pathlib.Path,
    content: str,
    *,
    encoding: str = "utf8",
    retries: int = 6,
    backoff_ms: int = 25,
    atomic: bool = True,
) -> None:
    ensure_dir_for_file(file_path)
    attempts = max(0, int(retries)) + 1
    for attempt in range(attempts):
        temp_path = file_path.with_name(f"{file_path.name}.tmp-{os.getpid()}-{int(time.time() * 1000)}-{attempt}") if atomic else file_path
        try:
            temp_path.write_text(content, encoding=encoding)
            if atomic:
                replace_file_robust(temp_path, file_path, content, encoding)
            return
        except Exception as error:  # pragma: no cover - platform dependent
            if atomic and temp_path.exists():
                try:
                    temp_path.unlink()
                except Exception:
                    pass
            if not is_retryable_file_write_error(error) or attempt >= attempts - 1:
                raise
            delay_ms = min(1000, int(backoff_ms) * (2 ** attempt))
            time.sleep(delay_ms / 1000.0)


def run_node_script(script_relative_path: str, argv: list[str] | None = None, *, root: pathlib.Path | None = None) -> int:
    workspace_root = root or find_repo_root(pathlib.Path(__file__))
    script_path = workspace_root / pathlib.PurePosixPath(normalize_path(script_relative_path))
    if not script_path.exists():
        sys.stderr.write(f"missing script target: {script_path}\n")
        return 1
    node_exec = os.environ.get("AIO_NODE_EXEC", "node")
    env = dict(os.environ)
    env["AIO_PYTHON_EXEC"] = env.get("AIO_PYTHON_EXEC", sys.executable)
    completed = subprocess.run([node_exec, str(script_path), *(argv or [])], cwd=str(workspace_root), env=env)
    return int(completed.returncode or 0)


def resolve_python_equivalent_file(script_relative_path: str, *, root: pathlib.Path | None = None) -> pathlib.Path:
    workspace_root = root or find_repo_root(pathlib.Path(__file__))
    relative = script_relative_to_equivalent_relative(script_relative_path, "py")
    return workspace_root / "scripts" / "polyglot" / "equivalents" / "python" / relative


def run_python_file(
    script_path: pathlib.Path,
    argv: list[str] | None = None,
    *,
    root: pathlib.Path | None = None,
    extra_env: dict[str, str] | None = None,
) -> subprocess.CompletedProcess[str]:
    workspace_root = root or find_repo_root(pathlib.Path(__file__))
    env = dict(os.environ)
    env.update(extra_env or {})
    return subprocess.run(
        [sys.executable, str(script_path), *(argv or [])],
        cwd=str(workspace_root),
        env=env,
        capture_output=True,
        text=True,
    )


def run_python_equivalent_script(
    script_relative_path: str,
    argv: list[str] | None = None,
    *,
    root: pathlib.Path | None = None,
    extra_env: dict[str, str] | None = None,
) -> subprocess.CompletedProcess[str]:
    workspace_root = root or find_repo_root(pathlib.Path(__file__))
    python_equivalent_file = resolve_python_equivalent_file(script_relative_path, root=workspace_root)
    if not python_equivalent_file.exists():
        raise FileNotFoundError(f"missing Python equivalent for {script_relative_path}: {python_equivalent_file}")
    return run_python_file(python_equivalent_file, argv, root=workspace_root, extra_env=extra_env)
