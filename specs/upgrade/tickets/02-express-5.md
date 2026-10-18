# 02: Express 5 serves the menu API

**What to build:** The menu API runs on Express 5.3.0 and parses JSON bodies with `express.json()`. The separate `body-parser` dependency is gone. Clients see the same API.

**Blocked by:** None

**Status:** done (merged to `main` in #2)

- [x] `package.json` pins `express` 5.3.0 and no longer lists `body-parser`.
- [x] `server/app.js` uses `express.json()`.
- [x] `/api/menu/stock-ice-creams` stays registered before `/api/menu/:id`.
- [x] POST and PUT still store the catalogue name for `iceCream.id` and ignore the client's `iceCream.name`.
- [x] A missing menu item is still a not-found response, and no response carries a stack trace.
- [x] `src/serverApi.test.js` passes with its assertions unchanged.
- [x] Every check in "Commands in force" exits 0.
