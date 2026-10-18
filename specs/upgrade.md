# Upgrade

Delta spec for moving this ice cream menu app off its legacy toolchain. The product stays the same. The stack moves to the latest stable releases below. Do not pick different versions. Confirm any API in the `docs` skill before writing it.

Checked on 17 October 2026.

## Target

| Concern        | Legacy, in the repo today                          | Target                                                                                                                  |
| -------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Node           | 14                                                 | 24.22.0 (Active LTS). Node 26 is still Current. Do not use it.                                                          |
| UI             | React 16.8, react-scripts 3.0.1                    | React 19.3.1 and react-dom 19.3.1                                                                                       |
| Build          | Create React App                                   | Vite 8.3.4                                                                                                              |
| Routing        | react-router-dom 5                                 | react-router 8.4.0 and @react-router/dev 8.4.0, Vite plugin, `ssr: false`                                               |
| Tests          | Jest via react-scripts, `jest-dom` 3               | Vitest 5.0.5, `@testing-library/react` 16.3.3, `@testing-library/jest-dom`                                              |
| End to end     | None                                               | Playwright 1.64.1. Checked on 18 October 2026.                                                                          |
| Format         | Prettier 1.17                                      | Prettier 3.9.10, default options                                                                                        |
| Lint           | ESLint buried in react-scripts                     | ESLint 10.13.0 with a flat config and `npm run lint`                                                                    |
| HTTP client    | axios 0.18, only inside `src/data/iceCreamData.js` | `fetch` inside that same module                                                                                         |
| Server         | Express 4 and the `body-parser` package            | Express 5.3.0 and `express.json()`                                                                                      |
| Styles         | `emotion` 10 and `@emotion/core`                   | `@emotion/react` 11.14.0                                                                                                |
| Document title | `react-helmet` 5                                   | React 19 document metadata when the docs confirm it works for this client-rendered app. Otherwise `react-helmet-async`. |
| Language       | JavaScript                                         | JavaScript. Do not convert the app to TypeScript in this upgrade.                                                       |

Add `"engines": { "node": ">=24.22.0" }` and `.nvmrc` containing `24.22.0` in the toolchain commit.

### Supporting packages

Status: accepted amendment, 18 October 2026. The target table does not name these, but the targets need them. Checked on npm on 18 October 2026. Do not pick different versions.

| Package                     | Version | Why the target needs it                                                                                                                                                                 |
| --------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@react-router/node`        | 8.4.0   | SPA mode still pre-renders the root route at build time, so the React Router docs (`how-to/spa`) require this package even with `ssr: false`.                                           |
| `@testing-library/dom`      | 10.4.2  | Required peer of `@testing-library/react` 16.3.3.                                                                                                                                       |
| `@testing-library/jest-dom` | 7.0.1   | The target row names this package without a version. 7.0.1 is the latest.                                                                                                               |
| `jsdom`                     | 30.1.3  | Vitest DOM environment for any test that renders a component. The three characterization files stay in the `node` environment.                                                          |
| `@eslint/js`                | 10.0.1  | Recommended core rules for the ESLint 10 flat config.                                                                                                                                   |
| `globals`                   | 17.13.0 | Browser and Node globals for the flat config.                                                                                                                                           |
| `eslint-plugin-react-hooks` | 7.1.1   | Keeps the Rules of Hooks check that CRA's `react-app` config runs today. Supports ESLint 10.                                                                                            |
| `isbot`                     | 5.2.2   | React Router's default server entry imports it for the SPA pre-render. `react-router build` adds it to `package.json` itself and fails without it. Accepted amendment, 18 October 2026. |

React Router config and route files stay JavaScript: `react-router.config.js` and `src/routes.js`, with `appDirectory: "src"`.

### Tracked `node_modules`

`node_modules/` has been committed since the first commit (31,428 files), even though `.gitignore` lists it. The toolchain commit runs `git rm -r --cached node_modules` so the reinstall does not land in history. It changes no file on disk.

### Formatting on `main`

`server/app.js` and the three characterization test files use single quotes and trailing commas, so `npx prettier --check` fails on them with both Prettier 1.17 and 3.9.10 defaults. The toolchain commit reformats them with Prettier 3.9.10. That is a style change only. No assertion changes.

### API port

Accepted amendment, 18 October 2026. macOS's AirPlay Receiver listens on port 5000, so the Express server cannot bind there and the proxy receives AirPlay's 403. The toolchain commit moves `server/index.js` and the Vite `/api` proxy to port 5001.

### Module type

Accepted amendment, 18 October 2026. React Router 8's SPA build pre-renders the root route in Node, and that pre-render fails with a 500 while `package.json` is CommonJS. The React Router migration sets `"type": "module"` and converts `server/app.js` and `server/index.js` to ES modules. The server tests change `require` to `import`. That is an import change only. No assertion changes.

### Load and save failures

Accepted amendment, 18 October 2026. Removing `isMounted` made request failures visible, so the app now handles them:

- When loading fails for a reason other than a not-found or a cancelled request, the page shows a `role="alert"` message from `src/structure/LoadError.js` and does not show the empty-list text.
- When a save or delete fails, the form stays on screen and shows a `role="alert"` message. It does not navigate.
- The server logs the stack of an error that answers 500 or above. It never logs the request body, and the client still receives no stack trace.

### Unused lockfile and font files

Accepted amendment, 18 October 2026. The app uses npm, so `yarn.lock` is removed. `package-lock.json` stays. Font files that no stylesheet imports are removed: Geomanist Book `.eot`, `.svg`, and `.ttf`; every Geomanist Medium and Geomanist Regular file; and `kathen.otf`. Geomanist Book and Cornerstone `.woff` and `.woff2` stay. `README.md` stays until its own spec.

## Preserve

These are the characterization assertions. Lock them in tests before changing dependencies. During the rewrite, change the test runner and imports only. Do not change what they assert.

- `GET /api/menu/stock-ice-creams` returns catalogue flavours that are not already on the menu. That route stays registered before `/api/menu/:id`.
- `POST /api/menu` and `PUT /api/menu/:id` ignore the client's `iceCream.name` and store the catalogue name for `iceCream.id`.
- Menu list results are sorted by name on the client.
- Routes: `/` menu, `/ice-creams` catalogue, `/menu-items/add?iceCreamId=N` add form, `/menu-items/:menuItemId` edit form. Any other path ends on `/`.
- In the form, quantity 0 and out of stock stay coupled.
- Validation errors appear after the first submit. Focus moves to the first `[aria-invalid="true"]` control.
- Skip link targets `#main`. `main` is the landmark and holds the heading. Loading is announced with `aria-live`. Decorative images use `alt=""`.
- Components do not call `fetch` or axios. Only `src/data/iceCreamData.js` does.
- Restarting the server resets the in-memory menu.

## Replace

These are legacy mechanisms, not behavior. Remove them as the matching target lands.

- `history.push` and `history.replace` from React Router 5.
- The `isMounted` ref. Use the cleanup or abort pattern the current React docs describe.
- `emotion/macro`, `@emotion/core`, and the dead `src/styles/ice-cream.scss` and `src/assets/css/style.css` files.
- Create React App, `react-scripts`, the `proxy` field, and the `jest-dom` 3 import.
- axios 0.18 and the separate `body-parser` dependency.
- `FocusLink` may stay or be folded into the router link, but navigation must still be a link and the heading must receive focus after a save that redirects home. The `focus` flag is currently unused. Implement that focus as part of keeping the accessibility behavior, rather than preserving the unused flag.
- `uniqid`. It reads `process.pid` and `require('os')` when it loads, which only CRA's webpack polyfills supplied. Under Vite the page renders nothing. In the toolchain commit, `useUniqueIds` takes its ids from a module-level counter and `uniqid` is removed. When React 19.3.1 lands, `useUniqueIds` uses React's `useId`. Accepted amendment, 18 October 2026.

## Characterization tests

These files lock the behavior above. Later commits may change how they run, not what they assert.

- `src/serverApi.test.js`: stock route, catalogue name on create and update, seed menu after a restart. The app under test is `server/app.js`.
- `src/utils/validators.test.js`: description, price, and the quantity and stock coupling.
- `src/data/iceCreamData.test.js`: client-side name sorting.
- End-to-end tests under `e2e/`. These drive the running app in a browser and lock the routes, the first-submit validation, the move to the first `[aria-invalid="true"]` control, the heading focus after a save that returns home, the skip link, the `main` landmark, the loading live region, and decorative `alt=""`. They are not in the repo yet. Add them after the toolchain commit, when Node 24 can run Playwright, and before changing the router or the page shell. Later commits may change how they start the app, not what they assert.
  - The legacy app never focuses the heading, so the heading-focus test lands with its final assertion marked `test.fixme`. The commit that implements that focus during the router or page shell migration removes only the `fixme` marker. Accepted amendment, 18 October 2026.

## Commands in force

`test-runner` runs the checks. The dev servers are how the end-to-end suite reaches the app. Update this section in the same commit that changes the runner.

Run every check on Node 24.22.0 (`.nvmrc`).

- One file: `npm test -- src/path/File.test.js`
- Full suite: `npm test` (Vitest, one run)
- Format check: `npx prettier --check <file>` for every changed file
- Lint: `npm run lint`
- Build: `npm run build`
- End to end: `npx playwright test`. Its config starts both dev servers, so none may already be running on ports 3000 or 5001.

Dev servers: `npm run start-server` (Express on port 5001) and `npm start` (Vite on port 3000, with `/api` proxied to port 5001).

`npx prettier --write <file>` is the formatter. The edit hook runs it. `npm run format` formats the whole repo.

The toolchain commit lands before the `e2e/` suite, so on that commit alone `npx playwright test` stops with "No tests found". Every later commit runs it. The upgrade is not done until every check exits 0. Do not report the suite green when a check was not run.
