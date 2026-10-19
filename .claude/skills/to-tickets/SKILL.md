---
name: to-tickets
description: Break an accepted spec into tracer-bullet tickets under specs/<slug>/tickets/.
disable-model-invocation: true
---

# To tickets

Break an accepted spec into tracer-bullet tickets. Each ticket is a narrow path through the layers it touches, and it names the tickets that block it.

The parent spec is the accepted file in `specs/`. If it is missing or still proposed, stop.

## Process

1. Read the spec. If a path is passed as an argument, read that file.
2. Read the code the spec touches, if you have not already. Use the words already in that code.
3. Draft the tickets. Each one is demoable on its own and fits in one context. A mechanical change that touches many call sites is three steps: add the new form beside the old, migrate the call sites in batches that stay green, then delete the old form.
4. Show the list and wait for approval. For each ticket: title, blocked by, and the behavior it makes work. Ask whether the size and the blocking edges are right. Iterate until the user approves.
5. Write one file per ticket at `specs/<slug>/tickets/<NN>-<slug>.md`, numbered from `01`, blockers first. Name a file when it is a seam the parent spec already names. Do not add a code sample.

```markdown
# <NN>: <Ticket title>

**What to build:** the behavior this ticket makes work, from the user's perspective.

**Blocked by:** the numbers and titles of the tickets that gate this one, or "None".

**Status:** ready-for-agent

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2
```
