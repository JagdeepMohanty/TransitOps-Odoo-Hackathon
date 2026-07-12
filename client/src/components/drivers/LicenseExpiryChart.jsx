import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#22C55E', '#F59E0B', '#EF4444'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-bg-dropdown border border-border rounded-xl p-3 shadow-modal text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.payload.color }} />
        <span className="text-content-primary font-semibold">{d.name}</span>
        <span className="text-content-muted">{d.value} drivers</span>
      </div>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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

export default function LicenseExpiryChart({ drivers }) {
  const today = new Date();
  const in30  = new Date(today); in30.setDate(today.getDate() + 30);

  const valid    = drivers.filter(d => new Date(d.licenseExpiry) > in30).length;
  const expiring = drivers.filter(d => { const e = new Date(d.licenseExpiry); return e > today && e <= in30; }).length;
  const expired  = drivers.filter(d => new Date(d.licenseExpiry) <= today).length;

  const data = [
    { name: 'Valid',          value: valid,    color: '#22C55E' },
    { name: 'Expiring Soon',  value: expiring, color: '#F59E0B' },
    { name: 'Expired',        value: expired,  color: '#EF4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="bg-bg-card border border-border rounded-[20px] shadow-card-md p-6 h-full">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-content-primary">License Expiry Status</h2>
        <p className="text-xs text-content-muted mt-0.5">Compliance overview across fleet</p>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data} cx="50%" cy="50%"
            innerRadius={50} outerRadius={78}
            paddingAngle={3} dataKey="value"
            labelLine={false} label={renderLabel}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center */}
      <div className="flex flex-col items-center -mt-2 mb-4">
        <span className="text-xl font-bold text-content-primary">{drivers.length}</span>
        <span className="text-xs text-content-muted">Total Drivers</span>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {[
          { label: 'Valid',         value: valid,    color: '#22C55E', bg: 'bg-success/10'  },
          { label: 'Expiring Soon', value: expiring, color: '#F59E0B', bg: 'bg-warning/10'  },
          { label: 'Expired',       value: expired,  color: '#EF4444', bg: 'bg-danger/10'   },
        ].map(d => (
          <div key={d.label} className={`flex items-center justify-between px-3 py-2 rounded-xl ${d.bg} border border-border/40`}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-xs text-content-muted">{d.label}</span>
            </div>
            <span className="text-sm font-bold text-content-primary">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
