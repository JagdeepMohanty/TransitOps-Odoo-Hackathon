import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import { TrendingUp, Droplets, DollarSign, Navigation } from 'lucide-react';
import { FUEL_TREND } from '@utils/fuelExpenseMockData';

const fmtK = v => `₹${(v / 1000).toFixed(0)}K`;
const fmtL = v => `${v}L`;

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(15,23,42,0.98)', border: '1px solid #334155',
      borderRadius: 14, padding: '14px 18px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,130,246,0.1)',
      backdropFilter: 'blur(20px)',
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label} 2024</p>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0, boxShadow: `0 0 6px ${p.color}` }} />
          <span style={{ fontSize: 12, color: '#94A3B8', minWidth: 110 }}>{p.name}:</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>
            {p.dataKey === 'fuelCost' ? `₹${p.value.toLocaleString()}` : p.dataKey === 'distance' ? `${p.value} km` : `${p.value} L`}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }) {
  const icons = { 'Fuel Usage (L)': Droplets, 'Fuel Cost (₹)': DollarSign, 'Distance (km)': Navigation };
  return (
    <div style={{ display: 'flex', gap: 20, justifyContent: 'center', paddingTop: 12, flexWrap: 'wrap' }}>
      {payload?.map(p => {
        const Icon = icons[p.value];
        return (
          <div key={p.value} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: p.color, flexShrink: 0 }} />
            {Icon && <Icon size={11} color={p.color} />}
            <span style={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 500 }}>{p.value}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function FuelTrendChart() {
  const [activeMetric, setActiveMetric] = useState(null);
  const totalCost = FUEL_TREND.reduce((s, d) => s + d.fuelCost, 0);
  const totalFuel = FUEL_TREND.reduce((s, d) => s + d.fuelUsage, 0);
  const maxCostMonth = FUEL_TREND.reduce((a, b) => b.fuelCost > a.fuelCost ? b : a, FUEL_TREND[0]);

  return (
    <div style={{
      background: 'rgba(30,41,59,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid #334155', borderRadius: 20, padding: '22px 22px 16px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: '#3B82F6', opacity: 0.05, filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: '#22C55E', opacity: 0.04, filter: 'blur(50px)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', margin: 0, letterSpacing: '-0.01em' }}>Fuel Consumption Trend</p>
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Monthly fuel usage, cost &amp; distance — last 6 months</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <StatPill icon={<Droplets size={11} color="#3B82F6" />} label={`${totalFuel}L total`} color="#3B82F6" />
          <StatPill icon={<TrendingUp size={11} color="#EF4444" />} label={`₹${(totalCost / 1000).toFixed(0)}K spend`} color="#EF4444" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={FUEL_TREND} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gFuelUsage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gFuelCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.32} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gDistance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.45)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11.5 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left"  tickFormatter={fmtL} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} width={42} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={fmtK} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} width={46} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(59,130,246,0.3)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Legend content={<CustomLegend />} />
          <ReferenceLine yAxisId="right" x={maxCostMonth.month} stroke="rgba(239,68,68,0.25)" strokeDasharray="4 4" label={{ value: 'Peak', fill: '#EF4444', fontSize: 10, position: 'top' }} />
          <Area yAxisId="left"  type="monotone" dataKey="fuelUsage" name="Fuel Usage (L)"  stroke="#3B82F6" strokeWidth={2.5} fill="url(#gFuelUsage)" dot={false} activeDot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#0F172A' }} />
          <Area yAxisId="right" type="monotone" dataKey="fuelCost"  name="Fuel Cost (₹)"  stroke="#EF4444" strokeWidth={2}   fill="url(#gFuelCost)"  dot={false} activeDot={{ r: 5, fill: '#EF4444', strokeWidth: 2, stroke: '#0F172A' }} />
          <Area yAxisId="left"  type="monotone" dataKey="distance"  name="Distance (km)"  stroke="#22C55E" strokeWidth={2}   fill="url(#gDistance)"  dot={false} activeDot={{ r: 5, fill: '#22C55E', strokeWidth: 2, stroke: '#0F172A' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatPill({ icon, label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 9, background: `${color}12`, border: `1px solid ${color}28` }}>
      {icon}
      <span style={{ fontSize: 11.5, fontWeight: 700, color }}>{label}</span>
    </div>
  );
}
