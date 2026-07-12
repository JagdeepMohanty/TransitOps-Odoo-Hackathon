import { useState } from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { FLEET_UTILIZATION_TREND } from '@utils/reportsMockData';

const VIEWS   = ['daily', 'weekly', 'monthly'];
const COLORS  = { daily: '#3B82F6', weekly: '#8B5CF6', monthly: '#22C55E' };
const LABELS  = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1E293B] border border-border/60 rounded-xl p-3 shadow-modal text-xs min-w-[130px]">
      <p className="text-content-muted font-semibold mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-content-secondary capitalize">{p.dataKey}</span>
          </div>
          <span className="font-bold text-content-primary">{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

export default function FleetUtilizationChart() {
  const [active, setActive] = useState(['daily', 'weekly', 'monthly']);

  const toggle = v =>
    setActive(prev =>
      prev.includes(v)
        ? prev.length > 1 ? prev.filter(x => x !== v) : prev
        : [...prev, v]
    );

  const latest = FLEET_UTILIZATION_TREND[FLEET_UTILIZATION_TREND.length - 1];

  return (
    <div className="bg-bg-card border border-border/60 rounded-2xl shadow-card-md overflow-hidden">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-content-primary">Fleet Utilization Trend</h3>
            <p className="text-xs text-content-muted">Active vehicles as % of total fleet — Dec 2024</p>
          </div>
        </div>

        {/* Toggle pills */}
        <div className="flex items-center gap-1 p-1 bg-bg-base rounded-xl self-start sm:self-auto">
          {VIEWS.map(v => (
            <button
              key={v}
              onClick={() => toggle(v)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200"
              style={
                active.includes(v)
                  ? { background: COLORS[v], color: '#fff' }
                  : { color: '#94A3B8' }
              }
            >
              {LABELS[v]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-3 divide-x divide-border/40 border-b border-border/40">
        {VIEWS.map(v => (
          <div key={v} className="px-6 py-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[v] }} />
            <div>
              <p className="text-[10px] text-content-muted uppercase tracking-wider capitalize">{v}</p>
              <p className="text-sm font-bold text-content-primary">{latest[v]}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart ── */}
      <div className="px-2 pt-4 pb-2">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={FLEET_UTILIZATION_TREND} margin={{ top: 5, right: 16, left: -18, bottom: 0 }}>
            <defs>
              {VIEWS.map(v => (
                <linearGradient key={v} id={`fu-${v}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={COLORS[v]} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={COLORS[v]} stopOpacity={0}    />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.4} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${v}%`}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
            {VIEWS.filter(v => active.includes(v)).map(v => (
              <Area
                key={v}
                type="monotone"
                dataKey={v}
                stroke={COLORS[v]}
                strokeWidth={2}
                fill={`url(#fu-${v})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: COLORS[v] }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
