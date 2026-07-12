# TransitOps — Smart Transport Operations Platform

> A full-stack fleet management system built for the **Odoo Hackathon**.

TransitOps gives fleet managers, dispatchers, safety officers, and financial analysts a single platform to manage vehicles, drivers, trips, maintenance, fuel, and operational costs — with role-based access control baked in from day one.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Pages & Routes](#pages--routes)
- [RBAC — Roles & Permissions](#rbac--roles--permissions)
- [Team](#team)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3, Framer Motion 12 |
| Routing | React Router DOM 6 |
| Forms | React Hook Form 7 + Zod 4 |
| Charts | Recharts 2 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Backend | Node.js 18+, Express 4, ES Modules |
| Database | MySQL 8.x |
| ORM | Prisma 5.x |
| Validation | Zod 3 |
| Auth | JWT + bcryptjs |
| Security | Helmet, express-rate-limit, CORS |
| Logging | Morgan |
| Dev Tooling | Nodemon, Concurrently |

---

## Features

### Backend
- JWT authentication with role-based access control (RBAC)
- Full CRUD for Vehicles, Drivers, Trips, Maintenance, Fuel Logs, Expenses
- Trip dispatch workflow (DRAFT → DISPATCHED → COMPLETED / CANCELLED)
- Dashboard KPI aggregations
- Reports with CSV export (`json2csv`)
- Prisma migrations + seed script
- Rate limiting, Helmet security headers, Morgan request logging
- Centralized error handling and 404 middleware
- Health check endpoint

### Frontend
- Responsive layout with collapsible sidebar and mobile drawer
- Dashboard with fleet KPIs, charts, and recent trips
- Vehicle registry with status tracking
- Driver profiles with safety scores and license expiry tracking
- Trip dispatcher with timeline and status progression
- Fleet maintenance scheduler with cost tracking
- Fuel log management with trend charts
- Expense management with distribution charts
- Reports & analytics with CSV export
- Settings — full enterprise control panel:
  - User management (add / edit / delete / suspend)
  - Role & Permission Matrix (6 roles × 9 modules × 6 permissions)
  - Application settings (company, timezone, language, currency, theme)
  - Security settings (password, 2FA, sessions, API keys)
  - Notification preferences (email & push toggles, digest frequency)
  - Activity timeline (live audit log)
- Profile page with account details and security overview
- Dark / light theme support
- Animated UI with Framer Motion

---

## Project Structure

```
TransitOps-Odoo-Hackathon/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── api/                # Axios API modules
│       ├── components/         # Reusable UI components
│       │   ├── auth/
│       │   ├── common/
│       │   ├── dashboard/
│       │   ├── drivers/
│       │   ├── finance/
│       │   ├── layout/
│       │   ├── maintenance/
│       │   ├── reports/
│       │   ├── settings/
│       │   ├── trips/
│       │   └── vehicles/
│       ├── context/            # AuthContext, ThemeContext
│       ├── hooks/              # useAuth, useDebounce, usePagination, useToast
│       ├── pages/              # Page-level components per route
│       ├── routes/             # ProtectedRoute, RoleProtectedRoute, PublicRoute
│       ├── schemas/            # Zod validation schemas
│       ├── styles/             # Global CSS + design tokens
│       └── utils/              # formatCurrency, formatDate, mock data, storage
├── server/                     # Express backend
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── migrations/         # Prisma migration history
│   │   └── seed.js             # Initial data seed
│   └── src/
│       ├── config/             # Environment & app config
│       ├── constants/          # Shared constants & messages
│       ├── controllers/        # Route handler logic
│       ├── middleware/         # Auth, error, rate-limit middleware
│       ├── repositories/       # Prisma data access layer
│       ├── routes/             # Express routers (9 modules)
│       ├── services/           # Business logic layer
│       ├── utils/              # Helpers (calculations, CSV, etc.)
│       └── validators/         # Zod request validators
├── docs/
│   ├── API.md                  # Full API endpoint contract
│   ├── DATABASE.md             # Database setup guide
│   ├── BUSINESS_RULES.md
│   ├── DEMO_FLOW.md
│   └── DEPLOYMENT.md
├── package.json                # Root scripts (concurrently)
└── CONTRIBUTING.md
```

---

## Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher
- **MySQL** 8.0 or higher (local or managed)

---

## Setup

### 1. Clone and install dependencies

```bash
git clone https://github.com/JagdeepMohanty/TransitOps-Odoo-Hackathon.git
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

Edit `server/.env` with your credentials:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mysql://root:yourpassword@localhost:3306/transitops
JWT_SECRET=replace_with_a_long_random_secret_minimum_32_chars
JWT_EXPIRES_IN=8h
CLIENT_URL=http://localhost:5173
```

> ⚠️ Never commit `server/.env` — it is gitignored.

### 3. Configure the frontend environment (optional)

```bash
# Windows PowerShell
Copy-Item client/.env.example client/.env
```

The default points to `http://localhost:5001/api`. Adjust `VITE_API_URL` if your backend runs on a different port.

### 4. Create the MySQL database

```sql
CREATE DATABASE transitops
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 5. Run Prisma setup

```bash
npm run prisma:generate   # generate the Prisma client
npm run prisma:migrate    # run all migrations
npm run prisma:seed       # seed roles and demo users
```

### 6. Start development

```bash
npm run dev
```

Starts the backend on **port 5000** and the frontend on **port 5173** concurrently.

---

## Available Scripts

Run all scripts from the **project root**.

| Script | Description |
|--------|-------------|
| `npm run dev` | Start backend + frontend concurrently |
| `npm run server` | Start backend only (Nodemon) |
| `npm run client` | Start frontend only (Vite) |
| `npm run install:all` | Install root + client + server dependencies |
| `npm run build` | Build the frontend for production |
| `npm run prisma:generate` | Regenerate Prisma client after schema changes |
| `npm run prisma:migrate` | Run pending database migrations |
| `npm run prisma:seed` | Seed initial roles and demo users |

Additional server-only scripts (run from `server/`):

| Script | Description |
|--------|-------------|
| `npm run start` | Start backend in production mode |
| `npm run prisma:deploy` | Deploy migrations in production |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |

---

## Environment Variables

### `server/.env`

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment (`development` / `production`) | `development` |
| `DATABASE_URL` | MySQL connection string | — |
| `JWT_SECRET` | Secret for signing JWTs (min 32 chars) | — |
| `JWT_EXPIRES_IN` | JWT expiry duration | `8h` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |

### `client/.env`

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5001/api` |
| `VITE_APP_NAME` | Application name | `TransitOps` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

---

## Database Schema

Built with Prisma on MySQL 8. Core models:

| Model | Description |
|-------|-------------|
| `User` | Platform users with hashed passwords and role assignment |
| `Role` | FLEET_MANAGER, DISPATCHER, SAFETY_OFFICER, FINANCIAL_ANALYST |
| `Vehicle` | Fleet vehicles with status, odometer, capacity, and cost tracking |
| `Driver` | Drivers with license details, safety score, and availability status |
| `Trip` | Trips linking a vehicle + driver with cargo, distance, and status workflow |
| `Maintenance` | Maintenance logs per vehicle with cost and status tracking |
| `FuelLog` | Fuel refill records linked to vehicle and optional trip |
| `Expense` | Operational expenses (FUEL, TOLL, MAINTENANCE, PARKING, REPAIR, OTHER) |

See [`docs/DATABASE.md`](docs/DATABASE.md) for full setup instructions and schema details.

---

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current authenticated user |
| GET/POST | `/api/vehicles` | List / create vehicles |
| GET/PUT/DELETE | `/api/vehicles/:id` | Get / update / delete vehicle |
| GET/POST | `/api/drivers` | List / create drivers |
| GET/PUT/DELETE | `/api/drivers/:id` | Get / update / delete driver |
| GET/POST | `/api/trips` | List / create trips |
| PUT | `/api/trips/:id/dispatch` | Dispatch a trip |
| PUT | `/api/trips/:id/complete` | Complete a trip |
| PUT | `/api/trips/:id/cancel` | Cancel a trip |
| GET/POST | `/api/maintenance` | List / create maintenance logs |
| GET/POST | `/api/fuel-logs` | List / create fuel logs |
| GET/POST | `/api/expenses` | List / create expenses |
| GET | `/api/dashboard` | Fleet KPI aggregations |
| GET | `/api/reports` | Analytics data + CSV export |

See [`docs/API.md`](docs/API.md) for the full endpoint contract with request/response schemas.

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | JWT authentication |
| `/` | Dashboard | Fleet KPIs, charts, recent trips |
| `/vehicles` | Vehicles | Vehicle registry & status |
| `/drivers` | Drivers | Driver profiles & safety scores |
| `/trips` | Trips | Trip dispatcher & timeline |
| `/trips/create` | Create Trip | Schedule a new trip |
| `/trips/:id` | Trip Details | Trip progress, costs, assignment |
| `/maintenance` | Maintenance | Scheduled & unscheduled maintenance |
| `/fuel` | Fuel Logs | Fuel tracking & refill logs |
| `/expenses` | Expenses | Expense management & budgets |
| `/reports` | Reports | Analytics, ROI, CSV export |
| `/settings` | Settings | RBAC, users, security, notifications |
| `/profile` | Profile | User profile & security overview |
| `/unauthorized` | 403 | Access denied page |

---

## RBAC — Roles & Permissions

| Role | Access |
|------|--------|
| Fleet Manager | Vehicles, Drivers, Trips, Maintenance — full CRUD |
| Dispatcher | Trips — create & dispatch; other modules read-only |
| Safety Officer | Drivers & Maintenance — read + edit |
| Financial Analyst | Expenses, Fuel Logs, Reports — read + export |

The `/settings` page provides a live **Role & Permission Matrix** — 6 roles × 9 modules × 6 permission types (View, Create, Edit, Delete, Export, Manage).

---

## Team

| Member | Role |
|--------|------|
| Jagdeep | Team Lead & Backend Lead |
| Lacki | Backend Developer |
| Tanya | Frontend Developer |
| Niharika | Frontend Developer |

---

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the branch model, commit conventions, and team rules.

---

## License

[MIT](LICENSE)
