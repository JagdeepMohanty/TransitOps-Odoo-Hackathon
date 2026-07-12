import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { SAFETY_SCORE_TREND } from '@utils/driverMockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-dropdown border border-border rounded-xl p-3 shadow-modal text-xs">
      <p className="font-semibold text-content-primary mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-content-muted">{p.name}:</span>
          <span className="font-semibold text-content-primary">{p.value}{p.dataKey === 'avgScore' ? '' : ''}</span>
        </div>
      ))}
    </div>
  );
};

export default function DriverAnalyticsChart() {
  return (
    <div className="bg-bg-card border border-border rounded-[20px] shadow-card-md p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-bold text-content-primary">Driver Safety Analytics</h2>
          <p className="text-xs text-content-muted mt-0.5">6-month safety score & trip performance</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success/10 border border-success/20">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] font-semibold text-success">Avg 90.3</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={SAFETY_SCORE_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="gradTrips" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
          <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
            formatter={v => <span style={{ color: '#CBD5E1' }}>{v}</span>}
          />
          <Area type="monotone" dataKey="avgScore" name="Avg Safety Score" stroke="#3B82F6" strokeWidth={2} fill="url(#gradScore)" dot={false} activeDot={{ r: 4, fill: '#3B82F6' }} />
          <Area type="monotone" dataKey="trips"    name="Trips Completed"  stroke="#8B5CF6" strokeWidth={2} fill="url(#gradTrips)" dot={false} activeDot={{ r: 4, fill: '#8B5CF6' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
