---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by an accepted spec in `specs/`, or by tickets that spec already names.

If the spec is missing, or its status is still proposed, stop. Do not edit `src/`, `server/`, or `package.json` in that turn.

Branch off the default branch. Do not commit directly to it.

Call the Skill tool with "tdd" at the seams the spec already names.

Run the checks through the `test-runner` skill: the focused file as you go, then every check in `docs/DoD.md` and any extra check the spec names. Do not edit an assertion the spec says to keep.

Once `test-runner` reports GREEN, call the Skill tool with "code-review". Commit only after that report has no Blocking finding. The message shape is in `docs/commits.md`. Then ask the user to run `/pr` to open the pull request.
