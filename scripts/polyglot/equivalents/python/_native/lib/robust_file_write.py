#!/usr/bin/env python3
"""Native bridge for scripts/lib/robust-file-write.js."""

from __future__ import annotations

import json
import pathlib
import sys

from _common import ensure_dir_for_file, is_retryable_file_write_error, write_text_file_robust


def main(argv: list[str] | None = None) -> int:
    args = list(argv or [])
    if "--write-demo" in args:
        index = args.index("--write-demo")
        target = pathlib.Path(args[index + 1]).resolve() if index + 1 < len(args) else None
        if target is None:
            raise RuntimeError("--write-demo requires a file path")
        ensure_dir_for_file(target)
        write_text_file_robust(target, "robust_file_write demo\n", atomic=False)
        sys.stdout.write(
            json.dumps(
                {
                    "status": "pass",
                    "wrote": str(target),
                },
                indent=2,
            )
            + "\n"
        )
        return 0

    sys.stdout.write(
        json.dumps(
            {
                "status": "pass",
                "module": "robust_file_write",
                "exports": [
                    "ensure_dir_for_file",
                    "is_retryable_file_write_error",
                    "write_text_file_robust",
                ],
            },
            indent=2,
        )
        + "\n"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
