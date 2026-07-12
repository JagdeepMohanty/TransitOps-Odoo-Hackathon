// ─── Settings & RBAC Mock Data ────────────────────────────────

export const SETTINGS_KPI = {
  totalUsers:     { value: 28,  trend: +4,  label: 'Total Users',         unit: ''  },
  activeUsers:    { value: 22,  trend: +3,  label: 'Active Users',        unit: ''  },
  roles:          { value: 6,   trend: 0,   label: 'Roles',               unit: ''  },
  permissions:    { value: 54,  trend: +6,  label: 'Permissions',         unit: ''  },
  pendingInvites: { value: 4,   trend: -2,  label: 'Pending Invitations', unit: ''  },
  securityScore:  { value: 92,  trend: +7,  label: 'Security Score',      unit: '%' },
};

export const USERS_DATA = [
  { id: 'U001', name: 'Arjun Sharma',    email: 'arjun.sharma@transitops.com',    role: 'administrator',     department: 'IT',         status: 'active',    lastLogin: '2 min ago',   avatar: 'AS', joined: 'Jan 2023', phone: '+91 98765 43210', location: 'Mumbai, IN'    },
  { id: 'U002', name: 'Priya Nair',      email: 'priya.nair@transitops.com',      role: 'fleet_manager',     department: 'Operations', status: 'active',    lastLogin: '1 hr ago',    avatar: 'PN', joined: 'Mar 2023', phone: '+91 87654 32109', location: 'Pune, IN'      },
  { id: 'U003', name: 'Rahul Verma',     email: 'rahul.verma@transitops.com',     role: 'dispatcher',        department: 'Logistics',  status: 'active',    lastLogin: '3 hrs ago',   avatar: 'RV', joined: 'Jun 2023', phone: '+91 76543 21098', location: 'Delhi, IN'     },
  { id: 'U004', name: 'Kavya Reddy',     email: 'kavya.reddy@transitops.com',     role: 'driver',            department: 'Transport',  status: 'active',    lastLogin: '5 hrs ago',   avatar: 'KR', joined: 'Aug 2023', phone: '+91 65432 10987', location: 'Bangalore, IN' },
  { id: 'U005', name: 'Suresh Patel',    email: 'suresh.patel@transitops.com',    role: 'safety_officer',    department: 'Safety',     status: 'active',    lastLogin: '1 day ago',   avatar: 'SP', joined: 'Sep 2023', phone: '+91 54321 09876', location: 'Ahmedabad, IN' },
  { id: 'U006', name: 'Meena Iyer',      email: 'meena.iyer@transitops.com',      role: 'financial_analyst', department: 'Finance',    status: 'active',    lastLogin: '2 days ago',  avatar: 'MI', joined: 'Oct 2023', phone: '+91 43210 98765', location: 'Chennai, IN'   },
  { id: 'U007', name: 'Vikram Singh',    email: 'vikram.singh@transitops.com',    role: 'driver',            department: 'Transport',  status: 'inactive',  lastLogin: '5 days ago',  avatar: 'VS', joined: 'Nov 2023', phone: '+91 32109 87654', location: 'Jaipur, IN'    },
  { id: 'U008', name: 'Anita Desai',     email: 'anita.desai@transitops.com',     role: 'fleet_manager',     department: 'Operations', status: 'active',    lastLogin: '6 hrs ago',   avatar: 'AD', joined: 'Dec 2023', phone: '+91 21098 76543', location: 'Surat, IN'     },
  { id: 'U009', name: 'Ravi Kumar',      email: 'ravi.kumar@transitops.com',      role: 'dispatcher',        department: 'Logistics',  status: 'pending',   lastLogin: 'Never',       avatar: 'RK', joined: 'Jan 2024', phone: '+91 10987 65432', location: 'Hyderabad, IN' },
  { id: 'U010', name: 'Deepa Menon',     email: 'deepa.menon@transitops.com',     role: 'safety_officer',    department: 'Safety',     status: 'active',    lastLogin: '3 days ago',  avatar: 'DM', joined: 'Feb 2024', phone: '+91 09876 54321', location: 'Kochi, IN'     },
  { id: 'U011', name: 'Kiran Joshi',     email: 'kiran.joshi@transitops.com',     role: 'financial_analyst', department: 'Finance',    status: 'active',    lastLogin: '4 hrs ago',   avatar: 'KJ', joined: 'Mar 2024', phone: '+91 98765 12345', location: 'Nagpur, IN'    },
  { id: 'U012', name: 'Sanjay Gupta',    email: 'sanjay.gupta@transitops.com',    role: 'driver',            department: 'Transport',  status: 'suspended', lastLogin: '10 days ago', avatar: 'SG', joined: 'Apr 2024', phone: '+91 87654 23456', location: 'Lucknow, IN'   },
  { id: 'U013', name: 'Neha Kapoor',     email: 'neha.kapoor@transitops.com',     role: 'dispatcher',        department: 'Logistics',  status: 'active',    lastLogin: '30 min ago',  avatar: 'NK', joined: 'May 2024', phone: '+91 76543 34567', location: 'Kolkata, IN'   },
  { id: 'U014', name: 'Amit Tiwari',     email: 'amit.tiwari@transitops.com',     role: 'driver',            department: 'Transport',  status: 'pending',   lastLogin: 'Never',       avatar: 'AT', joined: 'Jun 2024', phone: '+91 65432 45678', location: 'Bhopal, IN'    },
];

export const ROLES_DATA = [
  { id: 'administrator',     label: 'Administrator',     color: 'danger',  users: 1, description: 'Full system access — manage users, roles, settings and all modules. Unrestricted control over the entire platform.',    permissions: 54, lastModified: '2 days ago'  },
  { id: 'fleet_manager',     label: 'Fleet Manager',     color: 'primary', users: 3, description: 'Manage vehicles, drivers, maintenance schedules and trip assignments. Core operational role.',                           permissions: 32, lastModified: '5 days ago'  },
  { id: 'dispatcher',        label: 'Dispatcher',        color: 'accent',  users: 3, description: 'Create and assign trips, manage driver schedules and monitor real-time fleet status.',                                   permissions: 18, lastModified: '1 week ago'  },
  { id: 'safety_officer',    label: 'Safety Officer',    color: 'warning', users: 2, description: 'Monitor driver safety scores, manage license information and compliance reporting.',                                     permissions: 14, lastModified: '2 weeks ago' },
  { id: 'financial_analyst', label: 'Financial Analyst', color: 'info',    users: 2, description: 'View and export financial reports, manage expenses, fuel costs and ROI analysis.',                                      permissions: 16, lastModified: '3 days ago'  },
  { id: 'driver',            label: 'Driver',            color: 'success', users: 5, description: 'View assigned trips, update trip status, log fuel usage and manage own profile.',                                       permissions: 8,  lastModified: '1 month ago' },
];

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
  { id: 1,  type: 'login',      user: 'Arjun Sharma',    action: 'Logged in from Chrome · Mumbai, IN',              time: '2 min ago',   ip: '103.21.xx.xx' },
  { id: 2,  type: 'role',       user: 'Priya Nair',      action: 'Role updated to Fleet Manager by Admin',          time: '45 min ago',  ip: '49.36.xx.xx'  },
  { id: 3,  type: 'permission', user: 'Admin',           action: 'Dispatcher permissions updated — Trips expanded', time: '2 hrs ago',   ip: '103.21.xx.xx' },
  { id: 4,  type: 'user',       user: 'Admin',           action: 'New user Neha Kapoor invited to Logistics',       time: '4 hrs ago',   ip: '103.21.xx.xx' },
  { id: 5,  type: 'password',   user: 'Meena Iyer',      action: 'Password changed successfully',                   time: '1 day ago',   ip: '117.55.xx.xx' },
  { id: 6,  type: 'report',     user: 'Kiran Joshi',     action: 'Monthly analytics report downloaded (PDF)',       time: '2 days ago',  ip: '49.36.xx.xx'  },
  { id: 7,  type: 'login',      user: 'Kavya Reddy',     action: 'Logged in from Mobile · Bangalore, IN',           time: '2 days ago',  ip: '65.21.xx.xx'  },
  { id: 8,  type: 'suspend',    user: 'Admin',           action: 'Sanjay Gupta account suspended — policy breach',  time: '3 days ago',  ip: '103.21.xx.xx' },
  { id: 9,  type: 'user',       user: 'Admin',           action: 'Amit Tiwari invited as Driver',                   time: '4 days ago',  ip: '103.21.xx.xx' },
  { id: 10, type: 'login',      user: 'Suresh Patel',    action: 'Logged in from Firefox · Ahmedabad, IN',          time: '5 days ago',  ip: '122.33.xx.xx' },
];

export const API_KEYS = [
  { id: 'K001', name: 'Production API Key',  key: 'sk_live_••••••••••••••••4f2a', created: 'Jan 12, 2025', lastUsed: '2 min ago',   status: 'active',   scopes: ['read', 'write'] },
  { id: 'K002', name: 'Staging API Key',     key: 'sk_test_••••••••••••••••9c1b', created: 'Dec 5, 2024',  lastUsed: '3 days ago',  status: 'active',   scopes: ['read']          },
  { id: 'K003', name: 'Webhook Secret',      key: 'whsec_••••••••••••••••7d3e',  created: 'Nov 20, 2024', lastUsed: 'Never',       status: 'inactive', scopes: ['webhook']       },
  { id: 'K004', name: 'Analytics Read Key',  key: 'sk_anl_••••••••••••••••2b8f', created: 'Feb 1, 2025',  lastUsed: '1 hr ago',    status: 'active',   scopes: ['read']          },
];

export const ACTIVE_SESSIONS = [
  { id: 'S001', device: 'Chrome 121 · Windows 11',  location: 'Mumbai, IN',    ip: '103.21.xx.xx', time: 'Current session', current: true,  browser: 'Chrome'  },
  { id: 'S002', device: 'Safari 17 · iPhone 15 Pro', location: 'Bangalore, IN', ip: '49.36.xx.xx',  time: '2 hrs ago',       current: false, browser: 'Safari'  },
  { id: 'S003', device: 'Firefox 122 · macOS 14',    location: 'Delhi, IN',     ip: '117.55.xx.xx', time: '1 day ago',       current: false, browser: 'Firefox' },
];
