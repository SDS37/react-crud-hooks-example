# 09: Effects clean up without isMounted

**What to build:** Containers that load data cancel their requests when they unmount or their inputs change. They use the cleanup or abort pattern the current React docs describe, through the `signal` that ticket 03 added to the data layer. A cancelled request never sets state or navigates.

**Blocked by:** 03: The data layer uses fetch; 07: The app runs on React Router 8 in SPA mode

**Status:** ready-for-agent

- [ ] No `isMounted` ref or flag remains in `src/`.
- [ ] Each data-loading effect aborts its request in its cleanup.
- [ ] An aborted request is not reported as a failure and does not trigger the not-found redirect.
- [ ] A real failure is still surfaced and is not silently ignored.
- [ ] Leaving a page while it loads causes no React warning or error in the browser console.
- [ ] Every check in "Commands in force" exits 0.
