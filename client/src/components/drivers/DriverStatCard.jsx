import { TrendingUp, TrendingDown } from 'lucide-react';

export default function DriverStatCard({ title, value, description, trend, trendValue, icon: Icon, color, delay = 0 }) {
  const isUp = trend === 'up';

  return (
    <div
      className="relative overflow-hidden rounded-[20px] bg-bg-card border border-border shadow-card-md
        hover:shadow-card-lg hover:-translate-y-1 hover:border-border-strong
        transition-all duration-300 cursor-default group p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient left border accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[20px]"
        style={{ background: `linear-gradient(180deg, ${color}cc, ${color}44)` }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[20px]"
        style={{ background: `radial-gradient(ellipse at top left, ${color}12 0%, transparent 65%)` }}
      />

      <div className="pl-3 relative z-10">
        {/* Icon + title */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-content-muted uppercase tracking-widest truncate">{title}</p>
            <p className="mt-2 text-3xl font-bold text-content-primary tracking-tight leading-none">{value}</p>
            {description && (
              <p className="mt-1.5 text-xs text-content-muted truncate">{description}</p>
            )}
          </div>
          <div
            className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
            style={{ background: `${color}20`, border: `1px solid ${color}35` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        </div>

        {/* Trend */}
        {trendValue && (
          <div className="mt-4 flex items-center gap-1.5">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${isUp ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
              {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trendValue}
            </div>
            <span className="text-[11px] text-content-disabled">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
