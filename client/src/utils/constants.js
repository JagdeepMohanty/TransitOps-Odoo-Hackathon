// Values MUST match backend UPPER_SNAKE_CASE enums exactly

// ── Vehicle ──────────────────────────────────────────────────
export const VEHICLE_STATUSES = [
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'On Trip',   value: 'ON_TRIP'   },
  { label: 'In Shop',   value: 'IN_SHOP'   },
  { label: 'Retired',   value: 'RETIRED'   },
];

export const VEHICLE_STATUS_LABELS = {
  AVAILABLE: 'Available',
  ON_TRIP:   'On Trip',
  IN_SHOP:   'In Shop',
  RETIRED:   'Retired',
};

export const VEHICLE_TYPES = [
  'Heavy Truck', 'Medium Truck', 'Light Truck', 'Mini Truck',
  'Tanker', 'Trailer', 'Van', 'Bus',
];

// ── Driver ───────────────────────────────────────────────────
export const DRIVER_STATUSES = [
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'On Trip',   value: 'ON_TRIP'   },
  { label: 'Off Duty',  value: 'OFF_DUTY'  },
  { label: 'Suspended', value: 'SUSPENDED' },
];

export const DRIVER_STATUS_LABELS = {
  AVAILABLE:  'Available',
  ON_TRIP:    'On Trip',
  OFF_DUTY:   'Off Duty',
  SUSPENDED:  'Suspended',
};

export const LICENSE_CATEGORIES = ['LMV', 'HMV', 'HGMV', 'HTV', 'PSV', 'Transport'];

// ── Trip ─────────────────────────────────────────────────────
export const TRIP_STATUSES = [
  { label: 'Draft',      value: 'DRAFT'      },
  { label: 'Dispatched', value: 'DISPATCHED' },
  { label: 'Completed',  value: 'COMPLETED'  },
  { label: 'Cancelled',  value: 'CANCELLED'  },
];

// ── Maintenance ──────────────────────────────────────────────
export const MAINTENANCE_STATUSES = [
  { label: 'Active',    value: 'ACTIVE'    },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export const MAINTENANCE_TYPES = [
  'Oil Change', 'Tyre Replacement', 'Brake Service',
  'Engine Overhaul', 'AC Service', 'Battery Replacement',
  'Annual Inspection', 'General Service',
];

// ── Finance ──────────────────────────────────────────────────
export const EXPENSE_TYPES = [
  { label: 'Fuel',        value: 'FUEL'        },
  { label: 'Toll',        value: 'TOLL'        },
  { label: 'Maintenance', value: 'MAINTENANCE' },
  { label: 'Parking',     value: 'PARKING'     },
  { label: 'Repair',      value: 'REPAIR'      },
  { label: 'Other',       value: 'OTHER'       },
];
