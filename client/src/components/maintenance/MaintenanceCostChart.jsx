import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { MAINTENANCE_COST_TREND } from '@utils/maintenanceMockData';

const fmt = v => `₹${(v / 1000).toFixed(0)}K`;

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(17,24,39,0.97)', border: '1px solid #334155', borderRadius: 14,
      padding: '12px 16px', boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
      backdropFilter: 'blur(12px)',
    }}>
      <p style={{
        fontSize: 11, fontWeight: 700, color: '#94A3B8',
        marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#94A3B8', minWidth: 90 }}>{p.name}:</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>₹{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function MaintenanceCostChart() {
  const total = MAINTENANCE_COST_TREND.reduce((s, d) => s + d.monthly, 0);

  return (
    <div style={{
      background: 'rgba(30,41,59,0.65)', backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid #334155', borderRadius: 20, padding: '22px 20px 14px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        borderRadius: '50%', background: '#3B82F6',
        opacity: 0.04, filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
            Maintenance Cost Trend
          </p>
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>
            Monthly breakdown — last 6 months
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 10px', borderRadius: 8,
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
        }}>
          <TrendingUp size={12} color="#22C55E" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#22C55E' }}>
            ₹{(total / 1000).toFixed(0)}K total
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={MAINTENANCE_COST_TREND} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradMonthly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradRepair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradService" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.5)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={false} tickLine={false} width={46}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: 14 }}
            formatter={v => <span style={{ fontSize: 11, color: '#94A3B8' }}>{v}</span>}
          />
          <Area
            type="monotone" dataKey="monthly" name="Monthly Cost"
            stroke="#3B82F6" strokeWidth={2.5} fill="url(#gradMonthly)"
            dot={false} activeDot={{ r: 5, fill: '#3B82F6', strokeWidth: 2, stroke: '#1E293B' }}
          />
          <Area
            type="monotone" dataKey="repair" name="Repair Cost"
            stroke="#EF4444" strokeWidth={2} fill="url(#gradRepair)"
            dot={false} activeDot={{ r: 4, fill: '#EF4444', strokeWidth: 2, stroke: '#1E293B' }}
          />
          <Area
            type="monotone" dataKey="service" name="Service Cost"
            stroke="#22C55E" strokeWidth={2} fill="url(#gradService)"
            dot={false} activeDot={{ r: 4, fill: '#22C55E', strokeWidth: 2, stroke: '#1E293B' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
