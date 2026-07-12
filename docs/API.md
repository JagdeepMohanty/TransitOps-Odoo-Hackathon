# TransitOps API Contract

> **Status:** Hour 4 complete — Auth, Vehicle, Driver, Trip modules live.
> **Audience:** Jagdeep, Lacki, Tanya, Niharika.

---

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

All endpoints except `POST /auth/login` require a Bearer token.

```
Authorization: Bearer <token>
```

Obtain the token from `POST /auth/login`.

---

## Standard Response Envelopes

Every response uses one of these two shapes — no exceptions.

### Success
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": []
}
```

### Validation Error (HTTP 400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "registrationNumber", "message": "Registration number is required" }
  ]
}
```

### Paginated List
```json
{
  "success": true,
  "message": "Vehicles retrieved successfully.",
  "data": {
    "data": [ ],
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
| 200  | OK |
| 201  | Created |
| 400  | Bad Request / Validation failed |
| 401  | Unauthorized — missing or invalid token |
| 403  | Forbidden — insufficient role |
| 404  | Not Found |
| 409  | Conflict — duplicate or business rule violation |
| 500  | Internal Server Error |

---

## Data Type Conventions

- **IDs** — integers (`1`, `42`)
- **Dates** — ISO 8601 strings (`"2024-06-15T08:30:00.000Z"`)
- **Decimal fields** — returned as numeric strings by Prisma (`"1250.50"`). Use `parseFloat()` before arithmetic.
- **Enum values** — `UPPER_SNAKE_CASE` from API. Map to display labels in the UI layer.

---

## Enum Reference

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

### RoleName
`FLEET_MANAGER` | `DISPATCHER` | `SAFETY_OFFICER` | `FINANCIAL_ANALYST`

---

## Health

### GET /health

No authentication required.

**Response 200:**
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
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>",
    "user": {
      "id": 1,
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
| `maxLoadCapacity` | numeric string | Decimal — use `parseFloat()` |
| `odometer` | numeric string | Decimal — use `parseFloat()` |
| `acquisitionCost` | numeric string | Decimal — use `parseFloat()` |
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
| `status` | VehicleStatus | Filter by exact status |
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
    }
  }
}
```

---

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
      "type": "Truck",
      "maxLoadCapacity": "28000.00",
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
- `status` — NOT accepted on create; always defaults to `AVAILABLE`

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

**Response 404:** Vehicle not found.

**Response 409:** Duplicate registration number.

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
`POST` and `DELETE` require role `FLEET_MANAGER`.
`PUT` requires role `FLEET_MANAGER` or `SAFETY_OFFICER`.

### Driver Object

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Auto-assigned |
| `name` | string | |
| `licenseNumber` | string | Unique |
| `licenseCategory` | string | e.g. `"HGV"`, `"LGV"` |
| `licenseExpiryDate` | ISO 8601 string | Must be a future date |
| `contactNumber` | string | |
| `safetyScore` | integer | 0–100, default 100 |
| `status` | DriverStatus | Default: `AVAILABLE` |
| `createdAt` | ISO 8601 string | |
| `updatedAt` | ISO 8601 string | |

---

### GET /drivers

Returns paginated list of drivers.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | integer | Default: 1 |
| `limit` | integer | Default: 10, max: 100 |
| `status` | DriverStatus | Filter by exact status |
| `search` | string | Searches name, licenseNumber, contactNumber |
| `sortBy` | string | `name`, `status`, `safetyScore`, `licenseExpiryDate`, `createdAt` |
| `sortOrder` | string | `asc` or `desc` (default: `desc`) |

**Example:** `GET /drivers?status=AVAILABLE&search=rajesh&sortBy=safetyScore&sortOrder=desc`

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

Returns all drivers with status `AVAILABLE` AND a non-expired license. Used to populate trip assignment dropdowns.

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
- `licenseExpiryDate` — required, valid date string, must NOT be in the past
- `contactNumber` — required
- `safetyScore` — optional integer 0–100, defaults to 100
- `status` — NOT accepted on create; always defaults to `AVAILABLE`

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

Requires role: `FLEET_MANAGER` or `SAFETY_OFFICER`. All fields optional (partial update).

**Request Body (example):**
```json
{
  "safetyScore": 88,
  "status": "OFF_DUTY"
}
```

**Response 200:** Updated driver object.

**Response 400:** Expired license date supplied.

**Response 404:** Driver not found.

**Response 409:** Duplicate license number.

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

**Response 409:**
```json
{
  "success": false,
  "message": "Driver is already on a trip.",
  "errors": []
}
```

---

## Frontend Integration Notes

### Field Names — Use Exactly These

| ✅ Correct | ❌ Never use |
|-----------|-------------|
| `registrationNumber` | `registrationNo`, `regNumber`, `plate` |
| `maxLoadCapacity` | `maxCapacity`, `capacity` |
| `acquisitionCost` | `purchaseCost`, `cost` |
| `licenseExpiryDate` | `expiryDate`, `licenseExpiry` |
| `licenseCategory` | `category`, `licenseType` |
| `safetyScore` | `score`, `safety` |
| `contactNumber` | `phone`, `contact` |

### Decimal Parsing

```js
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

### Pagination Query Params

```js
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

## Trip Endpoints

All trip endpoints require authentication.
`POST /trips`, `PUT /trips/:id`, `DELETE /trips/:id`, and all lifecycle actions require role `DISPATCHER` or `FLEET_MANAGER`.

### Trip Object

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Auto-assigned |
| `source` | string | Origin location |
| `destination` | string | |
| `vehicleId` | integer | FK → vehicles |
| `driverId` | integer | FK → drivers |
| `cargoWeight` | numeric string | Decimal — use `parseFloat()` |
| `plannedDistance` | numeric string | Decimal — use `parseFloat()` |
| `actualDistance` | numeric string \| null | Set on completion |
| `startOdometer` | numeric string \| null | Captured from vehicle at dispatch |
| `finalOdometer` | numeric string \| null | Set on completion |
| `fuelConsumed` | numeric string \| null | Set on completion |
| `revenue` | numeric string \| null | Optional, set on create or completion |
| `status` | TripStatus | Default: `DRAFT` |
| `dispatchedAt` | ISO 8601 string \| null | |
| `completedAt` | ISO 8601 string \| null | |
| `cancelledAt` | ISO 8601 string \| null | |
| `createdAt` | ISO 8601 string | |
| `updatedAt` | ISO 8601 string | |
| `vehicle` | object | Lean vehicle snapshot |
| `driver` | object | Lean driver snapshot |

---

### GET /trips

Returns paginated list of trips.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | integer | Default: 1 |
| `limit` | integer | Default: 10, max: 100 |
| `status` | TripStatus | Filter by exact status |
| `vehicleId` | integer | Filter by vehicle |
| `driverId` | integer | Filter by driver |
| `dateFrom` | ISO date string | Filter `createdAt >= dateFrom` |
| `dateTo` | ISO date string | Filter `createdAt <= dateTo` |
| `search` | string | Partial match on source or destination |
| `sortBy` | string | `createdAt`, `dispatchedAt`, `completedAt`, `source`, `destination`, `status` |
| `sortOrder` | string | `asc` or `desc` (default: `desc`) |

**Example:** `GET /trips?status=DISPATCHED&sortBy=dispatchedAt&sortOrder=desc`

**Response 200:**
```json
{
  "success": true,
  "message": "Trips retrieved successfully.",
  "data": {
    "data": [
      {
        "id": 1,
        "source": "Mumbai",
        "destination": "Pune",
        "vehicleId": 1,
        "driverId": 1,
        "cargoWeight": "5000.00",
        "plannedDistance": "150.00",
        "actualDistance": null,
        "startOdometer": null,
        "finalOdometer": null,
        "fuelConsumed": null,
        "revenue": null,
        "status": "DRAFT",
        "dispatchedAt": null,
        "completedAt": null,
        "cancelledAt": null,
        "createdAt": "2024-06-15T08:00:00.000Z",
        "updatedAt": "2024-06-15T08:00:00.000Z",
        "vehicle": {
          "id": 1,
          "registrationNumber": "MH12AB1234",
          "name": "Tata Prima",
          "type": "Truck",
          "maxLoadCapacity": "28000.00",
          "status": "AVAILABLE"
        },
        "driver": {
          "id": 1,
          "name": "Rajesh Kumar",
          "licenseNumber": "DL0120230001234",
          "licenseCategory": "HGV",
          "licenseExpiryDate": "2027-03-15T00:00:00.000Z",
          "status": "AVAILABLE"
        }
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

### GET /trips/:id

**Response 200:** Single trip object (same shape as list item).

**Response 404:**
```json
{ "success": false, "message": "Trip not found.", "errors": [] }
```

---

### POST /trips

Requires role: `DISPATCHER` or `FLEET_MANAGER`.

**Request Body:**
```json
{
  "source": "Mumbai",
  "destination": "Pune",
  "vehicleId": 1,
  "driverId": 1,
  "cargoWeight": 5000,
  "plannedDistance": 150,
  "revenue": 12000
}
```

**Field Rules:**
- `source` — required
- `destination` — required
- `vehicleId` — required, vehicle must exist and be `AVAILABLE`
- `driverId` — required, driver must exist, be `AVAILABLE`, and have a valid (non-expired) license
- `cargoWeight` — required, must be > 0, must not exceed vehicle `maxLoadCapacity`
- `plannedDistance` — required, must be > 0
- `revenue` — optional, must be ≥ 0
- `status` — NOT accepted; always set to `DRAFT`

**Response 201:** Created trip object.

**Response 404:** Vehicle or driver not found.

**Response 409 (cargo exceeded):**
```json
{ "success": false, "message": "Cargo weight exceeds vehicle maximum load capacity.", "errors": [] }
```

**Response 409 (vehicle unavailable):**
```json
{ "success": false, "message": "Vehicle is not available for dispatch.", "errors": [] }
```

**Response 409 (driver unavailable):**
```json
{ "success": false, "message": "Driver is not available for dispatch.", "errors": [] }
```

---

### PUT /trips/:id

Requires role: `DISPATCHER` or `FLEET_MANAGER`. Only allowed on `DRAFT` trips. All fields optional.

**Request Body (example):**
```json
{
  "destination": "Nashik",
  "cargoWeight": 4500
}
```

**Business Rules:**
- Changing `vehicleId` re-validates vehicle availability
- Changing `driverId` re-validates driver availability and license
- Changing `cargoWeight` re-validates against current vehicle capacity
- Changing `vehicleId` re-validates cargo against new vehicle capacity

**Response 200:** Updated trip object.

**Response 409:** Trip not in DRAFT status, or business rule violation.

---

### DELETE /trips/:id

Requires role: `DISPATCHER` or `FLEET_MANAGER`.

**Allowed when:** status is `DRAFT` or `CANCELLED`.

**Blocked when:** status is `DISPATCHED` (fleet state locked) or `COMPLETED` (financial records exist).

**Response 200:**
```json
{ "success": true, "message": "Trip deleted successfully.", "data": null }
```

**Response 409:**
```json
{ "success": false, "message": "Invalid trip status for this operation.", "errors": [] }
```

---

### POST /trips/:id/dispatch

Requires role: `DISPATCHER` or `FLEET_MANAGER`.

**No request body required.**

**Business Rules:**
- Trip must be `DRAFT`
- Vehicle must be `AVAILABLE` (not `RETIRED`, `IN_SHOP`, or `ON_TRIP`)
- Driver must be `AVAILABLE` (not `SUSPENDED` or `ON_TRIP`)
- Driver license must not be expired
- All three updates (trip, vehicle, driver) are atomic via Prisma transaction
- `startOdometer` is captured from the vehicle's current odometer at dispatch time

**Response 200:**
```json
{
  "success": true,
  "message": "Trip dispatched successfully.",
  "data": {
    "id": 1,
    "status": "DISPATCHED",
    "dispatchedAt": "2024-06-15T09:00:00.000Z",
    "startOdometer": "12500.00",
    "vehicle": { "status": "ON_TRIP" },
    "driver":  { "status": "ON_TRIP" }
  }
}
```

**Response 409:** Trip not DRAFT, or vehicle/driver not available.

---

### POST /trips/:id/complete

Requires role: `DISPATCHER` or `FLEET_MANAGER`.

**Request Body:**
```json
{
  "actualDistance": 148,
  "fuelConsumed": 22.5,
  "finalOdometer": 12648,
  "revenue": 14500
}
```

**Field Rules:**
- `actualDistance` — required, must be > 0
- `fuelConsumed` — required, must be ≥ 0
- `finalOdometer` — required, must be ≥ 0 and ≥ `startOdometer`
- `revenue` — optional, must be ≥ 0; if omitted, retains value from trip creation

**Business Rules:**
- Trip must be `DISPATCHED`
- `finalOdometer` must be ≥ `startOdometer`
- Vehicle status set to `AVAILABLE`, odometer updated to `finalOdometer`
- Driver status set to `AVAILABLE`
- All updates are atomic via Prisma transaction

**Response 200:**
```json
{
  "success": true,
  "message": "Trip completed successfully.",
  "data": {
    "id": 1,
    "status": "COMPLETED",
    "completedAt": "2024-06-15T17:30:00.000Z",
    "actualDistance": "148.00",
    "fuelConsumed": "22.50",
    "finalOdometer": "12648.00",
    "revenue": "14500.00",
    "vehicle": { "status": "AVAILABLE" },
    "driver":  { "status": "AVAILABLE" }
  }
}
```

**Response 400:** `finalOdometer` less than `startOdometer`.

**Response 409:** Trip not `DISPATCHED`.

---

### POST /trips/:id/cancel

Requires role: `DISPATCHER` or `FLEET_MANAGER`.

**No request body required.**

**Business Rules:**
- Trip must be `DRAFT` or `DISPATCHED`
- If `DRAFT`: simple status update, no fleet state changes
- If `DISPATCHED`: vehicle and driver restored to `AVAILABLE` atomically via Prisma transaction

**Response 200:**
```json
{
  "success": true,
  "message": "Trip cancelled successfully.",
  "data": {
    "id": 1,
    "status": "CANCELLED",
    "cancelledAt": "2024-06-15T10:00:00.000Z"
  }
}
```

**Response 409:** Trip is `COMPLETED` or already `CANCELLED`.

---

## Trip Status Flow

```
DRAFT → DISPATCHED → COMPLETED
  ↓              ↓
CANCELLED    CANCELLED
```

| From | To | Action | Vehicle | Driver |
|------|----|--------|---------|--------|
| DRAFT | DISPATCHED | dispatch | AVAILABLE → ON_TRIP | AVAILABLE → ON_TRIP |
| DISPATCHED | COMPLETED | complete | ON_TRIP → AVAILABLE (odometer updated) | ON_TRIP → AVAILABLE |
| DRAFT | CANCELLED | cancel | no change | no change |
| DISPATCHED | CANCELLED | cancel | ON_TRIP → AVAILABLE | ON_TRIP → AVAILABLE |

---

## Trip Frontend Integration Notes

### Field Names — Use Exactly These

| ✅ Correct | ❌ Never use |
|-----------|-------------|
| `cargoWeight` | `cargo`, `weight`, `load` |
| `plannedDistance` | `distance`, `plannedDist` |
| `actualDistance` | `realDistance`, `tripDistance` |
| `startOdometer` | `odometerStart`, `startOdo` |
| `finalOdometer` | `odometerEnd`, `endOdo` |
| `fuelConsumed` | `fuel`, `fuelUsed` |
| `vehicleId` | `vehicle_id`, `vehicleID` |
| `driverId` | `driver_id`, `driverID` |

### Decimal Parsing

```js
const cargo    = parseFloat(trip.cargoWeight);
const planned  = parseFloat(trip.plannedDistance);
const actual   = parseFloat(trip.actualDistance);
const startOdo = parseFloat(trip.startOdometer);
const finalOdo = parseFloat(trip.finalOdometer);
const fuel     = parseFloat(trip.fuelConsumed);
const revenue  = parseFloat(trip.revenue);
```

### Trip Status Labels

```js
const TRIP_STATUS_LABELS = {
  DRAFT:      'Draft',
  DISPATCHED: 'Dispatched',
  COMPLETED:  'Completed',
  CANCELLED:  'Cancelled',
};

const TRIP_STATUS_COLORS = {
  DRAFT:      'gray',
  DISPATCHED: 'blue',
  COMPLETED:  'green',
  CANCELLED:  'red',
};
```

### Dispatch Modal — Pre-flight Checks

Before showing the Dispatch button, verify:
```js
// Only show dispatch if trip is DRAFT
const canDispatch = trip.status === 'DRAFT';

// Show warning if vehicle or driver is no longer AVAILABLE
const vehicleReady = trip.vehicle.status === 'AVAILABLE';
const driverReady  = trip.driver.status  === 'AVAILABLE';
```

### Complete Modal — Required Fields

```js
// All three are required by the API
const payload = {
  actualDistance: Number(actualDistance),   // > 0
  fuelConsumed:   Number(fuelConsumed),     // >= 0
  finalOdometer:  Number(finalOdometer),    // >= startOdometer
  revenue:        Number(revenue),          // optional, >= 0
};
```

---



| Module | Status |
|--------|--------|
| `GET/POST /maintenance` | 🔜 Hour 5 |
| `POST /maintenance/:id/close` | 🔜 Hour 5 |
| `GET/POST /fuel-logs` | 🔜 Hour 5 |
| `GET/POST /expenses` | 🔜 Hour 5 |
| `GET /dashboard/kpis` | 🔜 Hour 5 |
| `GET /reports/summary` | 🔜 Hour 5 |
| `GET /reports/vehicle-performance` | 🔜 Hour 5 |
| `GET /reports/export/csv` | 🔜 Hour 5 |
