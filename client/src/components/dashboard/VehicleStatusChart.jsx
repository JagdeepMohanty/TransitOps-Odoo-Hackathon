import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Available',   value: 4, color: '#22C55E' },
  { name: 'On Trip',     value: 2, color: '#3B82F6' },
  { name: 'Maintenance', value: 1, color: '#F59E0B' },
  { name: 'Retired',     value: 1, color: '#475569' },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-bg-dropdown border border-border rounded-xl p-3 shadow-modal text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.payload.color }} />
        <span className="text-content-primary font-semibold">{d.name}</span>
        <span className="text-content-muted">{d.value} vehicles</span>
      </div>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.08) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function VehicleStatusChart() {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-bg-card border border-border rounded-[20px] shadow-card-md p-6 h-full">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-content-primary">Vehicle Status</h2>
        <p className="text-xs text-content-muted mt-0.5">Fleet distribution overview</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="flex flex-col items-center -mt-2 mb-4">
        <span className="text-2xl font-bold text-content-primary">{total}</span>
        <span className="text-xs text-content-muted">Total Vehicles</span>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between px-3 py-2 rounded-xl bg-bg-secondary border border-border/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-[11px] text-content-muted">{d.name}</span>
            </div>
            <span className="text-sm font-bold text-content-primary">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
