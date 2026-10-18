# 04: React 19 renders the app

**What to build:** The app renders with React 19.3.1 and react-dom 19.3.1 through `createRoot`, using the automatic JSX runtime. A spike showed that Emotion 10, React Router 5 and react-helmet 5 still work on React 19, so this ticket changes only React. Component tests become possible with `@testing-library/react` 16.3.3 and `jsdom`.

**Blocked by:** None

**Status:** done (merged to `main` in #2)

- [x] `package.json` pins `react` and `react-dom` 19.3.1, `@testing-library/react` 16.3.3 and `jsdom` 30.1.3.
- [x] `src/index.js` uses `createRoot`.
- [x] JSX compiles with the automatic runtime. Imports kept only for the classic runtime are removed, and so is the `React` exception to `no-unused-vars` in `eslint.config.mjs`.
- [x] The React 16 act-warning workaround in `src/setupTests.js` is removed.
- [x] `useUniqueIds` gets its ids from React's `useId`, and the module-level counter is removed.
- [x] Labels, inputs and error messages are still linked by id, so the e2e form tests pass unchanged.
- [x] Every check in "Commands in force" exits 0.
