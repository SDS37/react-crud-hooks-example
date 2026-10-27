---
name: pr
description: Use when writing a PR body.
disable-model-invocation: true
---

Open the pull request with `gh pr create` from a branch off the default branch. Do not commit directly to it.

```markdown
## Summary

What changed and why.

## Evidence

The checks from `docs/DoD.md` that were run, plus any check the spec adds, and their results. For a visible change, name the route that was exercised.

## Test plan

- [ ] A step a reviewer can run
```
