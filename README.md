# super-lista — Portal de Lista del Súper

Portal web mobile-first para capturar el pedido semanal del supermercado. Reemplaza la hoja impresa que se llena a mano.

## Estado actual: v0.1.0 (MVP) — Desplegado

**URL:** https://lista-super-production.up.railway.app

### Implementado

- [x] Catálogo de 153 productos cargados desde el Excel maestro
- [x] Vista mobile-first con productos organizados por 11 categorías
- [x] Selección de productos con tap (toggle on/off)
- [x] Cantidades default pre-cargadas, ajustables con +/-
- [x] Unidades de medida derivadas (pza, kg, paquete, manojo, pack, etc.)
- [x] Sección "Otros" para captura libre (texto + cantidad + unidad)
- [x] Página de resumen con todos los productos seleccionados
- [x] Descarga de archivo `.md` compatible con skill `/pedir-super`
- [x] Botón "Nueva lista" para reiniciar (semanal o pedido extraordinario)
- [x] Deploy en Railway (Next.js + PostgreSQL)
- [x] Dominio público generado por Railway
- [x] Endpoint `/api/seed` para carga inicial de productos

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
| Descargar .md | `/api/lista/download` |

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
| `make test` | Corre los tests (17 tests) |
| `make seed` | Carga productos del Excel |
| `make up` | Levanta todo con Docker |
| `make down` | Apaga Docker |
| `make studio` | Abre Prisma Studio (browser de DB) |

## Cómo correr tests

```bash
npm run test
```

- **17 tests** (2 suites): generación de markdown + derivación de unidades de medida
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

Los productos se cargaron una sola vez visitando `/api/seed`. Si se necesita recargar:

1. Borrar productos existentes desde Prisma Studio o la DB directamente
2. Visitar `https://lista-super-production.up.railway.app/api/seed`

## Estructura del proyecto

```
super-lista/
├── .specify/           # Spec files (constitution, spec, plan)
├── prisma/             # Database schema (Prisma)
├── scripts/            # Seed script (lee Excel local)
├── src/
│   ├── app/            # Next.js pages + API routes
│   │   ├── api/lista/  # API: lista, items, otros, download
│   │   ├── api/seed/   # API: seed one-time (productos hardcoded)
│   │   ├── resumen/    # Página de resumen
│   │   └── page.tsx    # Página principal (lista de productos)
│   ├── components/     # React components (ProductCard, CategorySection, OtrosSection)
│   └── lib/            # Utilities (prisma client, markdown generator, types)
├── tests/              # Vitest tests (markdown + units)
├── docker-compose.yml  # Local dev (PostgreSQL)
└── Makefile            # Standard commands
```
