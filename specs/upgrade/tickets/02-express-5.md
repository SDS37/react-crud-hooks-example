# 02: Express 5 serves the menu API

**What to build:** The menu API runs on Express 5.3.0 and parses JSON bodies with `express.json()`. The separate `body-parser` dependency is gone. Clients see the same API.

**Blocked by:** None

**Status:** ready-for-agent

- [ ] `package.json` pins `express` 5.3.0 and no longer lists `body-parser`.
- [ ] `server/app.js` uses `express.json()`.
- [ ] `/api/menu/stock-ice-creams` stays registered before `/api/menu/:id`.
- [ ] POST and PUT still store the catalogue name for `iceCream.id` and ignore the client's `iceCream.name`.
- [ ] A missing menu item is still a not-found response, and no response carries a stack trace.
- [ ] `src/serverApi.test.js` passes with its assertions unchanged.
- [ ] Every check in "Commands in force" exits 0.
