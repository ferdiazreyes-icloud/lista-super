# super-lista — Portal de Lista del Súper

Portal web mobile-first para capturar el pedido semanal del supermercado. Reemplaza la hoja impresa que se llena a mano.

## Estado actual: v0.1.0 (MVP)

### Implementado

- [x] Catálogo de ~153 productos cargados desde el Excel maestro
- [x] Vista mobile-first con productos organizados por categoría
- [x] Selección de productos con tap (toggle on/off)
- [x] Cantidades default pre-cargadas, ajustables con +/-
- [x] Unidades de medida derivadas (pza, kg, paquete, manojo, pack, etc.)
- [x] Sección "Otros" para captura libre (texto + cantidad + unidad)
- [x] Página de resumen con todos los productos seleccionados
- [x] Descarga de archivo `.md` compatible con skill `/pedir-super`
- [x] Botón "Nueva lista" para reiniciar
- [x] Docker + docker-compose para desarrollo local
- [x] Listo para deploy en Railway

### Pendiente

- [ ] Deploy en Railway
- [ ] Dominio o URL pública
- [ ] PWA (instalar como app en el cel)
- [ ] Historial de listas anteriores

## Cómo correr localmente

### Requisitos
- Node.js 20+
- Docker (para PostgreSQL)

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
| `make test` | Corre los tests |
| `make seed` | Carga productos del Excel |
| `make up` | Levanta todo con Docker |
| `make down` | Apaga Docker |
| `make studio` | Abre Prisma Studio (browser de DB) |

## Cómo correr tests

```bash
npm run test
```

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (mobile-first)
- **PostgreSQL** + **Prisma** ORM
- **Railway** (deployment)

## Estructura del proyecto

```
super-lista/
├── .specify/           # Spec files (constitution, spec, plan)
├── prisma/             # Database schema
├── scripts/            # Seed script
├── src/
│   ├── app/            # Next.js pages + API routes
│   ├── components/     # React components
│   └── lib/            # Utilities (prisma, markdown, types)
├── tests/              # Vitest tests
├── Dockerfile          # Production container
├── docker-compose.yml  # Local dev (PostgreSQL)
└── Makefile            # Standard commands
```
