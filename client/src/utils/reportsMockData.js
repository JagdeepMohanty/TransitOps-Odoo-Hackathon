// ─── Reports & Analytics Mock Data ───────────────────────────

export const KPI_DATA = {
  fleetUtilization:   { value: 87.5,  unit: '%',    trend: +4.2,  label: 'Fleet Utilization'    },
  fuelEfficiency:     { value: 8.6,   unit: 'km/L', trend: +0.4,  label: 'Fuel Efficiency'      },
  operationalCost:    { value: 284500,unit: '₹',    trend: -3.1,  label: 'Operational Cost'     },
  vehicleROI:         { value: 22.4,  unit: '%',    trend: +5.8,  label: 'Vehicle ROI'          },
  totalRevenue:       { value: 612000,unit: '₹',    trend: +12.3, label: 'Total Revenue'        },
  netProfit:          { value: 327500,unit: '₹',    trend: +9.1,  label: 'Net Profit'           },
  avgTripDistance:    { value: 312,   unit: 'km',   trend: +2.7,  label: 'Avg Trip Distance'    },
  totalFuelUsed:      { value: 4820,  unit: 'L',    trend: -5.2,  label: 'Total Fuel Used'      },
};

export const SPARKLINE_DATA = {
  fleetUtilization: [72,75,78,74,80,83,85,82,87,84,88,87],
  fuelEfficiency:   [7.8,8.0,7.9,8.1,8.3,8.2,8.4,8.5,8.6,8.4,8.7,8.6],
  operationalCost:  [310,295,320,305,290,285,300,288,275,280,270,284],
  vehicleROI:       [14,16,15,17,18,19,20,21,20,22,23,22],
  totalRevenue:     [480,510,495,530,545,560,575,590,580,600,610,612],
  netProfit:        [210,225,215,240,255,265,275,290,285,305,315,327],
  avgTripDistance:  [280,295,305,290,310,315,308,320,312,318,325,312],
  totalFuelUsed:    [5200,5100,5300,5050,4900,4850,4950,4800,4750,4820,4780,4820],
};

export const FLEET_UTILIZATION_TREND = [
  { date: 'Dec 1',  daily: 82, weekly: 79, monthly: 76 },
  { date: 'Dec 2',  daily: 85, weekly: 80, monthly: 77 },
  { date: 'Dec 3',  daily: 78, weekly: 81, monthly: 77 },
  { date: 'Dec 4',  daily: 90, weekly: 82, monthly: 78 },
  { date: 'Dec 5',  daily: 88, weekly: 83, monthly: 79 },
  { date: 'Dec 6',  daily: 75, weekly: 82, monthly: 79 },
  { date: 'Dec 7',  daily: 92, weekly: 84, monthly: 80 },
  { date: 'Dec 8',  daily: 87, weekly: 85, monthly: 81 },
  { date: 'Dec 9',  daily: 83, weekly: 85, monthly: 81 },
  { date: 'Dec 10', daily: 95, weekly: 86, monthly: 82 },
  { date: 'Dec 11', daily: 89, weekly: 87, monthly: 83 },
  { date: 'Dec 12', daily: 91, weekly: 87, monthly: 83 },
  { date: 'Dec 13', daily: 86, weekly: 87, monthly: 84 },
  { date: 'Dec 14', daily: 93, weekly: 88, monthly: 84 },
];

export const FUEL_EFFICIENCY_DATA = [
  { month: 'Jul', distance: 18200, fuelConsumed: 2240, efficiency: 8.1 },
  { month: 'Aug', distance: 19500, fuelConsumed: 2350, efficiency: 8.3 },
  { month: 'Sep', distance: 17800, fuelConsumed: 2180, efficiency: 8.2 },
  { month: 'Oct', distance: 21000, fuelConsumed: 2500, efficiency: 8.4 },
  { month: 'Nov', distance: 22400, fuelConsumed: 2620, efficiency: 8.5 },
  { month: 'Dec', distance: 20800, fuelConsumed: 2420, efficiency: 8.6 },
];

export const COST_BREAKDOWN = [
  { name: 'Fuel',        value: 118400, color: '#3B82F6' },
  { name: 'Maintenance', value: 72000,  color: '#8B5CF6' },
  { name: 'Tolls',       value: 24500,  color: '#F59E0B' },
  { name: 'Insurance',   value: 42000,  color: '#22C55E' },
  { name: 'Parking',     value: 8200,   color: '#38BDF8' },
  { name: 'Repairs',     value: 14400,  color: '#EF4444' },
  { name: 'Other',       value: 5000,   color: '#94A3B8' },
];

export const VEHICLE_ROI_DATA = [
  { vehicle: 'KA-01',  revenue: 98000,  fuelCost: 22000, maintenanceCost: 8500,  roi: 28.4 },
  { vehicle: 'KA-02',  revenue: 112000, fuelCost: 26000, maintenanceCost: 18000, roi: 24.1 },
  { vehicle: 'MH-03',  revenue: 74000,  fuelCost: 18000, maintenanceCost: 85000, roi: -9.2 },
  { vehicle: 'DL-04',  revenue: 105000, fuelCost: 28000, maintenanceCost: 16500, roi: 22.8 },
  { vehicle: 'TN-05',  revenue: 88000,  fuelCost: 16000, maintenanceCost: 6700,  roi: 31.2 },
  { vehicle: 'GJ-06',  revenue: 118000, fuelCost: 24000, maintenanceCost: 10000, roi: 29.6 },
  { vehicle: 'UP-08',  revenue: 62000,  fuelCost: 14000, maintenanceCost: 7500,  roi: 18.5 },
];

export const FLEET_PERFORMANCE = [
  { id: 'V001', name: 'Tata Prima 4028.S',    plate: 'KA-01-AB-1234', trips: 42, distance: 6240, fuelUsed: 728, efficiency: 8.6, cost: 30500, revenue: 98000, roi: 28.4, score: 91 },
  { id: 'V002', name: 'Ashok Leyland 2518',   plate: 'KA-02-CD-5678', trips: 38, distance: 8200, fuelUsed: 1010, efficiency: 8.1, cost: 44000, revenue: 112000, roi: 24.1, score: 84 },
  { id: 'V003', name: 'Eicher Pro 6031',       plate: 'MH-03-EF-9012', trips: 18, distance: 3100, fuelUsed: 420, efficiency: 7.4, cost: 103000, revenue: 74000, roi: -9.2, score: 38 },
  { id: 'V004', name: 'Mahindra Blazo X 35',  plate: 'DL-04-GH-3456', trips: 35, distance: 7800, fuelUsed: 980, efficiency: 8.0, cost: 44500, revenue: 105000, roi: 22.8, score: 79 },
  { id: 'V005', name: 'Tata LPT 1613',        plate: 'TN-05-IJ-7890', trips: 28, distance: 5600, fuelUsed: 620, efficiency: 9.0, cost: 22700, revenue: 88000, roi: 31.2, score: 94 },
  { id: 'V006', name: 'Volvo FH 500',         plate: 'GJ-06-KL-2345', trips: 45, distance: 9200, fuelUsed: 1050, efficiency: 8.8, cost: 34000, revenue: 118000, roi: 29.6, score: 96 },
  { id: 'V007', name: 'Eicher Pro 3015',      plate: 'UP-08-OP-0123', trips: 22, distance: 4200, fuelUsed: 510, efficiency: 8.2, cost: 21500, revenue: 62000, roi: 18.5, score: 72 },
];

export const TOP_VEHICLES = [
  { rank: 1, vehicle: 'Volvo FH 500',        plate: 'GJ-06-KL-2345', trips: 45, distance: 9200, revenue: 118000, efficiency: 8.8, roi: 29.6 },
  { rank: 2, vehicle: 'Tata LPT 1613',       plate: 'TN-05-IJ-7890', trips: 28, distance: 5600, revenue: 88000,  efficiency: 9.0, roi: 31.2 },
  { rank: 3, vehicle: 'Tata Prima 4028.S',   plate: 'KA-01-AB-1234', trips: 42, distance: 6240, revenue: 98000,  efficiency: 8.6, roi: 28.4 },
  { rank: 4, vehicle: 'Ashok Leyland 2518',  plate: 'KA-02-CD-5678', trips: 38, distance: 8200, revenue: 112000, efficiency: 8.1, roi: 24.1 },
  { rank: 5, vehicle: 'Mahindra Blazo X 35', plate: 'DL-04-GH-3456', trips: 35, distance: 7800, revenue: 105000, efficiency: 8.0, roi: 22.8 },
];

export const LOW_PERFORMING_VEHICLES = [
  { vehicle: 'Eicher Pro 6031',  plate: 'MH-03-EF-9012', reason: 'High Maintenance Cost', detail: '₹85,000 engine overhaul', severity: 'critical' },
  { vehicle: 'Eicher Pro 3015',  plate: 'UP-08-OP-0123', reason: 'Low Efficiency',         detail: '8.2 km/L below fleet avg', severity: 'warning'  },
  { vehicle: 'Ashok Leyland 2518',plate:'KA-02-CD-5678', reason: 'High Fuel Consumption',  detail: '1,010 L this month',       severity: 'warning'  },
];

export const ANALYTICS_TABLE_DATA = [
  { id: 'V001', vehicle: 'Tata Prima 4028.S',    plate: 'KA-01-AB-1234', trips: 42, distance: 6240, fuelUsed: 728,  fuelEfficiency: 8.6, maintenanceCost: 8500,  operationalCost: 30500, revenue: 98000,  roi: 28.4, status: 'available'   },
  { id: 'V002', vehicle: 'Ashok Leyland 2518',   plate: 'KA-02-CD-5678', trips: 38, distance: 8200, fuelUsed: 1010, fuelEfficiency: 8.1, maintenanceCost: 18000, operationalCost: 44000, revenue: 112000, roi: 24.1, status: 'on_trip'     },
  { id: 'V003', vehicle: 'Eicher Pro 6031',       plate: 'MH-03-EF-9012', trips: 18, distance: 3100, fuelUsed: 420,  fuelEfficiency: 7.4, maintenanceCost: 85000, operationalCost: 103000,revenue: 74000,  roi: -9.2, status: 'maintenance' },
  { id: 'V004', vehicle: 'Mahindra Blazo X 35',  plate: 'DL-04-GH-3456', trips: 35, distance: 7800, fuelUsed: 980,  fuelEfficiency: 8.0, maintenanceCost: 16500, operationalCost: 44500, revenue: 105000, roi: 22.8, status: 'available'   },
  { id: 'V005', vehicle: 'Tata LPT 1613',        plate: 'TN-05-IJ-7890', trips: 28, distance: 5600, fuelUsed: 620,  fuelEfficiency: 9.0, maintenanceCost: 6700,  operationalCost: 22700, revenue: 88000,  roi: 31.2, status: 'available'   },
  { id: 'V006', vehicle: 'Volvo FH 500',         plate: 'GJ-06-KL-2345', trips: 45, distance: 9200, fuelUsed: 1050, fuelEfficiency: 8.8, maintenanceCost: 10000, operationalCost: 34000, revenue: 118000, roi: 29.6, status: 'on_trip'     },
  { id: 'V007', vehicle: 'Eicher Pro 3015',      plate: 'UP-08-OP-0123', trips: 22, distance: 4200, fuelUsed: 510,  fuelEfficiency: 8.2, maintenanceCost: 7500,  operationalCost: 21500, revenue: 62000,  roi: 18.5, status: 'available'   },
];

export const INSIGHTS = [
  { type: 'success', icon: 'TrendingUp',  title: 'Highest ROI Vehicle',       value: 'Tata LPT 1613',       detail: '31.2% ROI this month'         },
  { type: 'danger',  icon: 'Fuel',        title: 'Lowest Fuel Efficiency',    value: 'Eicher Pro 6031',     detail: '7.4 km/L — 14% below avg'     },
  { type: 'warning', icon: 'DollarSign',  title: 'Most Expensive Vehicle',    value: 'Eicher Pro 6031',     detail: '₹1,03,000 operational cost'   },
  { type: 'primary', icon: 'BarChart2',   title: 'Highest Revenue Vehicle',   value: 'Volvo FH 500',        detail: '₹1,18,000 revenue this month' },
  { type: 'warning', icon: 'Wrench',      title: 'Highest Maintenance Cost',  value: 'Eicher Pro 6031',     detail: '₹85,000 engine overhaul'      },
  { type: 'accent',  icon: 'Star',        title: 'Best Performing Driver',    value: 'Kavya Reddy',         detail: '4.9 rating · 34 trips'        },
  { type: 'success', icon: 'Activity',    title: 'Most Active Vehicle',       value: 'Volvo FH 500',        detail: '45 trips · 9,200 km covered'  },
];

export const RECENT_REPORTS = [
  { id: 1, title: 'Fleet Performance Report',    type: 'Generated', time: '2 hours ago',  icon: 'FileBarChart', color: 'primary' },
  { id: 2, title: 'Monthly Analytics Exported',  type: 'Exported',  time: '5 hours ago',  icon: 'Download',     color: 'success' },
  { id: 3, title: 'Expense Report Downloaded',   type: 'Downloaded',time: '1 day ago',    icon: 'Receipt',      color: 'warning' },
  { id: 4, title: 'Fuel Analysis Completed',     type: 'Completed', time: '2 days ago',   icon: 'Fuel',         color: 'accent'  },
  { id: 5, title: 'Maintenance Report Generated',type: 'Generated', time: '3 days ago',   icon: 'Wrench',       color: 'danger'  },
];
