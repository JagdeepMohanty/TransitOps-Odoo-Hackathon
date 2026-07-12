import { TrendingUp, TrendingDown, Activity, Fuel, DollarSign, BarChart2, Route, Zap, Target } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const ICON_MAP = { Activity, Fuel, DollarSign, BarChart2, Route, Zap, Target, TrendingUp };

const THEME = {
  primary: {
    border:   'border-primary/20',
    leftBar:  'bg-gradient-to-b from-primary to-primary/10',
    iconBg:   'bg-primary/10 text-primary',
    glow:     'hover:shadow-[0_0_28px_rgba(59,130,246,0.18)]',
    spark:    '#3B82F6',
    hoverBg:  'hover:border-primary/40',
  },
  success: {
    border:   'border-success/20',
    leftBar:  'bg-gradient-to-b from-success to-success/10',
    iconBg:   'bg-success/10 text-success',
    glow:     'hover:shadow-[0_0_28px_rgba(34,197,94,0.18)]',
    spark:    '#22C55E',
    hoverBg:  'hover:border-success/40',
  },
  warning: {
    border:   'border-warning/20',
    leftBar:  'bg-gradient-to-b from-warning to-warning/10',
    iconBg:   'bg-warning/10 text-warning',
    glow:     'hover:shadow-[0_0_28px_rgba(245,158,11,0.18)]',
    spark:    '#F59E0B',
    hoverBg:  'hover:border-warning/40',
  },
  danger: {
    border:   'border-danger/20',
    leftBar:  'bg-gradient-to-b from-danger to-danger/10',
    iconBg:   'bg-danger/10 text-danger',
    glow:     'hover:shadow-[0_0_28px_rgba(239,68,68,0.18)]',
    spark:    '#EF4444',
    hoverBg:  'hover:border-danger/40',
  },
  accent: {
    border:   'border-accent/20',
    leftBar:  'bg-gradient-to-b from-accent to-accent/10',
    iconBg:   'bg-accent/10 text-accent',
    glow:     'hover:shadow-[0_0_28px_rgba(139,92,246,0.18)]',
    spark:    '#8B5CF6',
    hoverBg:  'hover:border-accent/40',
  },
  info: {
    border:   'border-[#38BDF8]/20',
    leftBar:  'bg-gradient-to-b from-[#38BDF8] to-[#38BDF8]/10',
    iconBg:   'bg-[#38BDF8]/10 text-[#38BDF8]',
    glow:     'hover:shadow-[0_0_28px_rgba(56,189,248,0.18)]',
    spark:    '#38BDF8',
    hoverBg:  'hover:border-[#38BDF8]/40',
  },
};

function fmt(value, unit) {
  if (unit === '₹') {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000)   return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  }
  if (unit === '%')    return `${value}%`;
  if (unit === 'km/L') return `${value} km/L`;
  if (unit === 'km')   return `${value} km`;
  if (unit === 'L')    return `${value.toLocaleString()} L`;
  return String(value);
}

export default function AnalyticsStatCard({ label, value, unit, trend, sparkline = [], icon, color = 'primary' }) {
  const t         = THEME[color] || THEME.primary;
  const Icon      = ICON_MAP[icon] || Activity;
  const isUp      = trend >= 0;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const trendCls  = isUp ? 'text-success' : 'text-danger';
  const sparkData = sparkline.map((v, i) => ({ i, v }));

  return (
    <div
      className={`
        relative group overflow-hidden rounded-2xl border bg-bg-card
        shadow-card transition-all duration-300 cursor-default
        hover:-translate-y-1
        ${t.border} ${t.glow} ${t.hoverBg}
      `}
    >
      {/* Gradient left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${t.leftBar}`} />

      <div className="pl-4 pr-4 pt-4 pb-3">
        {/* Top row: icon + sparkline */}
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-xl ${t.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="w-[72px] h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={t.spark}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Value */}
        <p className="text-[22px] font-bold text-content-primary tracking-tight leading-none mb-1">
          {fmt(value, unit)}
        </p>

        {/* Label */}
        <p className="text-[10px] font-semibold text-content-muted uppercase tracking-widest mb-2.5">
          {label}
        </p>

        {/* Trend pill */}
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg-base ${trendCls}`}>
          <TrendIcon className="w-2.5 h-2.5" />
          <span className="text-[10px] font-bold">{isUp ? '+' : ''}{trend}%</span>
          <span className="text-[10px] text-content-disabled font-normal">vs last mo.</span>
        </div>
      </div>
    </div>
  );
}
