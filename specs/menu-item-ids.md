# Menu item ids

Status: accepted, 20 October 2026.

## Problem Statement

If a staff member deletes a menu item and then adds one, the new item can get the same id as a menu item that is still there. To reproduce on the seed menu, delete any item except Raspberry Pi, add a flavour, and open it. The edit page shows Raspberry Pi, and saving overwrites both entries with id 7. An add with no delete before it works.

`POST /api/menu` in `server/app.ts` sets the new id to `menuData.length + 1`. That is only a free id while the ids are exactly 1 to n. After one delete from the seed menu (ids 1 to 7), 6 items remain, so the new item gets id 7, which Raspberry Pi already has. `GET /api/menu/:id` returns the first match, which is Raspberry Pi. `PUT /api/menu/:id` replaces every match. Deleting k items makes the next add collide with id 8 − k.

## Solution

The server gives each new menu item an id that no menu item has ever had. Each app keeps a `nextMenuId` counter that starts at the highest seed id plus 1 (8). Each POST uses the counter's value and then increments it. Ids are never reused, so an old URL to a deleted item returns 404 instead of opening a different item.

## User Stories

1. As a staff member, I want a flavour I just added to open as itself, so that editing it never changes a different flavour.

## Implementation Decisions

- The change is only in `createApp` in `server/app.ts`. Add `let nextMenuId = Math.max(...menuData.map((item) => item.id)) + 1;` after the seed menu. In the POST handler, replace `id: menuData.length + 1` with `id: nextMenuId++`.
- Use a counter, not `max(id) + 1`. `max + 1` would reuse id 7 after Raspberry Pi is deleted.
- The counter lives inside `createApp`, so each app instance starts from the seed again. That keeps the existing "a new app starts from the seed menu" test true.
- Keep to erasable syntax (`.claude/rules/type-stripping.md`).

## Testing Decisions

- The seam is `src/serverApi.test.ts`, through its `request` helper, with one `createApp()` instance across the calls.
- Test 1: delete `/api/menu/3`, then POST. The new id is not an id already on the menu. `GET /api/menu/7` is still Raspberry Pi, and `GET` on the new id returns the posted flavour.
- Test 2: delete `/api/menu/7`, then POST. The new id is not 7.
- Both tests fail before the fix and pass after it.
- Checks: every command in `docs/DoD.md`, plus `npx prettier --check` on the changed files. This spec adds no extra check.

## Out of Scope

- Any client change. `src/data/iceCreamData.ts` and `src/ice-cream/` already use the id the server returns.
- Making GET or PUT defend against duplicate ids. The fix stops duplicates at the source.
- The stray `, 10` passed as `find`'s `thisArg` in `GET /api/menu/:id`. It has no effect.
- Persisting the menu or the counter across server restarts.
