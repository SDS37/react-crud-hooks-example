# 02: Refuse an invalid special

**What to build:** `POST` and `PUT` on the menu return 400 for a bad special and change nothing. A present `isSpecial` that is not a boolean returns `{ error: "isSpecial must be a boolean" }`. A save that would leave an out of stock menu item as the special returns `{ error: "An out of stock menu item cannot be the special" }`. For a `PUT` the check runs on the item as it would be after the save. The seam is `server/app.ts`, tested in `src/serverApi.test.ts`.

**Blocked by:** 01: Mark a menu item as the special through the API

**Status:** ready-for-agent

- [x] A non-boolean `isSpecial` on `POST` and on `PUT` returns 400 and leaves the menu unchanged.
- [x] `isSpecial: true` with `inStock: false` returns 400 on `POST` and on `PUT`.
- [x] A `PUT` with `inStock: false` and no `isSpecial` on the current special returns 400.
- [x] After each 400 the previous special is still the special.
- [x] No field other than `isSpecial` is newly validated.
- [x] Every check in `docs/DoD.md` exits 0.
