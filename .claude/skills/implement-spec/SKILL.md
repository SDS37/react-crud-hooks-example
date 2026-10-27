---
name: implement-spec
description: "Implement the result of /to-spec and /to-tickets in code."
disable-model-invocation: true
---

You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec.

The spec is an accepted file in `specs/`. Tickets are the files under `specs/<slug>/tickets/` from `to-tickets`. If the spec is missing or still proposed, stop before creating a branch.

The goal is the entire spec implemented on a single **integration branch**. The lead does not implement. Workers are ordinary subagents on Sonnet.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

**Subagents** should be run in the background where possible for maximum concurrency.

## Steps

1. Read the spec and tickets to understand the task graph.

2. (optional) Use an **exploration subagent** to conduct any exploration required by the tickets - relevant codebase files or external documentation. Ensure the exploration subagent can save files - it should save its markdown notes in a directory outside the repo, accessible by all future subagents. This lets **subagents** focus on implementation rather than exploration.

3. Create the integration branch off the default branch. Do not check out the default branch to implement. Open a draft pull request with `gh` after the first merge in step 5 (a branch with no commits ahead of the default branch cannot open one).

4. Use **subagents** to implement each ticket, each in its own worktree on its own branch. Each subagent:
   - confirms its worktree is based on the integration branch before starting, and resets onto it if not;
   - calls the Skill tool with `tdd` to build the ticket;
   - runs `test-runner` and reports done only when the verdict is GREEN;
   - merges the integration branch tip into its own branch before reporting done

5. Once a subagent completes, merge its work to the integration branch with a merger subagent.

6. If this changes the **frontier** of available tickets, kick off more **subagents** to work on the new tickets. This allows for maximum concurrency.

7. Once all tickets are complete, call the Skill tool with `code-review` on the integration branch. Fix the findings in one subagent, then run `test-runner` again.

8. If a draft pull request exists, report the integration branch and ask the user to run `/pr` to write the body and mark it ready.

9. Clean up all **subagent** worktrees.
