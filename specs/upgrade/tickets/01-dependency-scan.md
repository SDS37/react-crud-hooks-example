# 01: Dev server pre-bundles dependencies again

**What to build:** The Vite dev server scans the app's entry for dependencies and pre-bundles them on a fresh start, instead of logging "Failed to run dependency scan" and falling back to on-demand discovery. The toolchain commit dropped the scanner's JSX-in-`.js` setting from `vite.config.mjs`.

**Blocked by:** None

**Status:** ready-for-agent

- [ ] With `node_modules/.vite` removed, `npx vite --force` starts without "Failed to run dependency scan" in its output.
- [ ] The production build still exits 0 and the app still renders under `npm start`.
- [ ] Every check in "Commands in force" in `specs/upgrade.md` exits 0.
