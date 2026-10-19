# TypeScript

Status: accepted, 19 October 2026.

Checked on npm on 18 October 2026. Do not pick different versions. Confirm any API in the `docs` skill before writing it.

## Problem Statement

The app is JavaScript, so a wrong prop, a misspelled field on a menu item, or a data-layer call with the wrong argument only shows up when a test or a user hits it. `structure/` and `ice-cream/` components declare their props with `prop-types`, but React 19 ignores `propTypes`, so those declarations no longer check anything. `docs/architecture-decision-records.md` ADR 8 and `.claude/rules/typescript.md` keep the app JavaScript until an accepted spec says otherwise.

## Solution

Convert the app, the server, the tests, and the config files to TypeScript in strict mode, with no change to what a shop staff member sees or does. A new `npm run typecheck` check joins "Commands in force", so a type error fails the same way a test does. The JSX-in-`.js` Vite plugin and `prop-types` go away because `.tsx` files and types replace them.

## User Stories

1. As a developer, I want a type error to fail a check before review, so that a wrong prop or a misspelled menu field never reaches the running app.
2. As a developer, I want route params and route module exports typed by React Router, so that a renamed route or param breaks the build instead of the page.

## Implementation Decisions

### Packages

| Package             | Version | Why                                                                                                                            |
| ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `typescript`        | 6.0.3   | The newest release `typescript-eslint` 8.71.2 supports (`>=4.8.4 <6.1.0`). TypeScript 7.0.2 is newer but cannot be linted yet. |
| `typescript-eslint` | 8.71.2  | Parses and lints `.ts` and `.tsx` in the existing ESLint 10 flat config.                                                       |
| `@types/react`      | 19.3.0  | Types for React 19.3.1.                                                                                                        |
| `@types/react-dom`  | 19.3.0  | Types for react-dom 19.3.1.                                                                                                    |
| `@types/node`       | 24.19.2 | Types for Node 24, matching `.nvmrc`. Do not use `@types/node` 26.                                                             |
| `@types/express`    | 5.0.6   | Types for Express 5.3.0.                                                                                                       |

Remove `prop-types`. Each `propTypes` block becomes a props type on the component.

### Compiler settings

- One `tsconfig.json` at the root with `strict: true` (which includes `strictNullChecks` and `noImplicitAny`), `noEmit: true`, `jsx: "react-jsx"`, and `jsxImportSource: "@emotion/react"` so the `css` prop type-checks.
- It includes the React Router generated types: `".react-router/types/**/*"` in `include` and `rootDirs: [".", "./.react-router/types"]`, per the React Router "route module type safety" docs.
- `npm run typecheck` runs `react-router typegen && tsc`. It is the seam for this change.

### File moves

- `src/` and `src/routes/`: files with JSX become `.tsx`, the rest become `.ts`. `src/routes.ts` keeps the route config and imports its types from `@react-router/dev/routes`. Route modules use the generated `Route` types where they read params.
- `src/data/iceCreamData.ts` exports the menu item and catalogue flavour types (`{id, name}` and `{id, iceCream, inStock, quantity, price, description}`). Components import those types from the data layer, which stays the only module that calls `fetch`.
- `server/app.ts` and `server/index.ts` run on Node 24 with type stripping, so `npm run start-server` stays one `node` command with no build step. Confirm in the Node 24 docs which syntax type stripping allows, and keep the server to that syntax.
- Tests become `.test.ts` or `.test.tsx`. `e2e/` specs become `.spec.ts`.
- `vite.config.mjs`, `playwright.config.mjs`, and `react-router.config.js` become `.ts`. `eslint.config.mjs` stays JavaScript, because a TypeScript ESLint config needs a loader the spec does not name.

### Removals

- Remove the `jsx-in-js-files` plugin from `vite.config`, because Vite and the React Router plugin compile JSX in `.tsx` files without it.
- After the last batch, no `.js` file remains under `src/`, `server/`, or `e2e/`.

### Order

1. **Toolchain.** Add the packages, `tsconfig.json` with `allowJs`, `npm run typecheck`, and the `typescript-eslint` config. Update "Commands in force" in `specs/upgrade.md`, the Commands section of `AGENTS.md`, and `docs/DoD.md` in the same commit. Add an ADR that supersedes ADR 8.
2. **Convert in batches that stay green.** The data layer, utils, and hooks first, then `structure/`, then `ice-cream/`, then the root layout and routes, then the server, then the tests and config files.
3. **Remove the old form.** Turn off `allowJs`, remove `prop-types` and the JSX plugin, and update the Architecture section of `AGENTS.md` and `.claude/rules/typescript.md`.

## Testing Decisions

- The seam is `npm run typecheck`. Each batch exits 0 on it and on every existing check.
- Behavior stays locked by the existing suites. The characterization tests (`src/serverApi.test`, `src/utils/validators.test`, `src/data/iceCreamData.test`, and `e2e/`) change only their file extension, imports, and type annotations. No assertion changes.
- New tests are not needed for a rename. A type that would have caught a real bug is enough evidence on its own.
- Commands: `npm run typecheck`, `npm test`, `npx prettier --check <file>`, `npm run lint`, `npm run build`, and `npx playwright test`.

## Out of Scope

- Any change to the menu, the catalogue, the forms, the API, or the accessibility behavior.
- Upgrading any package that `specs/upgrade.md` pins, or moving to TypeScript 7.
- A separate build or bundle step for the server.
- Typing third-party code beyond the `@types` packages above.

## Further Notes

- `.claude/rules/typescript.md` already sets the language rules once a spec exists: strict mode, `unknown` instead of `any`, no `@ts-ignore` without a one-line reason, and `PascalCase` types with no `I` prefix. This spec does not repeat them.
- `.react-router/` is already in `.gitignore` and the ESLint ignores. Generated types are never committed.
- Prettier 3 formats `.ts` and `.tsx` with its default options, but the format hook and Lefthook skip them today. Add `.ts` and `.tsx` to `FORMATTED_EXTENSIONS` in `.claude/hooks/format-on-edit.py` and to the glob in `lefthook.yml`, as a `chore(harness)` commit next to the toolchain commit.
- The work spans many files. Break it into tickets with `to-tickets` and build it with `implement-spec`.
