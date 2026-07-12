// ── Vehicle ──────────────────────────────────────────────────
export const VEHICLE_STATUSES = [
  { label: 'Available',   value: 'available'   },
  { label: 'On Trip',     value: 'on_trip'     },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Retired',     value: 'retired'     },
];

export const VEHICLE_TYPES = [
  { label: 'Truck',       value: 'truck'       },
  { label: 'Van',         value: 'van'         },
  { label: 'Bus',         value: 'bus'         },
  { label: 'Car',         value: 'car'         },
  { label: 'Motorcycle',  value: 'motorcycle'  },
];

export const FUEL_TYPES = [
  { label: 'Diesel',   value: 'diesel'   },
  { label: 'Petrol',   value: 'petrol'   },
  { label: 'CNG',      value: 'cng'      },
  { label: 'Electric', value: 'electric' },
];

// ── Driver ───────────────────────────────────────────────────
export const DRIVER_STATUSES = [
  { label: 'Active',   value: 'active'   },
  { label: 'Inactive', value: 'inactive' },
  { label: 'On Trip',  value: 'on_trip'  },
];

// ── Trip ─────────────────────────────────────────────────────
export const TRIP_STATUSES = [
  { label: 'Pending',     value: 'pending'     },
  { label: 'Dispatched',  value: 'dispatched'  },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed',   value: 'completed'   },
  { label: 'Cancelled',   value: 'cancelled'   },
];

// ── Maintenance ──────────────────────────────────────────────
export const MAINTENANCE_STATUSES = [
  { label: 'Scheduled',   value: 'scheduled'   },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed',   value: 'completed'   },
  { label: 'Overdue',     value: 'overdue'     },
];

export const MAINTENANCE_TYPES = [
  { label: 'Oil Change',     value: 'oil_change'     },
  { label: 'Tyre Rotation',  value: 'tyre_rotation'  },
  { label: 'Brake Service',  value: 'brake_service'  },
  { label: 'Engine Service', value: 'engine_service' },
  { label: 'General',        value: 'general'        },
];

// ── Finance ──────────────────────────────────────────────────
export const EXPENSE_TYPES = [
  { label: 'Fuel',        value: 'fuel'        },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Toll',        value: 'toll'        },
  { label: 'Insurance',   value: 'insurance'   },
  { label: 'Salary',      value: 'salary'      },
  { label: 'Other',       value: 'other'       },
];

// ── Mock data seeds ──────────────────────────────────────────
export const MOCK_VEHICLES = [
  { id: 'V001', regNo: 'KA-01-AB-1234', type: 'Truck',  make: 'Tata',   model: 'Prima',   year: 2021, status: 'available',   fuel: 'diesel',  km: 45200 },
  { id: 'V002', regNo: 'KA-02-CD-5678', type: 'Van',    make: 'Force',  model: 'Traveller', year: 2020, status: 'on_trip',   fuel: 'diesel',  km: 62100 },
  { id: 'V003', regNo: 'MH-03-EF-9012', type: 'Truck',  make: 'Ashok',  model: 'Leyland', year: 2019, status: 'maintenance', fuel: 'diesel',  km: 98400 },
  { id: 'V004', regNo: 'DL-04-GH-3456', type: 'Bus',    make: 'Volvo',  model: 'B9R',     year: 2022, status: 'available',   fuel: 'diesel',  km: 31000 },
  { id: 'V005', regNo: 'TN-05-IJ-7890', type: 'Car',    make: 'Toyota', model: 'Innova',  year: 2023, status: 'available',   fuel: 'petrol',  km: 12500 },
  { id: 'V006', regNo: 'GJ-06-KL-2345', type: 'Truck',  make: 'Tata',   model: 'Ace',     year: 2018, status: 'retired',     fuel: 'diesel',  km: 180000 },
];

export const MOCK_DRIVERS = [
  { id: 'D001', name: 'Rajesh Kumar',   phone: '+91 98765 43210', license: 'KA-DL-2019-001', status: 'active',   trips: 142, rating: 4.8, joined: '2021-03-15' },
  { id: 'D002', name: 'Suresh Patel',   phone: '+91 87654 32109', license: 'GJ-DL-2018-045', status: 'on_trip',  trips: 98,  rating: 4.6, joined: '2021-07-22' },
  { id: 'D003', name: 'Amit Singh',     phone: '+91 76543 21098', license: 'DL-DL-2020-112', status: 'active',   trips: 67,  rating: 4.9, joined: '2022-01-10' },
  { id: 'D004', name: 'Priya Sharma',   phone: '+91 65432 10987', license: 'MH-DL-2017-089', status: 'inactive', trips: 203, rating: 4.7, joined: '2020-11-05' },
  { id: 'D005', name: 'Vikram Yadav',   phone: '+91 54321 09876', license: 'TN-DL-2021-034', status: 'active',   trips: 55,  rating: 4.5, joined: '2022-06-18' },
];

export const MOCK_TRIPS = [
  { id: 'T1042', vehicle: 'KA-01-AB-1234', driver: 'Rajesh Kumar',  from: 'Bangalore', to: 'Chennai',   status: 'in_progress', date: '2024-01-15', distance: 346, cost: 4200 },
  { id: 'T1041', vehicle: 'KA-02-CD-5678', driver: 'Suresh Patel',  from: 'Mumbai',    to: 'Pune',      status: 'completed',   date: '2024-01-14', distance: 148, cost: 1800 },
  { id: 'T1040', vehicle: 'DL-04-GH-3456', driver: 'Amit Singh',    from: 'Delhi',     to: 'Agra',      status: 'completed',   date: '2024-01-13', distance: 206, cost: 2500 },
  { id: 'T1039', vehicle: 'TN-05-IJ-7890', driver: 'Vikram Yadav',  from: 'Chennai',   to: 'Coimbatore',status: 'completed',   date: '2024-01-12', distance: 498, cost: 6000 },
  { id: 'T1038', vehicle: 'KA-01-AB-1234', driver: 'Rajesh Kumar',  from: 'Bangalore', to: 'Mysore',    status: 'cancelled',   date: '2024-01-11', distance: 145, cost: 0    },
  { id: 'T1037', vehicle: 'MH-03-EF-9012', driver: 'Priya Sharma',  from: 'Pune',      to: 'Nashik',    status: 'completed',   date: '2024-01-10', distance: 212, cost: 2800 },
  { id: 'T1036', vehicle: 'GJ-06-KL-2345', driver: 'Suresh Patel',  from: 'Ahmedabad', to: 'Surat',     status: 'pending',     date: '2024-01-16', distance: 265, cost: 3200 },
];

export const MOCK_MAINTENANCE = [
  { id: 'M001', vehicle: 'KA-01-AB-1234', type: 'Oil Change',     status: 'completed',   date: '2024-01-10', cost: 2500,  notes: 'Engine oil + filter replaced' },
  { id: 'M002', vehicle: 'MH-03-EF-9012', type: 'Brake Service',  status: 'in_progress', date: '2024-01-15', cost: 8000,  notes: 'Front brake pads worn out'     },
  { id: 'M003', vehicle: 'KA-02-CD-5678', type: 'Tyre Rotation',  status: 'scheduled',   date: '2024-01-20', cost: 1200,  notes: 'Scheduled rotation'            },
  { id: 'M004', vehicle: 'DL-04-GH-3456', type: 'Engine Service', status: 'overdue',     date: '2024-01-05', cost: 15000, notes: 'Major service overdue'         },
  { id: 'M005', vehicle: 'TN-05-IJ-7890', type: 'General',        status: 'scheduled',   date: '2024-01-25', cost: 3000,  notes: 'Routine check-up'              },
];

export const MOCK_EXPENSES = [
  { id: 'E001', type: 'fuel',        vehicle: 'KA-01-AB-1234', amount: 4500,  date: '2024-01-15', description: 'Diesel fill-up — Bangalore'   },
  { id: 'E002', type: 'maintenance', vehicle: 'MH-03-EF-9012', amount: 8000,  date: '2024-01-15', description: 'Brake service'                },
  { id: 'E003', type: 'toll',        vehicle: 'KA-02-CD-5678', amount: 320,   date: '2024-01-14', description: 'Mumbai-Pune expressway toll'   },
  { id: 'E004', type: 'insurance',   vehicle: 'DL-04-GH-3456', amount: 45000, date: '2024-01-01', description: 'Annual insurance premium'      },
  { id: 'E005', type: 'fuel',        vehicle: 'TN-05-IJ-7890', amount: 3200,  date: '2024-01-12', description: 'Petrol fill-up — Chennai'      },
  { id: 'E006', type: 'other',       vehicle: 'KA-01-AB-1234', amount: 1500,  date: '2024-01-10', description: 'Parking charges'              },
];

export const MOCK_FUEL_LOGS = [
  { id: 'F001', vehicle: 'KA-01-AB-1234', driver: 'Rajesh Kumar',  liters: 80,  pricePerL: 92.5, total: 7400, odometer: 45200, date: '2024-01-15', station: 'HP Petrol, Bangalore' },
  { id: 'F002', vehicle: 'KA-02-CD-5678', driver: 'Suresh Patel',  liters: 60,  pricePerL: 91.0, total: 5460, odometer: 62100, date: '2024-01-14', station: 'BPCL, Mumbai'         },
  { id: 'F003', vehicle: 'DL-04-GH-3456', driver: 'Amit Singh',    liters: 120, pricePerL: 93.0, total: 11160,odometer: 31000, date: '2024-01-13', station: 'IOC, Delhi'           },
  { id: 'F004', vehicle: 'TN-05-IJ-7890', driver: 'Vikram Yadav',  liters: 45,  pricePerL: 102.0,total: 4590, odometer: 12500, date: '2024-01-12', station: 'HP Petrol, Chennai'   },
  { id: 'F005', vehicle: 'KA-01-AB-1234', driver: 'Rajesh Kumar',  liters: 75,  pricePerL: 92.0, total: 6900, odometer: 44800, date: '2024-01-08', station: 'BPCL, Mysore'         },
];
