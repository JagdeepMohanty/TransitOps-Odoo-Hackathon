import { useState } from 'react';
import { Plus, Download, RefreshCw, Search, Wrench } from 'lucide-react';

export default function MaintenanceHeader({ onSchedule, onExport, onRefresh, search, onSearch }) {
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    onRefresh?.();
    setTimeout(() => setRefreshing(false), 800);
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 16,
    }}>
      {/* Left: Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.15) 100%)',
            border: '1px solid rgba(59,130,246,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(59,130,246,0.15)',
          }}>
            <Wrench size={18} color="#3B82F6" strokeWidth={2} />
          </div>
          <div>
            <h1 style={{
              fontSize: 22, fontWeight: 800, color: '#F8FAFC',
              letterSpacing: '-0.025em', margin: 0, lineHeight: 1.2,
            }}>
              Fleet Maintenance
            </h1>
            <p style={{ fontSize: 13, color: '#64748B', margin: 0, marginTop: 2 }}>
              Manage vehicle maintenance schedules, repairs, service history, and operational health.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={13} color="#64748B" style={{
            position: 'absolute', left: 10, top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
          <input
            value={search}
            onChange={e => onSearch?.(e.target.value)}
            placeholder="Quick search…"
            style={{
              paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
              borderRadius: 10, border: '1px solid #334155',
              background: 'rgba(30,41,59,0.6)', color: '#F8FAFC', fontSize: 12,
              outline: 'none', width: 180, backdropFilter: 'blur(8px)',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#3B82F6'}
            onBlur={e => e.target.style.borderColor = '#334155'}
          />
        </div>

        <HeaderBtn onClick={handleRefresh} title="Refresh">
          <RefreshCw size={14} style={{
            transition: 'transform 0.6s',
            transform: refreshing ? 'rotate(360deg)' : 'rotate(0deg)',
          }} />
          <span>Refresh</span>
        </HeaderBtn>

        <HeaderBtn onClick={onExport} title="Export CSV">
          <Download size={14} />
          <span>Export CSV</span>
        </HeaderBtn>

        <button
          onClick={onSchedule}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 16px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(59,130,246,0.35)';
          }}
        >
          <Plus size={15} />
          <span>Schedule Maintenance</span>
        </button>
      </div>
    </div>
  );
}

function HeaderBtn({ children, onClick, title }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 14px', borderRadius: 10,
        border: `1px solid ${h ? '#475569' : '#334155'}`,
        background: h ? 'rgba(30,41,59,0.9)' : 'rgba(30,41,59,0.5)',
        color: h ? '#F8FAFC' : '#94A3B8', fontSize: 12, fontWeight: 500,
        cursor: 'pointer', transition: 'all 0.15s', backdropFilter: 'blur(8px)',
      }}
    >
      {children}
    </button>
  );
}
