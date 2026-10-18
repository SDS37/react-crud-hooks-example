# AGENTS.md

Canonical project guidance for coding agents working in this repository. Claude Code loads it through `@AGENTS.md` in `CLAUDE.md`.

## Commands

Use **npm** (`yarn.lock` is stale; don't update it) on Node 24.22.0 (`.nvmrc`; `nvm use`).

The app needs two processes running together:

- `npm run start-server`: Express API on port 5001 (`server/index.js`). Port 5000 is taken by macOS's AirPlay Receiver.
- `npm start`: React Router dev server (a Vite server) on port 3000. `server.proxy` in `vite.config.mjs` forwards the frontend's relative `/api/...` calls to port 5001.

Checks (the same list as "Commands in force" in `specs/upgrade.md`):

- Full suite: `npm test` runs Vitest once. `npm run test:watch` is watch mode.
- One file: `npm test -- src/path/File.test.js`.
- Format check: `npx prettier --check <file>`. Prettier 3.9.10 with **default options** (double quotes, trailing commas, 80 columns). Legacy files still use single quotes, so they get reformatted when touched. `npx prettier --write <file>` formats one file; `npm run format` formats the repo.
- Lint: `npm run lint` (ESLint 10 flat config in `eslint.config.mjs`).
- Build: `npm run build` (React Router, SPA mode: `build/client/index.html` plus assets; `build/server` is a by-product).
- End to end: `npx playwright test`. `playwright.config.mjs` starts both dev servers itself, so stop any you have running first. Run `npx playwright install chromium` once.

Characterization tests live in `src/serverApi.test.js`, `src/utils/validators.test.js`, `src/data/iceCreamData.test.js`, and `e2e/`. Vitest runs with `globals: true` in the `node` environment; `src/setupTests.js` loads `@testing-library/jest-dom/vitest`.

- The rest of the code is still the legacy stack: React 16.8, axios 0.18, Express 4, Emotion 10. Vite compiles JSX in `src/**/*.js` through a small plugin in `vite.config.mjs`. That is the starting point, not the destination. The destination and the behavior that must survive are in `specs/upgrade.md`. Do not add new legacy-only APIs. A file that has not been migrated yet must keep working until the upgrade changes it.

## Git workflow

Branch off `main` and open a PR with `gh`. Don't commit directly to `main`.

## Specs

Specs in `specs/` are the only source of product changes. `specs/upgrade.md` is the accepted spec for the stack upgrade. Any other change needs its own spec file, written and shown to the user, before `src/`, `server/`, or `package.json` is edited. A chat request is not a spec. If the work is not in the spec, amend the spec and stop.

A change is done when every check under "Commands in force" in `specs/upgrade.md` exits 0. A written summary is not a check. When that section changes, update the Commands section of this file in the same commit.

## Architecture

An ice cream shop menu CRUD demo built from function components and hooks.

**Backend**: `server/app.js` exports `createApp()` with **in-memory data**, so every new app starts from the seed menu. `server/index.js` listens on port 5001.

- `iceCreams` is the catalogue (`{id, name}`). Each `id` maps to `public/ice-cream-images/ice-cream-{id}.svg`.
- `menuData` holds the menu items (`{id, iceCream: {id, name}, inStock, quantity, price, description}`).
- `/api/menu/stock-ice-creams` returns catalogue flavours that aren't on the menu yet. It must stay declared before `/api/menu/:id`.
- On POST/PUT the server ignores the client's `iceCream.name` and looks it up by `iceCream.id`. It stores the other fields without validating them.

**Data layer**: every API call goes through `src/data/iceCreamData.js` (axios), and components never call axios directly. List results are sorted by name on the client.

**Routes (`src/routes.js`, shell in `src/root.js`)**: `ssr: false` in `react-router.config.js`; `package.json` is `"type": "module"` because the build pre-render needs it. `src/entry.client.js` omits StrictMode until the containers' effects are fixed (ticket 09). The catch-all route's `clientLoader` redirects to `/`.

- `/`: Menu
- `/ice-creams`: catalogue flavours you can add
- `/menu-items/add?iceCreamId=N`: AddIceCream
- `/menu-items/:menuItemId`: EditIceCream
- Anything else redirects to `/`.

**Forms**: `AddIceCream` and `EditIceCream` are thin containers. They fetch data and render the shared `src/ice-cream/IceCream.js` form with `onSubmit` (and `onDelete` for edit). After saving they navigate with `useNavigate()` (`navigate('/', { state: { focus: true } })`, with `replace: true` where it replaced). They use an `isMounted` ref to avoid setting state after unmount; check `isMounted.current`, not the ref itself.

**Validation**: `useValidation` (in `src/hooks/`) takes a validator from `src/utils/validators.js` and returns `[error, ariaProps]`. Spread `ariaProps` onto the input. Errors show only after the first submit (`hasSubmitted`). On a failed submit, focus moves to the first `[aria-invalid="true"]` control. Use `useUniqueIds` for label/input/error ids. In the form, `inStock` and `quantity` are coupled (quantity 0 ⇔ out of stock).

**Accessibility**: keep these conventions intact.

- Skip link to `#main`.
- `structure/Main` renders the `<main>` landmark, sets the page title via react-helmet, and renders the heading.
- `LoaderMessage` announces loading through an `aria-live` region.
- Decorative images use `alt=""`.
- After a save or delete the containers navigate home with `state: { focus: true }`, and `Main` focuses its heading when it mounts with that state. Plain links through `FocusLink` do not move focus.

**Styling**: Emotion 11 (`@emotion/react`). Each component defines `css` blocks at the top of its file and applies them with the `css` prop (the Vite JSX plugin sets `importSource: "@emotion/react"`). Global styles and `@font-face` rules live in `root.js` via `<Global>`.
