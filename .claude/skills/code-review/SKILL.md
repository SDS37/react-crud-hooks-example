---
name: code-review
description: Spawn the code-reviewer agent for the diff since a fixed point. Use after a logical chunk of work, before committing, or before opening a PR. The author does not review its own change.
---

# Code review

Spawn the `code-reviewer` agent. Do not review the diff in this context, and do not fix it here.

Pass the fixed point the user gave (a commit, branch, tag, or `main`). If they did not give one, the agent reviews the current staged and unstaged diff. It returns **Blocking**, **Should-fix**, and **Nit**. Hand that report back unchanged.
