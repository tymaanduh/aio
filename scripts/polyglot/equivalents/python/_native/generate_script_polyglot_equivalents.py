#!/usr/bin/env python3
"""Native Python implementation for scripts/generate-script-polyglot-equivalents.js."""

from __future__ import annotations

import json
import os
import pathlib
import re
import sys
from collections import deque
from datetime import UTC, datetime
from typing import Any

from _common import (
    find_repo_root,
    normalize_path,
    script_relative_to_equivalent_relative,
    write_text_file_robust,
)

ROOT = find_repo_root(pathlib.Path(__file__))
SCRIPTS_ROOT = ROOT / "scripts"
EQUIVALENTS_ROOT = SCRIPTS_ROOT / "polyglot" / "equivalents"
PYTHON_EQUIVALENTS_ROOT = EQUIVALENTS_ROOT / "python"
CPP_EQUIVALENTS_ROOT = EQUIVALENTS_ROOT / "cpp"
PYTHON_SHARED_RUNTIME = PYTHON_EQUIVALENTS_ROOT / "_shared" / "native_script_runtime.py"
CPP_SHARED_RUNTIME = CPP_EQUIVALENTS_ROOT / "_shared" / "native_script_runtime.hpp"
PYTHON_LEGACY_SHARED_PROXY = PYTHON_EQUIVALENTS_ROOT / "_shared" / "node_script_proxy.py"
CPP_LEGACY_SHARED_PROXY = CPP_EQUIVALENTS_ROOT / "_shared" / "node_script_proxy.hpp"
PYTHON_NATIVE_IMPL_ROOT = PYTHON_EQUIVALENTS_ROOT / "_native"
CATALOG_FILE = ROOT / "data" / "output" / "databases" / "polyglot-default" / "build" / "script_polyglot_equivalents_catalog.json"

MANUAL_EQUIVALENT_DIRS = {"_native", "__pycache__"}


def parse_args(argv: list[str]) -> dict[str, Any]:
    return {"check": "--check" in (argv or [])}


def to_posix(value: pathlib.Path | str) -> str:
    return normalize_path(value)


def list_script_source_files() -> list[pathlib.Path]:
    files: list[pathlib.Path] = []
    queue: deque[pathlib.Path] = deque([SCRIPTS_ROOT])
    while queue:
        current = queue.popleft()
        for entry in sorted(current.iterdir(), key=lambda item: str(item)):
            rel_path = to_posix(entry.relative_to(SCRIPTS_ROOT))
            if entry.is_dir():
                if rel_path == "polyglot/equivalents" or rel_path.startswith("polyglot/equivalents/"):
                    continue
                queue.append(entry)
                continue
            if entry.is_file() and entry.name.endswith(".js"):
                files.append(entry)
    return sorted(files, key=lambda item: str(item))


def build_python_shared_runtime_content() -> str:
    return "\n".join(
        [
            "#!/usr/bin/env python3",
            "\"\"\"Shared runtime for generated Python script equivalents.\"\"\"",
            "",
            "from __future__ import annotations",
            "",
            "import importlib.util",
            "import os",
            "import pathlib",
            "import subprocess",
            "import sys",
            "",
            "ALLOW_JS_FALLBACK_ENV = \"AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK\"",
            "",
            "",
            "def normalize_path(value: str) -> str:",
            "    return str(value or \"\").replace('\\\\', '/')",
            "",
            "",
            "def parse_truthy(value: str) -> bool:",
            "    return str(value or \"\").strip().lower() in {\"1\", \"true\", \"yes\", \"on\"}",
            "",
            "",
            "def to_snake_case_base_name(file_name: str) -> str:",
            "    return str(file_name or \"\").replace('.js', '').replace('-', '_')",
            "",
            "",
            "def find_repo_root(start_path: pathlib.Path) -> pathlib.Path:",
            "    current = start_path.resolve()",
            "    if current.is_file():",
            "        current = current.parent",
            "    while True:",
            "        if (current / \"package.json\").exists() and (current / \"scripts\").exists():",
            "            return current",
            "        parent = current.parent",
            "        if parent == current:",
            "            raise RuntimeError(\"repository root not found from generated script equivalent\")",
            "        current = parent",
            "",
            "",
            "def script_relative_to_native_impl_relative(script_relative_path: str) -> pathlib.PurePosixPath:",
            "    source = pathlib.PurePosixPath(normalize_path(script_relative_path))",
            "    parts = list(source.parts)",
            "    if parts and parts[0] == \"scripts\":",
            "        parts = parts[1:]",
            "    if not parts:",
            "        raise RuntimeError(\"script_relative_path is required\")",
            "    file_name = parts.pop()",
            "    return pathlib.PurePosixPath(\"_native\", *parts, f\"{to_snake_case_base_name(file_name)}.py\")",
            "",
            "",
            "def run_node_compat(script_relative_path: str, argv: list[str] | None = None) -> int:",
            "    args = list(argv or [])",
            "    root = find_repo_root(pathlib.Path(__file__))",
            "    script_path = root / pathlib.PurePosixPath(script_relative_path)",
            "    if not script_path.exists():",
            "        sys.stderr.write(f\"missing script target: {script_path}\\\\n\")",
            "        return 1",
            "    node_exec = os.environ.get(\"AIO_NODE_EXEC\", \"node\")",
            "    env = {**os.environ, \"AIO_PYTHON_EXEC\": os.environ.get(\"AIO_PYTHON_EXEC\", sys.executable)}",
            "    completed = subprocess.run([node_exec, str(script_path), *args], cwd=str(root), env=env)",
            "    return int(completed.returncode)",
            "",
            "",
            "def load_native_module(script_relative_path: str):",
            "    root = find_repo_root(pathlib.Path(__file__))",
            "    equivalents_root = root / pathlib.PurePosixPath(\"scripts/polyglot/equivalents/python\")",
            "    native_root = equivalents_root / \"_native\"",
            "    native_impl_path = equivalents_root / script_relative_to_native_impl_relative(script_relative_path)",
            "    if not native_impl_path.exists():",
            "        return None",
            "    native_root_text = str(native_root)",
            "    if native_root_text not in sys.path:",
            "        sys.path.insert(0, native_root_text)",
            "    module_name = \"aio_native_script_\" + normalize_path(script_relative_path).replace('/', '_').replace('.', '_').replace('-', '_')",
            "    spec = importlib.util.spec_from_file_location(module_name, native_impl_path)",
            "    if spec is None or spec.loader is None:",
            "        raise RuntimeError(f\"failed to load native script implementation: {native_impl_path}\")",
            "    module = importlib.util.module_from_spec(spec)",
            "    spec.loader.exec_module(module)",
            "    return module",
            "",
            "",
            "def run_native_script(script_relative_path: str, argv: list[str] | None = None) -> int:",
            "    module = load_native_module(script_relative_path)",
            "    if module is not None:",
            "        entrypoint = getattr(module, \"main\", None) or getattr(module, \"run\", None) or getattr(module, \"run_native\", None)",
            "        if not callable(entrypoint):",
            "            raise RuntimeError(f\"native implementation missing main()/run() entrypoint for {script_relative_path}\")",
            "        result = entrypoint(list(argv or []))",
            "        return int(result or 0)",
            "    allow_fallback = ALLOW_JS_FALLBACK_ENV not in os.environ or parse_truthy(os.environ.get(ALLOW_JS_FALLBACK_ENV, \"1\"))",
            "    if allow_fallback:",
            "        return run_node_compat(script_relative_path, argv)",
            "    sys.stderr.write(f\"native Python equivalent not implemented for {script_relative_path} and JS fallback is disabled\\\\n\")",
            "    return 1",
            "",
        ]
    )


def build_cpp_shared_runtime_content() -> str:
    return "\n".join(
        [
            "#pragma once",
            "",
            "#include <cstdlib>",
            "#include <filesystem>",
            "#include <iostream>",
            "#include <string>",
            "#include <vector>",
            "",
            "#ifdef _WIN32",
            "#include <process.h>",
            "#else",
            "#include <sys/wait.h>",
            "#endif",
            "",
            "namespace aio::native_script_runtime {",
            "",
            "inline std::filesystem::path find_repo_root(std::filesystem::path start) {",
            "  std::filesystem::path current = std::filesystem::absolute(start);",
            "  while (!current.empty()) {",
            "    const auto packageFile = current / \"package.json\";",
            "    const auto scriptsDir = current / \"scripts\";",
            "    if (std::filesystem::exists(packageFile) && std::filesystem::exists(scriptsDir)) {",
            "      return current;",
            "    }",
            "    if (current == current.root_path()) {",
            "      break;",
            "    }",
            "    current = current.parent_path();",
            "  }",
            "  return {};",
            "}",
            "",
            "inline std::string quote_arg(const std::string& value) {",
            "  std::string out;",
            "  out.reserve(value.size() + 2);",
            "  out.push_back('\"');",
            "  for (char ch : value) {",
            "    if (ch == '\\\\' || ch == '\"') {",
            "      out.push_back('\\\\');",
            "    }",
            "    out.push_back(ch);",
            "  }",
            "  out.push_back('\"');",
            "  return out;",
            "}",
            "",
            "inline std::string resolve_python_exec() {",
            "#ifdef _WIN32",
            "  char* pythonExecEnv = nullptr;",
            "  std::size_t envLength = 0;",
            "  if (_dupenv_s(&pythonExecEnv, &envLength, \"AIO_PYTHON_EXEC\") == 0 && pythonExecEnv != nullptr) {",
            "    std::string value = pythonExecEnv;",
            "    std::free(pythonExecEnv);",
            "    if (!value.empty()) {",
            "      return value;",
            "    }",
            "  }",
            "  if (pythonExecEnv != nullptr) {",
            "    std::free(pythonExecEnv);",
            "  }",
            "#else",
            "  const char* pythonExecEnv = std::getenv(\"AIO_PYTHON_EXEC\");",
            "  if (pythonExecEnv != nullptr && pythonExecEnv[0] != '\\0') {",
            "    return pythonExecEnv;",
            "  }",
            "#endif",
            "  return \"python\";",
            "}",
            "",
            "inline int normalize_exit_status(int status) {",
            "#ifdef _WIN32",
            "  return status;",
            "#else",
            "  if (WIFEXITED(status)) {",
            "    return WEXITSTATUS(status);",
            "  }",
            "  if (WIFSIGNALED(status)) {",
            "    return 128 + WTERMSIG(status);",
            "  }",
            "  return status;",
            "#endif",
            "}",
            "",
            "inline std::string normalize_slashes(std::string value) {",
            "  for (char& ch : value) {",
            "    if (ch == '\\\\') {",
            "      ch = '/';",
            "    }",
            "  }",
            "  return value;",
            "}",
            "",
            "inline std::string to_snake_case_base_name(const std::string& file_name) {",
            "  std::string base = file_name;",
            "  const std::string suffix = \".js\";",
            "  if (base.size() >= suffix.size() && base.substr(base.size() - suffix.size()) == suffix) {",
            "    base = base.substr(0, base.size() - suffix.size());",
            "  }",
            "  for (char& ch : base) {",
            "    if (ch == '-') {",
            "      ch = '_';",
            "    }",
            "  }",
            "  return base;",
            "}",
            "",
            "inline std::filesystem::path script_relative_to_python_relative(const std::string& script_relative_path, const std::string& extension = \"py\") {",
            "  std::filesystem::path source = std::filesystem::path(normalize_slashes(script_relative_path));",
            "  std::filesystem::path relative;",
            "  auto iter = source.begin();",
            "  if (iter != source.end() && iter->string() == \"scripts\") {",
            "    ++iter;",
            "  }",
            "  for (; iter != source.end(); ++iter) {",
            "    relative /= *iter;",
            "  }",
            "  if (relative.empty()) {",
            "    return {};",
            "  }",
            "  const std::string file_name = relative.filename().string();",
            "  relative.replace_filename(to_snake_case_base_name(file_name) + \".\" + extension);",
            "  return relative;",
            "}",
            "",
            "inline std::filesystem::path resolve_python_equivalent_path(const std::filesystem::path& root, const std::string& script_relative_path) {",
            "  const std::filesystem::path relative = script_relative_to_python_relative(script_relative_path, \"py\");",
            "  return relative.empty() ? std::filesystem::path() : root / \"scripts\" / \"polyglot\" / \"equivalents\" / \"python\" / relative;",
            "}",
            "",
            "inline std::filesystem::path resolve_python_native_impl_path(const std::filesystem::path& root, const std::string& script_relative_path) {",
            "  const std::filesystem::path relative = script_relative_to_python_relative(script_relative_path, \"py\");",
            "  return relative.empty() ? std::filesystem::path() : root / \"scripts\" / \"polyglot\" / \"equivalents\" / \"python\" / \"_native\" / relative;",
            "}",
            "",
            "#ifdef _WIN32",
            "inline int spawn_windows_python_script(",
            "    const std::string& python_exec,",
            "    const std::filesystem::path& python_script,",
            "    int argc,",
            "    char** argv) {",
            "  std::vector<std::string> arguments;",
            "  arguments.reserve(static_cast<std::size_t>(argc > 1 ? argc + 1 : 2));",
            "  arguments.push_back(python_exec);",
            "  arguments.push_back(python_script.string());",
            "  for (int index = 1; index < argc; index += 1) {",
            "    if (argv != nullptr && argv[index] != nullptr) {",
            "      arguments.push_back(argv[index]);",
            "    }",
            "  }",
            "",
            "  std::vector<const char*> rawArguments;",
            "  rawArguments.reserve(arguments.size() + 1);",
            "  for (const auto& argument : arguments) {",
            "    rawArguments.push_back(argument.c_str());",
            "  }",
            "  rawArguments.push_back(nullptr);",
            "",
            "  const intptr_t status = _spawnvp(_P_WAIT, python_exec.c_str(), rawArguments.data());",
            "  if (status == -1) {",
            "    return 1;",
            "  }",
            "  return static_cast<int>(status);",
            "}",
            "#endif",
            "",
            "inline int run_python_script(",
            "    const std::string& python_exec,",
            "    const std::filesystem::path& python_script,",
            "    int argc,",
            "    char** argv) {",
            "#ifdef _WIN32",
            "  return spawn_windows_python_script(python_exec, python_script, argc, argv);",
            "#else",
            "  std::string command = quote_arg(python_exec) + \" \" + quote_arg(python_script.string());",
            "  for (int index = 1; index < argc; index += 1) {",
            "    command.append(\" \");",
            "    command.append(quote_arg(argv[index]));",
            "  }",
            "",
            "  const int status = std::system(command.c_str());",
            "  if (status < 0) {",
            "    return 1;",
            "  }",
            "  return normalize_exit_status(status);",
            "#endif",
            "}",
            "",
            "inline std::filesystem::path resolve_python_script_target(const std::filesystem::path& root, const std::string& script_relative_path) {",
            "  const std::filesystem::path nativeImpl = resolve_python_native_impl_path(root, script_relative_path);",
            "  if (!nativeImpl.empty() && std::filesystem::exists(nativeImpl)) {",
            "    return nativeImpl;",
            "  }",
            "  const std::filesystem::path pythonEquivalent = resolve_python_equivalent_path(root, script_relative_path);",
            "  if (!pythonEquivalent.empty() && std::filesystem::exists(pythonEquivalent)) {",
            "    return pythonEquivalent;",
            "  }",
            "  return {};",
            "}",
            "",
            "inline int run_native_script(const std::string& script_relative_path, int argc, char** argv) {",
            "  const std::filesystem::path executablePath =",
            "      (argc > 0 && argv != nullptr) ? std::filesystem::path(argv[0]) : std::filesystem::path(\".\");",
            "  const std::filesystem::path root = find_repo_root(executablePath.parent_path());",
            "  if (root.empty()) {",
            "    std::cerr << \"failed to locate repository root for generated C++ equivalent\\n\";",
            "    return 1;",
            "  }",
            "",
            "  const std::filesystem::path pythonScriptTarget = resolve_python_script_target(root, script_relative_path);",
            "  if (pythonScriptTarget.empty()) {",
            "    std::cerr << \"missing Python script target for generated C++ equivalent: \" << script_relative_path << \"\\n\";",
            "    return 1;",
            "  }",
            "",
            "  const std::string pythonExec = resolve_python_exec();",
            "  return run_python_script(pythonExec, pythonScriptTarget, argc, argv);",
            "}",
            "",
            "}  // namespace aio::native_script_runtime",
            "",
        ]
    )


def build_python_legacy_proxy_shim_content() -> str:
    return "\n".join(
        [
            "#!/usr/bin/env python3",
            "\"\"\"Retired compatibility shim for the old Node-backed script proxy.\"\"\"",
            "",
            "from __future__ import annotations",
            "",
            "",
            "def run_node_script(script_relative_path: str, argv: list[str] | None = None) -> int:",
            "    raise RuntimeError(",
            "        \"node_script_proxy.py is retired; regenerate wrappers or use _shared/native_script_runtime.py instead\"",
            "    )",
            "",
        ]
    )


def build_cpp_legacy_proxy_shim_content() -> str:
    return "\n".join(
        [
            "#pragma once",
            "",
            "#include <iostream>",
            "#include <string>",
            "",
            "namespace aio::script_proxy {",
            "",
            "inline int run_node_script(const std::string&, int, char**) {",
            "  std::cerr << \"node_script_proxy.hpp is retired; regenerate wrappers or use _shared/native_script_runtime.hpp instead\\n\";",
            "  return 1;",
            "}",
            "",
            "}  // namespace aio::script_proxy",
            "",
        ]
    )


def build_python_wrapper_content(script_relative_path: str, wrapper_file_path: pathlib.Path) -> str:
    shared_relative_path = normalize_path(os.path.relpath(PYTHON_SHARED_RUNTIME, wrapper_file_path.parent))
    return "\n".join(
        [
            "#!/usr/bin/env python3",
            f"\"\"\"Auto-generated Python equivalent for scripts/{script_relative_path}.\"\"\"",
            "",
            "from __future__ import annotations",
            "",
            "import importlib.util",
            "import pathlib",
            "import sys",
            "",
            "",
            "def _load_runtime():",
            f"    shared_runner_path = (pathlib.Path(__file__).resolve().parent / \"{shared_relative_path}\").resolve()",
            "    spec = importlib.util.spec_from_file_location(\"aio_native_script_runtime\", shared_runner_path)",
            "    if spec is None or spec.loader is None:",
            "        raise RuntimeError(f\"failed to load shared runtime: {shared_runner_path}\")",
            "    module = importlib.util.module_from_spec(spec)",
            "    spec.loader.exec_module(module)",
            "    return module.run_native_script",
            "",
            "",
            "if __name__ == \"__main__\":",
            "    run_native_script = _load_runtime()",
            f"    raise SystemExit(run_native_script(\"scripts/{script_relative_path}\", sys.argv[1:]))",
            "",
        ]
    )


def build_cpp_wrapper_content(script_relative_path: str, wrapper_file_path: pathlib.Path) -> str:
    shared_relative_path = normalize_path(os.path.relpath(CPP_SHARED_RUNTIME, wrapper_file_path.parent))
    return "\n".join(
        [
            f"// Auto-generated C++ equivalent for scripts/{script_relative_path}.",
            f"#include \"{shared_relative_path}\"",
            "",
            "int main(int argc, char** argv) {",
            f"  return aio::native_script_runtime::run_native_script(\"scripts/{script_relative_path}\", argc, argv);",
            "}",
            "",
        ]
    )


def build_equivalent_targets() -> tuple[dict[pathlib.Path, str], list[dict[str, Any]]]:
    targets: dict[pathlib.Path, str] = {
        PYTHON_SHARED_RUNTIME: build_python_shared_runtime_content(),
        CPP_SHARED_RUNTIME: build_cpp_shared_runtime_content(),
        PYTHON_LEGACY_SHARED_PROXY: build_python_legacy_proxy_shim_content(),
        CPP_LEGACY_SHARED_PROXY: build_cpp_legacy_proxy_shim_content(),
    }
    entries: list[dict[str, Any]] = []

    for abs_script_path in list_script_source_files():
        rel_from_scripts = to_posix(abs_script_path.relative_to(SCRIPTS_ROOT))
        python_relative = script_relative_to_equivalent_relative(rel_from_scripts, "py")
        cpp_relative = script_relative_to_equivalent_relative(rel_from_scripts, "cpp")
        python_file_path = PYTHON_EQUIVALENTS_ROOT / python_relative
        cpp_file_path = CPP_EQUIVALENTS_ROOT / cpp_relative
        python_native_impl_path = PYTHON_NATIVE_IMPL_ROOT / python_relative
        python_native_implemented = python_native_impl_path.exists()
        cpp_dispatch_strategy = "python_native_direct" if python_native_implemented else "python_wrapper_delegate"

        targets[python_file_path] = build_python_wrapper_content(rel_from_scripts, python_file_path)
        targets[cpp_file_path] = build_cpp_wrapper_content(rel_from_scripts, cpp_file_path)

        entries.append(
            {
                "script_id": re.sub(r"[/-]", "_", re.sub(r"\.js$", "", rel_from_scripts, flags=re.IGNORECASE)),
                "source_js_file": f"scripts/{rel_from_scripts}",
                "python_equivalent_file": f"scripts/polyglot/equivalents/python/{to_posix(python_relative)}",
                "cpp_equivalent_file": f"scripts/polyglot/equivalents/cpp/{to_posix(cpp_relative)}",
                "python_runtime_kind": "native_dispatch",
                "cpp_runtime_kind": "native_dispatch",
                "python_native_implemented": python_native_implemented,
                "python_native_impl_file": (
                    f"scripts/polyglot/equivalents/python/_native/{to_posix(python_relative)}"
                    if python_native_implemented
                    else ""
                ),
                "cpp_dispatch_strategy": cpp_dispatch_strategy,
                "js_compat_fallback_env": "AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK",
            }
        )

    return targets, entries


def list_generated_files(root_dir: pathlib.Path) -> list[pathlib.Path]:
    if not root_dir.exists():
        return []
    files: list[pathlib.Path] = []
    queue: deque[pathlib.Path] = deque([root_dir])
    while queue:
        current = queue.popleft()
        for entry in sorted(current.iterdir(), key=lambda item: str(item)):
            if entry.is_dir():
                if entry.name in MANUAL_EQUIVALENT_DIRS:
                    continue
                queue.append(entry)
                continue
            if entry.is_file():
                files.append(entry)
    return files


def write_targets(targets: dict[pathlib.Path, str]) -> None:
    for file_path, content in targets.items():
        write_text_file_robust(file_path, content, atomic=False)


def remove_stale_generated_files(targets: dict[pathlib.Path, str]) -> list[str]:
    stale: list[str] = []
    for root_dir in (PYTHON_EQUIVALENTS_ROOT, CPP_EQUIVALENTS_ROOT):
        for file_path in list_generated_files(root_dir):
            if file_path in targets:
                continue
            stale.append(to_posix(file_path.relative_to(ROOT)))
            file_path.unlink()
    return stale


def build_catalog(entries: list[dict[str, Any]]) -> dict[str, Any]:
    python_native_implementation_count = sum(1 for entry in entries if entry.get("python_native_implemented") is True)
    cpp_python_native_direct_count = sum(1 for entry in entries if entry.get("cpp_dispatch_strategy") == "python_native_direct")
    cpp_python_wrapper_delegate_count = sum(
        1 for entry in entries if entry.get("cpp_dispatch_strategy") == "python_wrapper_delegate"
    )
    return {
        "schema_version": 1,
        "catalog_id": "aio_script_polyglot_equivalents",
        "generated_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "root": str(ROOT),
        "outputs": {
            "python_root": "scripts/polyglot/equivalents/python",
            "cpp_root": "scripts/polyglot/equivalents/cpp",
            "catalog_file": to_posix(CATALOG_FILE.relative_to(ROOT)),
        },
        "metrics": {
            "script_count": len(entries),
            "python_equivalent_count": len(entries) + 1,
            "cpp_equivalent_count": len(entries) + 1,
            "python_native_implementation_count": python_native_implementation_count,
            "cpp_native_dispatch_count": len(entries),
            "cpp_python_native_direct_count": cpp_python_native_direct_count,
            "cpp_python_wrapper_delegate_count": cpp_python_wrapper_delegate_count,
        },
        "entries": entries,
    }


def write_catalog(catalog: dict[str, Any]) -> None:
    write_text_file_robust(CATALOG_FILE, f"{json.dumps(catalog, indent=2)}\n", atomic=False)


def normalize_catalog_for_comparison(catalog: dict[str, Any]) -> dict[str, Any]:
    payload = dict(catalog or {})
    payload.pop("generated_at", None)
    payload.pop("root", None)
    return payload


def run_check(targets: dict[pathlib.Path, str], catalog: dict[str, Any]) -> int:
    issues: list[dict[str, Any]] = []
    for file_path, expected_content in targets.items():
        if not file_path.exists():
            issues.append({"level": "error", "type": "missing_equivalent", "file": to_posix(file_path.relative_to(ROOT))})
            continue
        actual_content = file_path.read_text(encoding="utf8")
        if actual_content != expected_content:
            issues.append({"level": "error", "type": "drifted_equivalent", "file": to_posix(file_path.relative_to(ROOT))})

    for root_dir in (PYTHON_EQUIVALENTS_ROOT, CPP_EQUIVALENTS_ROOT):
        for file_path in list_generated_files(root_dir):
            if file_path not in targets:
                issues.append({"level": "error", "type": "stale_equivalent", "file": to_posix(file_path.relative_to(ROOT))})

    if not CATALOG_FILE.exists():
        issues.append({"level": "error", "type": "missing_equivalent_catalog", "file": to_posix(CATALOG_FILE.relative_to(ROOT))})
    else:
        try:
            existing_catalog = json.loads(CATALOG_FILE.read_text(encoding="utf8"))
            existing_serialized = json.dumps(normalize_catalog_for_comparison(existing_catalog))
            expected_serialized = json.dumps(normalize_catalog_for_comparison(catalog))
            if existing_serialized != expected_serialized:
                issues.append({"level": "error", "type": "drifted_equivalent_catalog", "file": to_posix(CATALOG_FILE.relative_to(ROOT))})
        except Exception as error:
            issues.append(
                {
                    "level": "error",
                    "type": "invalid_equivalent_catalog_json",
                    "file": to_posix(CATALOG_FILE.relative_to(ROOT)),
                    "error": str(error),
                }
            )

    report = {
        "status": "fail" if issues else "pass",
        "mode": "check",
        "generated_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "root": str(ROOT),
        "metrics": {"target_file_count": len(targets)},
        "issues": issues,
    }
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 1 if issues else 0


def run_write(targets: dict[pathlib.Path, str], catalog: dict[str, Any]) -> int:
    write_targets(targets)
    stale_files = remove_stale_generated_files(targets)
    write_catalog(catalog)
    report = {
        "status": "pass",
        "mode": "write",
        "generated_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "root": str(ROOT),
        "metrics": {
            "target_file_count": len(targets),
            "stale_files_removed": len(stale_files),
            "script_count": int((catalog.get("metrics") or {}).get("script_count") or 0),
        },
        "outputs": {
            "python_root": "scripts/polyglot/equivalents/python",
            "cpp_root": "scripts/polyglot/equivalents/cpp",
            "catalog_file": to_posix(CATALOG_FILE.relative_to(ROOT)),
        },
    }
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 0


def main(argv: list[str] | None = None) -> int:
    args = parse_args(list(argv or []))
    targets, entries = build_equivalent_targets()
    catalog = build_catalog(entries)
    if args.get("check"):
        return run_check(targets, catalog)
    return run_write(targets, catalog)


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
