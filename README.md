# TransitOps — Smart Transport Operations Platform

A full-stack fleet management system built for the Odoo Hackathon.
TransitOps enables fleet managers, dispatchers, safety officers, and financial analysts to manage vehicles, drivers, trips, maintenance, and operational costs from a single platform.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js, ES Modules |
| Database | MySQL 8.x |
| ORM | Prisma 5.x |
| Validation | Zod |
| Auth | JWT + bcryptjs |
| Dev tooling | Nodemon, Concurrently |

---

## Hour 1 Status — Backend Foundation Complete

| Component | Status |
|-----------|--------|
| Express application | ✅ |
| MySQL Prisma schema | ✅ |
| Environment validation | ✅ |
| Prisma client (singleton) | ✅ |
| CORS, Helmet, Morgan | ✅ |
| Health endpoint | ✅ |
| Error handling middleware | ✅ |
| 404 middleware | ✅ |
| Shared constants | ✅ |
| Base module routers (9 modules) | ✅ placeholder |
| Root dev scripts | ✅ |
| API contract document | ✅ |
| Database setup guide | ✅ |
| Authentication (JWT + RBAC) | 🔜 Hour 2 |
| Vehicle CRUD | 🔜 Hour 2 |
| Driver CRUD | 🔜 Hour 2 |
| Trip dispatch workflow | 🔜 Hour 2 |
| Maintenance management | 🔜 Hour 2 |
| Fuel logs & expenses | 🔜 Hour 2 |
| Dashboard KPIs | 🔜 Hour 2 |
| Reports & CSV export | 🔜 Hour 3 |

---

## Prerequisites

- **Node.js** 18 or higher
- **MySQL** 8.0 or higher (local or managed)
- **npm** 9 or higher

---

## Setup

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd TransitOps-Odoo-Hackathon
npm run install:all
```

### 2. Configure the backend environment

```bash
# macOS / Linux
cp server/.env.example server/.env

# Windows PowerShell
Copy-Item server/.env.example server/.env
```

Edit `server/.env` with your MySQL credentials:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mysql://root:yourpassword@localhost:3306/transitops
JWT_SECRET=replace_with_a_long_random_secret_minimum_32_chars
JWT_EXPIRES_IN=8h
CLIENT_URL=http://localhost:5173
```

> ⚠️ Never commit `server/.env`. It is gitignored.

### 3. Create the MySQL database

```sql
CREATE DATABASE transitops
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 4. Run Prisma setup

```bash
npm run prisma:generate   # generate the Prisma client
npm run prisma:migrate    # create all tables
npm run prisma:seed       # seed roles
```

### 5. Start development

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) concurrently.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start backend + frontend concurrently |
| `npm run server` | Start backend only |
| `npm run client` | Start frontend only |
| `npm run install:all` | Install all dependencies |
| `npm run build` | Build the frontend for production |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed initial data |

---

## API

Base URL: `http://localhost:5000/api`

Health check: `GET /api/health`

See [`docs/API.md`](docs/API.md) for the full endpoint contract.

---

## Database

See [`docs/DATABASE.md`](docs/DATABASE.md) for local and managed MySQL setup instructions.

---

## Team

| Member | Role | Branch |
|--------|------|--------|
| Jagdeep | Team Lead, Backend Lead | `feature/jagdeep-backend` |
| Lacki | Backend Developer | `backend/lacki` |
| Tanya | Frontend Developer | `frontend/tanya` |
| Niharika | Frontend Developer | `frontend/niharika` |

---

## Hour 2 Plan

- JWT authentication and role-based access control
- Vehicle CRUD with status management
- Driver CRUD with license tracking
- Trip creation and dispatch workflow
- Maintenance record management
- Fuel log and expense recording
- Dashboard KPI aggregations

---

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for branch model, commit conventions, and team rules.
