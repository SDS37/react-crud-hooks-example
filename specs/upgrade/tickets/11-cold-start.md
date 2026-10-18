# 11: The first e2e run after a fresh install passes

**What to build:** After a fresh `npm install` with no Vite dependency cache, the first `npx playwright test` run passes. Today it fails: the dev server finds a dependency late and re-optimizes, and the page's request for `src/entry.client.js` fails with "Failed to fetch dynamically imported module". The skip-link test then fails. A fresh CI checkout hits this on every run.

**Blocked by:** 07: The app runs on React Router 8 in SPA mode

**Status:** done (merged to `main` in #2)

- [x] Reproduce the failure first: remove `node_modules/.vite` and run the e2e suite through the lock. Record the failing test and the Vite log line.
- [x] After the fix, three consecutive runs that each start from a removed `node_modules/.vite` exit 0, and the dev server log shows no re-optimization after the first page load.
- [x] The fix lives in the dev server or dependency-optimizer configuration, or in how `playwright.config.mjs` starts the app. It does not add retries and does not change e2e assertions.
- [x] Every check in "Commands in force" exits 0.
