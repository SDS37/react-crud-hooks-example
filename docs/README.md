# Project docs

Read these in order.

1. [Definition of done](DoD.md): the checks a change must pass before it is done.
2. [Architecture](architecture.md): how the layers connect, and the component tree.
3. [Architecture decision records](architecture-decision-records.md): the stack decisions already made, and why.
4. [Conventional commits](../.claude/rules/conventional-commits.md): how to branch, commit, and open a pull request.

Product changes start from a spec in [`specs/`](../specs/). [`specs/upgrade.md`](../specs/upgrade.md) is the upgrade spec, and its "Commands in force" section is the source for the checks in the definition of done. [`AGENTS.md`](../AGENTS.md) describes the commands and the architecture.

This README, the definition of done, the architecture overview, and the decision records stay current. A new decision is a new record in the decision log. Do not rewrite an accepted record.
