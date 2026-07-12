import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon,
  iconColor = 'text-primary',
  iconBg    = 'bg-primary/10',
  className = '',
}) {
  const Icon = icon;

  const trendConfig = {
    up:      { icon: TrendingUp,   cls: 'text-success' },
    down:    { icon: TrendingDown, cls: 'text-danger'  },
    neutral: { icon: Minus,        cls: 'text-content-muted' },
  };

  const TrendIcon = trend ? trendConfig[trend]?.icon : null;
  const trendCls  = trend ? trendConfig[trend]?.cls  : '';

  return (
    <div
      className={[
        'bg-bg-card border border-border-card rounded-xl shadow-card p-6',
        'hover:border-border-strong hover:shadow-card-md transition-all duration-200',
        className,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-content-muted truncate">{title}</p>
          <p className="mt-2 text-3xl font-bold text-content-primary tracking-tight">{value}</p>
          {(trendLabel || subtitle) && (
            <div className="mt-2 flex items-center gap-1.5">
              {TrendIcon && <TrendIcon className={`w-3.5 h-3.5 ${trendCls}`} />}
              <span className={`text-xs font-medium ${trendCls || 'text-content-muted'}`}>
                {trendLabel || subtitle}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl shrink-0 ${iconBg}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
      </div>
    </div>
  );
}
