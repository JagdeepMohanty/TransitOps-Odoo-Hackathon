import { useState } from 'react';
import { Plus, Download, RefreshCw, Search, Fuel, SlidersHorizontal } from 'lucide-react';

export default function FuelExpenseHeader({ onAddFuel, onAddExpense, onExport, onRefresh, search, onSearch }) {
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    onRefresh?.();
    setTimeout(() => setRefreshing(false), 900);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        {/* Left — Title block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(139,92,246,0.18) 100%)',
            border: '1px solid rgba(59,130,246,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(59,130,246,0.22), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}>
            <Fuel size={22} color="#3B82F6" strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.15 }}>
                Fuel &amp; Expense Management
              </h1>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#3B82F6', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', padding: '2px 8px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Live
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
              Monitor fuel usage, operating expenses, maintenance costs, and fleet profitability.
            </p>
          </div>
        </div>

        {/* Right — Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <SearchBox value={search} onChange={onSearch} />
          <GhostBtn onClick={() => setShowFilter(v => !v)} active={showFilter}>
            <SlidersHorizontal size={13} />
            <span>Filter</span>
          </GhostBtn>
          <GhostBtn onClick={handleRefresh}>
            <RefreshCw size={13} style={{ transition: 'transform 0.7s ease', transform: refreshing ? 'rotate(360deg)' : 'rotate(0deg)' }} />
            <span>Refresh</span>
          </GhostBtn>
          <GhostBtn onClick={onExport}>
            <Download size={13} />
            <span>Export CSV</span>
          </GhostBtn>
          <PrimaryBtn onClick={onAddFuel} color="#22C55E" glow="rgba(34,197,94,0.35)">
            <Plus size={14} /><span>Add Fuel Log</span>
          </PrimaryBtn>
          <PrimaryBtn onClick={onAddExpense} color="#3B82F6" glow="rgba(59,130,246,0.35)">
            <Plus size={14} /><span>Add Expense</span>
          </PrimaryBtn>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(59,130,246,0.3), rgba(139,92,246,0.2), transparent)' }} />
    </div>
  );
}

function SearchBox({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <Search size={13} color={focused ? '#3B82F6' : '#64748B'} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', transition: 'color 0.15s' }} />
      <input
        value={value} onChange={e => onChange?.(e.target.value)}
        placeholder="Search fleet, driver, station…"
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          paddingLeft: 32, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
          borderRadius: 11, border: `1px solid ${focused ? '#3B82F6' : '#334155'}`,
          background: focused ? 'rgba(30,41,59,0.9)' : 'rgba(30,41,59,0.6)',
          color: '#F8FAFC', fontSize: 12.5, outline: 'none', width: 210,
          backdropFilter: 'blur(12px)', transition: 'all 0.2s',
          boxShadow: focused ? '0 0 0 3px rgba(59,130,246,0.15)' : 'none',
        }}
      />
    </div>
  );
}

function GhostBtn({ children, onClick, active }) {
  const [h, setH] = useState(false);
  const isActive = active || h;
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
        borderRadius: 11, border: `1px solid ${isActive ? '#475569' : '#334155'}`,
        background: isActive ? 'rgba(30,41,59,0.95)' : 'rgba(30,41,59,0.5)',
        color: isActive ? '#F8FAFC' : '#94A3B8', fontSize: 12.5, fontWeight: 500,
        cursor: 'pointer', transition: 'all 0.18s', backdropFilter: 'blur(12px)',
      }}>
      {children}
    </button>
  );
}

function PrimaryBtn({ children, onClick, color, glow }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px',
        borderRadius: 11, border: 'none', background: color, color: '#fff',
        fontSize: 13, fontWeight: 600, cursor: 'pointer',
        boxShadow: h ? `0 8px 24px ${glow}` : `0 3px 12px ${color}40`,
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        transform: h ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
      }}>
      {children}
    </button>
  );
}
