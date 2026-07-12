import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const DATA = [
  { name: 'Active',      value: 18, color: '#22c55e' },
  { name: 'Maintenance', value: 5,  color: '#f59e0b' },
  { name: 'Inactive',    value: 3,  color: '#94a3b8' },
]

export default function VehicleStatusChart() {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Fleet Status</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
            {DATA.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [`${v} vehicles`]} />
          <Legend iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
