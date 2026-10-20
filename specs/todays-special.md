# Today's special

Status: accepted

## Problem Statement

The menu is sorted by name, so a flavour the shop wants to push sits wherever the alphabet puts it. Staff and customers cannot tell which flavour the shop is pushing without reading the whole menu.

## Solution

Staff can mark one menu item as the special. Its card shows a "Today's special" badge and stays first on the menu. The other cards stay in name order. A menu has at most one special. Marking a different menu item moves the special to it. Staff can also unmark it. A new menu has none, and deleting the special leaves the menu with none.

## User Stories

1. As a shop staff member, I want to mark a menu item as the special, so that it stays at the top of the menu with a badge.
2. As a shop staff member, I want to mark the special while I add a flavour to the menu, so that I do not have to add it and then edit it.
3. As a shop staff member, I want marking a different menu item to replace the current special, so that the menu never shows two specials.
4. As a shop staff member, I want to unmark the special, so that the menu can have none.
5. As a shop staff member, I want an out of stock menu item to be refused as the special, so that the flavour the shop pushes can be bought.

## Implementation Decisions

- The special is a boolean `isSpecial` on a menu item. The seed menu items all have `isSpecial: false`.
- `server/app.ts`, `POST /api/menu` and `PUT /api/menu/:id`:
  - A missing `isSpecial` means `false` on `POST`, and means the stored value is unchanged on `PUT`.
  - A present `isSpecial` that is not a boolean returns 400 with `{ error: "isSpecial must be a boolean" }`. No other field is validated by this spec.
  - If the saved item would have `isSpecial: true` and `inStock: false`, the request returns 400 with `{ error: "An out of stock menu item cannot be the special" }`. For a `PUT` this is checked against the item as it would be after the save, so omitting `isSpecial` on the current special while setting `inStock: false` also returns 400. Nothing is cleared automatically.
  - A 400 changes nothing on the menu, including the previous special.
  - Saving `isSpecial: true` clears `isSpecial` on every other menu item. Saving it on the item that is already the special changes nothing.
- `src/data/iceCreamData.ts`:
  - Add `isSpecial` to `MenuItem` and `MenuItemInput`.
  - `getMenu` sorts the special first, then by ice cream name.
- `src/ice-cream/IceCream.tsx`, the form shared by add and edit:
  - A "Today's special" checkbox, sent as `isSpecial` on submit. It starts unchecked on add and checked or unchecked from the menu item on edit, as `inStock` does now.
  - It is disabled only when it is unchecked and `inStock` is false. A checked box stays enabled so it can be unticked.
  - While it is checked and `inStock` is false, a hint appears under it: "Out of stock items can't be today's special. Untick this or restock to save." The checkbox points at the hint with `aria-describedby`. Save stays enabled.
  - If the server returns 400, the existing save error shows. The client does not read the error body.
- `src/ice-cream/Menu.tsx`: the special's card shows a "Today's special" text badge, so colour is not the only signal.
- Keep to erasable syntax in `server/` (`.claude/rules/type-stripping.md`).

## Testing Decisions

- Server tests in `src/serverApi.test.ts`, through its `request` helper with one `createApp()` instance across the calls, like the tests for `specs/menu-item-ids.md`:
  - A fresh menu has no item with `isSpecial: true`.
  - `POST` with `isSpecial: true` makes it the only special. A second `POST` with `isSpecial: true` moves it, and the first item reads `false`.
  - `PUT` with `isSpecial: true` on another item moves the special. `PUT` with `isSpecial: false` on the special leaves none.
  - `PUT` without `isSpecial` on the special keeps it. A `POST` without it stores `false`.
  - Deleting the special leaves no special.
  - A non-boolean `isSpecial` on `POST` and on `PUT` returns 400, and the menu is unchanged.
  - `isSpecial: true` with `inStock: false` returns 400 on `POST` and on `PUT`. A `PUT` with `inStock: false` and no `isSpecial` on the current special returns 400. The previous special is still the special after each.
- A `getMenu` test in `src/data/iceCreamData.test.ts`, resembling "sorts the menu by ice cream name": the special comes first, and the rest are in name order.
- A form test for the disabled and hint states of the checkbox, rendered like the existing component tests (for example `src/ice-cream/saveFailure.test.tsx`).
- One Playwright test in `e2e/`: tick the checkbox on a flavour, save, and see the badge on the first card of the menu.
- Each new test fails before the change and passes after it.
- Checks: every command in `docs/DoD.md`, plus `npx prettier --check` on the changed files. This spec adds no extra check.

## Out of Scope

- Persisting the menu or the special across server restarts.
- Any daily reset. "Today's special" is badge wording only, and the special stays until staff change it.
- Permissions, so any staff member can set the special.
- Handling two staff members editing at once.
- Warning staff when marking a menu item replaces another special.
- Validating any field other than `isSpecial`.
- Showing the server's error text in the form.

## Further Notes

- The coupling of `quantity` 0 and `inStock: false` in the form is unchanged. Out of stock for this spec means `inStock: false`, and the form can reach it by choosing quantity 0.
- A new menu item starts with `inStock: true` and quantity 0 in the form, so the checkbox is enabled on add until staff untick In Stock.
- The seed menu item Sundae Everyday is out of stock, so it cannot be the special until it is restocked.
- The Playwright test changes the shared in-memory menu. The existing e2e specs read it, so check that the new test leaves the menu as other specs expect, or has the server start fresh.
- `GLOSSARY.md` has the terms: menu item, special, and out of stock.
