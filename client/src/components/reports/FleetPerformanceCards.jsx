import { Truck, Star } from 'lucide-react';
import { FLEET_PERFORMANCE } from '@utils/reportsMockData';

function ScoreBadge({ score }) {
  const color =
    score >= 90 ? 'text-success bg-success/10 border-success/20' :
    score >= 70 ? 'text-primary bg-primary/10 border-primary/20' :
    score >= 50 ? 'text-warning bg-warning/10 border-warning/20' :
                  'text-danger  bg-danger/10  border-danger/20';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-bold ${color}`}>
      <Star className="w-3 h-3" />
      {score}
    </span>
  );
}

function ProgressBar({ value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-1.5 bg-bg-base rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

const MAX = {
  trips: 50, distance: 10000, fuelUsed: 1200, efficiency: 10,
  cost: 120000, revenue: 130000, roi: 35,
};

const METRIC_COLOR = {
  trips: '#3B82F6', distance: '#22C55E', fuelUsed: '#F59E0B',
  efficiency: '#38BDF8', cost: '#EF4444', revenue: '#22C55E', roi: '#8B5CF6',
};

export default function FleetPerformanceCards() {
  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
        <div className="p-2 rounded-xl bg-primary/10">
          <Truck className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-content-primary">Fleet Performance Dashboard</h3>
          <p className="text-xs text-content-muted">Per-vehicle breakdown with performance scores</p>
        </div>
      </div>

      <div className="divide-y divide-border/40">
        {FLEET_PERFORMANCE.map(v => (
          <div
            key={v.id}
            className="px-6 py-4 hover:bg-bg-hover/40 transition-colors duration-150 group"
          >
            {/* Vehicle name row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-content-primary">{v.name}</p>
                  <p className="text-xs text-content-muted font-mono">{v.plate}</p>
                </div>
              </div>
              <ScoreBadge score={v.score} />
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { key: 'trips',      label: 'Trips',      value: v.trips,      fmt: v => `${v}`,                  max: MAX.trips      },
                { key: 'distance',   label: 'Distance',   value: v.distance,   fmt: v => `${v.toLocaleString()} km`, max: MAX.distance   },
                { key: 'fuelUsed',   label: 'Fuel Used',  value: v.fuelUsed,   fmt: v => `${v} L`,                max: MAX.fuelUsed   },
                { key: 'efficiency', label: 'Efficiency', value: v.efficiency, fmt: v => `${v} km/L`,             max: MAX.efficiency },
                { key: 'cost',       label: 'Cost',       value: v.cost,       fmt: v => `₹${(v/1000).toFixed(0)}K`, max: MAX.cost    },
                { key: 'roi',        label: 'ROI',        value: v.roi,        fmt: v => `${v}%`,                 max: MAX.roi        },
              ].map(m => (
                <div key={m.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-content-muted uppercase tracking-wider">{m.label}</span>
                    <span className={`text-xs font-semibold ${m.key === 'roi' && m.value < 0 ? 'text-danger' : 'text-content-primary'}`}>
                      {m.fmt(m.value)}
                    </span>
                  </div>
                  <ProgressBar value={Math.max(m.value, 0)} max={m.max} color={METRIC_COLOR[m.key]} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
