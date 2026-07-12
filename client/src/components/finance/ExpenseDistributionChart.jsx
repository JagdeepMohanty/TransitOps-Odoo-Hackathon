import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { EXPENSE_DIST } from '@utils/fuelExpenseMockData';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  const total = EXPENSE_DIST.reduce((s, x) => s + x.value, 0);
  const pct = ((d.value / total) * 100).toFixed(1);
  return (
    <div style={{
      background: 'rgba(15,23,42,0.98)', border: '1px solid #334155',
      borderRadius: 12, padding: '10px 16px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.7)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: d.payload.color, boxShadow: `0 0 8px ${d.payload.color}` }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>{d.name}</span>
      </div>
      <p style={{ fontSize: 14, fontWeight: 800, color: d.payload.color, margin: '0 0 2px' }}>₹{d.value.toLocaleString()}</p>
      <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{pct}% of total</p>
    </div>
  );
}

function ActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 3} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.95} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 10} outerRadius={outerRadius + 13} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.4} />
    </g>
  );
}

export default function ExpenseDistributionChart() {
  const [activeIdx, setActiveIdx] = useState(null);
  const total = EXPENSE_DIST.reduce((s, d) => s + d.value, 0);
  const active = activeIdx !== null ? EXPENSE_DIST[activeIdx] : null;

  return (
    <div style={{
      background: 'rgba(30,41,59,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid #334155', borderRadius: 20, padding: '22px 20px',
      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: '50%', background: '#8B5CF6', opacity: 0.05, filter: 'blur(45px)', pointerEvents: 'none' }} />

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', margin: 0, letterSpacing: '-0.01em' }}>Expense Distribution</p>
        <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Breakdown by category — current period</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        {/* Donut */}
        <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={EXPENSE_DIST} cx="50%" cy="50%"
                innerRadius={58} outerRadius={80}
                paddingAngle={3} dataKey="value" strokeWidth={0}
                activeIndex={activeIdx ?? undefined}
                activeShape={<ActiveShape />}
                onMouseEnter={(_, i) => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {EXPENSE_DIST.map((entry, i) => (
                  <Cell key={i} fill={entry.color}
                    opacity={activeIdx === null || activeIdx === i ? 1 : 0.35}
                    style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: 16, fontWeight: 800, lineHeight: 1, color: active ? active.color : '#F8FAFC', transition: 'color 0.2s' }}>
              {active ? `₹${(active.value / 1000).toFixed(0)}K` : `₹${(total / 1000).toFixed(0)}K`}
            </span>
            <span style={{ fontSize: 10, color: '#64748B', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {active ? active.name : 'Total'}
            </span>
            {active && (
              <span style={{ fontSize: 11, fontWeight: 700, color: active.color, marginTop: 2 }}>
                {((active.value / total) * 100).toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
          {EXPENSE_DIST.map((d, i) => {
            const pct = ((d.value / total) * 100).toFixed(1);
            const isActive = activeIdx === i;
            return (
              <div key={d.name}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', opacity: activeIdx === null || isActive ? 1 : 0.4, transition: 'opacity 0.2s', padding: '3px 0' }}
                onMouseEnter={() => setActiveIdx(i)} onMouseLeave={() => setActiveIdx(null)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0, boxShadow: isActive ? `0 0 10px ${d.color}90` : 'none', transition: 'box-shadow 0.2s' }} />
                  <span style={{ fontSize: 12, color: isActive ? '#F8FAFC' : '#CBD5E1', fontWeight: isActive ? 600 : 400, transition: 'all 0.2s' }}>{d.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 56, height: 4, borderRadius: 2, background: '#1E293B', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 2, width: `${pct}%`, background: d.color, transition: 'width 0.5s ease', boxShadow: isActive ? `0 0 6px ${d.color}` : 'none' }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? d.color : '#94A3B8', minWidth: 46, textAlign: 'right', transition: 'color 0.2s' }}>
                    ₹{(d.value / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
