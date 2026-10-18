---
name: test-runner
description: Spawn the test-runner agent to verify a change and report the result. Use after a behavior change, or when implement asks for verification. The author does not run this grade in its own context.
---

# Test runner

Spawn the `test-runner` agent. Do not run the suite yourself and then declare it green. Do not fix failures in this pass.

The agent reads "Commands in force" in `specs/upgrade.md`, runs those checks, and returns the report. Hand that report back unchanged.
