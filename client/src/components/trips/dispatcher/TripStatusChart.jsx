import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { TRIP_STATUS_DATA } from '@utils/tripDispatcherMockData';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: '#1E293B', border: '1px solid #334155', borderRadius: 10,
      padding: '8px 12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.payload.color }} />
        <span style={{ fontSize: 12, color: '#94A3B8' }}>{d.name}:</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC' }}>{d.value} trips</span>
      </div>
    </div>
  );
}

export default function TripStatusChart() {
  const total = TRIP_STATUS_DATA.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{
      background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)',
      border: '1px solid #334155', borderRadius: 20, padding: '20px',
      height: '100%', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>Trip Status</p>
        <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Distribution across all statuses</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        {/* Donut */}
        <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={TRIP_STATUS_DATA}
                cx="50%" cy="50%"
                innerRadius={52} outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {TRIP_STATUS_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#F8FAFC', lineHeight: 1 }}>{total}</span>
            <span style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>Total</span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {TRIP_STATUS_DATA.map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 10, height: 10, borderRadius: 3,
                  background: d.color, flexShrink: 0,
                  boxShadow: `0 0 6px ${d.color}88`,
                }} />
                <span style={{ fontSize: 12, color: '#94A3B8' }}>{d.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>{d.value}</span>
                <span style={{
                  fontSize: 10, color: '#64748B',
                  background: '#0F172A', borderRadius: 4, padding: '1px 5px',
                }}>
                  {Math.round((d.value / total) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
