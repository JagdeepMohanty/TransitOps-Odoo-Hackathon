import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { MAINTENANCE_STATUS_DATA } from '@utils/maintenanceMockData';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: 'rgba(17,24,39,0.97)', border: '1px solid #334155', borderRadius: 10,
      padding: '8px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.payload.color }} />
        <span style={{ fontSize: 12, color: '#CBD5E1' }}>{d.name}:</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>{d.value}</span>
      </div>
    </div>
  );
}

export default function MaintenanceStatusChart() {
  const [activeIndex, setActiveIndex] = useState(null);
  const total = MAINTENANCE_STATUS_DATA.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{
      background: 'rgba(30,41,59,0.65)', backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid #334155', borderRadius: 20, padding: '22px 20px',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', bottom: -40, left: -40, width: 160, height: 160,
        borderRadius: '50%', background: '#8B5CF6',
        opacity: 0.04, filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
          Maintenance Status
        </p>
        <p style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>
          Current distribution across all vehicles
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
        {/* Donut */}
        <div style={{ position: 'relative', width: 168, height: 168, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MAINTENANCE_STATUS_DATA}
                cx="50%" cy="50%"
                innerRadius={54} outerRadius={76}
                paddingAngle={3} dataKey="value"
                strokeWidth={0}
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {MAINTENANCE_STATUS_DATA.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === i ? 1 : 0.45}
                    style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <span style={{
              fontSize: 28, fontWeight: 800, lineHeight: 1,
              transition: 'color 0.2s',
              color: activeIndex !== null ? MAINTENANCE_STATUS_DATA[activeIndex]?.color : '#F8FAFC',
            }}>
              {activeIndex !== null ? MAINTENANCE_STATUS_DATA[activeIndex]?.value : total}
            </span>
            <span style={{ fontSize: 10, color: '#64748B', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {activeIndex !== null ? MAINTENANCE_STATUS_DATA[activeIndex]?.name : 'Total'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, flex: 1 }}>
          {MAINTENANCE_STATUS_DATA.map((d, i) => (
            <div
              key={d.name}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', opacity: activeIndex === null || activeIndex === i ? 1 : 0.45,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 10, height: 10, borderRadius: 3,
                  background: d.color, flexShrink: 0,
                  boxShadow: activeIndex === i ? `0 0 8px ${d.color}80` : 'none',
                  transition: 'box-shadow 0.2s',
                }} />
                <span style={{ fontSize: 12, color: '#CBD5E1' }}>{d.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 64, height: 4, borderRadius: 2,
                  background: '#1E293B', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: `${(d.value / total) * 100}%`,
                    background: d.color,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: activeIndex === i ? d.color : '#F8FAFC',
                  minWidth: 18, textAlign: 'right',
                  transition: 'color 0.2s',
                }}>{d.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
