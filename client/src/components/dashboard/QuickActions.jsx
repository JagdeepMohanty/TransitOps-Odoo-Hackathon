import { Link } from 'react-router-dom';
import { Truck, Users, Route, Wrench, Fuel, DollarSign, FileText, Plus } from 'lucide-react';

const ACTIONS = [
  { label: 'Add Vehicle',       to: '/vehicles/add',      icon: Truck,      from: '#3B82F6', to2: '#1D4ED8' },
  { label: 'Add Driver',        to: '/drivers/add',       icon: Users,      from: '#22C55E', to2: '#15803D' },
  { label: 'Create Trip',       to: '/trips/create',      icon: Route,      from: '#8B5CF6', to2: '#6D28D9' },
  { label: 'Schedule Maint.',   to: '/maintenance',       icon: Wrench,     from: '#F59E0B', to2: '#B45309' },
  { label: 'Add Fuel Log',      to: '/finance/fuel',      icon: Fuel,       from: '#38BDF8', to2: '#0284C7' },
  { label: 'Record Expense',    to: '/finance/expenses',  icon: DollarSign, from: '#10B981', to2: '#047857' },
  { label: 'Generate Report',   to: '/reports',           icon: FileText,   from: '#EC4899', to2: '#BE185D' },
];

export default function QuickActions() {
  return (
    <div className="bg-bg-card border border-border rounded-[20px] shadow-card-md overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-bold text-content-primary">Quick Actions</h2>
        <p className="text-xs text-content-muted mt-0.5">Shortcuts to common tasks</p>
      </div>

      <div className="p-4 flex flex-col gap-2">
        {ACTIONS.map(({ label, to, icon: Icon, from, to2 }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60 bg-bg-secondary
              hover:border-transparent hover:shadow-card-md transition-all duration-200 relative overflow-hidden"
          >
            {/* Gradient bg on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: `linear-gradient(135deg, ${from}15, ${to2}08)` }}
            />

            {/* Icon */}
            <div
              className="relative z-10 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200"
              style={{ background: `linear-gradient(135deg, ${from}25, ${to2}15)`, border: `1px solid ${from}30` }}
            >
              <Icon className="w-4 h-4" style={{ color: from }} />
            </div>

            {/* Label */}
            <span className="relative z-10 text-xs font-semibold text-content-secondary group-hover:text-content-primary transition-colors duration-200 flex-1">
              {label}
            </span>

            {/* Arrow */}
            <Plus
              className="relative z-10 w-3.5 h-3.5 text-content-disabled group-hover:text-content-muted group-hover:rotate-90 transition-all duration-200 shrink-0"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
