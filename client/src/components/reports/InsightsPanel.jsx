import {
  TrendingUp, Fuel, DollarSign, BarChart2, Wrench, Star, Activity, Lightbulb,
} from 'lucide-react';
import { INSIGHTS } from '@utils/reportsMockData';

const ICON_MAP = { TrendingUp, Fuel, DollarSign, BarChart2, Wrench, Star, Activity };

const TYPE_STYLES = {
  success: { bg: 'bg-success/10', border: 'border-success/20', icon: 'text-success', dot: 'bg-success' },
  danger:  { bg: 'bg-danger/10',  border: 'border-danger/20',  icon: 'text-danger',  dot: 'bg-danger'  },
  warning: { bg: 'bg-warning/10', border: 'border-warning/20', icon: 'text-warning', dot: 'bg-warning' },
  primary: { bg: 'bg-primary/10', border: 'border-primary/20', icon: 'text-primary', dot: 'bg-primary' },
  accent:  { bg: 'bg-accent/10',  border: 'border-accent/20',  icon: 'text-accent',  dot: 'bg-accent'  },
};

export default function InsightsPanel() {
  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
        <div className="p-2 rounded-xl bg-accent/10">
          <Lightbulb className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-content-primary">AI Insights Panel</h3>
          <p className="text-xs text-content-muted">Auto-generated business intelligence</p>
        </div>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-semibold border border-accent/20">
          LIVE
        </span>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INSIGHTS.map((ins, i) => {
          const Icon = ICON_MAP[ins.icon] || Activity;
          const s    = TYPE_STYLES[ins.type] || TYPE_STYLES.primary;
          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-3.5 rounded-xl border ${s.bg} ${s.border} hover:scale-[1.01] transition-transform duration-200 cursor-default`}
            >
              <div className={`p-2 rounded-lg bg-bg-card/60 ${s.icon} shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-content-muted uppercase tracking-wider font-medium">{ins.title}</p>
                <p className="text-sm font-semibold text-content-primary truncate">{ins.value}</p>
                <p className="text-xs text-content-muted mt-0.5">{ins.detail}</p>
              </div>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${s.dot}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
