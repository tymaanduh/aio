#!/usr/bin/env python3
"""Native bridge for scripts/lib/agent-access-policy.js."""

from __future__ import annotations

import json
import sys

from agent_access_policy_native import (
    compact_access_policy,
    expand_access_policy,
    normalize_list,
    normalize_profile,
    profile_signature,
    stable_profile_id,
)


def main(argv: list[str] | None = None) -> int:
    del argv
    sys.stdout.write(
        json.dumps(
            {
                "status": "pass",
                "module": "agent_access_policy",
                "exports": [
                    "compact_access_policy",
                    "expand_access_policy",
                    "normalize_list",
                    "normalize_profile",
                    "profile_signature",
                    "stable_profile_id",
                ],
            },
            indent=2,
        )
        + "\n"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
