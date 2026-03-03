# Constitution — super-lista

## What this service IS

A mobile-first web portal that replaces the printed grocery list sheet. Three household members open a shared link, select the products they need for the week from three stores (UberEats/Chedraui, Sr. del Queso, Carne Vecino), and consolidated orders are generated as downloadable `.md` files — one per store.

## Immutable Principles

1. **Simplicity above all** — This is used by non-technical people on their phones. Every interaction must be tap-friendly, obvious, and fast.
2. **No authentication required** — Anyone with the link can access the list. No accounts, no passwords.
3. **The Excel is the source of truth for the product catalog** — Products, categories, default quantities, units, and UberEats mappings come from `lista súper (UberEats).xlsx`.
4. **Three stores supported** — UberEats/Chedraui Selecto (153 products), Sr. del Queso (44 products), and Carne Vecino (36 products). Each store generates its own downloadable `.md` file.
5. **The output is Markdown files** — Each store produces a downloadable `.md`. UberEats format matches `pedido-esta-semana.md` for the `/pedir-super` skill. Queso and Carne use a simple product + quantity table.
6. **One active list at a time** — There's always at most one active list. Creating a new one closes the previous one. All three stores share the same list.
