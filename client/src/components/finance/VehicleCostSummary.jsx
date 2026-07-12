import { useState } from 'react';
import { Truck, TrendingUp, TrendingDown, Fuel, Wrench, DollarSign, Zap, BarChart3, Target } from 'lucide-react';
import { VEHICLE_COSTS } from '@utils/fuelExpenseMockData';

export default function VehicleCostSummary() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const totalRevenue = VEHICLE_COSTS.reduce((s, v) => s + v.revenue, 0);
  const totalCostAll = VEHICLE_COSTS.reduce((s, v) => s + v.fuelCost + v.maintenanceCost + v.otherExpenses, 0);

  return (
    <div style={{
      background: 'rgba(30,41,59,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid #334155', borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 22px', borderBottom: '1px solid rgba(51,65,85,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={17} color="#3B82F6" />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', margin: 0, letterSpacing: '-0.01em' }}>Vehicle Cost Summary</p>
            <p style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>Per-vehicle financial performance &amp; ROI analysis</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <SummaryPill label="Fleet Revenue" value={`₹${(totalRevenue / 1000).toFixed(0)}K`} color="#22C55E" />
          <SummaryPill label="Fleet Cost" value={`₹${(totalCostAll / 1000).toFixed(0)}K`} color="#EF4444" />
          <SummaryPill label="Vehicles" value={VEHICLE_COSTS.length} color="#3B82F6" />
        </div>
      </div>

      {/* Cards grid */}
      <div style={{ padding: '18px 22px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 16 }}>
        {VEHICLE_COSTS.map(v => {
          const totalCost = v.fuelCost + v.maintenanceCost + v.otherExpenses;
          const profit    = v.revenue - totalCost;
          const roi       = ((v.revenue - totalCost) / v.acquisitionCost * 100).toFixed(2);
          const isProfit  = profit >= 0;
          const fuelPct   = Math.round((v.fuelCost / totalCost) * 100);
          const maintPct  = Math.round((v.maintenanceCost / totalCost) * 100);
          const otherPct  = Math.max(0, 100 - fuelPct - maintPct);
          const isHov     = hovered === v.id;
          const isSel     = selected === v.id;
          const lowEff    = v.efficiency < 3.5;

          return (
            <div key={v.id}
              onMouseEnter={() => setHovered(v.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(isSel ? null : v.id)}
              style={{
                background: isSel
                  ? 'rgba(59,130,246,0.1)'
                  : isHov ? 'rgba(59,130,246,0.06)' : 'rgba(15,23,42,0.55)',
                border: `1px solid ${isSel ? 'rgba(59,130,246,0.45)' : isHov ? 'rgba(59,130,246,0.28)' : '#1E293B'}`,
                borderRadius: 18, padding: '18px',
                transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
                transform: isHov ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHov ? '0 10px 32px rgba(0,0,0,0.45)' : 'none',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Ambient glow */}
              {isHov && <div style={{ position: 'absolute', top: -25, right: -25, width: 100, height: 100, borderRadius: '50%', background: '#3B82F6', opacity: 0.1, filter: 'blur(24px)', pointerEvents: 'none' }} />}

              {/* Vehicle header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(59,130,246,0.08))', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Truck size={21} color="#3B82F6" strokeWidth={1.7} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: '#F8FAFC', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#475569', background: 'rgba(71,85,105,0.2)', padding: '1px 6px', borderRadius: 4 }}>{v.registration}</span>
                    <span style={{ fontSize: 10, color: '#64748B' }}>{v.type}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 8, background: isProfit ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${isProfit ? 'rgba(34,197,94,0.22)' : 'rgba(239,68,68,0.22)'}` }}>
                    {isProfit ? <TrendingUp size={11} color="#22C55E" /> : <TrendingDown size={11} color="#EF4444" />}
                    <span style={{ fontSize: 11, fontWeight: 700, color: isProfit ? '#22C55E' : '#EF4444' }}>ROI {roi}%</span>
                  </div>
                  <span style={{ fontSize: 10, color: '#475569' }}>{v.totalTrips} trips</span>
                </div>
              </div>

              {/* Cost metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                <Metric icon={<Fuel size={11} color="#3B82F6" />}       label="Fuel"   value={`₹${(v.fuelCost / 1000).toFixed(1)}K`}       color="#3B82F6" />
                <Metric icon={<Wrench size={11} color="#F59E0B" />}     label="Maint." value={`₹${(v.maintenanceCost / 1000).toFixed(1)}K`} color="#F59E0B" />
                <Metric icon={<DollarSign size={11} color="#94A3B8" />} label="Other"  value={`₹${(v.otherExpenses / 1000).toFixed(1)}K`}   color="#94A3B8" />
              </div>

              {/* Revenue / Cost / Profit */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, padding: '10px 12px', background: 'rgba(15,23,42,0.5)', borderRadius: 10, border: '1px solid #1E293B' }}>
                <FinStat label="Revenue"  value={`₹${(v.revenue / 1000).toFixed(1)}K`}  color="#22C55E" />
                <div style={{ width: 1, background: '#1E293B' }} />
                <FinStat label="Op. Cost" value={`₹${(totalCost / 1000).toFixed(1)}K`}  color="#EF4444" />
                <div style={{ width: 1, background: '#1E293B' }} />
                <FinStat label="Profit"   value={`${isProfit ? '+' : ''}₹${(profit / 1000).toFixed(1)}K`} color={isProfit ? '#22C55E' : '#EF4444'} />
              </div>

              {/* Stacked cost bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Cost Breakdown</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    {lowEff && <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 600 }}>⚠ Low Efficiency</span>}
                    <Zap size={10} color={lowEff ? '#EF4444' : '#F59E0B'} />
                    <span style={{ fontSize: 10, color: lowEff ? '#EF4444' : '#F59E0B', fontWeight: 700 }}>{v.efficiency} km/L</span>
                  </div>
                </div>
                <div style={{ height: 7, borderRadius: 4, background: '#1E293B', overflow: 'hidden', display: 'flex', gap: 1 }}>
                  <div style={{ width: `${fuelPct}%`, background: 'linear-gradient(90deg, #3B82F6, #60A5FA)', transition: 'width 0.5s ease', borderRadius: '4px 0 0 4px' }} />
                  <div style={{ width: `${maintPct}%`, background: 'linear-gradient(90deg, #F59E0B, #FCD34D)', transition: 'width 0.5s ease' }} />
                  <div style={{ width: `${otherPct}%`, background: '#475569', transition: 'width 0.5s ease', borderRadius: '0 4px 4px 0' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                  {[['#3B82F6', `Fuel ${fuelPct}%`], ['#F59E0B', `Maint. ${maintPct}%`], ['#475569', `Other ${otherPct}%`]].map(([c, l]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 7, height: 7, borderRadius: 2, background: c, flexShrink: 0 }} />
                      <span style={{ fontSize: 10, color: '#64748B' }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Efficiency progress bar */}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Fuel Efficiency</span>
                  <span style={{ fontSize: 10, color: lowEff ? '#EF4444' : '#22C55E', fontWeight: 700 }}>{v.efficiency} / 6.0 km/L</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: '#1E293B', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, width: `${Math.min((v.efficiency / 6) * 100, 100)}%`, background: lowEff ? 'linear-gradient(90deg, #EF4444, #F87171)' : 'linear-gradient(90deg, #22C55E, #4ADE80)', transition: 'width 0.6s ease', boxShadow: lowEff ? '0 0 6px rgba(239,68,68,0.5)' : '0 0 6px rgba(34,197,94,0.5)' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ icon, label, value, color }) {
  return (
    <div style={{ background: 'rgba(15,23,42,0.65)', border: '1px solid #1E293B', borderRadius: 10, padding: '9px 11px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>{icon}<span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</span></div>
      <p style={{ fontSize: 13.5, fontWeight: 700, color, margin: 0 }}>{value}</p>
    </div>
  );
}

function FinStat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px', fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 800, color, margin: 0 }}>{value}</p>
    </div>
  );
}

function SummaryPill({ label, value, color }) {
  return (
    <div style={{ padding: '6px 14px', borderRadius: 10, background: `${color}10`, border: `1px solid ${color}25`, textAlign: 'center' }}>
      <p style={{ fontSize: 10, color: '#64748B', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 800, color, margin: 0 }}>{value}</p>
    </div>
  );
}
