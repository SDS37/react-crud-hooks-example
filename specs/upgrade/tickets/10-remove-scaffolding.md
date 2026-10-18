# 10: Remove the temporary upgrade scaffolding

**What to build:** The workarounds that only bridged the legacy stack are gone, and the agent guide describes the upgraded app.

**Blocked by:** 01: Dev server pre-bundles dependencies again; 02: Express 5 serves the menu API; 03: The data layer uses fetch; 04: React 19 renders the app; 05: Styles use @emotion/react 11; 06: Page titles use React 19 document metadata; 07: The app runs on React Router 8 in SPA mode; 08: The heading receives focus after a save that returns home; 09: Effects clean up without isMounted; 11: The first e2e run after a fresh install passes

**Status:** ready-for-agent

- [ ] The JSX-in-`.js` plugin in `vite.config.mjs` is removed if the React Router plugin compiles the app without it. If it is still needed, a comment says why.
- [ ] No dependency from the Replace list in `specs/upgrade.md` remains in `package.json`.
- [ ] The Architecture section of `AGENTS.md` describes the route config, the root layout, the Emotion `css` prop, `fetch`, the abort cleanup and port 5001. The Commands section matches "Commands in force".
- [ ] `npm audit` was run and its result is reported. A finding that remains names the package it comes from.
- [ ] Every check in "Commands in force" exits 0.
