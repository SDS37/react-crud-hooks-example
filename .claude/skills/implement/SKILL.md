---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by an accepted spec in `specs/`, or by tickets that spec already names.

The stack upgrade belongs to the `upgrade` skill. If the spec is missing, or its status is still proposed, stop. Do not edit `src/`, `server/`, or `package.json` in that turn.

Branch off `main`. Do not commit to `main`.

Call the Skill tool with "tdd" at the seams the spec already names.

Run the checks through the `test-runner` skill: the focused file as you go, then every check in "Commands in force". Do not edit a characterization assertion.

Once `test-runner` reports GREEN, call the Skill tool with "code-review". Commit only after that report has no Blocking finding. Message shape is Conventional Commits. Then call the Skill tool with "pr" and open the pull request with `gh`.
