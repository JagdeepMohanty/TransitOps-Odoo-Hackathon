import { AlertTriangle, Fuel, Wrench, TrendingDown, AlertCircle } from 'lucide-react';
import { LOW_PERFORMING_VEHICLES } from '@utils/reportsMockData';

const SEVERITY_STYLES = {
  critical: { bg: 'bg-danger/10',  border: 'border-danger/30',  icon: 'text-danger',  badge: 'bg-danger/10 text-danger border-danger/20',  Icon: AlertCircle  },
  warning:  { bg: 'bg-warning/10', border: 'border-warning/30', icon: 'text-warning', badge: 'bg-warning/10 text-warning border-warning/20', Icon: AlertTriangle },
};

const REASON_ICONS = {
  'High Maintenance Cost': Wrench,
  'Low Efficiency':        TrendingDown,
  'High Fuel Consumption': Fuel,
  'Negative ROI':          TrendingDown,
};

export default function LowPerformingVehicles() {
  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
        <div className="p-2 rounded-xl bg-danger/10">
          <AlertTriangle className="w-4 h-4 text-danger" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-content-primary">Low Performing Vehicles</h3>
          <p className="text-xs text-content-muted">Vehicles requiring immediate attention</p>
        </div>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-danger/10 text-danger text-[10px] font-semibold border border-danger/20">
          {LOW_PERFORMING_VEHICLES.length} Alerts
        </span>
      </div>

      <div className="p-4 space-y-3">
        {LOW_PERFORMING_VEHICLES.map((v, i) => {
          const s    = SEVERITY_STYLES[v.severity] || SEVERITY_STYLES.warning;
          const RIcon = REASON_ICONS[v.reason] || AlertTriangle;
          return (
            <div
              key={i}
              className={`flex items-center gap-4 p-4 rounded-xl border ${s.bg} ${s.border} hover:scale-[1.01] transition-transform duration-200`}
            >
              <div className={`p-2.5 rounded-xl bg-bg-card/60 ${s.icon} shrink-0`}>
                <RIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-content-primary">{v.vehicle}</p>
                  <span className="text-[10px] font-mono text-content-muted">{v.plate}</span>
                </div>
                <p className="text-xs text-content-muted mt-0.5">{v.detail}</p>
              </div>
              <span className={`shrink-0 px-2.5 py-1 rounded-lg border text-[10px] font-semibold ${s.badge}`}>
                {v.reason}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
