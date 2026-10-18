# 08: The heading receives focus after a save that returns home

**What to build:** After a save or delete that returns to `/`, keyboard and screen reader focus lands on the menu page's main heading instead of being lost on the page. The unused `focus` flag from the legacy links is not kept for its own sake.

**Blocked by:** 07: The app runs on React Router 8 in SPA mode

**Status:** ready-for-agent

- [ ] Saving the edit form, saving the add form and deleting a menu item each end on `/` with the main heading focused.
- [ ] In `e2e/form.spec.js`, only the `fixme` marker on the heading-focus test is removed. Its assertion does not change, and the test passes.
- [ ] A plain link to `/` does not steal focus on its own unless the implementation intends that, and the e2e navigation tests still pass.
- [ ] No unused `focus` state remains in `FocusLink` or the containers.
- [ ] Every check in "Commands in force" exits 0.
