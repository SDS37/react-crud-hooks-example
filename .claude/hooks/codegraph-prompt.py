#!/usr/bin/env python3
"""Forward the code-index prompt hook, and drop a stale index.

The upstream hook injects source into the prompt. When that source names
files that are not in the tree, the injection is discarded instead.
"""

import os
import re
import subprocess
import sys

# CodeGraph labels a location as path:line. Relative imports and URLs do not.
LOCATION = re.compile(
    r"(?<![\w./])((?:[\w.-]+/)*[\w.-]+\.[A-Za-z0-9]{1,5}):\d+"
)


def main():
    raw = sys.stdin.read()
    root = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
    try:
        result = subprocess.run(
            ["codegraph", "prompt-hook"],
            input=raw,
            capture_output=True,
            text=True,
            cwd=root,
        )
    except FileNotFoundError:
        return

    if result.returncode != 0:
        return

    text = result.stdout
    if not text.strip():
        return

    for path in LOCATION.findall(text):
        if path.startswith("."):
            continue
        if not os.path.exists(os.path.join(root, path)):
            return

    sys.stdout.write(text)


if __name__ == "__main__":
    main()
