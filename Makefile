.PHONY: up down dev test seed logs migrate studio build

# Start all services (Docker)
up:
	docker compose up -d

# Stop all services
down:
	docker compose down

# Start local dev (requires DB running)
dev:
	npm run dev

# Run tests
test:
	npm run test

# Seed database with products from Excel
seed:
	npm run seed

# View logs
logs:
	docker compose logs -f

# Run database migrations
migrate:
	npx prisma migrate deploy

# Push schema to DB (dev)
db-push:
	npx prisma db push

# Open Prisma Studio (DB browser)
studio:
	npx prisma studio

# Build for production
build:
	npm run build

# Full local setup: start DB, push schema, seed, start dev server
setup:
	docker compose up -d db
	sleep 3
	npx prisma db push
	npm run seed
	npm run dev
