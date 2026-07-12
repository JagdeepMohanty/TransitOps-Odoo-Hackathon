// ─── Fuel & Expense Management — Mock Data ────────────────────

export const FE_VEHICLES = [
  { id: 'V001', name: 'Tata Prima 4028.S',   registration: 'KA-01-AB-1234', type: 'Heavy Truck',  acquisitionCost: 3200000 },
  { id: 'V002', name: 'Ashok Leyland 2518',  registration: 'KA-02-CD-5678', type: 'Medium Truck', acquisitionCost: 2100000 },
  { id: 'V003', name: 'Eicher Pro 6031',      registration: 'MH-03-EF-9012', type: 'Light Truck',  acquisitionCost: 1800000 },
  { id: 'V004', name: 'Mahindra Blazo X 35', registration: 'DL-04-GH-3456', type: 'Heavy Truck',  acquisitionCost: 2800000 },
  { id: 'V005', name: 'Tata LPT 1613',        registration: 'TN-05-IJ-7890', type: 'Medium Truck', acquisitionCost: 1600000 },
  { id: 'V006', name: 'Volvo FH 500',         registration: 'GJ-06-KL-2345', type: 'Heavy Truck',  acquisitionCost: 5500000 },
  { id: 'V008', name: 'Eicher Pro 3015',      registration: 'UP-08-OP-0123', type: 'Light Truck',  acquisitionCost: 1400000 },
];

export const FE_DRIVERS = [
  'Ravi Kumar', 'Suresh Nair', 'Amit Sharma', 'Priya Menon',
  'Deepak Verma', 'Kavya Reddy', 'Mohan Das',
];

export const FUEL_STATIONS = [
  'HPCL — Mumbai', 'BPCL — Delhi', 'IOC — Ahmedabad',
  'HPCL — Bangalore', 'BPCL — Hyderabad', 'IOC — Kolkata',
  'HPCL — Chennai', 'BPCL — Pune',
];

export const PAYMENT_METHODS = ['Cash', 'Fleet Card', 'UPI', 'Credit Card', 'Bank Transfer'];
export const EXPENSE_TYPES    = ['Fuel', 'Maintenance', 'Toll', 'Insurance', 'Repairs', 'Parking', 'Other'];
export const EXPENSE_CATS     = ['Operational', 'Preventive', 'Emergency', 'Regulatory', 'Administrative'];

// ─── Fuel Logs ────────────────────────────────────────────────
export const FUEL_LOGS = [
  { id: 'FL-001', vehicleId: 'V001', vehicle: 'Tata Prima 4028.S',   registration: 'KA-01-AB-1234', driver: 'Ravi Kumar',   trip: 'T1042', date: '2024-12-10', station: 'HPCL — Mumbai',    quantity: 120, pricePerLiter: 92.5, totalCost: 11100, distanceCovered: 480, efficiency: 4.0,  paymentMethod: 'Fleet Card', notes: 'Full tank before long haul' },
  { id: 'FL-002', vehicleId: 'V002', vehicle: 'Ashok Leyland 2518',  registration: 'KA-02-CD-5678', driver: 'Suresh Nair',  trip: 'T1041', date: '2024-12-12', station: 'BPCL — Delhi',     quantity: 95,  pricePerLiter: 91.8, totalCost: 8721,  distanceCovered: 380, efficiency: 4.0,  paymentMethod: 'Fleet Card', notes: 'Mid-trip refuel' },
  { id: 'FL-003', vehicleId: 'V006', vehicle: 'Volvo FH 500',        registration: 'GJ-06-KL-2345', driver: 'Deepak Verma', trip: 'T1038', date: '2024-12-11', station: 'IOC — Ahmedabad',  quantity: 110, pricePerLiter: 92.0, totalCost: 10120, distanceCovered: 385, efficiency: 3.5,  paymentMethod: 'Fleet Card', notes: '' },
  { id: 'FL-004', vehicleId: 'V004', vehicle: 'Mahindra Blazo X 35', registration: 'DL-04-GH-3456', driver: 'Amit Sharma',  trip: 'T1040', date: '2024-12-08', station: 'HPCL — Bangalore', quantity: 130, pricePerLiter: 93.2, totalCost: 12116, distanceCovered: 346, efficiency: 2.66, paymentMethod: 'Cash',       notes: 'High consumption — check engine' },
  { id: 'FL-005', vehicleId: 'V005', vehicle: 'Tata LPT 1613',       registration: 'TN-05-IJ-7890', driver: 'Priya Menon',  trip: 'T1039', date: '2024-12-07', station: 'BPCL — Hyderabad', quantity: 85,  pricePerLiter: 91.5, totalCost: 7778,  distanceCovered: 425, efficiency: 5.0,  paymentMethod: 'UPI',        notes: 'Best efficiency this month' },
  { id: 'FL-006', vehicleId: 'V008', vehicle: 'Eicher Pro 3015',     registration: 'UP-08-OP-0123', driver: 'Kavya Reddy',  trip: 'T1036', date: '2024-12-09', station: 'IOC — Kolkata',    quantity: 100, pricePerLiter: 92.8, totalCost: 9280,  distanceCovered: 440, efficiency: 4.4,  paymentMethod: 'Fleet Card', notes: '' },
  { id: 'FL-007', vehicleId: 'V001', vehicle: 'Tata Prima 4028.S',   registration: 'KA-01-AB-1234', driver: 'Ravi Kumar',   trip: 'T1035', date: '2024-12-03', station: 'HPCL — Chennai',   quantity: 115, pricePerLiter: 92.1, totalCost: 10592, distanceCovered: 460, efficiency: 4.0,  paymentMethod: 'Fleet Card', notes: '' },
  { id: 'FL-008', vehicleId: 'V002', vehicle: 'Ashok Leyland 2518',  registration: 'KA-02-CD-5678', driver: 'Suresh Nair',  trip: 'T1034', date: '2024-11-28', station: 'BPCL — Pune',      quantity: 90,  pricePerLiter: 91.2, totalCost: 8208,  distanceCovered: 360, efficiency: 4.0,  paymentMethod: 'Fleet Card', notes: '' },
];

// ─── Expenses ─────────────────────────────────────────────────
export const EXPENSES = [
  { id: 'EXP-001', vehicleId: 'V001', vehicle: 'Tata Prima 4028.S',   registration: 'KA-01-AB-1234', type: 'Fuel',        category: 'Operational',    amount: 11100, date: '2024-12-10', status: 'approved', paymentMethod: 'Fleet Card',    notes: 'Diesel fill-up — Mumbai depot',              approvedBy: 'Admin'   },
  { id: 'EXP-002', vehicleId: 'V003', vehicle: 'Eicher Pro 6031',      registration: 'MH-03-EF-9012', type: 'Maintenance', category: 'Emergency',      amount: 85000, date: '2024-12-01', status: 'approved', paymentMethod: 'Bank Transfer', notes: 'Engine overhaul — Tata Authorized',          approvedBy: 'Admin'   },
  { id: 'EXP-003', vehicleId: 'V002', vehicle: 'Ashok Leyland 2518',  registration: 'KA-02-CD-5678', type: 'Toll',        category: 'Operational',    amount: 1200,  date: '2024-12-12', status: 'approved', paymentMethod: 'Cash',          notes: 'NH-48 toll charges',                         approvedBy: 'Manager' },
  { id: 'EXP-004', vehicleId: 'V004', vehicle: 'Mahindra Blazo X 35', registration: 'DL-04-GH-3456', type: 'Insurance',   category: 'Regulatory',     amount: 42000, date: '2024-12-01', status: 'approved', paymentMethod: 'Bank Transfer', notes: 'Annual insurance renewal',                   approvedBy: 'Admin'   },
  { id: 'EXP-005', vehicleId: 'V006', vehicle: 'Volvo FH 500',        registration: 'GJ-06-KL-2345', type: 'Fuel',        category: 'Operational',    amount: 10120, date: '2024-12-11', status: 'approved', paymentMethod: 'Fleet Card',    notes: 'Diesel fill-up — Ahmedabad depot',           approvedBy: 'Manager' },
  { id: 'EXP-006', vehicleId: 'V005', vehicle: 'Tata LPT 1613',       registration: 'TN-05-IJ-7890', type: 'Other',       category: 'Administrative', amount: 3500,  date: '2024-12-08', status: 'pending',  paymentMethod: 'Cash',          notes: 'Driver allowance — overnight trip',          approvedBy: null      },
  { id: 'EXP-007', vehicleId: 'V004', vehicle: 'Mahindra Blazo X 35', registration: 'DL-04-GH-3456', type: 'Repairs',     category: 'Preventive',     amount: 8500,  date: '2024-11-25', status: 'approved', paymentMethod: 'Cash',          notes: 'Brake service — Delhi Auto Hub',             approvedBy: 'Admin'   },
  { id: 'EXP-008', vehicleId: 'V008', vehicle: 'Eicher Pro 3015',     registration: 'UP-08-OP-0123', type: 'Fuel',        category: 'Operational',    amount: 9280,  date: '2024-12-09', status: 'approved', paymentMethod: 'Fleet Card',    notes: 'Diesel fill-up — Kolkata depot',             approvedBy: 'Manager' },
  { id: 'EXP-009', vehicleId: 'V001', vehicle: 'Tata Prima 4028.S',   registration: 'KA-01-AB-1234', type: 'Parking',     category: 'Operational',    amount: 800,   date: '2024-12-10', status: 'approved', paymentMethod: 'Cash',          notes: 'Overnight parking — Mumbai port',            approvedBy: 'Manager' },
  { id: 'EXP-010', vehicleId: 'V006', vehicle: 'Volvo FH 500',        registration: 'GJ-06-KL-2345', type: 'Maintenance', category: 'Preventive',     amount: 12000, date: '2024-12-05', status: 'pending',  paymentMethod: 'Bank Transfer', notes: 'Transmission service — Volvo authorized',    approvedBy: null      },
];

// ─── Fuel Trend (monthly) ─────────────────────────────────────
export const FUEL_TREND = [
  { month: 'Jul', fuelUsage: 580, fuelCost: 53360, distance: 2320 },
  { month: 'Aug', fuelUsage: 640, fuelCost: 58880, distance: 2560 },
  { month: 'Sep', fuelUsage: 510, fuelCost: 46920, distance: 2040 },
  { month: 'Oct', fuelUsage: 720, fuelCost: 66240, distance: 2880 },
  { month: 'Nov', fuelUsage: 680, fuelCost: 62560, distance: 2720 },
  { month: 'Dec', fuelUsage: 745, fuelCost: 68540, distance: 2980 },
];

// ─── Expense Distribution ─────────────────────────────────────
export const EXPENSE_DIST = [
  { name: 'Fuel',        value: 58115, color: '#3B82F6' },
  { name: 'Maintenance', value: 97000, color: '#F59E0B' },
  { name: 'Toll',        value: 1200,  color: '#22C55E' },
  { name: 'Insurance',   value: 42000, color: '#8B5CF6' },
  { name: 'Repairs',     value: 8500,  color: '#EF4444' },
  { name: 'Other',       value: 4300,  color: '#94A3B8' },
];

// ─── Vehicle Cost Summary ─────────────────────────────────────
export const VEHICLE_COSTS = [
  { id: 'V001', name: 'Tata Prima 4028.S',   registration: 'KA-01-AB-1234', type: 'Heavy Truck',  fuelCost: 21692, maintenanceCost: 2500,  otherExpenses: 800,  revenue: 42000, acquisitionCost: 3200000, efficiency: 4.0,  totalTrips: 12 },
  { id: 'V002', name: 'Ashok Leyland 2518',  registration: 'KA-02-CD-5678', type: 'Medium Truck', fuelCost: 16929, maintenanceCost: 18000, otherExpenses: 1200, revenue: 38000, acquisitionCost: 2100000, efficiency: 4.0,  totalTrips: 9  },
  { id: 'V004', name: 'Mahindra Blazo X 35', registration: 'DL-04-GH-3456', type: 'Heavy Truck',  fuelCost: 12116, maintenanceCost: 50500, otherExpenses: 0,    revenue: 28500, acquisitionCost: 2800000, efficiency: 2.66, totalTrips: 7  },
  { id: 'V005', name: 'Tata LPT 1613',       registration: 'TN-05-IJ-7890', type: 'Medium Truck', fuelCost: 7778,  maintenanceCost: 3200,  otherExpenses: 3500, revenue: 24000, acquisitionCost: 1600000, efficiency: 5.0,  totalTrips: 8  },
  { id: 'V006', name: 'Volvo FH 500',        registration: 'GJ-06-KL-2345', type: 'Heavy Truck',  fuelCost: 10120, maintenanceCost: 17000, otherExpenses: 0,    revenue: 35000, acquisitionCost: 5500000, efficiency: 3.5,  totalTrips: 6  },
  { id: 'V008', name: 'Eicher Pro 3015',     registration: 'UP-08-OP-0123', type: 'Light Truck',  fuelCost: 9280,  maintenanceCost: 7500,  otherExpenses: 0,    revenue: 22000, acquisitionCost: 1400000, efficiency: 4.4,  totalTrips: 5  },
];

// ─── Recent Transactions ──────────────────────────────────────
export const RECENT_TXN = [
  { id: 'TXN-001', type: 'fuel',        title: 'Fuel Added',          vehicle: 'Tata Prima 4028.S',   amount: 11100, time: '2 hours ago',  },
  { id: 'TXN-002', type: 'maintenance', title: 'Maintenance Payment', vehicle: 'Eicher Pro 6031',      amount: 85000, time: '5 hours ago',  },
  { id: 'TXN-003', type: 'toll',        title: 'Toll Paid',           vehicle: 'Ashok Leyland 2518',   amount: 1200,  time: '8 hours ago',  },
  { id: 'TXN-004', type: 'fuel',        title: 'Fuel Added',          vehicle: 'Volvo FH 500',         amount: 10120, time: '1 day ago',    },
  { id: 'TXN-005', type: 'insurance',   title: 'Insurance Paid',      vehicle: 'Mahindra Blazo X 35',  amount: 42000, time: '1 day ago',    },
  { id: 'TXN-006', type: 'expense',     title: 'Expense Approved',    vehicle: 'Tata LPT 1613',        amount: 3500,  time: '2 days ago',   },
  { id: 'TXN-007', type: 'fuel',        title: 'Fuel Added',          vehicle: 'Eicher Pro 3015',      amount: 9280,  time: '2 days ago',   },
  { id: 'TXN-008', type: 'repairs',     title: 'Repair Completed',    vehicle: 'Mahindra Blazo X 35',  amount: 8500,  time: '3 days ago',   },
];

// ─── KPI ──────────────────────────────────────────────────────
export const FE_KPI = {
  totalFuel:    { value: '745 L',    desc: 'December 2024 total consumption',  trend: '+9.6% vs Nov',  trendUp: false },
  fuelCost:     { value: '₹68.5K',  desc: 'Total fuel spend this month',       trend: '+9.6% vs Nov',  trendUp: false },
  maintCost:    { value: '₹97K',    desc: 'Repairs + service this month',      trend: '+14% vs Nov',   trendUp: false },
  otherExp:     { value: '₹4.3K',   desc: 'Toll, parking, allowances',         trend: '-12% vs Nov',   trendUp: true  },
  totalOpCost:  { value: '₹2.11L',  desc: 'All operational expenses combined', trend: '+8.2% vs Nov',  trendUp: false },
  avgEfficiency:{ value: '3.9 km/L',desc: 'Fleet average fuel efficiency',     trend: '-0.3 vs Nov',   trendUp: false },
};
