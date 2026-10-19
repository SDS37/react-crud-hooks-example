# Project docs

Read these in order.

1. [Definition of done](DoD.md): the checks a change must pass before it is done.
2. [Architecture](architecture.md): how the layers connect, and the component tree.
3. [Architecture decision records](architecture-decision-records.md): the stack decisions already made, and why.
4. [Commits](commits.md): the commit message shape.

How this configuration loads, and the spec-driven development steps, are in [claude.md](claude.md). That page is not part of the read order above.

Product changes start from a spec in [`specs/`](../specs/). The checks a change must pass are the definition of done. A spec can add a check. [`AGENTS.md`](../AGENTS.md) is the process gate for agents. It does not restate the commands or the architecture.

This README, the definition of done, the architecture overview, and the decision records stay current. A new decision is a new record in the decision log. Do not rewrite an accepted record.
