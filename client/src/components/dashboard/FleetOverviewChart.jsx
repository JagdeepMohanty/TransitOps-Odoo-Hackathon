import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jul', vehicleUsage: 62, tripCompletion: 78, fuelConsumption: 45 },
  { month: 'Aug', vehicleUsage: 70, tripCompletion: 82, fuelConsumption: 52 },
  { month: 'Sep', vehicleUsage: 65, tripCompletion: 75, fuelConsumption: 48 },
  { month: 'Oct', vehicleUsage: 80, tripCompletion: 88, fuelConsumption: 60 },
  { month: 'Nov', vehicleUsage: 74, tripCompletion: 85, fuelConsumption: 55 },
  { month: 'Dec', vehicleUsage: 88, tripCompletion: 92, fuelConsumption: 63 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-dropdown border border-border rounded-xl p-3 shadow-modal text-xs">
      <p className="font-semibold text-content-primary mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-content-muted">{p.name}:</span>
          <span className="font-semibold text-content-primary">{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

export default function FleetOverviewChart() {
  return (
    <div className="bg-bg-card border border-border rounded-[20px] shadow-card-md p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-bold text-content-primary">Fleet Overview</h2>
          <p className="text-xs text-content-muted mt-0.5">6-month performance metrics</p>
        </div>
        <div className="flex gap-1">
          {['1M', '3M', '6M'].map((t, i) => (
            <button
              key={t}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-150 ${i === 2 ? 'bg-primary/10 text-primary' : 'text-content-muted hover:text-content-primary hover:bg-bg-hover'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradAmber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
          <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '16px' }}
            formatter={(value) => <span style={{ color: '#CBD5E1' }}>{value}</span>}
          />
          <Area type="monotone" dataKey="vehicleUsage" name="Vehicle Usage" stroke="#3B82F6" strokeWidth={2} fill="url(#gradBlue)" dot={false} activeDot={{ r: 4, fill: '#3B82F6' }} />
          <Area type="monotone" dataKey="tripCompletion" name="Trip Completion" stroke="#8B5CF6" strokeWidth={2} fill="url(#gradPurple)" dot={false} activeDot={{ r: 4, fill: '#8B5CF6' }} />
          <Area type="monotone" dataKey="fuelConsumption" name="Fuel Consumption" stroke="#F59E0B" strokeWidth={2} fill="url(#gradAmber)" dot={false} activeDot={{ r: 4, fill: '#F59E0B' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
