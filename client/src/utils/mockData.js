// ─── Centralized mock data for all pages ─────────────────────

export const MOCK_VEHICLES = [
  { id: 'V001', plate: 'KA-01-AB-1234', make: 'Tata',    model: 'Prima 4028.S', year: 2021, type: 'Heavy Truck',  status: 'available',   driver: 'Ravi Kumar',    fuel: 'Diesel', mileage: 48200, lastService: '2024-11-10' },
  { id: 'V002', plate: 'KA-02-CD-5678', make: 'Ashok',   model: 'Leyland 2518', year: 2020, type: 'Medium Truck', status: 'on_trip',     driver: 'Suresh Nair',   fuel: 'Diesel', mileage: 72100, lastService: '2024-10-22' },
  { id: 'V003', plate: 'MH-03-EF-9012', make: 'Eicher',  model: 'Pro 6031',     year: 2022, type: 'Light Truck',  status: 'maintenance', driver: 'Unassigned',    fuel: 'Diesel', mileage: 31500, lastService: '2024-12-01' },
  { id: 'V004', plate: 'DL-04-GH-3456', make: 'Mahindra',model: 'Blazo X 35',   year: 2019, type: 'Heavy Truck',  status: 'available',   driver: 'Amit Sharma',   fuel: 'Diesel', mileage: 95400, lastService: '2024-09-15' },
  { id: 'V005', plate: 'TN-05-IJ-7890', make: 'Tata',    model: 'LPT 1613',     year: 2023, type: 'Medium Truck', status: 'available',   driver: 'Priya Menon',   fuel: 'CNG',    mileage: 12300, lastService: '2024-12-10' },
  { id: 'V006', plate: 'GJ-06-KL-2345', make: 'Volvo',   model: 'FH 500',       year: 2021, type: 'Heavy Truck',  status: 'on_trip',     driver: 'Deepak Verma',  fuel: 'Diesel', mileage: 58700, lastService: '2024-11-28' },
  { id: 'V007', plate: 'RJ-07-MN-6789', make: 'Ashok',   model: 'Leyland 1616', year: 2018, type: 'Light Truck',  status: 'retired',     driver: 'Unassigned',    fuel: 'Diesel', mileage: 142000,lastService: '2024-06-01' },
  { id: 'V008', plate: 'UP-08-OP-0123', make: 'Eicher',  model: 'Pro 3015',     year: 2022, type: 'Light Truck',  status: 'available',   driver: 'Kavya Reddy',   fuel: 'Diesel', mileage: 27800, lastService: '2024-12-05' },
];

export const MOCK_DRIVERS = [
  { id: 'D001', name: 'Ravi Kumar',    phone: '+91-98765-43210', email: 'ravi.kumar@transitops.com',    license: 'KA-DL-2019-001234', licenseExpiry: '2026-03-15', status: 'active',   vehicle: 'KA-01-AB-1234', trips: 142, rating: 4.8, joined: '2020-01-15' },
  { id: 'D002', name: 'Suresh Nair',   phone: '+91-87654-32109', email: 'suresh.nair@transitops.com',   license: 'KL-DL-2018-005678', licenseExpiry: '2025-07-20', status: 'on_trip',  vehicle: 'KA-02-CD-5678', trips: 98,  rating: 4.6, joined: '2021-03-10' },
  { id: 'D003', name: 'Amit Sharma',   phone: '+91-76543-21098', email: 'amit.sharma@transitops.com',   license: 'DL-DL-2020-009012', licenseExpiry: '2027-11-30', status: 'active',   vehicle: 'DL-04-GH-3456', trips: 215, rating: 4.9, joined: '2019-06-22' },
  { id: 'D004', name: 'Priya Menon',   phone: '+91-65432-10987', email: 'priya.menon@transitops.com',   license: 'TN-DL-2021-003456', licenseExpiry: '2026-09-10', status: 'active',   vehicle: 'TN-05-IJ-7890', trips: 67,  rating: 4.7, joined: '2022-02-14' },
  { id: 'D005', name: 'Deepak Verma',  phone: '+91-54321-09876', email: 'deepak.verma@transitops.com',  license: 'GJ-DL-2017-007890', licenseExpiry: '2025-02-28', status: 'on_trip',  vehicle: 'GJ-06-KL-2345', trips: 178, rating: 4.5, joined: '2020-09-01' },
  { id: 'D006', name: 'Kavya Reddy',   phone: '+91-43210-98765', email: 'kavya.reddy@transitops.com',   license: 'AP-DL-2022-001122', licenseExpiry: '2028-05-15', status: 'active',   vehicle: 'UP-08-OP-0123', trips: 34,  rating: 4.9, joined: '2023-01-08' },
  { id: 'D007', name: 'Mohan Das',     phone: '+91-32109-87654', email: 'mohan.das@transitops.com',     license: 'WB-DL-2016-003344', licenseExpiry: '2024-12-31', status: 'inactive', vehicle: 'Unassigned',    trips: 312, rating: 4.3, joined: '2018-11-20' },
  { id: 'D008', name: 'Sunita Patel',  phone: '+91-21098-76543', email: 'sunita.patel@transitops.com',  license: 'GJ-DL-2020-005566', licenseExpiry: '2026-08-22', status: 'active',   vehicle: 'Unassigned',    trips: 89,  rating: 4.7, joined: '2021-07-30' },
];

export const MOCK_TRIPS = [
  { id: 'T1042', origin: 'Mumbai, MH',    destination: 'Pune, MH',       driver: 'Ravi Kumar',   vehicle: 'KA-01-AB-1234', status: 'completed',   distance: 148, startDate: '2024-12-10', endDate: '2024-12-10', cargo: 'Electronics',  cost: 4200  },
  { id: 'T1041', origin: 'Delhi, DL',     destination: 'Jaipur, RJ',     driver: 'Suresh Nair',  vehicle: 'KA-02-CD-5678', status: 'in_progress', distance: 282, startDate: '2024-12-12', endDate: null,          cargo: 'Textiles',     cost: 7800  },
  { id: 'T1040', origin: 'Bangalore, KA', destination: 'Chennai, TN',    driver: 'Amit Sharma',  vehicle: 'DL-04-GH-3456', status: 'completed',   distance: 346, startDate: '2024-12-08', endDate: '2024-12-09', cargo: 'Auto Parts',   cost: 9500  },
  { id: 'T1039', origin: 'Hyderabad, TS', destination: 'Vijayawada, AP', driver: 'Priya Menon',  vehicle: 'TN-05-IJ-7890', status: 'completed',   distance: 275, startDate: '2024-12-07', endDate: '2024-12-07', cargo: 'FMCG',         cost: 6200  },
  { id: 'T1038', origin: 'Ahmedabad, GJ', destination: 'Surat, GJ',      driver: 'Deepak Verma', vehicle: 'GJ-06-KL-2345', status: 'dispatched',  distance: 265, startDate: '2024-12-12', endDate: null,          cargo: 'Chemicals',    cost: 7100  },
  { id: 'T1037', origin: 'Kolkata, WB',   destination: 'Bhubaneswar, OD',driver: 'Kavya Reddy',  vehicle: 'UP-08-OP-0123', status: 'pending',     distance: 440, startDate: '2024-12-14', endDate: null,          cargo: 'Steel',        cost: 12000 },
  { id: 'T1036', origin: 'Chennai, TN',   destination: 'Coimbatore, TN', driver: 'Mohan Das',    vehicle: 'KA-01-AB-1234', status: 'cancelled',   distance: 500, startDate: '2024-12-05', endDate: null,          cargo: 'Machinery',    cost: 0     },
  { id: 'T1035', origin: 'Pune, MH',      destination: 'Nagpur, MH',     driver: 'Sunita Patel', vehicle: 'TN-05-IJ-7890', status: 'completed',   distance: 228, startDate: '2024-12-03', endDate: '2024-12-04', cargo: 'Pharmaceuticals', cost: 5800 },
];

export const MOCK_MAINTENANCE = [
  { id: 'M001', vehicle: 'KA-01-AB-1234', type: 'Oil Change',        status: 'completed',   scheduledDate: '2024-11-10', completedDate: '2024-11-10', cost: 2500,  technician: 'Raj Auto Works',    notes: 'Engine oil + filter replaced' },
  { id: 'M002', vehicle: 'KA-02-CD-5678', type: 'Tyre Replacement',  status: 'scheduled',   scheduledDate: '2024-12-20', completedDate: null,          cost: 18000, technician: 'SpeedFit Tyres',    notes: 'All 6 tyres due for replacement' },
  { id: 'M003', vehicle: 'MH-03-EF-9012', type: 'Engine Overhaul',   status: 'in_progress', scheduledDate: '2024-12-01', completedDate: null,          cost: 85000, technician: 'Tata Authorized',   notes: 'Major overhaul in progress' },
  { id: 'M004', vehicle: 'DL-04-GH-3456', type: 'Brake Service',     status: 'overdue',     scheduledDate: '2024-11-25', completedDate: null,          cost: 8500,  technician: 'Delhi Auto Hub',    notes: 'Brake pads worn out' },
  { id: 'M005', vehicle: 'TN-05-IJ-7890', type: 'AC Service',        status: 'completed',   scheduledDate: '2024-12-10', completedDate: '2024-12-10', cost: 3200,  technician: 'Cool Air Services', notes: 'AC gas refilled' },
  { id: 'M006', vehicle: 'GJ-06-KL-2345', type: 'Annual Inspection', status: 'scheduled',   scheduledDate: '2024-12-28', completedDate: null,          cost: 5000,  technician: 'RTO Approved',      notes: 'Annual fitness certificate renewal' },
  { id: 'M007', vehicle: 'UP-08-OP-0123', type: 'Battery Replacement',status: 'completed',  scheduledDate: '2024-12-05', completedDate: '2024-12-05', cost: 7500,  technician: 'Exide Service',     notes: 'Battery replaced' },
];

export const MOCK_EXPENSES = [
  { id: 'E001', type: 'Fuel',        vehicle: 'KA-01-AB-1234', amount: 8500,  date: '2024-12-10', description: 'Diesel fill-up — Mumbai depot',    trip: 'T1042', approvedBy: 'Admin' },
  { id: 'E002', type: 'Maintenance', vehicle: 'MH-03-EF-9012', amount: 85000, date: '2024-12-01', description: 'Engine overhaul — Tata Authorized', trip: null,    approvedBy: 'Admin' },
  { id: 'E003', type: 'Toll',        vehicle: 'KA-02-CD-5678', amount: 1200,  date: '2024-12-12', description: 'NH-48 toll charges',                trip: 'T1041', approvedBy: 'Manager' },
  { id: 'E004', type: 'Insurance',   vehicle: 'DL-04-GH-3456', amount: 42000, date: '2024-12-01', description: 'Annual insurance renewal',           trip: null,    approvedBy: 'Admin' },
  { id: 'E005', type: 'Fuel',        vehicle: 'GJ-06-KL-2345', amount: 9200,  date: '2024-12-11', description: 'Diesel fill-up — Ahmedabad depot',  trip: 'T1038', approvedBy: 'Manager' },
  { id: 'E006', type: 'Other',       vehicle: 'TN-05-IJ-7890', amount: 3500,  date: '2024-12-08', description: 'Driver allowance — overnight trip',  trip: 'T1039', approvedBy: 'Admin' },
  { id: 'E007', type: 'Maintenance', vehicle: 'DL-04-GH-3456', amount: 8500,  date: '2024-11-25', description: 'Brake service — Delhi Auto Hub',     trip: null,    approvedBy: 'Admin' },
  { id: 'E008', type: 'Fuel',        vehicle: 'UP-08-OP-0123', amount: 6800,  date: '2024-12-09', description: 'Diesel fill-up — Kolkata depot',    trip: 'T1036', approvedBy: 'Manager' },
];

export const MOCK_FUEL_LOGS = [
  { id: 'F001', vehicle: 'KA-01-AB-1234', driver: 'Ravi Kumar',   date: '2024-12-10', liters: 120, pricePerLiter: 92.5, totalCost: 11100, odometer: 48200, station: 'HPCL — Mumbai',    trip: 'T1042' },
  { id: 'F002', vehicle: 'KA-02-CD-5678', driver: 'Suresh Nair',  date: '2024-12-12', liters: 95,  pricePerLiter: 91.8, totalCost: 8721,  odometer: 72100, station: 'BPCL — Delhi',     trip: 'T1041' },
  { id: 'F003', vehicle: 'GJ-06-KL-2345', driver: 'Deepak Verma', date: '2024-12-11', liters: 110, pricePerLiter: 92.0, totalCost: 10120, odometer: 58700, station: 'IOC — Ahmedabad',  trip: 'T1038' },
  { id: 'F004', vehicle: 'DL-04-GH-3456', driver: 'Amit Sharma',  date: '2024-12-08', liters: 130, pricePerLiter: 93.2, totalCost: 12116, odometer: 95400, station: 'HPCL — Bangalore', trip: 'T1040' },
  { id: 'F005', vehicle: 'TN-05-IJ-7890', driver: 'Priya Menon',  date: '2024-12-07', liters: 85,  pricePerLiter: 91.5, totalCost: 7778,  odometer: 12300, station: 'BPCL — Hyderabad', trip: 'T1039' },
  { id: 'F006', vehicle: 'UP-08-OP-0123', driver: 'Kavya Reddy',  date: '2024-12-09', liters: 100, pricePerLiter: 92.8, totalCost: 9280,  odometer: 27800, station: 'IOC — Kolkata',    trip: 'T1036' },
];

// ─── Dashboard KPI summary ────────────────────────────────────
export const DASHBOARD_STATS = {
  totalVehicles:      { value: 8,   trend: 'up',   trendLabel: '+2 this month'    },
  activeDrivers:      { value: 6,   trend: 'up',   trendLabel: '2 on trip'        },
  tripsThisMonth:     { value: 24,  trend: 'up',   trendLabel: '+18% vs last month'},
  pendingMaintenance: { value: 3,   trend: 'down', trendLabel: '1 overdue'        },
  totalRevenue:       { value: '₹2.4L', trend: 'up', trendLabel: '+12% this month' },
  fuelCost:           { value: '₹59K',  trend: 'down', trendLabel: '-5% this month' },
};
