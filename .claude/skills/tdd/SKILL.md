---
name: tdd
description: Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
---

# Test-driven development

The seams are the ones named by the accepted spec. For the upgrade, those are the Preserve list and the characterization tests in `specs/upgrade.md`. Do not change what those tests assert. When the spec has not named the seam, use the `codebase-design` skill before writing the test. Run the checks through the `test-runner` skill.

A seam is the public boundary you test at. Test through that boundary. Do not test private helpers, and do not mock a module this app owns. The boundary to mock, when a test needs it, is the HTTP edge in `src/data/iceCreamData.js` or the clock. The server tests use `createApp()` from `server/app.js` with its in-memory data.

## Loop

- Write one failing test, then only enough code to pass it.
- One seam, one test, one change per cycle.
- An assertion states a known value from the spec. It does not recompute the result the way the implementation does.
- Refactoring belongs to `code-review`, after the test is green.
