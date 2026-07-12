// ─── Settings & RBAC Mock Data ────────────────────────────────

export const SETTINGS_KPI = {
  totalUsers:       { value: 24,  trend: +3,   label: 'Total Users'        },
  activeUsers:      { value: 19,  trend: +2,   label: 'Active Users'       },
  roles:            { value: 6,   trend: 0,    label: 'Roles'              },
  permissions:      { value: 54,  trend: +6,   label: 'Permissions'        },
  pendingInvites:   { value: 3,   trend: -1,   label: 'Pending Invitations'},
  securityScore:    { value: 87,  trend: +5,   label: 'Security Score'     },
};

export const USERS_DATA = [
  { id: 'U001', name: 'Arjun Sharma',    email: 'arjun.sharma@transitops.com',    role: 'administrator',     department: 'IT',        status: 'active',   lastLogin: '2 min ago',   avatar: 'AS' },
  { id: 'U002', name: 'Priya Nair',      email: 'priya.nair@transitops.com',      role: 'fleet_manager',     department: 'Operations',status: 'active',   lastLogin: '1 hr ago',    avatar: 'PN' },
  { id: 'U003', name: 'Rahul Verma',     email: 'rahul.verma@transitops.com',     role: 'dispatcher',        department: 'Logistics', status: 'active',   lastLogin: '3 hrs ago',   avatar: 'RV' },
  { id: 'U004', name: 'Kavya Reddy',     email: 'kavya.reddy@transitops.com',     role: 'driver',            department: 'Transport', status: 'active',   lastLogin: '5 hrs ago',   avatar: 'KR' },
  { id: 'U005', name: 'Suresh Patel',    email: 'suresh.patel@transitops.com',    role: 'safety_officer',    department: 'Safety',    status: 'active',   lastLogin: '1 day ago',   avatar: 'SP' },
  { id: 'U006', name: 'Meena Iyer',      email: 'meena.iyer@transitops.com',      role: 'financial_analyst', department: 'Finance',   status: 'active',   lastLogin: '2 days ago',  avatar: 'MI' },
  { id: 'U007', name: 'Vikram Singh',    email: 'vikram.singh@transitops.com',    role: 'driver',            department: 'Transport', status: 'inactive', lastLogin: '5 days ago',  avatar: 'VS' },
  { id: 'U008', name: 'Anita Desai',     email: 'anita.desai@transitops.com',     role: 'fleet_manager',     department: 'Operations',status: 'active',   lastLogin: '6 hrs ago',   avatar: 'AD' },
  { id: 'U009', name: 'Ravi Kumar',      email: 'ravi.kumar@transitops.com',      role: 'dispatcher',        department: 'Logistics', status: 'pending',  lastLogin: 'Never',       avatar: 'RK' },
  { id: 'U010', name: 'Deepa Menon',     email: 'deepa.menon@transitops.com',     role: 'safety_officer',    department: 'Safety',    status: 'active',   lastLogin: '3 days ago',  avatar: 'DM' },
  { id: 'U011', name: 'Kiran Joshi',     email: 'kiran.joshi@transitops.com',     role: 'financial_analyst', department: 'Finance',   status: 'active',   lastLogin: '4 hrs ago',   avatar: 'KJ' },
  { id: 'U012', name: 'Sanjay Gupta',    email: 'sanjay.gupta@transitops.com',    role: 'driver',            department: 'Transport', status: 'suspended',lastLogin: '10 days ago', avatar: 'SG' },
];

export const ROLES_DATA = [
  { id: 'administrator',     label: 'Administrator',     color: 'danger',  users: 1,  description: 'Full system access'                },
  { id: 'fleet_manager',     label: 'Fleet Manager',     color: 'primary', users: 2,  description: 'Manage vehicles, drivers, trips'    },
  { id: 'dispatcher',        label: 'Dispatcher',        color: 'accent',  users: 2,  description: 'Create trips, assign drivers'       },
  { id: 'safety_officer',    label: 'Safety Officer',    color: 'warning', users: 2,  description: 'Monitor safety, update scores'      },
  { id: 'financial_analyst', label: 'Financial Analyst', color: 'info',    users: 2,  description: 'View/export reports, manage expenses'},
  { id: 'driver',            label: 'Driver',            color: 'success', users: 3,  description: 'View assigned trips, update status' },
];

// Modules × Roles permission matrix
// Each cell: { view, create, edit, delete, export, manage }
export const PERMISSION_MATRIX = {
  modules: ['Dashboard','Vehicles','Drivers','Trips','Maintenance','Fuel','Expenses','Reports','Settings'],
  roles:   ['administrator','fleet_manager','dispatcher','safety_officer','financial_analyst','driver'],
  matrix: {
    Dashboard:   { administrator:[1,1,1,1,1,1], fleet_manager:[1,0,0,0,0,0], dispatcher:[1,0,0,0,0,0], safety_officer:[1,0,0,0,0,0], financial_analyst:[1,0,0,0,0,0], driver:[1,0,0,0,0,0] },
    Vehicles:    { administrator:[1,1,1,1,1,1], fleet_manager:[1,1,1,1,0,1], dispatcher:[1,0,0,0,0,0], safety_officer:[1,0,0,0,0,0], financial_analyst:[1,0,0,0,0,0], driver:[0,0,0,0,0,0] },
    Drivers:     { administrator:[1,1,1,1,1,1], fleet_manager:[1,1,1,1,0,1], dispatcher:[1,0,0,0,0,0], safety_officer:[1,0,1,0,0,0], financial_analyst:[1,0,0,0,0,0], driver:[1,0,0,0,0,0] },
    Trips:       { administrator:[1,1,1,1,1,1], fleet_manager:[1,1,1,1,0,1], dispatcher:[1,1,1,0,0,0], safety_officer:[1,0,0,0,0,0], financial_analyst:[1,0,0,0,1,0], driver:[1,0,1,0,0,0] },
    Maintenance: { administrator:[1,1,1,1,1,1], fleet_manager:[1,1,1,1,0,1], dispatcher:[1,0,0,0,0,0], safety_officer:[1,1,1,0,0,0], financial_analyst:[1,0,0,0,0,0], driver:[0,0,0,0,0,0] },
    Fuel:        { administrator:[1,1,1,1,1,1], fleet_manager:[1,1,1,1,1,0], dispatcher:[1,0,0,0,0,0], safety_officer:[1,0,0,0,0,0], financial_analyst:[1,0,0,0,1,0], driver:[0,0,0,0,0,0] },
    Expenses:    { administrator:[1,1,1,1,1,1], fleet_manager:[1,1,1,0,1,0], dispatcher:[1,0,0,0,0,0], safety_officer:[0,0,0,0,0,0], financial_analyst:[1,1,1,1,1,0], driver:[0,0,0,0,0,0] },
    Reports:     { administrator:[1,1,1,1,1,1], fleet_manager:[1,0,0,0,1,0], dispatcher:[1,0,0,0,0,0], safety_officer:[1,0,0,0,1,0], financial_analyst:[1,0,0,0,1,0], driver:[0,0,0,0,0,0] },
    Settings:    { administrator:[1,1,1,1,1,1], fleet_manager:[0,0,0,0,0,0], dispatcher:[0,0,0,0,0,0], safety_officer:[0,0,0,0,0,0], financial_analyst:[0,0,0,0,0,0], driver:[0,0,0,0,0,0] },
  },
};

export const ACTIVITY_TIMELINE = [
  { id: 1, type: 'login',      user: 'Arjun Sharma',    action: 'Logged in from Chrome · Mumbai',         time: '2 min ago',   color: 'success' },
  { id: 2, type: 'role',       user: 'Priya Nair',      action: 'Role updated to Fleet Manager',          time: '1 hr ago',    color: 'primary' },
  { id: 3, type: 'permission', user: 'Admin',           action: 'Permissions updated for Dispatcher role',time: '3 hrs ago',   color: 'accent'  },
  { id: 4, type: 'user',       user: 'Admin',           action: 'New user Ravi Kumar invited',            time: '5 hrs ago',   color: 'info'    },
  { id: 5, type: 'password',   user: 'Meena Iyer',      action: 'Password changed successfully',          time: '1 day ago',   color: 'warning' },
  { id: 6, type: 'report',     user: 'Kiran Joshi',     action: 'Monthly analytics report downloaded',    time: '2 days ago',  color: 'success' },
  { id: 7, type: 'login',      user: 'Kavya Reddy',     action: 'Logged in from Mobile · Bangalore',      time: '2 days ago',  color: 'success' },
  { id: 8, type: 'user',       user: 'Admin',           action: 'Vikram Singh account suspended',         time: '3 days ago',  color: 'danger'  },
];

export const API_KEYS = [
  { id: 'K001', name: 'Production API Key',  key: 'sk_live_••••••••••••••••4f2a', created: 'Jan 12, 2025', lastUsed: '2 min ago',  status: 'active'   },
  { id: 'K002', name: 'Staging API Key',     key: 'sk_test_••••••••••••••••9c1b', created: 'Dec 5, 2024',  lastUsed: '3 days ago', status: 'active'   },
  { id: 'K003', name: 'Webhook Secret',      key: 'whsec_••••••••••••••••7d3e',  created: 'Nov 20, 2024', lastUsed: 'Never',      status: 'inactive' },
];

export const ACTIVE_SESSIONS = [
  { id: 'S001', device: 'Chrome · Windows 11',  location: 'Mumbai, IN',    ip: '103.21.xx.xx', time: 'Current session', current: true  },
  { id: 'S002', device: 'Safari · iPhone 15',   location: 'Bangalore, IN', ip: '49.36.xx.xx',  time: '2 hrs ago',       current: false },
  { id: 'S003', device: 'Firefox · macOS',      location: 'Delhi, IN',     ip: '117.55.xx.xx', time: '1 day ago',       current: false },
];
