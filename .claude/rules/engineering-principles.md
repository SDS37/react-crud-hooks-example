---
paths:
  - "**/*"
---

# Engineering principles

These rules apply to every file in this repository.

## Working style

- Prefer the smallest change that fully solves the problem. Do not refactor unrelated code in the same change.
- Match the surrounding code: naming, file layout, comment density, and idioms.
- Read before you write. Understand the existing pattern before adding a new one.
- When a library, framework, SDK, or CLI is involved, fetch current docs with the `docs` skill before relying on memory. APIs change.

## Code quality

- No dead code, commented-out blocks, or `TODO` without an owner or an issue reference.
- Keep functions small and single-purpose. Extract when a function does two things.
- Name things for intent, not implementation. Avoid abbreviations.
- Handle errors explicitly. Do not swallow an error or fall back to a default that hides a failure. Surface it by logging or throwing.
- Keep nesting shallow. Return early instead of wrapping the rest of a function in a condition.
- Name a bare number or string when its meaning is not obvious at the use site.
- A comment says why the code is there. Do not comment what the code already says.
- Check untrusted input at the boundary that receives it. Do not trust it again deeper in the call chain.

## Changes

- New behavior starts with a failing test that states the requirement. Do not generate tests from existing code just to raise coverage.
- Characterization tests in `specs/upgrade.md` lock behavior before the code that changes that behavior. Later commits may change their runner and imports, not their assertions.
- Do not edit a failing test to make it pass. Change the implementation.
- The author does not grade the change. `test-runner` and `code-review` are separate passes.
- Follow the spec gate and the done check in `AGENTS.md`.
- A new spec is written with `to-spec` and stays proposed until the user accepts it. Small, one-context changes then use `implement`. Work that will not fit one context uses `implement-spec`. The stack upgrade uses `upgrade`.
- Do not check out `main` to implement a change. Large work runs in a git worktree named `<type>-<slug>`.
- Do not commit while tests are running.
