#!/usr/bin/env python3
"""Block reads and writes of secret files before the tool runs."""

import json
import re
import sys

SECRET_PATH = re.compile(
    r"(^|/)(\.env($|\.)|credentials\.(json|ya?ml)$|id_rsa($|\.)|.*\.pem$|secrets/)",
    re.IGNORECASE,
)
SECRET_COMMAND = re.compile(
    r"(\.env\b|id_rsa|\.pem\b|credentials\.json)",
    re.IGNORECASE,
)
READ_COMMAND = re.compile(
    r"\b(cat|head|tail|less|bat|source|curl|cp|mv|open|sed|awk)\b",
    re.IGNORECASE,
)


def deny(reason):
    json.dump(
        {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": reason,
            }
        },
        sys.stdout,
    )
    sys.exit(0)


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        return

    tool = data.get("tool_name") or ""
    tool_input = data.get("tool_input") or {}

    if tool in ("Read", "Edit", "Write"):
        path = (tool_input.get("file_path") or "").replace("\\", "/")
        if SECRET_PATH.search(path):
            deny("Blocked secret file: " + path)
        return

    if tool == "Bash":
        command = tool_input.get("command") or ""
        if SECRET_COMMAND.search(command) and READ_COMMAND.search(command):
            deny("Blocked a command that reads secret files.")


if __name__ == "__main__":
    main()
