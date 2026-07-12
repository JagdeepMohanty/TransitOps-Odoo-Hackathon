import {
  LayoutDashboard, Route, Wrench, Fuel, Receipt, BarChart3, Truck, Users,
} from 'lucide-react'

export const NAV_ITEMS = [
  { label: 'Dashboard',   path: '/',            icon: LayoutDashboard },
  { label: 'Trips',       path: '/trips',        icon: Route },
  { label: 'Vehicles',    path: '/vehicles',     icon: Truck },
  { label: 'Drivers',     path: '/drivers',      icon: Users },
  { label: 'Maintenance', path: '/maintenance',  icon: Wrench },
  { label: 'Fuel Logs',   path: '/fuel',         icon: Fuel },
  { label: 'Expenses',    path: '/expenses',     icon: Receipt },
  { label: 'Reports',     path: '/reports',      icon: BarChart3 },
]

export const TRIP_STATUS = {
  SCHEDULED:   { label: 'Scheduled',   color: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-amber-100 text-amber-700' },
  COMPLETED:   { label: 'Completed',   color: 'bg-green-100 text-green-700' },
  CANCELLED:   { label: 'Cancelled',   color: 'bg-red-100 text-red-700' },
}

export const VEHICLE_STATUS = {
  ACTIVE:      { label: 'Active',      color: 'bg-green-100 text-green-700' },
  MAINTENANCE: { label: 'Maintenance', color: 'bg-amber-100 text-amber-700' },
  INACTIVE:    { label: 'Inactive',    color: 'bg-slate-100 text-slate-600' },
}

export const MAINTENANCE_STATUS = {
  OPEN:        { label: 'Open',        color: 'bg-red-100 text-red-700' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-amber-100 text-amber-700' },
  CLOSED:      { label: 'Closed',      color: 'bg-green-100 text-green-700' },
}
