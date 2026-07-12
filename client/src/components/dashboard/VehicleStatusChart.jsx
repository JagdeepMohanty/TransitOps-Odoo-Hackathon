import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = {
  Available:   '#22c55e',
  'On Trip':   '#2563eb',
  Maintenance: '#f59e0b',
  Retired:     '#94a3b8',
}

export default function VehicleStatusChart({ kpis }) {
  const data = kpis ? [
    { name: 'Available',   value: kpis.availableVehicles,      color: COLORS['Available']   },
    { name: 'On Trip',     value: kpis.vehiclesOnTrip,         color: COLORS['On Trip']     },
    { name: 'Maintenance', value: kpis.vehiclesInMaintenance,  color: COLORS['Maintenance'] },
  ].filter(d => d.value > 0) : []

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Fleet Status</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[220px] text-sm text-slate-400">
          {kpis ? 'No vehicle data' : 'Loading…'}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => [`${v} vehicles`]} />
            <Legend iconType="circle" iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
