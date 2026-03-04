#!/usr/bin/env bash
set -euo pipefail

# Detect common language toolchains for polyglot planning.

check() {
  local name="$1"
  local cmd="$2"
  local version_cmd="$3"
  if command -v "$cmd" >/dev/null 2>&1; then
    local version
    version="$($version_cmd 2>/dev/null | head -n 1 || true)"
    printf '%s|installed|%s\n' "$name" "$version"
  else
    printf '%s|missing|\n' "$name"
  fi
}

check "javascript-node" "node" "node --version"
check "typescript" "tsc" "tsc --version"
check "python" "python3" "python3 --version"
check "go" "go" "go version"
check "rust" "rustc" "rustc --version"
check "java" "javac" "javac -version"
check "dotnet" "dotnet" "dotnet --version"
check "c-cpp" "gcc" "gcc --version"
check "swift" "swift" "swift --version"
check "kotlin" "kotlinc" "kotlinc -version"
