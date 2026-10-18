# Project docs

Status: proposed. Do not add `docs/` until this file is accepted.

This change starts after the upgrade's stop condition: the characterization tests and `npx playwright test` pass, `npm run build` exits 0, and `npm run lint` exits 0. It does not change the menu, the API, or the toolchain.

## Spec process

Keep the current gate. A product change starts from a file in `specs/`. The `to-spec` skill writes that file and stops when the change is not already specified. `specs/upgrade.md` remains the upgrade spec.

Do not install GitHub Spec Kit. Its constitution, specify, plan, tasks, and implement commands repeat that gate and would leave two specs for one change.

## Docs to add

Write these against the upgraded app. Point `CLAUDE.md` at `docs/README.md` with one line. Do not `@`-import the folder.

| File | What it holds |
| --- | --- |
| `docs/README.md` | Read order: definition of done, architecture decisions, then `.claude/rules/conventional-commits.md`. |
| `docs/DoD.md` | Checkboxes a command can prove: the test command, `npx playwright test`, `npm run build`, and `npm run lint` from the upgraded “Commands in force”. A “Not in this DoD” section: TypeScript conversion, server rendering, language style guides, and diagrams. |
| `docs/architecture-decision-records.md` | Decisions already made in `specs/upgrade.md`: Node 24.22.0, Vite, React 19, React Router with `ssr: false`, Vitest, `fetch` only inside `src/data/iceCreamData.js`, `@emotion/react` 11, JavaScript. Each record has context, decision, alternatives, and consequences. |

A new decision is a new ADR. Do not silently rewrite an accepted one. `docs/README.md`, `docs/DoD.md`, and `docs/architecture-decision-records.md` stay current after the upgrade.

`docs/commits.md` is not a second copy of the commit rule. The agent-facing rule stays `.claude/rules/conventional-commits.md`. The index links to it.

Do not add `docs/standards/` files that restate React, Express, or JavaScript documentation. Do not add Mermaid diagrams.
