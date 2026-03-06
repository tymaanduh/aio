#!/usr/bin/env python3
"""Compile and execute generated C++ script equivalents."""

from __future__ import annotations

import os
import pathlib
import shutil
import subprocess
import sys


def normalize_path(value: str) -> str:
    return str(value or "").replace("\\", "/")


def find_repo_root(start_path: pathlib.Path) -> pathlib.Path:
    current = start_path.resolve()
    if current.is_file():
        current = current.parent
    while True:
        if (current / "package.json").exists() and (current / "scripts").exists():
            return current
        parent = current.parent
        if parent == current:
            raise RuntimeError("repository root not found")
        current = parent


def parse_args(argv: list[str]) -> dict:
    force_rebuild = False
    source_file = ""
    passthrough: list[str] = []
    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if token == "--force-rebuild":
            force_rebuild = True
            index += 1
            continue
        if token == "--":
            passthrough = [str(item or "") for item in argv[index + 1 :]]
            break
        if not source_file:
            source_file = token
            index += 1
            continue
        passthrough = [str(item or "") for item in argv[index:]]
        break
    return {
        "source_file": source_file,
        "passthrough": passthrough,
        "force_rebuild": force_rebuild,
    }


def detect_compiler() -> tuple[str, list[str], str] | None:
    override = str(os.environ.get("AIO_CPP_COMPILER", "")).strip()
    if override:
        candidate = shutil.which(override) or override
        kind = pathlib.Path(override).name.lower()
        if "cl" == kind or kind.endswith("cl.exe"):
            return (candidate, [], "msvc")
        return (candidate, [], "gnu")
    for candidate in ("g++", "clang++", "c++"):
        resolved = shutil.which(candidate)
        if resolved:
            return (resolved, [], "gnu")
    resolved_cl = shutil.which("cl")
    if resolved_cl:
        return (resolved_cl, [], "msvc")
    return None


def resolve_binary_path(root: pathlib.Path, source_file: pathlib.Path) -> pathlib.Path:
    relative_source = pathlib.PurePosixPath(normalize_path(source_file.relative_to(root)))
    suffix = ".exe" if os.name == "nt" else ""
    return (
        root
        / "data"
        / "output"
        / "databases"
        / "polyglot-default"
        / "build"
        / "polyglot_script_native_cpp"
        / "bin"
        / relative_source.with_suffix(suffix)
    )


def compile_required(output_file: pathlib.Path, dependencies: list[pathlib.Path], force_rebuild: bool) -> bool:
    if force_rebuild or not output_file.exists():
        return True
    output_mtime = output_file.stat().st_mtime
    return any(dependency.exists() and dependency.stat().st_mtime > output_mtime for dependency in dependencies)


def compile_source(
    compiler: tuple[str, list[str], str],
    root: pathlib.Path,
    source_file: pathlib.Path,
    output_file: pathlib.Path,
) -> subprocess.CompletedProcess[str]:
    output_file.parent.mkdir(parents=True, exist_ok=True)
    executable, extra_args, kind = compiler
    if kind == "msvc":
        command = [
            executable,
            "/nologo",
            "/std:c++17",
            "/EHsc",
            f"/Fe:{output_file}",
            str(source_file),
        ]
    else:
        command = [
            executable,
            "-std=c++17",
            "-O2",
            str(source_file),
            "-o",
            str(output_file),
        ]
    command.extend(extra_args)
    return subprocess.run(command, cwd=str(root), capture_output=True, text=True)


def run_binary(binary_file: pathlib.Path, argv: list[str], root: pathlib.Path) -> subprocess.CompletedProcess[str]:
    env = dict(os.environ)
    env["AIO_PYTHON_EXEC"] = env.get("AIO_PYTHON_EXEC", sys.executable)
    return subprocess.run([str(binary_file), *argv], cwd=str(root), env=env, capture_output=True, text=True)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or [])
    if not args["source_file"]:
        sys.stderr.write("native_cpp_entrypoint_runner requires a C++ source file path\n")
        return 2

    root = find_repo_root(pathlib.Path(__file__))
    source_file = pathlib.Path(args["source_file"])
    if not source_file.is_absolute():
        source_file = (root / pathlib.PurePosixPath(normalize_path(args["source_file"]))).resolve()
    if not source_file.exists():
        sys.stderr.write(f"missing C++ equivalent source: {source_file}\n")
        return 1

    compiler = detect_compiler()
    if compiler is None:
        sys.stderr.write("no supported C++ compiler found for native script equivalent execution\n")
        return 1

    output_file = resolve_binary_path(root, source_file)
    shared_runtime_file = root / "scripts" / "polyglot" / "equivalents" / "cpp" / "_shared" / "native_script_runtime.hpp"
    dependencies = [source_file, shared_runtime_file]
    if compile_required(output_file, dependencies, bool(args["force_rebuild"])):
        compile_result = compile_source(compiler, root, source_file, output_file)
        if compile_result.stdout:
            sys.stdout.write(str(compile_result.stdout))
        if compile_result.stderr:
            sys.stderr.write(str(compile_result.stderr))
        if compile_result.returncode != 0:
            return int(compile_result.returncode)

    run_result = run_binary(output_file, list(args["passthrough"]), root)
    if run_result.stdout:
        sys.stdout.write(str(run_result.stdout))
    if run_result.stderr:
        sys.stderr.write(str(run_result.stderr))
    return int(run_result.returncode or 0)


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
