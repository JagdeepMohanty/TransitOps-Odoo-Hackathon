# Hour 1 Status — Team Handoff

> **Project:** TransitOps — Smart Transport Operations Platform
> **Phase:** Hour 1 complete
> **Author:** Jagdeep (Backend Lead)
> **Branch:** `feature/jagdeep-backend`

---

## Completed by Jagdeep

| Item | Status |
|------|--------|
| Repository structure | ✅ |
| Root development scripts | ✅ |
| Express application foundation | ✅ |
| Helmet, CORS, Morgan, body-parser middleware | ✅ |
| MySQL Prisma schema (all 8 models) | ✅ |
| Environment validation with Zod | ✅ |
| Prisma client (singleton, dev-safe) | ✅ |
| Shared API response format | ✅ |
| `ApiError`, `ApiResponse`, `asyncHandler` utilities | ✅ |
| Centralized error middleware (Prisma + Zod + generic) | ✅ |
| 404 not-found middleware | ✅ |
| Health endpoint `GET /api/health` | ✅ |
| All 9 module placeholder routers (HTTP 501) | ✅ |
| Shared constants (roles, statuses, expense types, HTTP codes, messages) | ✅ |
| Seed file (roles) | ✅ |
| `.gitignore` (secrets excluded) | ✅ |
| `docs/API.md` contract | ✅ |
| `docs/DATABASE.md` setup guide | ✅ |

---

## For Lacki — Backend Module Developer

### Before you start

```bash
git checkout develop
git pull origin develop
git checkout -b backend/lacki
```

### What is ready for you

- `server/prisma/schema.prisma` — complete schema, do not modify without discussing with Jagdeep
- `server/src/config/prisma.js` — the single shared Prisma client, import this everywhere
- `server/src/utils/ApiError.js` — throw this for all operational errors
- `server/src/utils/ApiResponse.js` — use `.send(res)` for all success responses
- `server/src/utils/asyncHandler.js` — wrap every async controller
- `server/src/constants/` — use these for all status values and messages

### Architecture pattern to follow

Every module follows this layered structure:

```
routes/         → HTTP routing only, no business logic
controllers/    → parse request, call service, return response
services/       → all business logic and validation
repositories/   → all Prisma queries
```

### Rules

- **Never** create a new `PrismaClient` instance. Import from `server/src/config/prisma.js`.
- **Never** put business logic directly in route files.
- **Always** use `asyncHandler` to wrap async controllers.
- **Always** throw `ApiError` for expected failures (not found, conflict, forbidden).
- **Always** use `ApiResponse.send(res)` for success responses.
- **Use transactions** for any operation that writes to multiple tables (e.g. dispatching a trip updates both the trip, vehicle status, and driver status).
- **Do not rename** any Prisma model fields without coordinating with Jagdeep and the frontend team.
- **Do not run** `prisma migrate dev` on a shared database without coordinating.

### Placeholder routes to implement

Each of these files currently returns HTTP 501. Replace the placeholder with real logic:

```
server/src/routes/auth.routes.js
server/src/routes/vehicle.routes.js
server/src/routes/driver.routes.js
server/src/routes/trip.routes.js
server/src/routes/maintenance.routes.js
server/src/routes/fuelLog.routes.js
server/src/routes/expense.routes.js
server/src/routes/dashboard.routes.js
server/src/routes/report.routes.js
```

Corresponding service and repository stubs are in:

```
server/src/services/
server/src/repositories/
server/src/controllers/
server/src/validators/
```

### Example controller pattern

```js
import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import * as vehicleService from '../services/vehicle.service.js';

export const getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await vehicleService.listVehicles(req.query);
  new ApiResponse(HTTP_STATUS.OK, 'Vehicles retrieved', vehicles).send(res);
});
```

---

## For Tanya and Niharika — Frontend Developers

### Environment setup

Create `client/.env` (already gitignored):

```env
VITE_API_URL=http://localhost:5000/api
```

### API base URL

```js
const API_URL = import.meta.env.VITE_API_URL;
```

### Response shapes — always expect these

**Success:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Clear error message",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

### Canonical field names — use exactly these

| Field | ✅ Use | ❌ Never |
|-------|--------|---------|
| Vehicle reg | `registrationNumber` | `registrationNo`, `regNumber` |
| Vehicle capacity | `maxLoadCapacity` | `maxCapacity`, `capacity` |
| Vehicle cost | `acquisitionCost` | `purchaseCost` |
| License expiry | `licenseExpiryDate` | `expiryDate`, `licenseExpiry` |
| Vehicle FK | `vehicleId` | `vehicle_id`, `vehicleID` |
| Driver FK | `driverId` | `driver_id`, `driverID` |
| Trip weight | `cargoWeight` | `cargo`, `weight` |
| Trip distance | `plannedDistance` | `distance` |
| Maintenance type | `maintenanceType` | `type` |
| Expense date | `expenseDate` | `date` |
| Fuel date | `logDate` | `date`, `fuelDate` |

### Decimal fields

Prisma returns decimal values as **numeric strings** (e.g. `"1250.50"`).
Parse them before arithmetic:

```js
const cost = parseFloat(vehicle.acquisitionCost);
const capacity = parseFloat(vehicle.maxLoadCapacity);
```

### Date fields

All dates are ISO 8601 strings. Format for display:

```js
new Date(trip.dispatchedAt).toLocaleDateString();
```

### Enum values

All status values are `UPPER_SNAKE_CASE` from the API. Map to display labels in the UI layer, not in API calls.

```js
const STATUS_LABELS = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  IN_SHOP: 'In Shop',
  RETIRED: 'Retired',
};
```

### Auth header (Hour 2)

Once auth is implemented, attach the token to every protected request:

```js
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
}
```

---

## Local Development Commands

```bash
# Install all dependencies (root + client + server)
npm run install:all

# Copy environment file (run once)
cp server/.env.example server/.env          # macOS / Linux
Copy-Item server/.env.example server/.env   # Windows PowerShell

# Generate Prisma client
npm run prisma:generate

# Run database migration (requires MySQL running)
npm run prisma:migrate

# Seed initial data (roles)
npm run prisma:seed

# Start both frontend and backend concurrently
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client
```

---

## Branch Model

| Branch | Owner | Purpose |
|--------|-------|---------|
| `main` | Jagdeep | Production-ready releases only |
| `develop` | Jagdeep | Integration branch — all PRs target here |
| `feature/jagdeep-backend` | Jagdeep | Backend foundation (Hour 1) |
| `backend/lacki` | Lacki | Module implementation |
| `frontend/tanya` | Tanya | Frontend implementation |
| `frontend/niharika` | Niharika | Frontend implementation |

**Always pull `develop` before starting new work.**
**Never push directly to `main`.**
