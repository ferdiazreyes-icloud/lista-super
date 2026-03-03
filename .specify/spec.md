# Spec — super-lista

## Problem

Every week, a grocery list is printed on paper, three household members mark items by hand, the sheet is photographed, and Claude interprets the photo to order on UberEats. This is error-prone (handwriting interpretation) and wasteful (printing). Additionally, the printed sheet covers three stores: UberEats/Chedraui, Sr. del Queso (cheese shop), and Carne Vecino (neighborhood butcher).

## Solution

A web portal where the same list is displayed digitally. Users tap to select products and adjust quantities across all three stores. The result is three downloadable `.md` files — one per store.

## Users

- 3 household members (non-technical, mobile phones)
- FerDi (reviews the final list and triggers orders)

## User Stories

### US-1: View product list
As a household member, I open the portal link on my phone and see all products organized by store and category. UberEats products (153) are shown first with 11 categories, followed by Sr. del Queso (44 products, 6 categories) and Carne Vecino (36 products, 3 categories).

### US-2: Select UberEats products
As a household member, I tap a UberEats product to select it. It activates with the default quantity shown (e.g., Aguacate = 5 pzas). I can tap +/- to change the quantity. I can tap again to deselect it.

### US-3: Select Sr. del Queso / Carne products
As a household member, I tap a product from Sr. del Queso or Carne Vecino. It activates starting at quantity 1 (no default). I can tap +/- to adjust. These products don't show a default quantity when unselected.

### US-4: Add custom items
As a household member, I scroll to the "Otros" section (only for UberEats) and type a product name and quantity for items not in the pre-loaded list.

### US-5: Download orders as Markdown
As FerDi, I open the summary view and tap the download button for each store to get separate `.md` files: `pedido-ubereats-FECHA.md`, `pedido-queso-FECHA.md`, and `pedido-carne-FECHA.md`.

### US-6: Create a new list
As FerDi, I tap "Nueva lista" to start a fresh weekly list. The previous list is archived. All products across all stores start unselected.

### US-7: See summary
As FerDi, I open the summary page to see all selected products consolidated by store → category, with quantities and units, before downloading.

## Stores

### UberEats / Chedraui Selecto (153 products)
Categories: Frutas y Verduras, Lácteos y Huevo, Pan y Tortilla, Carnes Frías, Despensa, Congelados, Bebidas, Frutos Secos, Otros, Limpieza y Hogar, Cuidado Personal

### Sr. del Queso (44 products)
Categories: Quesos, Tortillas y Maíz, Cocina Libanesa, Pollo, Salchichonería, Orgánicos

### Carne Vecino (36 products)
Categories: Res, Cerdo, Pollo

## Product Data Model

Each product has:
- `name`: display name (e.g., "Aguacate")
- `category`: which section it belongs to
- `store`: which store it belongs to (ubereats, queso, carne)
- `brand`: preferred brand if any (e.g., "Los Volcanes") — mainly for UberEats
- `ubereats_name`: exact search term for UberEats (empty for other stores)
- `default_qty`: default quantity when selected (0 = no default, user starts at 1)
- `unit`: unit of measure (pza, kg, paquete, manojo, pack, paq, etc.)
- `notes`: extra info (alternatives, presentation, season, etc.)
- `sort_order`: display order within category

## Units of Measure

### UberEats units (derived from Excel)
- **pza** (pieza): loose produce counted individually
- **kg**: produce sold by weight
- **paquete**: packaged items with weight in name
- **manojo**: bundles (Cilantro, Perejil)
- **pack**: multi-unit packages (Leche 4x1L)
- **bolsa**: bagged items
- **lata**: canned items
- **botella**: liquid containers
- **rollo**: rolls
- **barra**: bar items

### Sr. del Queso units
- **kg**: cheeses, meats, bulk items sold by weight
- **pza**: individual packaged items (200g containers, bottles)
- **paq**: packaged goods (totopos, tortillas, tostadas)

### Carne Vecino units
- **kg**: all products sold by kilogram

## Out of Scope

- Authentication / user sessions
- Automatic UberEats ordering
- Push notifications
- Order history / analytics
- Price tracking
- PWA (install as app)
