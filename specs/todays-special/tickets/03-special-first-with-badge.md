# 03: Show the special first with a badge

**What to build:** The menu shows the special first, with a "Today's special" text badge on its card, and the other cards stay in name order. `MenuItem` and `MenuItemInput` gain `isSpecial`, and `getMenu` sorts the special first, then by ice cream name. The seams are `src/data/iceCreamData.ts` and `src/ice-cream/Menu.tsx`. Setting the flag through the API demonstrates it.

**Blocked by:** 01: Mark a menu item as the special through the API

**Status:** done

- [x] A `getMenu` test, like "sorts the menu by ice cream name", shows the special first and the rest in name order.
- [x] With no special the order is unchanged.
- [x] The special's card shows the text "Today's special", and no other card does.
- [x] Every check in `docs/DoD.md` exits 0.
