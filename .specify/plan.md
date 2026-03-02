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
- id, name, category, brand, ubereats_name, default_qty, unit, notes, sort_order, created_at

### lists
One per weekly cycle (or extraordinary order).
- id, name, status (active/closed), created_at, closed_at

### list_items
Selected products for a specific list.
- id, list_id, product_id, quantity, created_at, updated_at

### list_custom_items
Free-text items from "Otros" section.
- id, list_id, product_name, quantity, unit, created_at

## Key Decisions

1. **No auth** — Single shared link. Simplicity wins.
2. **Products start unselected** — Matches the paper flow (blank sheet, mark what you need).
3. **Default qty pre-filled on select** — Tap = activate with default. +/- to adjust.
4. **Only selected items saved** — We only store list_items for products that were explicitly selected, not the entire catalog per list.
5. **Markdown download format** — Matches existing `pedido-esta-semana.md` for skill compatibility.
6. **Seed from Excel** — A script reads the Excel and populates the products table.

## Pages

1. **`/`** — Main list page. Shows all products by category. Tap to select/deselect. Adjust qty. "Otros" section at bottom.
2. **`/resumen`** — Summary page. Shows only selected items grouped by category. "Descargar .md" button. "Nueva lista" button.

## API Routes

1. **`GET /api/lista`** — Get active list with all selections
2. **`POST /api/lista`** — Create new list (closes previous)
3. **`PUT /api/lista/items`** — Toggle/update product selection
4. **`POST /api/lista/otros`** — Add custom item
5. **`DELETE /api/lista/otros/:id`** — Remove custom item
6. **`GET /api/lista/download`** — Generate and return .md file

## Seed

Two mechanisms for populating products:

1. **Local seed script** (`scripts/seed.ts`): reads `lista súper (UberEats).xlsx` using `xlsx` library. Useful for local dev.
2. **API seed endpoint** (`/api/seed`): contains all 153 products hardcoded. Used for production (one-time visit to populate DB).

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
