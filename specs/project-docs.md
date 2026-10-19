# Project docs

**Status:** done, 18 October 2026. The files in the table below are written, and `CLAUDE.md` points at `docs/README.md`. The four definition-of-done commands exited 0 on Node 24.22.0.

The upgrade's checks had already passed. This spec does not change the menu, the API, or the toolchain.

## Spec process

Keep the current gate. A product change starts from a file in `specs/`. The `to-spec` skill writes that file and stops when the change is not already specified. `specs/upgrade.md` remains the upgrade spec.

Do not install GitHub Spec Kit. Its constitution, specify, plan, tasks, and implement commands repeat that gate and would leave two specs for one change.

## Docs to add

Write these against the upgraded app. Point `CLAUDE.md` at `docs/README.md` with one line. Do not `@`-import the folder.

| File                                    | What it holds                                                                                                                                                                                                                                                           |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/README.md`                        | Read order: definition of done, architecture, architecture decisions, then `docs/commits.md`.                                                                                                                                                                           |
| `docs/DoD.md`                           | Checkboxes a command can prove: the test command, `npx playwright test`, `npm run build`, `npm run lint`, and `npm run typecheck` from “Commands in force”. A “Not in this DoD” section: server rendering, language style guides, and diagrams.                         |
| `docs/architecture-decision-records.md` | Decisions already made in `specs/upgrade.md`: Node 24.22.0, Vite, React 19, React Router with `ssr: false`, Vitest, `fetch` only inside `src/data/iceCreamData.js`, `@emotion/react` 11, JavaScript. Each record has context, decision, alternatives, and consequences. |
| `docs/architecture.md`                  | How the layers connect, and the component tree. Accepted amendment, 18 October 2026.                                                                                                                                                                                    |

A new decision is a new ADR. Do not silently rewrite an accepted one. `docs/README.md`, `docs/DoD.md`, `docs/architecture.md`, and `docs/architecture-decision-records.md` stay current after the upgrade.

The commit convention lives in `docs/commits.md`. `AGENTS.md` names the shape in one line. A commit hook denies a message that does not match, and the denial includes that file. The index links to it.

Do not add `docs/standards/` files that restate React, Express, or JavaScript documentation. Mermaid diagrams belong only in `docs/architecture.md`. Do not add them to the decision records or the definition of done.
