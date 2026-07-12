import { useState } from 'react';
import { Plus, Download, RefreshCw, Search, X, Truck } from 'lucide-react';

export default function TripHeader({ onCreateTrip, onSearch, onRefresh, onExport }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    onRefresh?.();
    setTimeout(() => setRefreshing(false), 1000);
  }

  function handleSearch(e) {
    setSearchVal(e.target.value);
    onSearch?.(e.target.value);
  }

  function clearSearch() {
    setSearchVal('');
    onSearch?.('');
    setSearchOpen(false);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left — Title */}
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59,130,246,0.35)',
            flexShrink: 0,
          }}
        >
          <Truck size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Trip Dispatcher
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
            Plan, assign, dispatch, monitor, and complete transport operations.
          </p>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Inline search */}
        {searchOpen ? (
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#1E293B', border: '1px solid #334155',
              borderRadius: 10, padding: '6px 12px',
              boxShadow: '0 0 0 2px rgba(59,130,246,0.2)',
            }}
          >
            <Search size={14} color="#94A3B8" />
            <input
              autoFocus
              value={searchVal}
              onChange={handleSearch}
              placeholder="Search trips…"
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#F8FAFC', fontSize: 13, width: 160,
              }}
            />
            <button onClick={clearSearch} style={{ color: '#64748B', cursor: 'pointer', display: 'flex' }}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <HeaderBtn icon={<Search size={15} />} label="Search" onClick={() => setSearchOpen(true)} />
        )}

        <HeaderBtn icon={<RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />} label="Refresh" onClick={handleRefresh} />
        <HeaderBtn icon={<Download size={15} />} label="Export CSV" onClick={onExport} />

        {/* Primary CTA */}
        <button
          onClick={onCreateTrip}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: '#fff', fontSize: 13, fontWeight: 600,
            boxShadow: '0 0 16px rgba(59,130,246,0.4)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(59,130,246,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(59,130,246,0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Plus size={16} />
          Create Trip
        </button>
      </div>
    </div>
  );
}

function HeaderBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 13px', borderRadius: 10, cursor: 'pointer',
        background: '#1E293B', border: '1px solid #334155',
        color: '#CBD5E1', fontSize: 13, fontWeight: 500,
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.color = '#F8FAFC'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#CBD5E1'; }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
