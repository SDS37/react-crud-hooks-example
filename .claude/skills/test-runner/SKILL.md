---
name: test-runner
description: Spawn the test-runner agent to verify a change. The author does not grade its own change.
---

# Test runner

Spawn the `test-runner` agent. Do not run the suite yourself and then declare it green. Do not fix failures in this pass.

The agent reads the checks in `docs/DoD.md` and any extra check the accepted spec names, runs them, and returns the report. Hand that report back unchanged.
