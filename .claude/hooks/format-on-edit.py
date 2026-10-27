#!/usr/bin/env python3
"""Format an edited file with Prettier and send the result back to Claude."""

import json
import os
import subprocess
import sys

FORMATTED_EXTENSIONS = {".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".scss"}


def emit_block(reason):
    json.dump({"decision": "block", "reason": reason}, sys.stdout)


def emit_context(text):
    json.dump(
        {
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "additionalContext": text,
            }
        },
        sys.stdout,
    )


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        return

    path = ((data.get("tool_input") or {}).get("file_path") or "")
    if not path or not os.path.isfile(path):
        return

    normalized = path.replace("\\", "/")
    if "/node_modules/" in normalized or "/build/" in normalized:
        return
    if os.path.splitext(path)[1].lower() not in FORMATTED_EXTENSIONS:
        return

    root = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
    prettier = os.path.join(root, "node_modules", ".bin", "prettier")
    if not os.path.isfile(prettier):
        emit_block("Prettier is missing. Run npm install before editing.")
        return

    with open(path, "rb") as handle:
        before = handle.read()

    result = subprocess.run(
        [prettier, "--write", path],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        detail = (result.stderr or result.stdout or "prettier failed").strip()
        emit_block(
            "Prettier rejected the file. Fix it before continuing.\n" + detail
        )
        return

    with open(path, "rb") as handle:
        after = handle.read()
    if before != after:
        emit_context(
            "Prettier reformatted "
            + path
            + ". Re-read the file before the next edit."
        )


if __name__ == "__main__":
    main()
