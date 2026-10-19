# Claude configuration

What loads on a request, and what stays quiet until something happens. `CLAUDE.md` points here through `docs/README.md`. It does not import this page.

```mermaid
flowchart TD
  req[Request]

  req --> claude[CLAUDE.md]
  claude --> agents["AGENTS.md: spec, done, branch, commits, index"]
  claude --> readme[docs/README.md]

  req --> catalog[Skill descriptions]
  catalog -->|skill is invoked| body[Skill body]
  body --> agentsRun["code-reviewer or test-runner, when that skill runs"]

  serverEdit["Edit under server/"] --> strip[type-stripping rule]

  claudeDir["Work under .claude/"] --> nested[".claude/CLAUDE.md CodeGraph block"]

  tool[Tool call] --> secret[secret-guard]
  bash[Bash] --> policy[commit-policy]
  policy -->|commit on the default branch| denyBranch[Deny]
  policy -->|message is not Conventional Commits| denyMsg["Deny and include docs/commits.md"]
  policy -->|codegraph init| denyInit[Deny]
  write[Edit or Write] --> format[format-on-edit]
  prompt[User prompt] --> cg[codegraph-prompt]
  cg -->|index names a missing file| none[Inject nothing]
  cg -->|index matches the tree| inject[Inject structure]
```

`AGENTS.md` is the process gate. The standing checks are `docs/DoD.md`. A spec can add a check. Skill bodies, the two agents, and the type-stripping rule load only when they are used. The hooks stay silent unless they deny a call or the index matches the tree.

## Spec-driven development

Spec-driven development (SDD) is the path from a conversation to a commit. `/to-spec`, `/to-tickets`, `/implement`, and `/implement-spec` run only when invoked. `tdd` also runs on its own when the request is test-first. The commit hook does not check that a test was written first.

```mermaid
flowchart TD
  talk[Conversation]
  talk --> spec["SDD 1. /to-spec writes specs/slug.md as proposed and stops"]
  spec --> accepted{User accepts the spec?}
  accepted -->|no| spec
  accepted -->|yes| fit{Fits one context?}
  fit -->|yes| impl["SDD 3. /implement"]
  fit -->|no| tickets["SDD 2. /to-tickets drafts the list and waits"]
  tickets --> approved{User approves the tickets?}
  approved -->|no| tickets
  approved -->|yes| implSpec["SDD 3. /implement-spec"]
  impl --> gate
  implSpec --> gate
  gate{Spec missing or still proposed?}
  gate -->|yes| stop[Stop. No application edits.]
  gate -->|no| seam{Spec names a seam?}
  seam -->|no| design[codebase-design names the seam]
  design --> tdd
  seam -->|yes| tdd["SDD 4. tdd: one failing test, then only enough code to pass"]
  tdd --> checks["SDD 5. test-runner: docs/DoD.md plus extra spec checks"]
  checks -->|RED| tdd
  checks -->|GREEN| review["SDD 6. code-review"]
  review -->|Blocking| fix[Fix the finding]
  fix --> checks
  review -->|no Blocking| commit["SDD 7. Commit off the default branch"]
  commit --> pr["SDD 8. /pr"]
```
