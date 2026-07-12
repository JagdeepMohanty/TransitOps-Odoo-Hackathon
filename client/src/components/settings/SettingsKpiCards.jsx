import { motion } from 'framer-motion';
import { Users, UserCheck, Shield, Key, MailOpen, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { SETTINGS_KPI } from '@utils/settingsMockData';

const CARD_CONFIG = [
  {
    key: 'totalUsers',
    icon: Users,
    spark: [18,19,20,20,21,22,22,23,24,28],
    border: 'border-primary/30',
    glow: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.25)]',
    topBar: 'from-primary via-primary/70 to-transparent',
    iconBg: 'bg-primary/15 text-primary border-primary/25',
    sparkColor: '#3B82F6',
    valueColor: 'text-primary',
    bgGlow: 'from-primary/8',
  },
  {
    key: 'activeUsers',
    icon: UserCheck,
    spark: [14,15,15,16,17,17,18,19,20,22],
    border: 'border-success/30',
    glow: 'hover:shadow-[0_0_40px_rgba(34,197,94,0.25)]',
    topBar: 'from-success via-success/70 to-transparent',
    iconBg: 'bg-success/15 text-success border-success/25',
    sparkColor: '#22C55E',
    valueColor: 'text-success',
    bgGlow: 'from-success/8',
  },
  {
    key: 'roles',
    icon: Shield,
    spark: [6,6,6,6,6,6,6,6,6,6],
    border: 'border-accent/30',
    glow: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]',
    topBar: 'from-accent via-accent/70 to-transparent',
    iconBg: 'bg-accent/15 text-accent border-accent/25',
    sparkColor: '#8B5CF6',
    valueColor: 'text-accent',
    bgGlow: 'from-accent/8',
  },
  {
    key: 'permissions',
    icon: Key,
    spark: [42,44,44,46,48,48,50,52,54,54],
    border: 'border-warning/30',
    glow: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]',
    topBar: 'from-warning via-warning/70 to-transparent',
    iconBg: 'bg-warning/15 text-warning border-warning/25',
    sparkColor: '#F59E0B',
    valueColor: 'text-warning',
    bgGlow: 'from-warning/8',
  },
  {
    key: 'pendingInvites',
    icon: MailOpen,
    spark: [5,5,4,4,4,4,3,3,4,4],
    border: 'border-[#38BDF8]/30',
    glow: 'hover:shadow-[0_0_40px_rgba(56,189,248,0.25)]',
    topBar: 'from-[#38BDF8] via-[#38BDF8]/70 to-transparent',
    iconBg: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/25',
    sparkColor: '#38BDF8',
    valueColor: 'text-[#38BDF8]',
    bgGlow: 'from-[#38BDF8]/8',
  },
  {
    key: 'securityScore',
    icon: ShieldCheck,
    spark: [72,74,75,78,79,82,84,87,90,92],
    border: 'border-success/30',
    glow: 'hover:shadow-[0_0_40px_rgba(34,197,94,0.25)]',
    topBar: 'from-success via-success/70 to-transparent',
    iconBg: 'bg-success/15 text-success border-success/25',
    sparkColor: '#22C55E',
    valueColor: 'text-success',
    bgGlow: 'from-success/8',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function SettingsKpiCards() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4"
    >
      {CARD_CONFIG.map(({ key, icon: Icon, spark, border, glow, topBar, iconBg, sparkColor, valueColor, bgGlow }) => {
        const d = SETTINGS_KPI[key];
        const isUp = d.trend >= 0;
        const TIcon = isUp ? TrendingUp : TrendingDown;
        const tColor = isUp ? 'text-success' : 'text-danger';
        const tBg    = isUp ? 'bg-success/10 border-success/25' : 'bg-danger/10 border-danger/25';
        const sparkData = spark.map((v, i) => ({ i, v }));

        return (
          <motion.div
            key={key}
            variants={item}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`relative group overflow-hidden rounded-2xl border bg-bg-card/90 backdrop-blur-sm shadow-card cursor-default ${border} ${glow} transition-shadow duration-300`}
          >
            {/* Top gradient bar */}
            <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${topBar}`} />

            {/* Background glow on hover */}
            <div className={`absolute inset-0 bg-gradient-to-b ${bgGlow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none`} />

            <div className="relative p-4">
              {/* Icon + Sparkline */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl border ${iconBg} shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="w-[60px] h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkData}>
                      <Line type="monotone" dataKey="v" stroke={sparkColor} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Value */}
              <p className={`text-2xl font-black tracking-tight leading-none mb-1 ${valueColor}`}>
                {d.value}{d.unit}
              </p>

              {/* Label */}
              <p className="text-[10px] font-bold text-content-muted uppercase tracking-widest mb-3 leading-tight">
                {d.label}
              </p>

              {/* Trend pill */}
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${tColor} ${tBg}`}>
                <TIcon className="w-2.5 h-2.5" />
                {isUp ? '+' : ''}{d.trend}
                <span className="font-normal text-content-disabled ml-0.5">vs last mo.</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
