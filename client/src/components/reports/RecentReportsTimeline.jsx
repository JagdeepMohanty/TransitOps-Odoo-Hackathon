import { FileBarChart, Download, Receipt, Fuel, Wrench, Clock } from 'lucide-react';
import { RECENT_REPORTS } from '@utils/reportsMockData';

const ICON_MAP = { FileBarChart, Download, Receipt, Fuel, Wrench };

const COLOR_STYLES = {
  primary: { bg: 'bg-primary/10', icon: 'text-primary', line: 'bg-primary/30' },
  success: { bg: 'bg-success/10', icon: 'text-success', line: 'bg-success/30' },
  warning: { bg: 'bg-warning/10', icon: 'text-warning', line: 'bg-warning/30' },
  accent:  { bg: 'bg-accent/10',  icon: 'text-accent',  line: 'bg-accent/30'  },
  danger:  { bg: 'bg-danger/10',  icon: 'text-danger',  line: 'bg-danger/30'  },
};

export default function RecentReportsTimeline() {
  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
        <div className="p-2 rounded-xl bg-primary/10">
          <Clock className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-content-primary">Recent Reports</h3>
          <p className="text-xs text-content-muted">Latest generated and exported reports</p>
        </div>
      </div>

      <div className="p-5">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-4 bottom-4 w-px bg-border/40" />

          <div className="space-y-4">
            {RECENT_REPORTS.map((r, i) => {
              const Icon = ICON_MAP[r.icon] || FileBarChart;
              const s    = COLOR_STYLES[r.color] || COLOR_STYLES.primary;
              return (
                <div key={r.id} className="flex items-start gap-4 group">
                  {/* Icon dot */}
                  <div className={`relative z-10 w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center shrink-0 border border-border/40 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-3.5 h-3.5 ${s.icon}`} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-content-primary truncate">{r.title}</p>
                      <span className="text-[10px] text-content-muted whitespace-nowrap shrink-0">{r.time}</span>
                    </div>
                    <span className={`inline-block mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${s.bg} ${s.icon}`}>
                      {r.type}
                    </span>
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
