import { DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { COST_BREAKDOWN } from '@utils/reportsMockData';

const total = COST_BREAKDOWN.reduce((s, d) => s + d.value, 0);

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#1E293B] border border-border/60 rounded-xl p-3 shadow-modal text-xs">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
        <span className="text-content-primary font-semibold">{d.name}</span>
      </div>
      <p className="text-content-secondary">₹{d.value.toLocaleString()}</p>
      <p className="text-content-muted">{((d.value / total) * 100).toFixed(1)}% of total</p>
    </div>
  );
};

export default function OperationalCostChart() {
  return (
    <div className="bg-bg-card border border-border/60 rounded-2xl shadow-card-md overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-warning/10">
            <DollarSign className="w-4 h-4 text-warning" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-content-primary">Operational Cost Breakdown</h3>
            <p className="text-xs text-content-muted">Total spend by category this period</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-content-primary">₹{(total / 1000).toFixed(0)}K</p>
          <p className="text-[10px] text-content-muted">Total Cost</p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-6 flex flex-col lg:flex-row items-center gap-8">

        {/* Donut */}
        <div className="relative shrink-0 w-[200px] h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={COST_BREAKDOWN}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                {COST_BREAKDOWN.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-content-primary">₹{(total / 1000).toFixed(0)}K</span>
            <span className="text-[10px] text-content-muted mt-0.5">Total</span>
          </div>
        </div>

        {/* Legend table */}
        <div className="flex-1 w-full space-y-2.5">
          {COST_BREAKDOWN.map(d => {
            const pct = (d.value / total) * 100;
            return (
              <div key={d.name} className="group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-xs text-content-secondary group-hover:text-content-primary transition-colors">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-content-primary">₹{(d.value / 1000).toFixed(1)}K</span>
                    <span className="text-[10px] text-content-muted w-8 text-right">{pct.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-bg-base rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: d.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
