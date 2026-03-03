# Plan — super-lista

## Tech Stack

- **Framework**: Next.js 14 (App Router) — TypeScript
- **Styling**: Tailwind CSS — mobile-first responsive
- **Database**: PostgreSQL (Railway native add-on)
- **ORM**: Prisma
- **Deployment**: Railway (single service + PostgreSQL)
- **Containerization**: Docker + docker-compose (local dev)

## Architecture

Single Next.js app with:
- **Server Components** for product list rendering (fast initial load)
- **Client Components** for interactive selection (tap, +/-, quantity)
- **API Routes** for mutations (save selections, create list, download)
- **Prisma** for database access

## Database Schema

### products
Master product catalog. Seeded from Excel. Rarely changes.
- id, name, category, **store** (ubereats|queso|carne), brand, ubereats_name, default_qty, unit, notes, sort_order, created_at

### lists
One per weekly cycle (or extraordinary order).
- id, name, status (active/closed), created_at, closed_at

### list_items
Selected products for a specific list. Works for all stores (ubereats, queso, carne).
- id, list_id, product_id, quantity, created_at, updated_at

### list_custom_items
Free-text items from "Otros" section (UberEats only).
- id, list_id, product_name, quantity, unit, created_at

## Key Decisions

1. **No auth** — Single shared link. Simplicity wins.
2. **Products start unselected** — Matches the paper flow (blank sheet, mark what you need).
3. **Default qty pre-filled on select (UberEats only)** — Tap = activate with default. +/- to adjust. Sr. del Queso and Carne start at 1 (no default).
4. **Only selected items saved** — We only store list_items for products that were explicitly selected.
5. **Separate markdown per store** — Three download buttons: UberEats, Sr. del Queso, Carne Vecino. Each generates its own `.md` file.
6. **Single `store` field on products** — Distinguishes which store a product belongs to. Keeps a single products table for simplicity.
7. **Seed from Excel** — A script reads the Excel and populates the products table. API seed endpoint handles all three stores independently.

## Pages

1. **`/`** — Main list page. Shows UberEats products by category, then "Otros" section, then Sr. del Queso section, then Carne (Vecino) section.
2. **`/resumen`** — Summary page. Shows selected items grouped by store → category. One download button per store. "Nueva lista" button.

## API Routes

1. **`GET /api/lista`** — Get active list with all products grouped by store (products, quesoProducts, carneProducts)
2. **`POST /api/lista`** — Create new list (closes previous, resets all stores)
3. **`PUT /api/lista/items`** — Toggle/update product selection (works for any store)
4. **`POST /api/lista/otros`** — Add custom item (UberEats only)
5. **`DELETE /api/lista/otros/:id`** — Remove custom item
6. **`GET /api/lista/download?store=ubereats|queso|carne`** — Generate and return store-specific .md file

## Components

- **ProductCard** — UberEats product card (shows brand, default qty)
- **StoreProductCard** — Sr. del Queso / Carne product card (no brand, no default qty shown)
- **CategorySection** — Groups UberEats products by category
- **StoreSection** — Groups store products by store header → subcategories
- **OtrosSection** — Free-text input for custom items (UberEats only)

## Seed

Two mechanisms for populating products:

1. **Local seed script** (`scripts/seed.ts`): reads `lista súper (UberEats).xlsx` using `xlsx` library. Useful for local dev.
2. **API seed endpoint** (`/api/seed`): contains all products hardcoded (153 UberEats + 44 Sr. del Queso + 36 Carne Vecino = 233 total). Checks each store independently — can be re-visited to add new stores without re-seeding existing ones.

## Deployment (Railway)

- **Builder**: Railpack (auto-detects Next.js, no Dockerfile needed)
- **Build command**: `npx prisma generate && npm run build`
- **Start command**: `npx prisma db push && npx next start -H 0.0.0.0 -p ${PORT:-3000}`
- **Variables**: `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`, `NODE_ENV` = `production`
- **Networking**: port 8080 (Railway-assigned via $PORT)

### Key deployment learnings

- Railpack uses Dockerfile if present; removed to use native Next.js builder
- `prisma generate` must run at build time (no DB needed), `prisma db push` at start time (needs DB access)
- `postinstall` hooks break in Railpack's isolated dependency stage; moved to build command
- Next.js must bind to `0.0.0.0` (not localhost) for Railway routing to work
- After deploy with new schema, visit `/api/seed` to load new store products
