# Constitution — super-lista

## What this service IS

A mobile-first web portal that replaces the printed grocery list sheet. Three household members open a shared link, select the products they need for the week, and a consolidated order is generated as a downloadable `.md` file.

## Immutable Principles

1. **Simplicity above all** — This is used by non-technical people on their phones. Every interaction must be tap-friendly, obvious, and fast.
2. **No authentication required** — Anyone with the link can access the list. No accounts, no passwords.
3. **The Excel is the source of truth for the product catalog** — Products, categories, default quantities, units, and UberEats mappings come from `lista súper (UberEats).xlsx`.
4. **Only UberEats/Chedraui products** — "Sr. del Queso" and "Carne (Vecino)" are out of scope.
5. **The output is a Markdown file** — The downloadable `.md` follows the same format as `pedido-esta-semana.md` so it integrates with the existing `/pedir-super` skill.
6. **One active list at a time** — There's always at most one active list. Creating a new one closes the previous one.
