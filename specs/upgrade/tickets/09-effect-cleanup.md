# 09: Effects clean up without isMounted

**What to build:** Containers that load data cancel their requests when they unmount or their inputs change. They use the cleanup or abort pattern the current React docs describe, through the `signal` that ticket 03 added to the data layer. A cancelled request never sets state or navigates.

**Blocked by:** 03: The data layer uses fetch; 07: The app runs on React Router 8 in SPA mode; 11: The first e2e run after a fresh install passes

**Status:** done (merged to `main` in #2)

- [x] No `isMounted` ref or flag remains in `src/`.
- [x] `src/entry.client.js` is deleted, so React Router's default client entry renders the app in StrictMode again. Ticket 07 added it only because StrictMode's second effect run left the `isMounted` ref false.
- [x] Effects survive StrictMode's mount, cleanup and remount cycle in development: the add and edit forms load, and the e2e suite passes.
- [x] The not-found redirect in `AddIceCream` no longer depends on a ref object's truthiness.
- [x] Each data-loading effect aborts its request in its cleanup.
- [x] An aborted request is not reported as a failure and does not trigger the not-found redirect.
- [x] A real failure is still surfaced and is not silently ignored.
- [x] Leaving a page while it loads causes no React warning or error in the browser console.
- [x] Every check in "Commands in force" exits 0.
