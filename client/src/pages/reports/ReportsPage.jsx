import { BarChart3, Download, TrendingUp, TrendingDown, Fuel, DollarSign, Truck, Route } from 'lucide-react';
import PageShell      from '@components/layout/PageShell';
import Button         from '@components/common/Button';
import FilterDropdown from '@components/common/FilterDropdown';
import { MOCK_TRIPS, MOCK_EXPENSES, MOCK_FUEL_LOGS, MOCK_VEHICLES } from '@utils/mockData';

const PERIOD_OPTIONS = [
  { label: 'Last 7 days',   value: '7d'  },
  { label: 'Last 30 days',  value: '30d' },
  { label: 'Last 3 months', value: '3m'  },
  { label: 'Last year',     value: '1y'  },
];

// ─── Metric Row ───────────────────────────────────────────────
function MetricRow({ label, value, trend, trendLabel }) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendCls  = trend === 'up' ? 'text-success' : 'text-danger';
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <span className="text-xs text-content-muted">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-content-primary">{value}</span>
        {trend && (
          <div className={`flex items-center gap-0.5 ${trendCls}`}>
            <TrendIcon className="w-3 h-3" />
            <span className="text-[11px] font-medium">{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Chart Placeholder ────────────────────────────────────────
function ChartPlaceholder({ title, subtitle, icon: Icon, color, metrics }) {
  return (
    <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-content-primary">{title}</h2>
        </div>
        <Button variant="ghost" size="sm" icon={Download}>Export</Button>
      </div>

      {/* Visual bar chart simulation */}
      <div className="px-6 pt-5 pb-2">
        <div className="flex items-end gap-2 h-28">
          {[65, 80, 45, 90, 70, 55, 85, 60, 75, 95, 50, 88].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-sm transition-all duration-500 ${color.replace('bg-', 'bg-').replace('/10', '/40')}`}
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
            <span key={m} className="text-[9px] text-content-disabled">{m}</span>
          ))}
        </div>
      </div>

      <div className="px-6 pb-5">
        <p className="text-xs text-content-muted mb-3">{subtitle}</p>
        {metrics.map(m => <MetricRow key={m.label} {...m} />)}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const totalRevenue  = MOCK_TRIPS.filter(t => t.status === 'completed').reduce((s, t) => s + t.cost, 0);
  const totalExpenses = MOCK_EXPENSES.reduce((s, e) => s + e.amount, 0);
  const totalFuel     = MOCK_FUEL_LOGS.reduce((s, f) => s + f.totalCost, 0);
  const completedTrips = MOCK_TRIPS.filter(t => t.status === 'completed').length;
  const avgTripCost   = completedTrips > 0 ? Math.round(totalRevenue / completedTrips) : 0;
  const fleetUtil     = Math.round((MOCK_VEHICLES.filter(v => v.status !== 'retired').length / MOCK_VEHICLES.length) * 100);

  return (
    <PageShell
      title="Reports"
      subtitle="Analytics and insights for your fleet operations"
      actions={<Button variant="secondary" icon={Download}>Export All</Button>}
    >
      {/* Filters */}
      <div className="flex gap-3">
        <FilterDropdown label="Period" options={PERIOD_OPTIONS} />
      </div>

      {/* Top KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue',    value: `₹${totalRevenue.toLocaleString()}`,  icon: DollarSign, color: 'bg-success/10 text-success',   trend: 'up',   trendLabel: '+12%' },
          { label: 'Total Expenses',   value: `₹${totalExpenses.toLocaleString()}`, icon: TrendingDown, color: 'bg-danger/10 text-danger',   trend: 'down', trendLabel: '-5%'  },
          { label: 'Completed Trips',  value: completedTrips,                        icon: Route,      color: 'bg-primary/10 text-primary',   trend: 'up',   trendLabel: '+18%' },
          { label: 'Fleet Utilization',value: `${fleetUtil}%`,                       icon: Truck,      color: 'bg-accent/10 text-accent',     trend: 'up',   trendLabel: '+3%'  },
        ].map(({ label, value, icon: Icon, color, trend, trendLabel }) => {
          const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
          const trendCls  = trend === 'up' ? 'text-success' : 'text-danger';
          return (
            <div key={label} className="bg-bg-card border border-border-card rounded-xl p-4 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-content-muted uppercase tracking-wider">{label}</p>
                <div className={`p-1.5 rounded-lg ${color}`}><Icon className="w-3.5 h-3.5" /></div>
              </div>
              <p className="text-xl font-bold text-content-primary">{value}</p>
              <div className={`flex items-center gap-1 mt-1 ${trendCls}`}>
                <TrendIcon className="w-3 h-3" />
                <span className="text-[11px] font-medium">{trendLabel} vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartPlaceholder
          title="Fuel Efficiency"
          subtitle="Average km/liter across fleet vehicles"
          icon={Fuel}
          color="bg-info/10 text-info"
          metrics={[
            { label: 'Avg Fuel Efficiency', value: '8.4 km/L',  trend: 'up',   trendLabel: '+0.3' },
            { label: 'Total Fuel Consumed', value: `${MOCK_FUEL_LOGS.reduce((s,f)=>s+f.liters,0)}L`, trend: 'down', trendLabel: '-5%' },
            { label: 'Fuel Cost This Month', value: `₹${totalFuel.toLocaleString()}`, trend: 'down', trendLabel: '-8%' },
          ]}
        />
        <ChartPlaceholder
          title="Operational Costs"
          subtitle="Monthly breakdown of all fleet expenses"
          icon={DollarSign}
          color="bg-warning/10 text-warning"
          metrics={[
            { label: 'Total Expenses',    value: `₹${totalExpenses.toLocaleString()}`, trend: 'down', trendLabel: '-5%'  },
            { label: 'Avg Cost per Trip', value: `₹${avgTripCost.toLocaleString()}`,   trend: 'up',   trendLabel: '+2%'  },
            { label: 'Maintenance Share', value: '52%',                                 trend: 'down', trendLabel: '-3%'  },
          ]}
        />
        <ChartPlaceholder
          title="Vehicle Performance"
          subtitle="Trip completion rate and distance covered"
          icon={Truck}
          color="bg-primary/10 text-primary"
          metrics={[
            { label: 'Trips Completed',   value: completedTrips,                        trend: 'up',   trendLabel: '+18%' },
            { label: 'Total Distance',    value: `${MOCK_TRIPS.reduce((s,t)=>s+t.distance,0).toLocaleString()} km`, trend: 'up', trendLabel: '+12%' },
            { label: 'Cancellation Rate', value: '12.5%',                               trend: 'down', trendLabel: '-2%'  },
          ]}
        />
        <ChartPlaceholder
          title="Fleet Utilization"
          subtitle="Active vs idle vehicle hours per month"
          icon={Route}
          color="bg-accent/10 text-accent"
          metrics={[
            { label: 'Fleet Utilization', value: `${fleetUtil}%`,                       trend: 'up',   trendLabel: '+3%'  },
            { label: 'Active Vehicles',   value: MOCK_VEHICLES.filter(v=>v.status!=='retired').length, trend: 'up', trendLabel: '+1' },
            { label: 'Avg Trips/Vehicle', value: (MOCK_TRIPS.length / MOCK_VEHICLES.length).toFixed(1), trend: 'up', trendLabel: '+0.5' },
          ]}
        />
      </div>
    </PageShell>
  );
}
