#!/usr/bin/env python3
import subprocess
import sys


def main() -> int:
    if len(sys.argv) < 3:
        sys.stderr.write("node_script_bridge.py expects: <node_exec> <script_path> [script_args...]\n")
        return 2

    node_exec = sys.argv[1]
    script_path = sys.argv[2]
    script_args = sys.argv[3:]

    result = subprocess.run(
        [node_exec, script_path, *script_args],
        capture_output=True,
        text=True
    )

    if result.stdout:
        sys.stdout.write(result.stdout)
    if result.stderr:
        sys.stderr.write(result.stderr)
    return int(result.returncode or 0)


if __name__ == "__main__":
    raise SystemExit(main())
