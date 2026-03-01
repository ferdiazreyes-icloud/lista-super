# Spec — super-lista

## Problem

Every week, a grocery list is printed on paper, three household members mark items by hand, the sheet is photographed, and Claude interprets the photo to order on UberEats. This is error-prone (handwriting interpretation) and wasteful (printing).

## Solution

A web portal where the same list is displayed digitally. Users tap to select products and adjust quantities. The result is a downloadable `.md` file ready for the `/pedir-super` skill.

## Users

- 3 household members (non-technical, mobile phones)
- FerDi (reviews the final list and triggers the UberEats order)

## User Stories

### US-1: View product list
As a household member, I open the portal link on my phone and see all ~153 products organized by category (Frutas y Verduras, Lácteos y Huevo, etc.) so I know what's available to order.

### US-2: Select products
As a household member, I tap a product to select it. It activates with the default quantity shown (e.g., Aguacate = 5 pzas). I can tap +/- to change the quantity. I can tap again to deselect it.

### US-3: Add custom items
As a household member, I scroll to the "Otros" section and type a product name and quantity for items not in the pre-loaded list.

### US-4: Download the order as Markdown
As FerDi, I open the summary view and tap "Descargar .md" to get a file like `pedido-2026-03-01.md` formatted identically to `pedido-esta-semana.md`.

### US-5: Create a new list
As FerDi, I tap "Nueva lista" to start a fresh weekly list. The previous list is archived. All products start unselected with their default quantities ready.

### US-6: See summary
As FerDi, I open the summary page to see all selected products consolidated by category, with quantities and units, before downloading.

## Categories (from Excel)

1. Frutas y Verduras
2. Lácteos y Huevo
3. Pan y Tortilla
4. Carnes Frías
5. Despensa
6. Congelados
7. Bebidas
8. Frutos Secos y Chiles Secos
9. Otros
10. Limpieza y Hogar
11. Cuidado Personal

## Product Data Model

Each product has:
- `name`: display name (e.g., "Aguacate")
- `category`: which section it belongs to
- `brand`: preferred brand if any (e.g., "Los Volcanes")
- `ubereats_name`: exact search term for UberEats (e.g., "Aguacate hass")
- `default_qty`: default quantity when selected
- `unit`: unit of measure (pza, kg, paquete, manojo, pack, etc.)
- `notes`: extra info (alternatives, season, etc.)
- `sort_order`: display order within category

## Units of Measure

Derived from the Excel data:
- **pza** (pieza): loose produce counted individually (Aguacate, Plátano, Chile, etc.)
- **kg**: produce sold by weight (Betabel, Jícama, etc.)
- **paquete**: packaged items with weight in name (Mora azul 170g, Brócoli 454g)
- **manojo**: bundles (Cilantro, Perejil, Epazote)
- **pack**: multi-unit packages (Leche 4x1L, Yakult 5x80ml)
- **bolsa**: bagged items (Frijol, Chía)
- **lata**: canned items (Atún, Chipotles)
- **botella**: liquid containers (Aceite, Salsa de soya)
- **rollo**: rolls (Epazote)
- **barra**: bar items (Jabón en barra)

## Out of Scope (MVP)

- Authentication / user sessions
- Automatic UberEats ordering
- Sr. del Queso / Carne (Vecino) sections
- Push notifications
- Order history / analytics
- Price tracking
