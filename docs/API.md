# TransitOps API Contract

<<<<<<< Updated upstream
> **Audience:** Jagdeep (Backend Lead), Lacki (Backend), Tanya & Niharika (Frontend)
> **Status:** Hour 1 foundation complete. All module endpoints return HTTP 501 until implemented.
=======
> **Status:** Hour 3 complete — Auth, Vehicle, Driver modules live.
> **Audience:** All team members — Jagdeep, Lacki, Tanya, Niharika.
>>>>>>> Stashed changes

---

## Base URL

```
http://localhost:5000/api
```

---

<<<<<<< Updated upstream
## Authentication Header

Reserved for Hour 2. All protected routes will require:
=======
## Authentication

All endpoints except `POST /auth/login` require a Bearer token.
>>>>>>> Stashed changes

```
Authorization: Bearer <token>
```

<<<<<<< Updated upstream
=======
Obtain the token from `POST /auth/login`.

>>>>>>> Stashed changes
---

## Standard Response Envelopes

<<<<<<< Updated upstream
Every response from this API — success or failure — uses one of these two shapes. No exceptions.

### Success

```json
{
  "success": true,
  "message": "Operation completed successfully",
=======
Every response uses one of these two shapes — no exceptions.

### Success
```json
{
  "success": true,
  "message": "Human-readable message",
>>>>>>> Stashed changes
  "data": {}
}
```

### Error
<<<<<<< Updated upstream

```json
{
  "success": false,
  "message": "Clear error message",
=======
```json
{
  "success": false,
  "message": "Human-readable error message",
>>>>>>> Stashed changes
  "errors": []
}
```

<<<<<<< Updated upstream
The `errors` array contains field-level validation details when applicable:

=======
### Validation Error (HTTP 400)
>>>>>>> Stashed changes
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
<<<<<<< Updated upstream
    { "field": "email", "message": "Invalid email address" }
=======
    { "field": "registrationNumber", "message": "Registration number is required" }
>>>>>>> Stashed changes
  ]
}
```

<<<<<<< Updated upstream
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
=======
### Paginated List
```json
{
  "success": true,
  "message": "Vehicles retrieved successfully.",
  "data": {
    "data": [ ...items ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request / Validation failed |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient role |
| 404 | Not Found |
| 409 | Conflict — duplicate or business rule violation |
| 500 | Internal Server Error |
>>>>>>> Stashed changes

---

## Data Type Conventions

<<<<<<< Updated upstream
- **IDs** are integers (`1`, `42`, not `"1"`)
- **Dates** are ISO 8601 strings in all API responses: `"2024-06-15T08:30:00.000Z"`
- **Decimal fields** (costs, distances, weights) are returned as numeric strings by Prisma (e.g. `"1250.50"`). The frontend must parse these with `parseFloat()` before arithmetic. **Both teams must not change this without discussion.**
- **Enum values** use `UPPER_SNAKE_CASE` internally. UI may display them as title case.
- **Pagination** (when implemented): `page`, `limit`, `total`, `totalPages` inside `data`.
=======
- **IDs** — integers (`1`, `42`)
- **Dates** — ISO 8601 strings (`"2024-06-15T08:30:00.000Z"`)
- **Decimal fields** — returned as numeric strings by Prisma (`"1250.50"`). Use `parseFloat()` before arithmetic.
- **Enum values** — `UPPER_SNAKE_CASE` from API. Map to display labels in the UI layer.
>>>>>>> Stashed changes

---

## Enum Reference

<<<<<<< Updated upstream
### RoleName
`FLEET_MANAGER` | `DISPATCHER` | `SAFETY_OFFICER` | `FINANCIAL_ANALYST`

=======
>>>>>>> Stashed changes
### VehicleStatus
`AVAILABLE` | `ON_TRIP` | `IN_SHOP` | `RETIRED`

### DriverStatus
`AVAILABLE` | `ON_TRIP` | `OFF_DUTY` | `SUSPENDED`

<<<<<<< Updated upstream
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
=======
### RoleName
`FLEET_MANAGER` | `DISPATCHER` | `SAFETY_OFFICER` | `FINANCIAL_ANALYST`

---

## Auth Endpoints

### POST /auth/login

No authentication required.

**Request:**
```json
{
  "email": "fleet@transitops.com",
  "password": "Fleet@123"
}
```

**Response 200:**
>>>>>>> Stashed changes
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>",
    "user": {
      "id": 1,
<<<<<<< Updated upstream
      "name": "Jagdeep Singh",
      "email": "manager@transitops.com",
      "role": "FLEET_MANAGER"
=======
      "name": "Fleet Manager",
      "email": "fleet@transitops.com",
      "role": { "name": "FLEET_MANAGER" }
    }
  }
}
```

**Response 401:**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "errors": []
}
```

---

### GET /auth/me

Requires: Bearer token.

**Response 200:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "Fleet Manager",
    "email": "fleet@transitops.com",
    "roleId": 1,
    "role": { "name": "FLEET_MANAGER" },
    "createdAt": "2024-06-15T08:00:00.000Z",
    "updatedAt": "2024-06-15T08:00:00.000Z"
  }
}
```

---

### POST /auth/logout

Requires: Bearer token.

**Response 200:**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

---

## Vehicle Endpoints

All vehicle endpoints require authentication.
Write operations (`POST`, `PUT`, `DELETE`) require role `FLEET_MANAGER`.

### Vehicle Object

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Auto-assigned |
| `registrationNumber` | string | Unique, max 50 chars |
| `name` | string | |
| `model` | string \| null | |
| `type` | string | e.g. `"Truck"`, `"Van"` |
| `region` | string \| null | e.g. `"North"` |
| `maxLoadCapacity` | numeric string | Decimal — parse with `parseFloat()` |
| `odometer` | numeric string | Decimal — parse with `parseFloat()` |
| `acquisitionCost` | numeric string | Decimal — parse with `parseFloat()` |
| `status` | VehicleStatus | Default: `AVAILABLE` |
| `createdAt` | ISO 8601 string | |
| `updatedAt` | ISO 8601 string | |

---

### GET /vehicles

Returns paginated list of vehicles.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | integer | Default: 1 |
| `limit` | integer | Default: 10, max: 100 |
| `status` | VehicleStatus | Filter by status |
| `type` | string | Partial match on type |
| `region` | string | Partial match on region |
| `search` | string | Searches name, registrationNumber, type, region |
| `sortBy` | string | `name`, `status`, `type`, `region`, `createdAt`, `odometer` |
| `sortOrder` | string | `asc` or `desc` (default: `desc`) |

**Example:** `GET /vehicles?status=AVAILABLE&search=truck&page=1&limit=10`

**Response 200:**
```json
{
  "success": true,
  "message": "Vehicles retrieved successfully.",
  "data": {
    "data": [
      {
        "id": 1,
        "registrationNumber": "MH12AB1234",
        "name": "Tata Prima",
        "model": "Prima 4028.S",
        "type": "Truck",
        "region": "West",
        "maxLoadCapacity": "28000.00",
        "odometer": "12500.00",
        "acquisitionCost": "3500000.00",
        "status": "AVAILABLE",
        "createdAt": "2024-06-15T08:00:00.000Z",
        "updatedAt": "2024-06-15T08:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
>>>>>>> Stashed changes
    }
  }
}
```

---

<<<<<<< Updated upstream
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
=======
### GET /vehicles/available

Returns all vehicles with status `AVAILABLE`. No pagination — used to populate dropdowns.

**Response 200:**
```json
{
  "success": true,
  "message": "Available vehicles retrieved successfully.",
  "data": [
    {
      "id": 1,
      "registrationNumber": "MH12AB1234",
      "name": "Tata Prima",
      "status": "AVAILABLE"
    }
  ]
}
```

---

### GET /vehicles/:id

**Response 200:** Single vehicle object (same shape as list item).

**Response 404:**
```json
{
  "success": false,
  "message": "Vehicle not found.",
  "errors": []
}
```

---

### POST /vehicles

Requires role: `FLEET_MANAGER`.

**Request Body:**
```json
{
  "registrationNumber": "MH12AB1234",
  "name": "Tata Prima",
  "model": "Prima 4028.S",
  "type": "Truck",
  "region": "West",
  "maxLoadCapacity": 28000,
  "acquisitionCost": 3500000,
  "odometer": 0
}
```

**Field Rules:**
- `registrationNumber` — required, unique, max 50 chars
- `name` — required
- `type` — required
- `maxLoadCapacity` — required, must be > 0
- `acquisitionCost` — required, must be > 0
- `odometer` — optional, must be ≥ 0, defaults to 0
- `model`, `region` — optional

**Response 201:** Created vehicle object.

**Response 409:**
```json
{
  "success": false,
  "message": "Vehicle registration number already exists.",
  "errors": []
}
```

---

### PUT /vehicles/:id

Requires role: `FLEET_MANAGER`. All fields optional (partial update).

**Request Body (example — update status and odometer):**
```json
{
  "status": "RETIRED",
  "odometer": 150000
}
```

**Response 200:** Updated vehicle object.

---

### DELETE /vehicles/:id

Requires role: `FLEET_MANAGER`.

**Business Rules — deletion blocked when:**
- Vehicle status is `ON_TRIP`
- Vehicle status is `IN_SHOP`
- Vehicle has an active trip (`DRAFT` or `DISPATCHED`)
- Vehicle has an active maintenance record

**Response 200:**
```json
{
  "success": true,
  "message": "Vehicle deleted successfully.",
  "data": null
}
```

**Response 409:**
```json
{
  "success": false,
  "message": "Vehicle is already on a trip.",
  "errors": []
}
```

---

## Driver Endpoints

All driver endpoints require authentication.
Write operations (`POST`, `PUT`, `DELETE`) require role `FLEET_MANAGER`.

### Driver Object
>>>>>>> Stashed changes

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Auto-assigned |
| `name` | string | |
| `licenseNumber` | string | Unique |
<<<<<<< Updated upstream
| `licenseCategory` | string | e.g. "HGV", "LGV" |
| `licenseExpiryDate` | ISO 8601 string | |
=======
| `licenseCategory` | string | e.g. `"HGV"`, `"LGV"` |
| `licenseExpiryDate` | ISO 8601 string | Must be a future date |
>>>>>>> Stashed changes
| `contactNumber` | string | |
| `safetyScore` | integer | 0–100, default 100 |
| `status` | DriverStatus | Default: `AVAILABLE` |
| `createdAt` | ISO 8601 string | |
| `updatedAt` | ISO 8601 string | |

---

<<<<<<< Updated upstream
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
=======
### GET /drivers

Returns paginated list of drivers.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | integer | Default: 1 |
| `limit` | integer | Default: 10, max: 100 |
| `status` | DriverStatus | Filter by status |
| `search` | string | Searches name, licenseNumber, contactNumber |
| `sortBy` | string | `name`, `status`, `safetyScore`, `licenseExpiryDate`, `createdAt` |
| `sortOrder` | string | `asc` or `desc` (default: `desc`) |

**Example:** `GET /drivers?status=AVAILABLE&search=john&sortBy=safetyScore&sortOrder=desc`

**Response 200:**
```json
{
  "success": true,
  "message": "Drivers retrieved successfully.",
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Rajesh Kumar",
        "licenseNumber": "DL0120230001234",
        "licenseCategory": "HGV",
        "licenseExpiryDate": "2027-03-15T00:00:00.000Z",
        "contactNumber": "9876543210",
        "safetyScore": 95,
        "status": "AVAILABLE",
        "createdAt": "2024-06-15T08:00:00.000Z",
        "updatedAt": "2024-06-15T08:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

### GET /drivers/available

Returns all drivers with status `AVAILABLE` AND a valid (non-expired) license. Used to populate trip assignment dropdowns.

**Response 200:**
```json
{
  "success": true,
  "message": "Available drivers retrieved successfully.",
  "data": [
    {
      "id": 1,
      "name": "Rajesh Kumar",
      "licenseNumber": "DL0120230001234",
      "licenseCategory": "HGV",
      "licenseExpiryDate": "2027-03-15T00:00:00.000Z",
      "status": "AVAILABLE"
    }
  ]
}
```

---

### GET /drivers/:id

**Response 200:** Single driver object.

**Response 404:**
```json
{
  "success": false,
  "message": "Driver not found.",
  "errors": []
}
```

---

### POST /drivers

Requires role: `FLEET_MANAGER`.

**Request Body:**
```json
{
  "name": "Rajesh Kumar",
  "licenseNumber": "DL0120230001234",
  "licenseCategory": "HGV",
  "licenseExpiryDate": "2027-03-15",
  "contactNumber": "9876543210",
  "safetyScore": 95
}
```

**Field Rules:**
- `name` — required
- `licenseNumber` — required, unique
- `licenseCategory` — required
- `licenseExpiryDate` — required, must be a valid date, must NOT be in the past
- `contactNumber` — required
- `safetyScore` — optional integer 0–100, defaults to 100

**Response 201:** Created driver object.

**Response 400 (expired license):**
```json
{
  "success": false,
  "message": "Driver license has expired.",
  "errors": []
}
```

**Response 409 (duplicate license):**
```json
{
  "success": false,
  "message": "Driver license number already exists.",
  "errors": []
}
```

---

### PUT /drivers/:id

Requires role: `FLEET_MANAGER`. All fields optional (partial update).

**Request Body (example):**
```json
{
  "safetyScore": 88,
  "status": "OFF_DUTY"
}
```

**Response 200:** Updated driver object.

---

### DELETE /drivers/:id

Requires role: `FLEET_MANAGER`.

**Business Rules — deletion blocked when:**
- Driver status is `ON_TRIP`
- Driver has an active trip (`DRAFT` or `DISPATCHED`)

**Response 200:**
```json
{
  "success": true,
  "message": "Driver deleted successfully.",
  "data": null
}
```

---

## Frontend Integration Notes

### Field Names — Use Exactly These
>>>>>>> Stashed changes

| ✅ Correct | ❌ Never use |
|-----------|-------------|
| `registrationNumber` | `registrationNo`, `regNumber`, `plate` |
<<<<<<< Updated upstream
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
=======
| `maxLoadCapacity` | `maxCapacity`, `capacity` |
| `acquisitionCost` | `purchaseCost`, `cost` |
| `licenseExpiryDate` | `expiryDate`, `licenseExpiry` |
| `licenseCategory` | `category`, `licenseType` |
| `safetyScore` | `score`, `safety` |
| `contactNumber` | `phone`, `contact` |

### Decimal Parsing

```js
// Always parse Prisma decimal strings before arithmetic
const capacity = parseFloat(vehicle.maxLoadCapacity);
const cost     = parseFloat(vehicle.acquisitionCost);
const odometer = parseFloat(vehicle.odometer);
```

### Status Display Mapping

```js
const VEHICLE_STATUS_LABELS = {
  AVAILABLE: 'Available',
  ON_TRIP:   'On Trip',
  IN_SHOP:   'In Shop',
  RETIRED:   'Retired',
};

const DRIVER_STATUS_LABELS = {
  AVAILABLE:  'Available',
  ON_TRIP:    'On Trip',
  OFF_DUTY:   'Off Duty',
  SUSPENDED:  'Suspended',
};
```

### Pagination

```js
// Query params for list endpoints
const params = new URLSearchParams({
  page:      currentPage,
  limit:     10,
  status:    selectedStatus,   // optional
  search:    searchTerm,       // optional
  sortBy:    'createdAt',      // optional
  sortOrder: 'desc',           // optional
});
```

### Error Handling Pattern

```js
try {
  const res = await api.post('/vehicles', payload);
  // res.data.success === true
} catch (err) {
  const { message, errors } = err.response.data;
  // Show message to user
  // Map errors[] to form field errors if present
}
```

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Fleet Manager | `fleet@transitops.com` | `Fleet@123` |
| Dispatcher | `dispatcher@transitops.com` | `Dispatcher@123` |
| Safety Officer | `safety@transitops.com` | `Safety@123` |
| Finance Analyst | `finance@transitops.com` | `Finance@123` |

---

## Planned Endpoints (Hour 4+)

| Module | Status |
|--------|--------|
| `GET/POST /trips` | 🔜 Hour 4 |
| `POST /trips/:id/dispatch` | 🔜 Hour 4 |
| `POST /trips/:id/complete` | 🔜 Hour 4 |
| `GET/POST /maintenance` | 🔜 Hour 4 |
| `GET/POST /fuel-logs` | 🔜 Hour 4 |
| `GET/POST /expenses` | 🔜 Hour 4 |
| `GET /dashboard/kpis` | 🔜 Hour 4 |
| `GET /reports/summary` | 🔜 Hour 4 |
>>>>>>> Stashed changes
