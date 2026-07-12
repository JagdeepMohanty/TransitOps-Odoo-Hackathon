import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, Users, Route, Wrench, TrendingUp, TrendingDown,
  Plus, ArrowRight, Activity, DollarSign, Fuel, AlertTriangle,
  CheckCircle2, Clock, Circle, BarChart3,
} from 'lucide-react';
import PageShell   from '@components/layout/PageShell';
import StatusBadge from '@components/common/StatusBadge';
import { MOCK_TRIPS, MOCK_VEHICLES, MOCK_MAINTENANCE, DASHBOARD_STATS } from '@utils/mockData';

// ─── KPI Card ─────────────────────────────────────────────────
function KpiCard({ title, value, trend, trendLabel, icon: Icon, iconColor, iconBg, to }) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendCls  = trend === 'up' ? 'text-success' : 'text-danger';

  const inner = (
    <div className="bg-bg-card border border-border-card rounded-xl shadow-card p-5 hover:border-border-strong hover:shadow-card-md transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-content-muted uppercase tracking-wider">{title}</p>
          <p className="mt-2 text-2xl font-bold text-content-primary tracking-tight">{value}</p>
          <div className="mt-1.5 flex items-center gap-1">
            <TrendIcon className={`w-3 h-3 ${trendCls}`} />
            <span className={`text-xs font-medium ${trendCls}`}>{trendLabel}</span>
          </div>
        </div>
        <div className={`p-2.5 rounded-xl shrink-0 ${iconBg} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  return to ? <Link to={to}>{inner}</Link> : inner;
}

// ─── Activity Feed ────────────────────────────────────────────
const ACTIVITY = [
  { id: 1, icon: Route,         color: 'text-primary',   bg: 'bg-primary/10',   text: 'Trip T1041 dispatched to Jaipur',          time: '2 min ago'  },
  { id: 2, icon: AlertTriangle, color: 'text-warning',   bg: 'bg-warning/10',   text: 'Vehicle MH-03-EF-9012 in maintenance',     time: '18 min ago' },
  { id: 3, icon: CheckCircle2,  color: 'text-success',   bg: 'bg-success/10',   text: 'Trip T1042 completed successfully',         time: '1 hr ago'   },
  { id: 4, icon: Users,         color: 'text-accent',    bg: 'bg-accent/10',    text: 'Driver Kavya Reddy assigned to UP-08',     time: '2 hr ago'   },
  { id: 5, icon: Wrench,        color: 'text-danger',    bg: 'bg-danger/10',    text: 'Brake service overdue — DL-04-GH-3456',    time: '3 hr ago'   },
  { id: 6, icon: DollarSign,    color: 'text-secondary', bg: 'bg-secondary/10', text: 'Expense ₹85,000 approved for engine overhaul', time: 'Yesterday' },
];

// ─── Fleet Status Mini Chart ──────────────────────────────────
function FleetStatusBar() {
  const counts = {
    available:   MOCK_VEHICLES.filter(v => v.status === 'available').length,
    on_trip:     MOCK_VEHICLES.filter(v => v.status === 'on_trip').length,
    maintenance: MOCK_VEHICLES.filter(v => v.status === 'maintenance').length,
    retired:     MOCK_VEHICLES.filter(v => v.status === 'retired').length,
  };
  const total = MOCK_VEHICLES.length;

  const segments = [
    { key: 'available',   label: 'Available',   count: counts.available,   color: 'bg-success',  textColor: 'text-success'  },
    { key: 'on_trip',     label: 'On Trip',     count: counts.on_trip,     color: 'bg-primary',  textColor: 'text-primary'  },
    { key: 'maintenance', label: 'Maintenance', count: counts.maintenance, color: 'bg-warning',  textColor: 'text-warning'  },
    { key: 'retired',     label: 'Retired',     count: counts.retired,     color: 'bg-border-strong', textColor: 'text-content-muted' },
  ];

  return (
    <div className="space-y-4">
      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {segments.map(s => (
          <div
            key={s.key}
            className={`${s.color} transition-all duration-500`}
            style={{ width: `${(s.count / total) * 100}%` }}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {segments.map(s => (
          <div key={s.key} className="flex items-center justify-between px-3 py-2 rounded-lg bg-bg-secondary">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${s.color}`} />
              <span className="text-xs text-content-muted">{s.label}</span>
            </div>
            <span className={`text-sm font-bold ${s.textColor}`}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Maintenance Alerts ───────────────────────────────────────
function MaintenanceAlerts() {
  const alerts = MOCK_MAINTENANCE.filter(m => m.status === 'overdue' || m.status === 'in_progress' || m.status === 'scheduled');
  return (
    <ul className="divide-y divide-border/50">
      {alerts.slice(0, 4).map(m => (
        <li key={m.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${m.status === 'overdue' ? 'bg-danger/10' : m.status === 'in_progress' ? 'bg-warning/10' : 'bg-info/10'}`}>
            <Wrench className={`w-3.5 h-3.5 ${m.status === 'overdue' ? 'text-danger' : m.status === 'in_progress' ? 'text-warning' : 'text-info'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-content-primary truncate">{m.type}</p>
            <p className="text-[11px] text-content-muted truncate">{m.vehicle}</p>
          </div>
          <StatusBadge status={m.status} />
        </li>
      ))}
    </ul>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('all');

  const recentTrips = MOCK_TRIPS.slice(0, 5);
  const filteredTrips = activeTab === 'all'
    ? recentTrips
    : recentTrips.filter(t => t.status === activeTab);

  const TABS = [
    { key: 'all',         label: 'All'         },
    { key: 'in_progress', label: 'Active'       },
    { key: 'completed',   label: 'Completed'    },
    { key: 'pending',     label: 'Pending'      },
  ];

  const STATUS_ICON = {
    completed:   <CheckCircle2 className="w-3.5 h-3.5 text-success" />,
    in_progress: <Activity     className="w-3.5 h-3.5 text-info"    />,
    dispatched:  <Circle       className="w-3.5 h-3.5 text-primary"  />,
    pending:     <Clock        className="w-3.5 h-3.5 text-warning"  />,
    cancelled:   <AlertTriangle className="w-3.5 h-3.5 text-danger"  />,
  };

  return (
    <PageShell
      title="Dashboard"
      subtitle="Welcome back — here's your fleet overview for today"
      actions={
        <Link to="/trips/create">
          <button className="btn-primary btn">
            <Plus className="w-4 h-4" /> Create Trip
          </button>
        </Link>
      }
    >
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard title="Total Vehicles"      value={DASHBOARD_STATS.totalVehicles.value}      trend={DASHBOARD_STATS.totalVehicles.trend}      trendLabel={DASHBOARD_STATS.totalVehicles.trendLabel}      icon={Truck}       iconColor="text-primary"   iconBg="bg-primary/10"   to="/vehicles"    />
        <KpiCard title="Active Drivers"      value={DASHBOARD_STATS.activeDrivers.value}      trend={DASHBOARD_STATS.activeDrivers.trend}      trendLabel={DASHBOARD_STATS.activeDrivers.trendLabel}      icon={Users}       iconColor="text-secondary" iconBg="bg-secondary/10" to="/drivers"     />
        <KpiCard title="Trips This Month"    value={DASHBOARD_STATS.tripsThisMonth.value}     trend={DASHBOARD_STATS.tripsThisMonth.trend}     trendLabel={DASHBOARD_STATS.tripsThisMonth.trendLabel}     icon={Route}       iconColor="text-accent"    iconBg="bg-accent/10"    to="/trips"       />
        <KpiCard title="Pending Maintenance" value={DASHBOARD_STATS.pendingMaintenance.value} trend={DASHBOARD_STATS.pendingMaintenance.trend} trendLabel={DASHBOARD_STATS.pendingMaintenance.trendLabel} icon={Wrench}      iconColor="text-warning"   iconBg="bg-warning/10"   to="/maintenance" />
      </div>

      {/* ── Secondary KPIs ── */}
      <div className="grid grid-cols-2 gap-3">
        <KpiCard title="Revenue This Month" value={DASHBOARD_STATS.totalRevenue.value} trend={DASHBOARD_STATS.totalRevenue.trend} trendLabel={DASHBOARD_STATS.totalRevenue.trendLabel} icon={DollarSign} iconColor="text-success" iconBg="bg-success/10" />
        <KpiCard title="Fuel Cost This Month" value={DASHBOARD_STATS.fuelCost.value} trend={DASHBOARD_STATS.fuelCost.trend} trendLabel={DASHBOARD_STATS.fuelCost.trendLabel} icon={Fuel} iconColor="text-info" iconBg="bg-info/10" to="/finance/fuel" />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Recent Trips — 2/3 width */}
        <div className="xl:col-span-2 bg-bg-card border border-border-card rounded-xl shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-content-primary">Recent Trips</h2>
            <Link to="/trips" className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover transition-colors font-medium">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-5 pt-3">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  activeTab === t.key
                    ? 'bg-primary/10 text-primary'
                    : 'text-content-muted hover:text-content-primary hover:bg-bg-hover'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-content-disabled uppercase tracking-wider">Trip</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-content-disabled uppercase tracking-wider hidden sm:table-cell">Route</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-content-disabled uppercase tracking-wider hidden md:table-cell">Driver</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-content-disabled uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold text-content-disabled uppercase tracking-wider hidden sm:table-cell">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredTrips.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-sm text-content-muted">No trips found</td></tr>
                ) : filteredTrips.map(trip => (
                  <tr key={trip.id} className="hover:bg-bg-hover/50 transition-colors duration-100">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {STATUS_ICON[trip.status]}
                        <span className="text-xs font-semibold text-content-primary">#{trip.id}</span>
                      </div>
                      <p className="text-[11px] text-content-muted mt-0.5">{trip.cargo}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <p className="text-xs text-content-secondary truncate max-w-[160px]">{trip.origin}</p>
                      <p className="text-[11px] text-content-muted truncate max-w-[160px]">→ {trip.destination}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <p className="text-xs text-content-secondary">{trip.driver}</p>
                      <p className="text-[11px] text-content-muted">{trip.vehicle}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={trip.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                      <span className="text-xs font-semibold text-content-primary">
                        {trip.cost > 0 ? `₹${trip.cost.toLocaleString()}` : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Fleet Status */}
          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-content-primary">Fleet Status</h2>
              <Link to="/vehicles" className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover transition-colors font-medium">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="p-5">
              <FleetStatusBar />
            </div>
          </div>

          {/* Maintenance Alerts */}
          <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-content-primary">Maintenance Alerts</h2>
              <Link to="/maintenance" className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover transition-colors font-medium">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="px-5 py-4">
              <MaintenanceAlerts />
            </div>
          </div>
        </div>
      </div>

      {/* ── Activity Feed + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Activity Feed */}
        <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <Activity className="w-4 h-4 text-content-muted" />
            <h2 className="text-sm font-semibold text-content-primary">Recent Activity</h2>
          </div>
          <ul className="divide-y divide-border/50 px-5">
            {ACTIVITY.map(item => (
              <li key={item.id} className="flex items-start gap-3 py-3">
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${item.bg}`}>
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-content-secondary leading-snug">{item.text}</p>
                  <p className="text-[11px] text-content-disabled mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <BarChart3 className="w-4 h-4 text-content-muted" />
            <h2 className="text-sm font-semibold text-content-primary">Quick Actions</h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {[
              { label: 'Add Vehicle',  to: '/vehicles/add',  icon: Truck,       color: 'text-primary',   bg: 'bg-primary/10'   },
              { label: 'Add Driver',   to: '/drivers/add',   icon: Users,       color: 'text-secondary', bg: 'bg-secondary/10' },
              { label: 'Create Trip',  to: '/trips/create',  icon: Route,       color: 'text-accent',    bg: 'bg-accent/10'    },
              { label: 'Log Expense',  to: '/finance/expenses', icon: DollarSign, color: 'text-success', bg: 'bg-success/10'   },
              { label: 'Fuel Log',     to: '/finance/fuel',  icon: Fuel,        color: 'text-info',      bg: 'bg-info/10'      },
              { label: 'Maintenance',  to: '/maintenance',   icon: Wrench,      color: 'text-warning',   bg: 'bg-warning/10'   },
            ].map(({ label, to, icon: Icon, color, bg }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-secondary hover:bg-bg-hover hover:border-border-strong transition-all duration-200 group"
              >
                <div className={`p-2 rounded-lg ${bg} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className="text-xs font-medium text-content-secondary group-hover:text-content-primary transition-colors">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
