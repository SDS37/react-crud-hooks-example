# AGENTS.md

Canonical project guidance for coding agents working in this repository. Claude Code loads it through `@AGENTS.md` in `CLAUDE.md`.

## Commands

Use **npm** (`yarn.lock` is stale; don't update it).

The app needs two processes running together:

- `npm run start-server`: Express API on port 5000 (`server/index.js`)
- `npm start`: CRA dev server on port 3000. `"proxy": "http://localhost:5000"` in package.json forwards the frontend's relative `/api/...` calls.

Other:

- Tests: `CI=true npm test` runs once (plain `npm test` is watch mode). For a single file: `CI=true npm test -- src/path/File.test.js`. Characterization tests live in `src/serverApi.test.js`, `src/utils/validators.test.js`, and `src/data/iceCreamData.test.js`. Use `@testing-library/react` with the old `jest-dom` package (`jest-dom/extend-expect`, already loaded in `src/setupTests.js`). `jest-emotion` is the snapshot serializer. The end-to-end suite in `specs/upgrade.md` is not in the repo yet.
- Formatting: Prettier 1.17 with **default options** (double quotes, 80 columns). The existing code still uses single quotes, so files get reformatted when touched. `npm run format` uses an unquoted glob that skips the top-level `src/*.js` files; to cover a specific file, run `npx prettier --write <file>`.
- Lint: only CRA's built-in `react-app` ESLint config. Warnings show in `npm start` / `npm run build` output, and there is no separate lint script. The upgrade adds `npm run lint`.
- The code on disk is the legacy stack: React 16.8, react-scripts 3.0.1, react-router v5, axios 0.18, Node 14. That is the starting point, not the destination. The destination and the behavior that must survive are in `specs/upgrade.md`. Do not add new legacy-only APIs. A file that has not been migrated yet must keep working until the upgrade changes it.

## Git workflow

Branch off `main` and open a PR with `gh`. Don't commit directly to `main`.

## Specs

Specs in `specs/` are the only source of product changes. `specs/upgrade.md` is the accepted spec for the stack upgrade. Any other change needs its own spec file, written and shown to the user, before `src/`, `server/`, or `package.json` is edited. A chat request is not a spec. If the work is not in the spec, amend the spec and stop.

A change is done when every check under "Commands in force" in `specs/upgrade.md` exits 0. A written summary is not a check. When that section changes, update the Commands section of this file in the same commit.

## Architecture

An ice cream shop menu CRUD demo built from function components and hooks.

**Backend**: `server/app.js` exports `createApp()` with **in-memory data**, so every new app starts from the seed menu. `server/index.js` listens on port 5000.

- `iceCreams` is the catalogue (`{id, name}`). Each `id` maps to `public/ice-cream-images/ice-cream-{id}.svg`.
- `menuData` holds the menu items (`{id, iceCream: {id, name}, inStock, quantity, price, description}`).
- `/api/menu/stock-ice-creams` returns catalogue flavours that aren't on the menu yet. It must stay declared before `/api/menu/:id`.
- On POST/PUT the server ignores the client's `iceCream.name` and looks it up by `iceCream.id`. It stores the other fields without validating them.

**Data layer**: every API call goes through `src/data/iceCreamData.js` (axios), and components never call axios directly. List results are sorted by name on the client.

**Routes (`src/App.js`)**:

- `/`: Menu
- `/ice-creams`: catalogue flavours you can add
- `/menu-items/add?iceCreamId=N`: AddIceCream
- `/menu-items/:menuItemId`: EditIceCream
- Anything else redirects to `/`.

**Forms**: `AddIceCream` and `EditIceCream` are thin containers. They fetch data and render the shared `src/ice-cream/IceCream.js` form with `onSubmit` (and `onDelete` for edit). After saving they navigate with `history.push/replace('/', { focus: true })`. They use an `isMounted` ref to avoid setting state after unmount; check `isMounted.current`, not the ref itself.

**Validation**: `useValidation` (in `src/hooks/`) takes a validator from `src/utils/validators.js` and returns `[error, ariaProps]`. Spread `ariaProps` onto the input. Errors show only after the first submit (`hasSubmitted`). On a failed submit, focus moves to the first `[aria-invalid="true"]` control. Use `useUniqueIds` for label/input/error ids. In the form, `inStock` and `quantity` are coupled (quantity 0 ⇔ out of stock).

**Accessibility**: keep these conventions intact.

- Skip link to `#main`.
- `structure/Main` renders the `<main>` landmark, sets the page title via react-helmet, and renders the heading.
- `LoaderMessage` announces loading through an `aria-live` region.
- Decorative images use `alt=""`.
- Navigation goes through `FocusLink`, which adds `state: { focus: true }`. Nothing uses that flag yet: `Main` creates a `heading` ref but never focuses it.

**Styling**: Emotion. Each component defines `css` blocks from `emotion/macro` at the top of its file. Global styles and `@font-face` rules live in `App.js` via `<Global>` from `@emotion/core`. `src/styles/ice-cream.scss` and `src/assets/css/style.css` are dead: they aren't imported and there's no sass compiler. Don't edit them to change styles.
