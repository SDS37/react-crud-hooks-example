# 06: Page titles use React 19 document metadata

**What to build:** Each page's title reads "<heading> | My Ice Cream" and is set by React 19 document metadata instead of react-helmet. Before writing it, use the `docs` skill to confirm that a rendered `<title>` updates `document.title` in a client-rendered app. If the docs do not confirm that, use `react-helmet-async` instead, as `specs/upgrade.md` allows.

**Blocked by:** 04: React 19 renders the app; 05: Styles use @emotion/react 11

**Status:** ready-for-agent

- [ ] A new e2e test, written first, checks the title on `/`, `/ice-creams`, the add form and the edit form.
- [ ] `src/structure/Main.js` sets the title without react-helmet, and `react-helmet` is no longer in `package.json`.
- [ ] Navigating between routes updates the title.
- [ ] Every check in "Commands in force" exits 0.
