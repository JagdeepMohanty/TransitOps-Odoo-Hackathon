import { Link } from 'react-router-dom';
import { MOCK_VEHICLES } from '@utils/constants';

const STATUS_CONFIG = {
  available:   { label: 'Available',   color: 'bg-success',  text: 'text-success'  },
  on_trip:     { label: 'On Trip',     color: 'bg-primary',  text: 'text-primary'  },
  maintenance: { label: 'Maintenance', color: 'bg-warning',  text: 'text-warning'  },
  retired:     { label: 'Retired',     color: 'bg-content-disabled', text: 'text-content-disabled' },
};

export default function VehicleStatusChart() {
  const counts = MOCK_VEHICLES.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {});

  const total = MOCK_VEHICLES.length;

  return (
    <div className="px-6 py-4 space-y-3">
      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
        const count = counts[key] || 0;
        const pct   = total ? Math.round((count / total) * 100) : 0;
        return (
          <div key={key} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full shrink-0" style={{
              backgroundColor: key === 'available' ? '#22C55E' : key === 'on_trip' ? '#3B82F6' : key === 'maintenance' ? '#F59E0B' : '#64748B'
            }} />
            <span className="text-xs text-content-secondary flex-1">{cfg.label}</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-bg-hover rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${cfg.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`text-xs font-semibold w-6 text-right ${cfg.text}`}>{count}</span>
            </div>
          </div>
        );
      })}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <span className="text-xs text-content-muted">Total Fleet</span>
        <span className="text-sm font-bold text-content-primary">{total} vehicles</span>
      </div>
    </div>
  );
}
