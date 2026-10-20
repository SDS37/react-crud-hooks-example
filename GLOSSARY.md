# Ice cream shop menu

Staff manage which ice creams the shop sells. Customers and staff read the menu to see what is on offer.

## Language

**Flavour**:
An ice cream the shop can sell, such as Cherry Blast.
_Avoid_: Ice cream (as a noun for the catalogue entry), scoop, product

**Catalogue**:
The flavours that are not yet on the menu.
_Avoid_: Stock list, available stock

**Menu**:
The set of menu items the shop currently offers.
_Avoid_: Stock, inventory

**Menu item**:
A flavour on the menu, with its price, stock and description. It has its own identity, which is never reused, even after it is deleted.
_Avoid_: Listing, entry, product

**Out of stock**:
A menu item staff have marked as unavailable.
_Avoid_: Sold out, empty, zero quantity

**Special**:
The one menu item the shop is pushing. It is shown first on the menu with a badge. A menu has at most one, and it lasts only as long as its menu item does.
_Avoid_: Featured, promoted, today's special (that is the badge wording, not the term)
