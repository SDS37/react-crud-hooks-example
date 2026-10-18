# Architecture decision records

These records hold decisions already made in [`specs/upgrade.md`](../specs/upgrade.md). A new decision is a new record at the end of this file. Do not rewrite an accepted record. If a decision changes, add a record that supersedes it and mark the old one superseded.

## ADR 1: Node 24.22.0

- **Status:** accepted, 18 October 2026.
- **Context:** The app ran on Node 14. The upgrade moves the stack to the latest stable releases, which need a current Node line.
- **Decision:** Use Node 24.22.0, the Active LTS release. `.nvmrc` pins it, and `package.json` declares `"engines": { "node": ">=24.22.0" }`.
- **Alternatives:** Node 26 was not chosen because it is still the Current release, not LTS.
- **Consequences:** Every check runs on Node 24.22.0. Contributors switch with `nvm use`.

## ADR 2: Vite as the build tool

- **Status:** accepted, 18 October 2026.
- **Context:** Create React App (`react-scripts` 3.0.1) bundled the build, the dev server, the test runner, and the lint config, and held the rest of the stack on old versions.
- **Decision:** Build and serve the app with Vite 8.3.4. The dev server runs on port 3000 and proxies `/api` to the Express server on port 5001.
- **Alternatives:** Keeping Create React App was not chosen because it pinned the legacy stack. The `proxy` field in `package.json` was a Create React App mechanism and is gone.
- **Consequences:** Vite only compiles JSX in `.jsx` files, so the `jsx-in-js-files` plugin in `vite.config.mjs` compiles JSX in `src/**/*.js`. Lint is a separate step, `npm run lint`.

## ADR 3: React 19

- **Status:** accepted, 18 October 2026.
- **Context:** The app used React 16.8, which predates the automatic JSX runtime, `useId`, and document metadata.
- **Decision:** Use React 19.3.1 and react-dom 19.3.1 with the automatic JSX runtime. `useUniqueIds` is built on `useId`. `structure/Main` sets the page title with a React 19 `<title>` element.
- **Alternatives:** `react-helmet-async` for the page title was not needed, because the React docs confirm that a rendered `<title>` works in a client-rendered app. `react-helmet` 5 and `uniqid` were removed.
- **Consequences:** The app runs under StrictMode, so effects must survive a mount, cleanup, and remount cycle. Data-loading effects abort their requests in cleanup instead of tracking an `isMounted` ref.

## ADR 4: React Router with `ssr: false`

- **Status:** accepted, 18 October 2026.
- **Context:** Routing used react-router-dom 5, with `history.push` and `history.replace` passed to components as props.
- **Decision:** Use React Router 8.4.0 in framework mode with its Vite plugin and `ssr: false`. Routes are configured in `src/routes.js`, the root layout is `src/root.js`, and a catch-all route redirects any other path to `/`.
- **Alternatives:** Server rendering was not chosen. The app stays a client-rendered SPA.
- **Consequences:** The build still pre-renders the root layout into `build/client/index.html`, so `Layout` and `HydrateFallback` must not use browser-only APIs. That pre-render needs `@react-router/node` and `isbot`, and `package.json` is `"type": "module"`. Containers navigate with router hooks.

## ADR 5: Vitest for unit tests

- **Status:** accepted, 18 October 2026.
- **Context:** Tests ran on Jest inside `react-scripts`, with the old `jest-dom` 3 package.
- **Decision:** Run unit tests with Vitest 5.0.5, `@testing-library/react` 16.3.3, and `@testing-library/jest-dom`. `npm test` runs the suite once. End-to-end tests run on Playwright 1.64.1.
- **Alternatives:** Keeping Jest was not chosen because it came bundled with `react-scripts`, which the upgrade removed.
- **Consequences:** Vitest shares the Vite config and runs with `globals: true` in the `node` environment. A component test opts into `jsdom`. The characterization tests changed only their runner, imports, and formatting. No assertion changed.

## ADR 6: `fetch` only inside the data layer

- **Status:** accepted, 18 October 2026.
- **Context:** Every API call went through axios 0.18 in `src/data/iceCreamData.js`.
- **Decision:** Use the platform `fetch` in that same module. Components never call `fetch`. Each function accepts an optional `{ signal }`, and a non-2xx response rejects with an error that carries `status`.
- **Alternatives:** Keeping axios was not chosen. `fetch` is built into the browser and Node 24.
- **Consequences:** One module owns the HTTP boundary, so cancellation and error status work the same way for every call. Lists are still sorted by name on the client.

## ADR 7: `@emotion/react` 11 for styles

- **Status:** accepted, 18 October 2026.
- **Context:** Styles used `emotion` 10 and `@emotion/core`, with `css` from the `emotion/macro` Babel macro. Vite runs no Babel macros.
- **Decision:** Use `@emotion/react` 11.14.0. Each component defines `css` blocks at the top of its file and applies them with the `css` prop. Global styles and `@font-face` rules use `<Global>` in `src/root.js`.
- **Alternatives:** Keeping Emotion 10 was not chosen because the macro needs Babel. The unused `src/styles/ice-cream.scss` and `src/assets/css/style.css` were deleted instead of revived.
- **Consequences:** The JSX plugin sets `importSource: "@emotion/react"` so the `css` prop compiles. Ticket 05 required screenshots of `/`, `/ice-creams`, the add form, and the edit form to match before and after the change.

## ADR 8: JavaScript

- **Status:** accepted, 18 October 2026.
- **Context:** The app is JavaScript. A stack upgrade is a large change on its own.
- **Decision:** Keep the app JavaScript. Config and route files are JavaScript too (`react-router.config.js`, `src/routes.js`).
- **Alternatives:** Converting to TypeScript during the upgrade was not chosen. It needs its own accepted spec.
- **Consequences:** No TypeScript dependency, `tsconfig`, or `.ts` file is added without that spec. See `.claude/rules/typescript.md`.
