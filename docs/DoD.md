# Definition of done

A change is done when every box below is checked. Each box is a command, and the box counts only when that command exits 0. A written summary is not a check.

The commands come from "Commands in force" in [`specs/upgrade.md`](../specs/upgrade.md). Run them on Node 24.22.0 (`.nvmrc`). When that section changes, update this file in the same commit.

The format check (`npx prettier --check` on every changed file) also stays in force. The edit hook and Lefthook run it.

- [x] `npm test` runs the Vitest suite once and passes.
- [x] `npx playwright test` passes. Its config starts both dev servers, so nothing may already be running on ports 3000 or 5001.
- [x] `npm run build` writes the SPA to `build/client/index.html`.
- [x] `npm run lint` reports no errors.
- [x] `npm run typecheck` generates route types and typechecks the program.

## Not in this DoD

- Renaming source files to TypeScript. The app stays JavaScript until the later issues in [`specs/typescript.md`](../specs/typescript.md).
- Server rendering. The app is a client-rendered SPA (`ssr: false`).
- Language style guides. Prettier's default options and the ESLint config are the style.
- Diagrams.
