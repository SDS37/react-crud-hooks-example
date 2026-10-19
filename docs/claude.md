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
