import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TRIP_PROGRESS_DATA } from '@utils/tripDispatcherMockData';

const METRICS = [
  { key: 'trips',    label: 'Trips',            color: '#3B82F6' },
  { key: 'distance', label: 'Distance (×10 km)', color: '#8B5CF6' },
  { key: 'cargo',    label: 'Cargo (tons)',       color: '#22C55E' },
];

const normalised = TRIP_PROGRESS_DATA.map(d => ({
  ...d,
  distance: Math.round(d.distance / 10),
}));

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1E293B', border: '1px solid #334155', borderRadius: 12,
      padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC', marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#94A3B8' }}>{p.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#F8FAFC' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function TripProgressChart() {
  return (
    <div style={{
      background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)',
      border: '1px solid #334155', borderRadius: 20, padding: '20px 20px 12px',
      height: '100%',
    }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>Trip Progress</p>
        <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Trips · Distance · Cargo — last 7 days</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={normalised} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            {METRICS.map(m => (
              <linearGradient key={m.key} id={`grad-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={m.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={m.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: 12, fontSize: 11, color: '#94A3B8' }}
            iconType="circle" iconSize={7}
          />
          {METRICS.map(m => (
            <Area
              key={m.key}
              type="monotone"
              dataKey={m.key}
              name={m.label}
              stroke={m.color}
              strokeWidth={2}
              fill={`url(#grad-${m.key})`}
              dot={false}
              activeDot={{ r: 4, fill: m.color, strokeWidth: 0 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
