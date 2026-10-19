---
name: tdd
description: Test-driven development for a change the spec names.
---

# Test-driven development

The seams are the ones named by the accepted spec. Do not change an assertion that spec says to keep. When the spec has not named the seam, use the `codebase-design` skill before writing the test. Run the checks through the `test-runner` skill.

A seam is the public boundary you test at. Test through that boundary. Do not test private helpers, and do not mock a module this project owns. Mock only a boundary the spec names, such as a network edge or a clock.

## Loop

- Write one failing test, then only enough code to pass it.
- One seam, one test, one change per cycle.
- An assertion states a known value from the spec. It does not recompute the result the way the implementation does.
- Refactoring belongs to `code-review`, after the test is green.
