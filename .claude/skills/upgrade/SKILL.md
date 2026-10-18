---
name: upgrade
description: Upgrade this app to the target in specs/upgrade.md. Use when moving off Create React App, React 16, or the other legacy versions named there.
---

# Upgrade

Read `specs/upgrade.md` and follow it. Do not choose other libraries or versions. If a step is not in that spec, add it to the spec and stop before editing the app.

## Order

1. Fetch the current docs for a library with the `docs` skill before writing that library's API.
2. Run the commands in "Commands in force". If the suite is red on `main`, stop and report that. Do not change a dependency in this step. The API, validator, and sort tests already exist.
3. Replace the toolchain in its own commit: Node 24.22.0, `.nvmrc`, the `engines` field, Vite, Vitest, Prettier 3, ESLint, and Playwright 1.64.1. Replace "Commands in force" and the Commands section of `AGENTS.md` in that same commit. Re-run the characterization tests. Fix runner setup and imports only.
4. Add the `e2e/` suite from the spec and make `npx playwright test` exit 0. Do this before changing the router or the page shell. Do not edit those assertions afterward.
5. Migrate the app onto the target. Keep the Preserve assertions. Remove the Replace list. Use `implement` when a package fits one context, and `implement-spec` when it does not.
6. Stop when every check in "Commands in force" exits 0 and `code-review` has been run on the diff.

Do not convert the project to TypeScript. Do not enable server rendering. Do not edit a characterization assertion so that a new implementation looks green.
