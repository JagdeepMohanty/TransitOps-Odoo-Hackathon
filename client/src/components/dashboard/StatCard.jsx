import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, description, trend, trendValue, icon: Icon, iconColor, gradientFrom, gradientTo, delay = 0 }) {
  const isUp = trend === 'up';

  return (
    <div
      className="relative overflow-hidden rounded-[20px] border border-border bg-bg-card p-5 shadow-card-md
        hover:shadow-card-lg hover:-translate-y-1 hover:border-border-strong
        transition-all duration-300 cursor-default group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient glow background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top right, ${gradientFrom}18 0%, transparent 70%)`,
        }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-content-muted uppercase tracking-widest truncate">{title}</p>
          <p className="mt-2 text-3xl font-bold text-content-primary tracking-tight leading-none">{value}</p>
          {description && (
            <p className="mt-1.5 text-xs text-content-muted truncate">{description}</p>
          )}
        </div>

        {/* Icon */}
        <div
          className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
          style={{ background: `linear-gradient(135deg, ${gradientFrom}30, ${gradientTo}20)`, border: `1px solid ${gradientFrom}40` }}
        >
          <Icon className="w-6 h-6" style={{ color: gradientFrom }} />
        </div>
      </div>

      {/* Trend */}
      <div className="mt-4 flex items-center gap-1.5 relative z-10">
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${isUp ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trendValue}
        </div>
        <span className="text-[11px] text-content-disabled">vs last month</span>
      </div>

      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${gradientFrom}, transparent)` }}
      />
    </div>
  );
}
