# 04: Staff set the special from the form

**What to build:** The add and edit form has a "Today's special" checkbox that sends `isSpecial` on submit. It starts unchecked on add and from the menu item on edit. It is disabled only when it is unchecked and the item is out of stock. While it is checked and the item is out of stock, the hint "Out of stock items can't be today's special. Untick this or restock to save." shows under it, tied to the checkbox with `aria-describedby`. Save stays enabled, and a server 400 shows the existing save error. The seam is `src/ice-cream/IceCream.tsx`.

**Blocked by:** 02: Refuse an invalid special, 03: Show the special first with a badge

**Status:** done

- [x] A form test covers the disabled state, the enabled state for a checked special, and the hint.
- [x] One Playwright test ticks the box on a flavour, saves, and sees the badge on the first card of the menu.
- [x] That test leaves the shared menu as the other e2e specs expect.
- [x] Every check in `docs/DoD.md` exits 0.
