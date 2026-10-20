# 01: Mark a menu item as the special through the API

**What to build:** The server stores `isSpecial` on each menu item. The seed menu has no special. `POST /api/menu` and `PUT /api/menu/:id` accept `isSpecial`. Saving `true` clears it on the previous special, and saving it on the current special changes nothing. A missing value means `false` on `POST` and the stored value on `PUT`. Deleting the special leaves the menu with none. The seam is `server/app.ts`, tested in `src/serverApi.test.ts`.

**Blocked by:** None

**Status:** done

- [x] A fresh menu has no item with `isSpecial: true`.
- [x] `POST` with `isSpecial: true` makes it the only special, and a second such `POST` moves it.
- [x] `PUT` with `isSpecial: true` on another item moves the special, and `PUT` with `false` on the special leaves none.
- [x] `PUT` without `isSpecial` on the special keeps it, and `POST` without it stores `false`.
- [x] Deleting the special leaves no special.
- [x] Every check in `docs/DoD.md` exits 0.
