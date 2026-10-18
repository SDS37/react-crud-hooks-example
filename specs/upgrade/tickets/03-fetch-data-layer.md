# 03: The data layer uses fetch

**What to build:** Every API call in `src/data/iceCreamData.js` uses `fetch` instead of axios, and axios is removed. Menu and catalogue lists are still sorted by name on the client. A failed response rejects with an error that carries its HTTP status, so a container can tell a not-found from other failures. Each function accepts an optional abort `signal` for ticket 09.

**Blocked by:** None

**Status:** done (merged to `main` in #2)

- [x] `src/data/iceCreamData.js` is the only module that calls `fetch`, and no module imports axios.
- [x] `axios` is no longer in `package.json`.
- [x] A non-OK response rejects. It never resolves as if the request succeeded.
- [x] Opening the add form for a flavour that is already on the menu still ends on `/`. The add and edit containers read the status from the new error shape.
- [x] `src/data/iceCreamData.test.js` mocks `fetch` instead of axios. Its sorting assertions and the requested URLs do not change.
- [x] Every check in "Commands in force" exits 0.
