#!/usr/bin/env python3
"""Deny a commit on the default branch, and a message that is not Conventional Commits.

The denial reason is how the convention reaches the agent. Context attached
beside the tool result would arrive only after the commit had already run.
"""

import json
import os
import re
import shlex
import subprocess
import sys

INIT = re.compile(r"\bcodegraph\s+init\b")
GIT = re.compile(r"(?:^|[\s;&|\"'`(\n])git(?![\w-])")
SUBJECT = re.compile(
    r"^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)"
    r"(\([^)]+\))?!?: \S"
)
HEREDOC = re.compile(r"<<-?\s*['\"]?(\w+)['\"]?\n(.*)\n\1\b", re.S)
TAKES_VALUE = {"-C", "-c", "--git-dir", "--work-tree", "--namespace"}


def emit_deny(reason):
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


def git_output(cwd, args):
    result = subprocess.run(
        ["git", *args],
        cwd=cwd,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        return ""
    return result.stdout.strip()


def default_branch(cwd):
    name = git_output(cwd, ["symbolic-ref", "--short", "refs/remotes/origin/HEAD"])
    if name:
        return name.split("/", 1)[-1]
    for candidate in ("main", "master"):
        exists = subprocess.run(
            ["git", "show-ref", "--verify", "--quiet", f"refs/heads/{candidate}"],
            cwd=cwd,
        )
        if exists.returncode == 0:
            return candidate
    return "main"


def cut_command(text):
    quote = None
    index = 0
    while index < len(text):
        char = text[index]
        if quote:
            if char == quote:
                quote = None
            index += 1
            continue
        if char in "\"'":
            quote = char
            index += 1
            continue
        if text.startswith("&&", index) or text.startswith("||", index):
            return text[:index]
        if char in ";&|\n":
            return text[:index]
        index += 1
    return text


def words_of(segment):
    try:
        return shlex.split(segment, posix=True)
    except ValueError:
        return segment.split()


def parse_commit(words):
    """Return (directory from -C, message lines or None) for a commit invocation."""
    directory = None
    index = 1
    while index < len(words):
        word = words[index]
        if word == "commit":
            return directory, messages_after(words[index + 1 :])
        if word in TAKES_VALUE and index + 1 < len(words):
            if word == "-C":
                directory = words[index + 1]
            index += 2
            continue
        if word.startswith("--git-dir="):
            index += 1
            continue
        if word.startswith("-C") and word != "-C":
            directory = word[2:]
            index += 1
            continue
        if word.startswith("-"):
            index += 1
            continue
        return None
    return None


def messages_after(words):
    messages = []
    saw_message = False
    index = 0
    while index < len(words):
        word = words[index]
        if word in ("-m", "--message") and index + 1 < len(words):
            messages.append(words[index + 1])
            saw_message = True
            index += 2
            continue
        if word.startswith("--message="):
            messages.append(word.split("=", 1)[1])
            saw_message = True
            index += 1
            continue
        if word.startswith("-m") and word != "-m":
            messages.append(word[2:])
            saw_message = True
            index += 1
            continue
        if word in ("-F", "--file") and index + 1 < len(words):
            path = words[index + 1]
            if path == "-":
                return None
            try:
                with open(path, encoding="utf-8") as handle:
                    messages.append(handle.read())
            except OSError:
                return None
            saw_message = True
            index += 2
            continue
        index += 1
    if not saw_message:
        return None
    return messages


def unwrap(text):
    match = HEREDOC.search(text)
    if match:
        return match.group(2).strip()
    return text


def subject_ok(messages):
    text = unwrap("\n".join(messages)).strip()
    if not text:
        return False
    return SUBJECT.match(text.splitlines()[0]) is not None


def commit_invocations(command):
    found = []
    for match in GIT.finditer(command):
        start = command.rfind("git", match.start(), match.end())
        segment = cut_command(command[start:])
        words = words_of(segment)
        if not words or words[0] != "git":
            continue
        parsed = parse_commit(words)
        if parsed is not None:
            found.append(parsed)
    return found


def resolve_directory(base, directory):
    if not directory:
        return base
    if os.path.isabs(directory):
        return directory
    return os.path.normpath(os.path.join(base, directory))


def working_directory(data, command, directory_from_flag):
    root = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
    base = data.get("cwd") or root
    changed = re.match(r"\s*cd\s+(\S+)\s+&&", command)
    if changed:
        base = resolve_directory(root, changed.group(1).strip("\"'"))
    return resolve_directory(base, directory_from_flag)


def convention(root):
    path = os.path.join(root, "docs", "commits.md")
    try:
        with open(path, encoding="utf-8") as handle:
            return handle.read().strip()
    except OSError:
        return "Commit messages use Conventional Commits: type(scope): reason."


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        return

    if (data.get("tool_name") or "") != "Bash":
        return

    command = (data.get("tool_input") or {}).get("command") or ""
    if INIT.search(command):
        emit_deny("Indexing is a user decision. Do not initialize the code index.")
        return

    invocations = commit_invocations(command)
    if not invocations:
        return

    root = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
    for directory, messages in invocations:
        cwd = working_directory(data, command, directory)
        branch = git_output(cwd, ["rev-parse", "--abbrev-ref", "HEAD"])
        if branch and branch == default_branch(cwd):
            emit_deny(
                "The current branch is the default branch. "
                "Commit from a branch off it."
            )
            return
        if messages is not None and not subject_ok(messages):
            emit_deny(
                "The commit message is not Conventional Commits.\n\n"
                + convention(root)
            )
            return


if __name__ == "__main__":
    main()
