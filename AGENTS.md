# AGENTS.md

Canonical project guidance for coding agents working in this repository. Claude Code loads it through `@AGENTS.md` in `CLAUDE.md`.

## Commands

Use **npm** on Node 24.22.0 (`.nvmrc`; `nvm use`). `package-lock.json` is the lockfile.

The app needs two processes running together:

- `npm run start-server`: Express API on port 5001 (`server/index.ts`). Port 5000 is taken by macOS's AirPlay Receiver.
- `npm start`: React Router dev server (a Vite server) on port 3000. `server.proxy` in `vite.config.ts` forwards the frontend's relative `/api/...` calls to port 5001.

Checks (the same list as "Commands in force" in `specs/upgrade.md`):

- Full suite: `npm test` runs Vitest once. `npm run test:watch` is watch mode.
- One file: `npm test -- src/path/File.test.ts`.
- Format check: `npx prettier --check <file>`. Prettier 3.9.10 with **default options** (double quotes, trailing commas, 80 columns). `npx prettier --write <file>` formats one file; `npm run format` formats the repo.
- Lint: `npm run lint` (ESLint 10 flat config in `eslint.config.mjs`).
- Build: `npm run build` (React Router, SPA mode: `build/client/index.html` plus assets; `build/server` is a by-product).
- End to end: `npx playwright test`. `playwright.config.ts` starts both dev servers itself, so stop any you have running first. Run `npx playwright install chromium` once.
- Typecheck: `npm run typecheck` (`react-router typegen && tsc`).

Characterization tests live in `src/serverApi.test.ts`, `src/utils/validators.test.ts`, `src/data/iceCreamData.test.ts`, and `e2e/`. Vitest runs with `globals: true` in the `node` environment; `src/setupTests.ts` loads `@testing-library/jest-dom/vitest`.

- The stack is React 19.3.1, React Router 8.4.0 (framework mode, SPA), Vite 8, Emotion 11, Express 5 and `fetch`. The behavior that must survive the upgrade is recorded in `specs/upgrade.md`. The app is TypeScript in strict mode. `allowJs` is off. JSX lives in `.tsx` files. `eslint.config.mjs` stays JavaScript.

## Git workflow

Branch off `main` and open a PR with `gh`. Don't commit directly to `main`.

## Specs

Specs in `specs/` are the only source of product changes. `specs/upgrade.md` is the accepted spec for the stack upgrade. Any other change needs its own spec file, written and shown to the user, before `src/`, `server/`, or `package.json` is edited. A chat request is not a spec. If the work is not in the spec, amend the spec and stop.

A change is done when every check under "Commands in force" in `specs/upgrade.md` exits 0. A written summary is not a check. When that section changes, update the Commands section of this file in the same commit.

## Architecture

An ice cream shop menu CRUD demo built from function components and hooks.

**Backend**: `server/app.ts` exports `createApp()` with **in-memory data**, so every new app starts from the seed menu. `server/index.ts` listens on port 5001. Node 24 runs it by stripping types, so there is no server build step.

- `iceCreams` is the catalogue (`{id, name}`). Each `id` maps to `public/ice-cream-images/ice-cream-{id}.svg`.
- `menuData` holds the menu items (`{id, iceCream: {id, name}, inStock, quantity, price, description}`).
- `/api/menu/stock-ice-creams` returns catalogue flavours that aren't on the menu yet. It must stay declared before `/api/menu/:id`.
- On POST/PUT the server ignores the client's `iceCream.name` and looks it up by `iceCream.id`. It stores the other fields without validating them.

**Data layer**: every API call goes through `src/data/iceCreamData.ts` (`fetch`), and components never call `fetch` directly. Each function takes an optional `{ signal }` for an `AbortController`, and a non-2xx response throws an error with `status`. List results are sorted by name on the client. Components use the `CatalogueFlavour` and `MenuItem` types exported from that module.

**Routes**: `src/routes.ts` is the route config (paths and file extensions are relative to `appDirectory: "src"` in `react-router.config.ts`). `ssr: false` makes it SPA mode: the build pre-renders only `build/client/index.html` from the root layout. `package.json` is `"type": "module"` because the pre-render loads `build/server/index.js`. The default client entry runs the app under StrictMode. `src/root.tsx` is the root layout: the document shell (`<html>`, icons, manifest, default `<title>`), the Emotion `<Global>` styles and fonts, the skip link, `Header` and `Footer`, and an `<Outlet>`. Its `Layout` and `HydrateFallback` also run in Node at build time, so keep browser-only code out of them. The catch-all route's `clientLoader` in `src/routes/catch-all.ts` redirects to `/`. The edit page reads `menuItemId` from the generated route params type.

- `/`: Menu
- `/ice-creams`: catalogue flavours you can add
- `/menu-items/add?iceCreamId=N`: AddIceCream
- `/menu-items/:menuItemId`: EditIceCream
- Anything else redirects to `/`.

**Forms**: `AddIceCream` and `EditIceCream` are thin containers. They fetch data and render the shared `src/ice-cream/IceCream.tsx` form with `onSubmit` (and `onDelete` for edit). After saving they navigate with `useNavigate()` (`navigate("/", { state: { focus: true } })`, with `replace: true` where it replaced). Their load effects create an `AbortController`, pass its `signal` to the data layer and abort in the cleanup; a rejection after abort is ignored (`controller.signal.aborted`).

**Validation**: `useValidation` (in `src/hooks/`) takes a validator from `src/utils/validators.ts` and returns `[error, ariaProps]`. Spread `ariaProps` onto the input. Errors show only after the first submit (`hasSubmitted`). On a failed submit, focus moves to the first `[aria-invalid="true"]` control. Use `useUniqueIds` (built on `useId`) for label/input/error ids. In the form, `inStock` and `quantity` are coupled (quantity 0 ⇔ out of stock).

**Accessibility**: keep these conventions intact.

- Skip link to `#main`.
- `structure/Main` renders the `<main>` landmark, sets the page title with a React 19 `<title>` element, and renders the heading.
- `LoaderMessage` announces loading through an `aria-live` region.
- Decorative images use `alt=""`.
- After a save or delete the containers navigate home with `state: { focus: true }`, and `Main` focuses its heading when it mounts with that state. Plain links through `FocusLink` do not move focus.

**Styling**: Emotion 11 (`@emotion/react`). Each component defines `css` blocks at the top of its file and applies them with the `css` prop. `jsxImportSource` in `tsconfig.json` is `@emotion/react`. Global styles and `@font-face` rules live in `root.tsx` via `<Global>`.
