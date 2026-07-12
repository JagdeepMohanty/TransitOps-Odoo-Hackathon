import {
  LayoutDashboard,
  Truck,
  Users,
  ShieldCheck,
  Route,
  Wrench,
  Fuel,
  DollarSign,
  BarChart3,
  UserCircle,
  LogOut,
  Zap,
} from 'lucide-react';

// ─── Main navigation sections ─────────────────────────────────
export const NAV_SECTIONS = [
  {
    id:    'main',
    label: 'Main',
    items: [
      { id: 'dashboard', to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    ],
  },
  {
    id:    'fleet',
    label: 'Fleet',
    items: [
      { id: 'vehicles',       to: '/vehicles',        icon: Truck,        label: 'Vehicles'          },
      { id: 'drivers',        to: '/drivers',         icon: Users,        label: 'Drivers'           },
      { id: 'driver-safety',  to: '/drivers/safety',  icon: ShieldCheck,  label: 'Driver Safety'     },
      { id: 'trips',          to: '/trips',            icon: Route,  label: 'Trips'            },
      { id: 'dispatcher',     to: '/trips/dispatcher', icon: Zap,    label: 'Trip Dispatcher'  },
      { id: 'maintenance',    to: '/maintenance',      icon: Wrench, label: 'Maintenance'      },
    ],
  },
  {
    id:    'finance',
    label: 'Finance',
    items: [
      { id: 'fuel',     to: '/finance/fuel',     icon: Fuel,       label: 'Fuel Logs' },
      { id: 'expenses', to: '/finance/expenses', icon: DollarSign, label: 'Expenses'  },
    ],
  },
  {
    id:    'analytics',
    label: 'Analytics',
    items: [
      { id: 'reports', to: '/reports', icon: BarChart3, label: 'Reports' },
    ],
  },
];

// ─── Bottom utility items ─────────────────────────────────────
export const NAV_BOTTOM = [
  { id: 'profile', to: '/profile', icon: UserCircle, label: 'Profile'  },
  { id: 'logout',  to: null,       icon: LogOut,     label: 'Logout', isDanger: true },
];
