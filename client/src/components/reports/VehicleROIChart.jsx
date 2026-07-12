import { TrendingUp } from 'lucide-react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { VEHICLE_ROI_DATA } from '@utils/reportsMockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-border rounded-xl p-3 shadow-modal text-xs space-y-1.5">
      <p className="text-content-primary font-semibold">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-content-secondary">{p.name}:</span>
          <span className="text-content-primary font-semibold">
            {p.name === 'ROI' ? `${p.value}%` : `₹${p.value.toLocaleString()}`}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function VehicleROIChart() {
  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-accent/10">
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-content-primary">Vehicle ROI Analysis</h3>
            <p className="text-xs text-content-muted">Revenue vs costs vs return on investment</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-content-muted">
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-[#22C55E]/70 inline-block rounded" />Revenue</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-[#3B82F6]/70 inline-block rounded" />Fuel</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-[#F59E0B]/70 inline-block rounded" />Maint.</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#8B5CF6] inline-block rounded" />ROI %</span>
        </div>
      </div>

      <div className="px-4 py-5">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={VEHICLE_ROI_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
            <XAxis dataKey="vehicle" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left"  tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="revenue"         name="Revenue"  fill="#22C55E" fillOpacity={0.75} radius={[4,4,0,0]} />
            <Bar yAxisId="left" dataKey="fuelCost"        name="Fuel"     fill="#3B82F6" fillOpacity={0.75} radius={[4,4,0,0]} />
            <Bar yAxisId="left" dataKey="maintenanceCost" name="Maint."   fill="#F59E0B" fillOpacity={0.75} radius={[4,4,0,0]} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="roi"
              name="ROI"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              dot={(props) => {
                const { cx, cy, payload } = props;
                return (
                  <circle
                    key={payload.vehicle}
                    cx={cx} cy={cy} r={5}
                    fill={payload.roi < 0 ? '#EF4444' : '#8B5CF6'}
                    strokeWidth={0}
                  />
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
