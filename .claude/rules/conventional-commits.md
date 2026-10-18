# Conventional commits

- Branch off `main`. Open the pull request with `gh`. Do not commit directly to `main`.
- One logical change per commit. A commit that changes the menu API and also restyles the form is two commits.
- Commit only after every check under "Commands in force" in `specs/upgrade.md` is green.
- Do not commit `.env` files, credentials, or generated `node_modules` and `build` output.

Messages follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

```
type(scope): short description
```

The description is the reason, in the imperative, and it fits on one line. Merge commits (`Merge ticket NN: ...`) are exempt.

## Types

| Type | When |
| --- | --- |
| feat | A new slice of menu behavior |
| fix | A bug fix |
| docs | Documentation only |
| style | Formatting only |
| refactor | A change that neither fixes a bug nor adds a feature |
| perf | A performance change |
| test | Tests only |
| build | Build system or dependencies |
| ci | CI configuration |
| chore | Tooling and other housekeeping |
| revert | Reverts a previous commit |

## Scopes

Use the area the change lives in.

| Scope | Area |
| --- | --- |
| menu | Menu list and menu-item routes |
| catalogue | Flavours that are not on the menu yet |
| form | Add and edit form, validation, stock and quantity |
| api | Express menu API |
| data | `src/data/iceCreamData.js` |
| a11y | Landmarks, focus, and live regions |
| styles | Emotion styles |
| harness | Claude rules, skills, and hooks |
| docs | Documentation |
| infra | Local run wiring, Vite, and CI |

Omit the scope when the change is the whole repo (`docs: describe the upgrade target`).

## Examples

```
feat(form): keep quantity and stock in step
fix(api): resolve the catalogue name on save
test(data): sort menu items by name
build(infra): move the dev server to Vite
docs: describe the upgrade target
```
