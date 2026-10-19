# Ultimate React Ice Cream

A menu for an ice cream shop. Browse what is on the menu, add a flavour from the catalogue, and edit or delete a menu item. The UI is function components and hooks. The API keeps the menu in memory, so restarting it restores the seed menu.

## Stack

Node 24.22.0, React 19, React Router 8 in SPA mode, Vite 8, Emotion 11, Express 5, and TypeScript. Pages call `fetch` only through `src/data/iceCreamData.ts`.

## Requirements

Node 24.22.0. From this directory, `nvm use` reads `.nvmrc`. Install with npm. `package-lock.json` is the lockfile.

```bash
npm install
```

## Run

The app needs both processes. Port 5000 is taken by the macOS AirPlay Receiver, so the API listens on 5001. Vite on port 3000 proxies `/api` to that port.

```bash
npm run start-server
```

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

| URL                            | Page                                            |
| ------------------------------ | ----------------------------------------------- |
| `/`                            | Menu                                            |
| `/ice-creams`                  | Catalogue flavours that are not on the menu yet |
| `/menu-items/add?iceCreamId=N` | Add that flavour                                |
| `/menu-items/:menuItemId`      | Edit or delete that item                        |

Any other path ends on `/`.

## Checks

Run these on Node 24.22.0. The definition of done is [docs/DoD.md](docs/DoD.md).

| Command                             | What it does                                                                       |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| `npm test`                          | Vitest, once. `npm run test:watch` is watch mode.                                  |
| `npm test -- src/path/File.test.ts` | One test file.                                                                     |
| `npm run lint`                      | ESLint.                                                                            |
| `npm run build`                     | SPA build. The page is `build/client/index.html`.                                  |
| `npx playwright test`               | End-to-end tests. Install the browser once with `npx playwright install chromium`. |

Playwright starts the API and the dev server itself. Stop anything already listening on ports 3000 and 5001 before that command.

## Docs

Start at [docs/README.md](docs/README.md). That index leads to the definition of done, the architecture overview, the decision records, and the commit rules.
