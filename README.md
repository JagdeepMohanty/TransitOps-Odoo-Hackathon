# TransitOps — Smart Transport Operations Platform

A full-stack fleet management system built for the Odoo Hackathon.
TransitOps enables fleet managers, dispatchers, safety officers, and financial analysts to manage vehicles, drivers, trips, maintenance, and operational costs from a single platform.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js, ES Modules |
| Database | MySQL 8.x |
| ORM | Prisma 5.x |
| Validation | Zod |
| Auth | JWT + bcryptjs |
| Dev tooling | Nodemon, Concurrently |

---

## Backend Status — Complete

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
| Authentication (JWT + RBAC) | ✅ |
| Vehicle CRUD | ✅ |
| Driver CRUD | ✅ |
| Trip dispatch workflow | ✅ |
| Maintenance management | ✅ |
| Fuel logs & expenses | ✅ |
| Dashboard KPIs | ✅ |
| Reports & CSV export | ✅ |

---

## Frontend Status — Settings & RBAC Complete

| Component | Status |
|-----------|--------|
| Settings Page (Framer Motion layout) | ✅ |
| Settings Header (gradient border, animated buttons) | ✅ |
| KPI Cards (glassmorphism, sparklines, hover glow) | ✅ |
| User Management Table (sticky header, expandable rows) | ✅ |
| Role & Permission Matrix (toggle cells, expand detail) | ✅ |
| Application Settings Card (premium form layout) | ✅ |
| Security Settings Card (password, 2FA, sessions, API keys) | ✅ |
| Notification Settings Card (premium toggles, digest) | ✅ |
| Activity Timeline (animated, live audit log) | ✅ |
| User Modal (add / edit / delete) | ✅ |
| Role Modal (create / edit with permission grid) | ✅ |
| RoleBadge & StatusBadge (polished, glow on hover) | ✅ |
| Roles Card (premium cards, permissions count) | ✅ |
| Settings Mock Data (14 users, richer roles & activity) | ✅ |
| Dashboard | ✅ |
| Vehicles, Drivers, Trips | ✅ |
| Finance (Fuel & Expenses) | ✅ |
| Maintenance | ✅ |
| Reports & Analytics | ✅ |

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

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Fleet KPIs, charts, recent trips |
| `/vehicles` | Vehicles | Vehicle registry & status |
| `/drivers` | Drivers | Driver profiles & safety scores |
| `/trips` | Trips | Trip dispatcher & timeline |
| `/maintenance` | Maintenance | Scheduled & unscheduled maintenance |
| `/fuel` | Fuel Logs | Fuel tracking & refill logs |
| `/expenses` | Expenses | Expense management & budgets |
| `/reports` | Reports | Analytics, ROI, CSV export |
| `/settings` | Settings | RBAC, users, security, notifications |
| `/profile` | Profile | User profile management |

---

## Settings & RBAC

The `/settings` page is a full enterprise control panel:

- **User Management** — add, edit, delete, suspend users with search, filter, sort & pagination
- **Role & Permission Matrix** — 6 roles × 9 modules × 6 permissions (View, Create, Edit, Delete, Export, Manage)
- **Application Settings** — company info, timezone, language, currency, theme
- **Security Settings** — password change, 2FA, session timeout, active sessions, API keys
- **Notification Preferences** — email & push toggles per alert type, digest frequency
- **Activity Timeline** — live audit log of logins, role changes, security events

### Roles

| Role | Permissions |
|------|-------------|
| Administrator | Full access — 54 permissions |
| Fleet Manager | Vehicles, Drivers, Trips, Maintenance — 32 permissions |
| Dispatcher | Trips, basic read — 18 permissions |
| Safety Officer | Drivers, Maintenance read/edit — 14 permissions |
| Financial Analyst | Expenses, Reports, Fuel — 16 permissions |
| Driver | Own trips & profile — 8 permissions |

---

## Team

| Member | Role | Branch |
|--------|------|--------|
| Jagdeep | Team Lead, Backend Lead | `feature/jagdeep-backend` |
| Lacki | Backend Developer | `backend/lacki` |
| Tanya | Frontend Developer | `frontend/tanya` |
| Niharika | Frontend Developer | `frontend/niharika` |

---

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for branch model, commit conventions, and team rules.
