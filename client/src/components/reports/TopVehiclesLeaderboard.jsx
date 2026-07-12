import { Trophy, Truck } from 'lucide-react';
import { TOP_VEHICLES } from '@utils/reportsMockData';

const RANK_STYLES = [
  { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/30', label: '🥇' },
  { bg: 'bg-[#94A3B8]/10', text: 'text-[#94A3B8]', border: 'border-[#94A3B8]/30', label: '🥈' },
  { bg: 'bg-[#CD7F32]/10', text: 'text-[#CD7F32]', border: 'border-[#CD7F32]/30', label: '🥉' },
];

export default function TopVehiclesLeaderboard() {
  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
        <div className="p-2 rounded-xl bg-[#F59E0B]/10">
          <Trophy className="w-4 h-4 text-[#F59E0B]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-content-primary">Top Performing Vehicles</h3>
          <p className="text-xs text-content-muted">Ranked by ROI and revenue this month</p>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-7 gap-2 px-6 py-2.5 bg-bg-base/50 border-b border-border/30">
        {['Rank', 'Vehicle', 'Trips', 'Distance', 'Revenue', 'Efficiency', 'ROI'].map(h => (
          <span key={h} className="text-[10px] font-semibold text-content-muted uppercase tracking-wider">{h}</span>
        ))}
      </div>

      <div className="divide-y divide-border/30">
        {TOP_VEHICLES.map((v, i) => {
          const rs = RANK_STYLES[i] || { bg: 'bg-bg-base', text: 'text-content-muted', border: 'border-border/20', label: `#${v.rank}` };
          return (
            <div
              key={v.rank}
              className="grid grid-cols-7 gap-2 items-center px-6 py-3.5 hover:bg-bg-hover/40 transition-colors duration-150"
            >
              {/* Rank */}
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-xl border text-sm font-bold ${rs.bg} ${rs.text} ${rs.border}`}>
                {i < 3 ? rs.label : `#${v.rank}`}
              </div>

              {/* Vehicle */}
              <div className="flex items-center gap-2 col-span-1">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-content-primary truncate">{v.vehicle}</p>
                  <p className="text-[10px] text-content-muted font-mono">{v.plate}</p>
                </div>
              </div>

              <span className="text-sm font-semibold text-content-primary">{v.trips}</span>
              <span className="text-sm text-content-secondary">{v.distance.toLocaleString()} km</span>
              <span className="text-sm font-semibold text-success">₹{(v.revenue / 1000).toFixed(0)}K</span>
              <span className="text-sm text-[#38BDF8]">{v.efficiency} km/L</span>
              <span className={`text-sm font-bold ${v.roi >= 25 ? 'text-success' : 'text-primary'}`}>{v.roi}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
