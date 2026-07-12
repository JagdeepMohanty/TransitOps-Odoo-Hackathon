import { Fuel } from 'lucide-react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { FUEL_EFFICIENCY_DATA } from '@utils/reportsMockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1E293B] border border-border/60 rounded-xl p-3 shadow-modal text-xs min-w-[150px]">
      <p className="text-content-muted font-semibold mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-content-secondary">{p.name}</span>
          </div>
          <span className="font-bold text-content-primary">
            {p.name === 'Efficiency' ? `${p.value} km/L` : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const STATS = [
  { label: 'Avg Efficiency', value: '8.4 km/L', color: '#22C55E' },
  { label: 'Total Distance', value: '1,19,700 km', color: '#3B82F6' },
  { label: 'Total Fuel',     value: '14,310 L',    color: '#F59E0B' },
];

export default function FuelEfficiencyChart() {
  return (
    <div className="bg-bg-card border border-border/60 rounded-2xl shadow-card-md overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#38BDF8]/10">
            <Fuel className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-content-primary">Fuel Efficiency Trend</h3>
            <p className="text-xs text-content-muted">Distance vs fuel consumed vs efficiency (Jul–Dec)</p>
          </div>
        </div>
        {/* Legend */}
        <div className="hidden sm:flex items-center gap-4 text-[10px] text-content-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2.5 rounded-sm bg-[#3B82F6]/70 inline-block" />Distance
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2.5 rounded-sm bg-[#F59E0B]/70 inline-block" />Fuel
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#22C55E] inline-block rounded" />Efficiency
          </span>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-3 divide-x divide-border/40 border-b border-border/40">
        {STATS.map(s => (
          <div key={s.label} className="px-6 py-3">
            <p className="text-[10px] text-content-muted uppercase tracking-wider">{s.label}</p>
            <p className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Chart ── */}
      <div className="px-2 pt-4 pb-2">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={FUEL_EFFICIENCY_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.4} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${(v / 1000).toFixed(0)}K`}
              width={36}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[7.5, 9.5]}
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${v}`}
              width={28}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar yAxisId="left" dataKey="distance"     name="Distance"  fill="#3B82F6" fillOpacity={0.7} radius={[4,4,0,0]} maxBarSize={32} />
            <Bar yAxisId="left" dataKey="fuelConsumed" name="Fuel"      fill="#F59E0B" fillOpacity={0.7} radius={[4,4,0,0]} maxBarSize={32} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="efficiency"
              name="Efficiency"
              stroke="#22C55E"
              strokeWidth={2.5}
              dot={{ fill: '#22C55E', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
