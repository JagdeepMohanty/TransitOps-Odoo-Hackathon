import { RefreshCw, Shield, FileCheck, AlertTriangle, CheckCircle2, Route, UserX } from 'lucide-react';
import { SAFETY_EVENTS } from '@utils/driverMockData';

const EVENT_ICONS = {
  license_renewed:    { icon: FileCheck,    color: '#22C55E', bg: 'rgba(34,197,94,0.12)'   },
  score_updated:      { icon: RefreshCw,    color: '#3B82F6', bg: 'rgba(59,130,246,0.12)'  },
  training_completed: { icon: Shield,       color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)'  },
  suspended:          { icon: UserX,        color: '#EF4444', bg: 'rgba(239,68,68,0.12)'   },
  trip_completed:     { icon: CheckCircle2, color: '#22C55E', bg: 'rgba(34,197,94,0.12)'   },
  incident_reported:  { icon: AlertTriangle,color: '#F59E0B', bg: 'rgba(245,158,11,0.12)'  },
};

export default function SafetyTimeline() {
  return (
    <div className="bg-bg-card border border-border rounded-[20px] shadow-card-md overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h2 className="text-sm font-bold text-content-primary">Recent Safety Events</h2>
          <p className="text-xs text-content-muted mt-0.5">Live compliance & safety activity feed</p>
        </div>
        <button className="text-xs text-primary hover:text-primary-hover font-medium transition-colors">
          View all
        </button>
      </div>

      <div className="px-6 py-5">
        <div className="relative">
          {/* Vertical connector */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/50" />

          <div className="space-y-0">
            {SAFETY_EVENTS.map((ev, i) => {
              const cfg = EVENT_ICONS[ev.type] ?? EVENT_ICONS.score_updated;
              const Icon = cfg.icon;
              return (
                <div key={ev.id} className="relative flex gap-4 group">
                  {/* Icon */}
                  <div
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-border/50 group-hover:scale-110 transition-transform duration-200"
                    style={{ background: cfg.bg }}
                  >
                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                  </div>

                  {/* Content */}
                  <div className={`flex-1 min-w-0 ${i < SAFETY_EVENTS.length - 1 ? 'pb-5' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-content-primary leading-snug">{ev.desc}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: `${cfg.color}18`, color: cfg.color }}
                          >
                            {ev.driver}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-content-disabled whitespace-nowrap shrink-0 mt-0.5">{ev.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
