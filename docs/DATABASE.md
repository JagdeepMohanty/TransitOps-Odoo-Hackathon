# TransitOps — Database Setup Guide

> **Stack:** MySQL 8.x · Prisma ORM 5.x · Node.js ES Modules

---

## Prerequisites

- MySQL 8.0 or higher
- Node.js 18 or higher
- Prisma CLI (installed as a dev dependency in `server/`)

---

## Approach A — Local MySQL

### 1. Start MySQL and create the database

```sql
CREATE DATABASE transitops
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Or via the MySQL CLI:

```bash
mysql -u root -p -e "CREATE DATABASE transitops CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 2. Configure your environment file

Copy the example and fill in your credentials:

```bash
# macOS / Linux
cp server/.env.example server/.env

# Windows PowerShell
Copy-Item server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mysql://root:yourpassword@localhost:3306/transitops
JWT_SECRET=replace_with_a_long_random_secret_minimum_32_chars
JWT_EXPIRES_IN=8h
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Never commit `server/.env`.** It is gitignored. Only commit `server/.env.example`.

### 3. Run migrations and seed

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run the initial migration (creates all tables)
npx prisma migrate dev --name init

# Seed the roles table
npx prisma db seed
```

### 4. Verify with Prisma Studio

```bash
npx prisma studio
```

Opens a browser UI at `http://localhost:5555` to inspect all tables.

---

## Approach B — Managed / Remote MySQL

Use this approach for cloud-hosted MySQL (e.g. PlanetScale, AWS RDS, Railway, Aiven).

Obtain from your provider:

| Variable | Example |
|----------|---------|
| Host | `db.example.com` |
| Port | `3306` |
| Username | `transitops_user` |
| Password | `your_secure_password` |
| Database | `transitops` |
| SSL required | Yes (most managed providers) |

### Connection string format

```env
DATABASE_URL=mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

### With SSL (PlanetScale / most managed providers)

```env
DATABASE_URL=mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?sslaccept=strict
```

> ⚠️ **Special characters in passwords** must be URL-encoded. For example:
> - `@` → `%40`
> - `#` → `%23`
> - `$` → `%24`
>
> Example: password `p@ss#1` becomes `p%40ss%231` in the URL.

### Deploy migrations (no interactive prompt)

```bash
cd server
npx prisma migrate deploy
npx prisma db seed
```

---

## Prisma Command Reference

| Command | Purpose |
|---------|---------|
| `npx prisma generate` | Regenerate the Prisma client after schema changes |
| `npx prisma migrate dev --name <label>` | Create and apply a new migration (development) |
| `npx prisma migrate deploy` | Apply pending migrations (production / CI) |
| `npx prisma db seed` | Run `prisma/seed.js` to populate initial data |
| `npx prisma studio` | Open the visual database browser |
| `npx prisma validate` | Check schema for errors without connecting |
| `npx prisma format` | Auto-format `schema.prisma` |

Or use the root-level shortcuts:

```bash
npm run prisma:generate   # from project root
npm run prisma:migrate    # from project root
npm run prisma:seed       # from project root
```

---

## Schema Overview

| Table | Description |
|-------|-------------|
| `roles` | Four system roles (seeded) |
| `users` | Authenticated users with role FK |
| `vehicles` | Fleet vehicles with status and cost tracking |
| `drivers` | Drivers with license and safety score |
| `trips` | Trip lifecycle from DRAFT → COMPLETED |
| `maintenance_logs` | Vehicle maintenance records |
| `fuel_logs` | Per-vehicle / per-trip fuel entries |
| `expenses` | Categorised operational expenses |

---

## Security Reminders

- `server/.env` is in `.gitignore` — it will never be committed
- `server/.env.example` contains only placeholder values — safe to commit
- Never log or print `DATABASE_URL` or `JWT_SECRET` at runtime
- The `env.js` config validates all required variables at startup and exits with a clear error if any are missing
