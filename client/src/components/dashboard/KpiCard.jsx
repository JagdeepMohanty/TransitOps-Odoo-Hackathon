import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TREND_MAP = {
  up:      { Icon: TrendingUp,   cls: 'text-success', bg: 'bg-success/10' },
  down:    { Icon: TrendingDown, cls: 'text-danger',  bg: 'bg-danger/10'  },
  neutral: { Icon: Minus,        cls: 'text-content-muted', bg: 'bg-bg-hover' },
};

export default function KpiCard({ title, value, subtitle, trend = 'neutral', trendLabel, icon, iconColor = 'text-primary', iconBg = 'bg-primary/10' }) {
  const Icon = icon;
  const t    = TREND_MAP[trend] ?? TREND_MAP.neutral;

  return (
    <div className="bg-bg-card border border-border-card rounded-xl shadow-card p-5 hover:border-border-strong hover:shadow-card-md transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-content-disabled uppercase tracking-wider truncate">{title}</p>
          <p className="mt-2.5 text-3xl font-bold text-content-primary tracking-tight leading-none">{value}</p>
          {(trendLabel || subtitle) && (
            <div className="mt-2.5 flex items-center gap-1.5">
              {trend !== 'neutral' && <t.Icon className={`w-3.5 h-3.5 ${t.cls} shrink-0`} />}
              <span className={`text-xs font-medium ${t.cls}`}>{trendLabel || subtitle}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl shrink-0 ${iconBg} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
      </div>
    </div>
  );
}
