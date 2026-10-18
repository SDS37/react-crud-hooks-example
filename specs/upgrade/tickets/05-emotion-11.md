# 05: Styles use @emotion/react 11

**What to build:** Every component's styles come from `@emotion/react` 11.14.0 through the `css` prop, and global styles and `@font-face` rules come from its `Global`. `emotion` and `@emotion/core` are removed. The dead `src/styles/ice-cream.scss` and `src/assets/css/style.css` are deleted. The pages look the same as before.

**Blocked by:** 04: React 19 renders the app

**Status:** ready-for-agent

- [ ] `package.json` pins `@emotion/react` 11.14.0 and no longer lists `emotion` or `@emotion/core`.
- [ ] Each component still defines its `css` blocks at the top of its own file.
- [ ] No module imports `emotion`, `emotion/macro` or `@emotion/core`.
- [ ] `src/styles/ice-cream.scss` and `src/assets/css/style.css` are deleted, and their entries in `.prettierignore` are removed.
- [ ] Screenshots of `/`, `/ice-creams`, the add form and the edit form match the screenshots taken before the change. The screenshots are not committed.
- [ ] Every check in "Commands in force" exits 0.
