# 05: Styles use @emotion/react 11

**What to build:** Every component's styles come from `@emotion/react` 11.14.0 through the `css` prop, and global styles and `@font-face` rules come from its `Global`. `emotion` and `@emotion/core` are removed. The dead `src/styles/ice-cream.scss` and `src/assets/css/style.css` are deleted. The pages look the same as before.

**Blocked by:** 04: React 19 renders the app

**Status:** done (merged to `main` in #2)

- [x] `package.json` pins `@emotion/react` 11.14.0 and no longer lists `emotion` or `@emotion/core`.
- [x] Each component still defines its `css` blocks at the top of its own file.
- [x] No module imports `emotion`, `emotion/macro` or `@emotion/core`.
- [x] `src/styles/ice-cream.scss` and `src/assets/css/style.css` are deleted, and their entries in `.prettierignore` are removed.
- [x] Screenshots of `/`, `/ice-creams`, the add form and the edit form match the screenshots taken before the change. The screenshots are not committed.
- [x] Every check in "Commands in force" exits 0.
