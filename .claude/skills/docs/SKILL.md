---
name: docs
description: Fetch current library documentation with the ctx7 CLI before using an API.
---

# Current docs

Use this before writing a library API. Training data goes stale.

Run, without a global install:

```bash
npx ctx7@latest library <name> <query>
npx ctx7@latest docs <libraryId> <query>
```

Resolve the library id first. Ids start with `/`, such as `/facebook/react`. `ctx7 docs react "hooks"` is not valid.

Most queries work without logging in. If a query is rate-limited, ask the user to run `npx ctx7@latest login` and then retry. Do not invent an API key.
