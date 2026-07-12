# TransitOps API Contract

> **Audience:** Jagdeep (Backend Lead), Lacki (Backend), Tanya & Niharika (Frontend)
> **Status:** Hour 1 foundation complete. All module endpoints return HTTP 501 until implemented.

---

## Base URL

```
http://localhost:5000/api
```

---

## Authentication Header

Reserved for Hour 2. All protected routes will require:

```
Authorization: Bearer <token>
```

---

## Standard Response Envelopes

Every response from this API — success or failure — uses one of these two shapes. No exceptions.

### Success

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Clear error message",
  "errors": []
}
```

The `errors` array contains field-level validation details when applicable:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

---

## HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | OK — request succeeded |
| 201 | Created — resource created |
| 204 | No Content — deleted successfully |
| 400 | Bad Request — validation or malformed input |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — authenticated but insufficient role |
| 404 | Not Found — resource does not exist |
| 409 | Conflict — unique constraint violation |
| 500 | Internal Server Error — unexpected failure |
| 501 | Not Implemented — module pending Hour 2+ |

---

## Data Type Conventions

- **IDs** are integers (`1`, `42`, not `"1"`)
- **Dates** are ISO 8601 strings in all API responses: `"2024-06-15T08:30:00.000Z"`
- **Decimal fields** (costs, distances, weights) are returned as numeric strings by Prisma (e.g. `"1250.50"`). The frontend must parse these with `parseFloat()` before arithmetic. **Both teams must not change this without discussion.**
- **Enum values** use `UPPER_SNAKE_CASE` internally. UI may display them as title case.
- **Pagination** (when implemented): `page`, `limit`, `total`, `totalPages` inside `data`.

---

## Enum Reference

### RoleName
`FLEET_MANAGER` | `DISPATCHER` | `SAFETY_OFFICER` | `FINANCIAL_ANALYST`

### VehicleStatus
`AVAILABLE` | `ON_TRIP` | `IN_SHOP` | `RETIRED`

### DriverStatus
`AVAILABLE` | `ON_TRIP` | `OFF_DUTY` | `SUSPENDED`

### TripStatus
`DRAFT` | `DISPATCHED` | `COMPLETED` | `CANCELLED`

### MaintenanceStatus
`ACTIVE` | `COMPLETED` | `CANCELLED`

### ExpenseType
`FUEL` | `TOLL` | `MAINTENANCE` | `PARKING` | `REPAIR` | `OTHER`

---

## Endpoints

### Health

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/health` | None | ✅ Live |

**Response:**
```json
{
  "success": true,
  "message": "TransitOps API is running",
  "data": {
    "status": "healthy",
    "database": "connected",
    "timestamp": "2024-06-15T08:30:00.000Z",
    "environment": "development"
  }
}
```

---

### Authentication

| Method | Path | Auth | Status |
|--------|------|------|--------|
| POST | `/auth/login` | None | 🔜 Hour 2 |
| GET | `/auth/me` | Bearer | 🔜 Hour 2 |

**POST /auth/login — Request body:**
```json
{
  "email": "manager@transitops.com",
  "password": "securepassword"
}
```

**POST /auth/login — Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>",
    "user": {
      "id": 1,
      "name": "Jagdeep Singh",
      "email": "manager@transitops.com",
      "role": "FLEET_MANAGER"
    }
  }
}
```

---

### Dashboard

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/dashboard/kpis` | Bearer | 🔜 Hour 2 |

---

### Vehicles

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/vehicles` | Bearer | 🔜 Hour 2 |
| POST | `/vehicles` | Bearer | 🔜 Hour 2 |
| GET | `/vehicles/available` | Bearer | 🔜 Hour 2 |
| GET | `/vehicles/:id` | Bearer | 🔜 Hour 2 |
| PUT | `/vehicles/:id` | Bearer | 🔜 Hour 2 |
| DELETE | `/vehicles/:id` | Bearer | 🔜 Hour 2 |

**Vehicle object fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Auto-assigned |
| `registrationNumber` | string | Unique |
| `name` | string | |
| `model` | string \| null | |
| `type` | string | e.g. "Truck", "Van" |
| `region` | string \| null | |
| `maxLoadCapacity` | numeric string | Decimal(10,2) |
| `odometer` | numeric string | Decimal(12,2), default "0" |
| `acquisitionCost` | numeric string | Decimal(12,2) |
| `status` | VehicleStatus | Default: `AVAILABLE` |
| `createdAt` | ISO 8601 string | |
| `updatedAt` | ISO 8601 string | |

---

### Drivers

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/drivers` | Bearer | 🔜 Hour 2 |
| POST | `/drivers` | Bearer | 🔜 Hour 2 |
| GET | `/drivers/available` | Bearer | 🔜 Hour 2 |
| GET | `/drivers/:id` | Bearer | 🔜 Hour 2 |
| PUT | `/drivers/:id` | Bearer | 🔜 Hour 2 |
| DELETE | `/drivers/:id` | Bearer | 🔜 Hour 2 |

**Driver object fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Auto-assigned |
| `name` | string | |
| `licenseNumber` | string | Unique |
| `licenseCategory` | string | e.g. "HGV", "LGV" |
| `licenseExpiryDate` | ISO 8601 string | |
| `contactNumber` | string | |
| `safetyScore` | integer | 0–100, default 100 |
| `status` | DriverStatus | Default: `AVAILABLE` |
| `createdAt` | ISO 8601 string | |
| `updatedAt` | ISO 8601 string | |

---

### Trips

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/trips` | Bearer | 🔜 Hour 2 |
| POST | `/trips` | Bearer | 🔜 Hour 2 |
| GET | `/trips/:id` | Bearer | 🔜 Hour 2 |
| PUT | `/trips/:id` | Bearer | 🔜 Hour 2 |
| POST | `/trips/:id/dispatch` | Bearer | 🔜 Hour 2 |
| POST | `/trips/:id/complete` | Bearer | 🔜 Hour 2 |
| POST | `/trips/:id/cancel` | Bearer | 🔜 Hour 2 |

**Trip object fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Auto-assigned |
| `source` | string | Origin location |
| `destination` | string | |
| `vehicleId` | integer | FK → vehicles |
| `driverId` | integer | FK → drivers |
| `cargoWeight` | numeric string | Decimal(10,2) |
| `plannedDistance` | numeric string | Decimal(10,2) |
| `actualDistance` | numeric string \| null | Set on completion |
| `startOdometer` | numeric string \| null | Set on dispatch |
| `finalOdometer` | numeric string \| null | Set on completion |
| `fuelConsumed` | numeric string \| null | Set on completion |
| `revenue` | numeric string \| null | |
| `status` | TripStatus | Default: `DRAFT` |
| `dispatchedAt` | ISO 8601 string \| null | |
| `completedAt` | ISO 8601 string \| null | |
| `cancelledAt` | ISO 8601 string \| null | |
| `createdAt` | ISO 8601 string | |
| `updatedAt` | ISO 8601 string | |

---

### Maintenance

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/maintenance` | Bearer | 🔜 Hour 2 |
| POST | `/maintenance` | Bearer | 🔜 Hour 2 |
| PUT | `/maintenance/:id` | Bearer | 🔜 Hour 2 |
| POST | `/maintenance/:id/close` | Bearer | 🔜 Hour 2 |

**Maintenance object fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Auto-assigned |
| `vehicleId` | integer | FK → vehicles |
| `maintenanceType` | string | e.g. "Oil Change", "Brake Repair" |
| `description` | string \| null | |
| `startDate` | ISO 8601 string | |
| `endDate` | ISO 8601 string \| null | Set on close |
| `cost` | numeric string | Decimal(12,2), default "0" |
| `status` | MaintenanceStatus | Default: `ACTIVE` |
| `notes` | string \| null | |
| `createdAt` | ISO 8601 string | |
| `updatedAt` | ISO 8601 string | |

---

### Fuel Logs

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/fuel-logs` | Bearer | 🔜 Hour 2 |
| POST | `/fuel-logs` | Bearer | 🔜 Hour 2 |

**Fuel log object fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Auto-assigned |
| `vehicleId` | integer | FK → vehicles |
| `tripId` | integer \| null | FK → trips (optional) |
| `liters` | numeric string | Decimal(10,2) |
| `cost` | numeric string | Decimal(12,2) |
| `logDate` | ISO 8601 string | |
| `odometer` | numeric string \| null | Decimal(12,2) |
| `createdAt` | ISO 8601 string | |

---

### Expenses

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/expenses` | Bearer | 🔜 Hour 2 |
| POST | `/expenses` | Bearer | 🔜 Hour 2 |

**Expense object fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Auto-assigned |
| `vehicleId` | integer | FK → vehicles |
| `tripId` | integer \| null | FK → trips (optional) |
| `type` | ExpenseType | |
| `amount` | numeric string | Decimal(12,2) |
| `description` | string \| null | |
| `expenseDate` | ISO 8601 string | |
| `createdAt` | ISO 8601 string | |

---

### Reports

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/reports/summary` | Bearer | 🔜 Hour 3 |
| GET | `/reports/vehicle-performance` | Bearer | 🔜 Hour 3 |
| GET | `/reports/export/csv` | Bearer | 🔜 Hour 3 |

---

## Field Naming — Critical Rules

The following canonical field names are locked. **Do not use alternate names.**

| ✅ Correct | ❌ Never use |
|-----------|-------------|
| `registrationNumber` | `registrationNo`, `regNumber`, `plate` |
| `maxLoadCapacity` | `maxCapacity`, `loadCapacity`, `capacity` |
| `acquisitionCost` | `purchaseCost`, `buyCost` |
| `licenseExpiryDate` | `expiryDate`, `licenseExpiry`, `expiry` |
| `vehicleId` | `vehicle_id`, `vehicleID` |
| `driverId` | `driver_id`, `driverID` |
| `cargoWeight` | `cargo`, `weight`, `load` |
| `plannedDistance` | `distance`, `plannedDist` |
| `maintenanceType` | `type` (when on a maintenance object) |
| `expenseDate` | `date`, `expDate` |
| `logDate` | `date`, `fuelDate` |
