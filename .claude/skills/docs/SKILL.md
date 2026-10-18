---
name: docs
description: Fetch current library documentation with the ctx7 CLI before using an API. Use during the upgrade and whenever a library's API may have changed.
---

# Current docs

Use this before writing React, React Router, Vite, Vitest, Playwright, Emotion, Express, or Testing Library APIs. Training data for this repo describes the legacy stack.

Run, without a global install:

```bash
npx ctx7@latest library <name> <query>
npx ctx7@latest docs <libraryId> <query>
```

Resolve the library id first. Ids start with `/`, such as `/facebook/react`. `ctx7 docs react "hooks"` is not valid.

Most queries work without logging in. If a query is rate-limited, ask the user to run `npx ctx7@latest login` and then retry. Do not invent an API key.
