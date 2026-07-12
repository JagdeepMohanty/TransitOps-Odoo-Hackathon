import { Users, UserCheck, Shield, Key, MailOpen, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { SETTINGS_KPI } from '@utils/settingsMockData';

const CARD_CONFIG = [
  {
    key: 'totalUsers',
    icon: Users,
    color: 'primary',
    spark: [18,19,20,20,21,22,22,23,24,24],
    border: 'border-primary/20',
    glow:   'hover:shadow-[0_0_28px_rgba(59,130,246,0.18)]',
    bar:    'from-primary to-primary/10',
    iconBg: 'bg-primary/10 text-primary',
    sparkC: '#3B82F6',
  },
  {
    key: 'activeUsers',
    icon: UserCheck,
    color: 'success',
    spark: [14,15,15,16,17,17,18,18,19,19],
    border: 'border-success/20',
    glow:   'hover:shadow-[0_0_28px_rgba(34,197,94,0.18)]',
    bar:    'from-success to-success/10',
    iconBg: 'bg-success/10 text-success',
    sparkC: '#22C55E',
  },
  {
    key: 'roles',
    icon: Shield,
    color: 'accent',
    spark: [6,6,6,6,6,6,6,6,6,6],
    border: 'border-accent/20',
    glow:   'hover:shadow-[0_0_28px_rgba(139,92,246,0.18)]',
    bar:    'from-accent to-accent/10',
    iconBg: 'bg-accent/10 text-accent',
    sparkC: '#8B5CF6',
  },
  {
    key: 'permissions',
    icon: Key,
    color: 'warning',
    spark: [42,44,44,46,48,48,50,52,54,54],
    border: 'border-warning/20',
    glow:   'hover:shadow-[0_0_28px_rgba(245,158,11,0.18)]',
    bar:    'from-warning to-warning/10',
    iconBg: 'bg-warning/10 text-warning',
    sparkC: '#F59E0B',
  },
  {
    key: 'pendingInvites',
    icon: MailOpen,
    color: 'info',
    spark: [5,5,4,4,4,4,3,3,3,3],
    border: 'border-[#38BDF8]/20',
    glow:   'hover:shadow-[0_0_28px_rgba(56,189,248,0.18)]',
    bar:    'from-[#38BDF8] to-[#38BDF8]/10',
    iconBg: 'bg-[#38BDF8]/10 text-[#38BDF8]',
    sparkC: '#38BDF8',
  },
  {
    key: 'securityScore',
    icon: ShieldCheck,
    color: 'success',
    spark: [72,74,75,78,79,80,82,84,85,87],
    border: 'border-success/20',
    glow:   'hover:shadow-[0_0_28px_rgba(34,197,94,0.18)]',
    bar:    'from-success to-success/10',
    iconBg: 'bg-success/10 text-success',
    sparkC: '#22C55E',
  },
];

export default function SettingsKpiCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {CARD_CONFIG.map(({ key, icon: Icon, border, glow, bar, iconBg, sparkC, spark }) => {
        const d      = SETTINGS_KPI[key];
        const isUp   = d.trend >= 0;
        const TIcon  = isUp ? TrendingUp : TrendingDown;
        const tColor = isUp ? 'text-success' : 'text-danger';
        const sparkData = spark.map((v, i) => ({ i, v }));

        return (
          <div
            key={key}
            className={`
              relative group overflow-hidden rounded-2xl border bg-bg-card
              shadow-card transition-all duration-300 cursor-default
              hover:-translate-y-1 ${border} ${glow}
            `}
          >
            {/* Left accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${bar}`} />

            <div className="pl-4 pr-4 pt-4 pb-3">
              {/* Icon + sparkline */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl ${iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="w-[64px] h-7">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkData}>
                      <Line type="monotone" dataKey="v" stroke={sparkC} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Value */}
              <p className="text-[22px] font-bold text-content-primary tracking-tight leading-none mb-1">
                {key === 'securityScore' ? `${d.value}%` : d.value}
              </p>

              {/* Label */}
              <p className="text-[10px] font-semibold text-content-muted uppercase tracking-widest mb-2.5 leading-tight">
                {d.label}
              </p>

              {/* Trend */}
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg-base ${tColor}`}>
                <TIcon className="w-2.5 h-2.5" />
                <span className="text-[10px] font-bold">{isUp ? '+' : ''}{d.trend}</span>
                <span className="text-[10px] text-content-disabled font-normal">vs last mo.</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
