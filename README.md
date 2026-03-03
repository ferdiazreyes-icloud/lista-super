# super-lista — Portal de Lista del Súper

Portal web mobile-first para capturar el pedido semanal del supermercado. Reemplaza la hoja impresa que se llena a mano. Soporta tres tiendas: UberEats/Chedraui, Sr. del Queso y Carne (Vecino).

## Estado actual: v0.2.0 — Multi-tienda

**URL:** https://lista-super-production.up.railway.app

### Implementado

- [x] Catálogo de 233 productos (153 UberEats + 44 Sr. del Queso + 36 Carne Vecino)
- [x] Vista mobile-first con productos organizados por tienda y categoría
- [x] **UberEats/Chedraui**: 153 productos en 11 categorías, con cantidades default y marcas
- [x] **Sr. del Queso**: 44 productos en 6 categorías (Quesos, Tortillas, Cocina Libanesa, Pollo, Salchichonería, Orgánicos)
- [x] **Carne (Vecino)**: 36 productos en 3 categorías (Res, Cerdo, Pollo) — todo por kg
- [x] Selección de productos con tap (toggle on/off)
- [x] Cantidades default pre-cargadas (UberEats), sin default (Queso y Carne empiezan en 1)
- [x] Unidades de medida derivadas (pza, kg, paquete, manojo, pack, paq, etc.)
- [x] Sección "Otros" para captura libre (solo UberEats)
- [x] Página de resumen con productos agrupados por tienda → categoría
- [x] **3 botones de descarga `.md`** — uno por tienda
- [x] Botón "Nueva lista" para reiniciar (semanal o pedido extraordinario)
- [x] Deploy en Railway (Next.js + PostgreSQL)
- [x] Endpoint `/api/seed` para carga de productos (soporta carga incremental por tienda)
- [x] 26 tests (3 suites): markdown UberEats + markdown Queso + markdown Carne + derivación de unidades

### Pendiente

- [ ] PWA (instalar como app en el cel)
- [ ] Historial de listas anteriores
- [ ] Eliminar endpoint `/api/seed` (ya cumplió su función)

## URL de producción

https://lista-super-production.up.railway.app

| Página | URL |
|---|---|
| Lista de productos | `/` |
| Resumen del pedido | `/resumen` |
| Descargar .md UberEats | `/api/lista/download?store=ubereats` |
| Descargar .md Sr. del Queso | `/api/lista/download?store=queso` |
| Descargar .md Carne (Vecino) | `/api/lista/download?store=carne` |

## Cómo correr localmente

### Requisitos
- Node.js 20+
- Docker (para PostgreSQL local)

### Setup rápido

```bash
# 1. Copiar variables de entorno
cp .env.example .env

# 2. Instalar dependencias
npm install

# 3. Levantar PostgreSQL con Docker
docker compose up -d db

# 4. Crear tablas en la DB
npx prisma db push

# 5. Cargar productos desde el Excel
npm run seed

# 6. Iniciar servidor de desarrollo
npm run dev
```

Abrir http://localhost:3000

### Comandos

| Comando | Qué hace |
|---|---|
| `make setup` | Hace todo el setup de una vez (DB + schema + seed + dev) |
| `make dev` | Inicia servidor de desarrollo |
| `make test` | Corre los tests (26 tests) |
| `make seed` | Carga productos del Excel |
| `make up` | Levanta todo con Docker |
| `make down` | Apaga Docker |
| `make studio` | Abre Prisma Studio (browser de DB) |

## Cómo correr tests

```bash
npm run test
```

- **26 tests** (3 suites): generación de markdown (UberEats + Sr. del Queso + Carne Vecino) + derivación de unidades de medida
- Framework: Vitest

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (mobile-first)
- **PostgreSQL** + **Prisma** ORM
- **Railway** (deployment via Railpack)

## Deployment (Railway)

El proyecto se despliega automáticamente al hacer push a `main`.

### Configuración en Railway

| Setting | Value |
|---|---|
| Builder | Railpack (default) |
| Custom Build Command | `npx prisma generate && npm run build` |
| Custom Start Command | `npx prisma db push && npx next start -H 0.0.0.0 -p ${PORT:-3000}` |
| DATABASE_URL | `${{Postgres.DATABASE_URL}}` (referencia al plugin) |
| NODE_ENV | `production` |

### Seed de productos

Los productos se cargan visitando `/api/seed`. El endpoint verifica cada tienda independientemente:
- Si UberEats ya tiene productos, no los recarga
- Si Sr. del Queso o Carne no tienen productos, los carga

Para cargar productos nuevos tras un deploy con cambios:
1. Visitar `https://lista-super-production.up.railway.app/api/seed`

## Estructura del proyecto

```
super-lista/
├── .specify/           # Spec files (constitution, spec, plan)
├── prisma/             # Database schema (Prisma)
├── scripts/            # Seed script (lee Excel local)
├── src/
│   ├── app/            # Next.js pages + API routes
│   │   ├── api/lista/  # API: lista, items, otros, download
│   │   ├── api/seed/   # API: seed (UberEats + Queso + Carne)
│   │   ├── resumen/    # Página de resumen (3 secciones + 3 descargas)
│   │   └── page.tsx    # Página principal (lista de productos)
│   ├── components/     # React components
│   │   ├── ProductCard.tsx       # Tarjeta producto UberEats
│   │   ├── StoreProductCard.tsx  # Tarjeta producto Queso/Carne
│   │   ├── CategorySection.tsx   # Sección de categoría UberEats
│   │   ├── StoreSection.tsx      # Sección de tienda (Queso/Carne)
│   │   └── OtrosSection.tsx      # Captura libre (UberEats)
│   └── lib/            # Utilities (prisma client, markdown generators, types)
├── tests/              # Vitest tests (markdown UberEats + Queso + Carne + units)
├── docker-compose.yml  # Local dev (PostgreSQL)
└── Makefile            # Standard commands
```
