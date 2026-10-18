# 07: The app runs on React Router 8 in SPA mode

**What to build:** The app runs on React Router 8.4.0 framework mode with the Vite plugin and `ssr: false`. A user reaches the same four routes as before, and any other path ends on `/`. Navigation is still links.

**Blocked by:** 03: The data layer uses fetch; 05: Styles use @emotion/react 11; 06: Page titles use React 19 document metadata

**Status:** ready-for-agent

- [ ] `package.json` pins `react-router`, `@react-router/dev` and `@react-router/node` 8.4.0, and no longer lists `react-router-dom`.
- [ ] `react-router.config.js` sets `ssr: false` and `appDirectory: "src"`. Route config is `src/routes.js`. No TypeScript file is added.
- [ ] A root layout renders the document shell, the skip link to `#main`, the header, the footer and the global styles. `index.html` and `src/index.js` are removed.
- [ ] `/`, `/ice-creams`, `/menu-items/add?iceCreamId=N` and `/menu-items/:menuItemId` render the same containers, and a catch-all sends any other path to `/`.
- [ ] Containers and cards use router hooks for navigation and params, not `history`, `match` or `location` props. No `history.push` or `history.replace` remains.
- [ ] `FocusLink` is folded into the router link or kept as a thin wrapper over it.
- [ ] `npm start` and `npm run build` use the React Router CLI, and the build writes a pre-rendered SPA `index.html`.
- [ ] The e2e suite passes with its assertions unchanged. Only how `playwright.config.mjs` starts the app may change.
- [ ] Every check in "Commands in force" exits 0, and the Commands section of `AGENTS.md` matches any changed command.
