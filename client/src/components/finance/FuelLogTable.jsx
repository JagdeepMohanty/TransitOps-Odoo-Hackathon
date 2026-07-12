import { useState, useMemo } from 'react';
import {
  ChevronUp, ChevronDown, ChevronsUpDown, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, Search, Droplets, AlertTriangle, Zap,
} from 'lucide-react';

const PAGE_SIZE = 6;
const VEH_OPTS  = ['all', 'KA-01-AB-1234', 'KA-02-CD-5678', 'DL-04-GH-3456', 'TN-05-IJ-7890', 'GJ-06-KL-2345', 'UP-08-OP-0123'];

export default function FuelLogTable({ logs = [], onView, onEdit, onDelete }) {
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [search,  setSearch]  = useState('');
  const [vehicle, setVehicle] = useState('all');
  const [page,    setPage]    = useState(1);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  }

  const filtered = useMemo(() => {
    let data = [...logs];
    if (vehicle !== 'all') data = data.filter(r => r.registration === vehicle);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(r =>
        r.id.toLowerCase().includes(q) || r.vehicle.toLowerCase().includes(q) ||
        r.driver.toLowerCase().includes(q) || r.station.toLowerCase().includes(q) ||
        (r.trip && r.trip.toLowerCase().includes(q))
      );
    }
    data.sort((a, b) => {
      const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [logs, vehicle, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const avgEff = filtered.length ? (filtered.reduce((s, r) => s + r.efficiency, 0) / filtered.length).toFixed(1) : 0;
  const totalQty = filtered.reduce((s, r) => s + r.quantity, 0);
  const totalCost = filtered.reduce((s, r) => s + r.totalCost, 0);

  const COLS = [
    { key: 'id',              label: 'Log ID',     sortable: true  },
    { key: 'vehicle',         label: 'Vehicle',    sortable: true  },
    { key: 'driver',          label: 'Driver',     sortable: true  },
    { key: 'trip',            label: 'Trip',       sortable: false },
    { key: 'date',            label: 'Date',       sortable: true  },
    { key: 'station',         label: 'Station',    sortable: false },
    { key: 'quantity',        label: 'Qty (L)',    sortable: true  },
    { key: 'totalCost',       label: 'Cost',       sortable: true  },
    { key: 'pricePerLiter',   label: '₹/Liter',   sortable: true  },
    { key: 'distanceCovered', label: 'Distance',   sortable: true  },
    { key: 'efficiency',      label: 'Efficiency', sortable: true  },
    { key: '_actions',        label: 'Actions',    sortable: false },
  ];

  function SortIcon({ col }) {
    if (!col.sortable) return null;
    if (sortKey !== col.key) return <ChevronsUpDown size={11} color="#475569" />;
    return sortDir === 'asc' ? <ChevronUp size={11} color="#3B82F6" /> : <ChevronDown size={11} color="#3B82F6" />;
  }

  return (
    <div style={{
      background: 'rgba(30,41,59,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid #334155', borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    }}>
      {/* Toolbar */}
      <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(51,65,85,0.6)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Droplets size={16} color="#3B82F6" />
            </div>
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC' }}>Fuel Log Records</span>
              <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                <CountPill color="#3B82F6">{filtered.length} records</CountPill>
                <CountPill color="#22C55E">{totalQty}L total</CountPill>
                <CountPill color="#EF4444">₹{(totalCost / 1000).toFixed(1)}K</CountPill>
                <CountPill color="#F59E0B">{avgEff} km/L avg</CountPill>
              </div>
            </div>
          </div>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search vehicle, driver, station…" />
        </div>
        {/* Vehicle filter pills */}
        <FilterPills label="Vehicle" opts={VEH_OPTS} val={vehicle} set={v => { setVehicle(v); setPage(1); }} />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1100 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2, background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(12px)' }}>
            <tr>
              {COLS.map(col => (
                <th key={col.key} onClick={() => col.sortable && toggleSort(col.key)}
                  style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: sortKey === col.key ? '#3B82F6' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(51,65,85,0.6)', cursor: col.sortable ? 'pointer' : 'default', whiteSpace: 'nowrap', userSelect: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => { if (col.sortable) e.currentTarget.style.color = '#CBD5E1'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = sortKey === col.key ? '#3B82F6' : '#64748B'; }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{col.label}<SortIcon col={col} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <EmptyRow colSpan={COLS.length} icon={<Droplets size={22} color="#3B82F6" />} msg="No fuel logs match the current filters" />
            ) : paged.map((rec, i) => (
              <FuelRow key={rec.id} record={rec} even={i % 2 === 0} onView={onView} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE} setPage={setPage} />
    </div>
  );
}

function FuelRow({ record, even, onView, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const lowEff = record.efficiency < 3.5;
  const highCost = record.totalCost > 11000;
  const bg = hovered ? 'rgba(59,130,246,0.07)' : lowEff ? 'rgba(239,68,68,0.04)' : even ? 'transparent' : 'rgba(15,23,42,0.25)';

  return (
    <tr style={{ background: bg, transition: 'background 0.15s', cursor: 'pointer', borderLeft: lowEff ? '2px solid rgba(239,68,68,0.4)' : '2px solid transparent' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => onView?.(record)}
    >
      <td style={td}><span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#93C5FD', letterSpacing: '0.02em' }}>{record.id}</span></td>
      <td style={td}>
        <p style={{ fontSize: 12.5, color: '#CBD5E1', fontWeight: 600, margin: 0 }}>{record.vehicle}</p>
        <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#475569', margin: '2px 0 0' }}>{record.registration}</p>
      </td>
      <td style={td}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(100,116,139,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#94A3B8' }}>
            {record.driver.split(' ').map(n => n[0]).join('')}
          </div>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>{record.driver}</span>
        </div>
      </td>
      <td style={td}><span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748B', background: 'rgba(100,116,139,0.1)', padding: '2px 7px', borderRadius: 5 }}>{record.trip ?? '—'}</span></td>
      <td style={td}><span style={{ fontSize: 11.5, color: '#64748B' }}>{record.date}</span></td>
      <td style={td}><span style={{ fontSize: 11.5, color: '#94A3B8' }}>{record.station}</span></td>
      <td style={td}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Droplets size={12} color="#3B82F6" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#3B82F6' }}>{record.quantity}L</span>
        </div>
      </td>
      <td style={td}>
        <span style={{ fontSize: 13, fontWeight: 800, color: highCost ? '#FCA5A5' : '#F8FAFC' }}>
          ₹{record.totalCost.toLocaleString()}
        </span>
      </td>
      <td style={td}><span style={{ fontSize: 11.5, color: '#94A3B8' }}>₹{record.pricePerLiter}</span></td>
      <td style={td}><span style={{ fontSize: 11.5, color: '#64748B' }}>{record.distanceCovered} km</span></td>
      <td style={td}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {lowEff
            ? <AlertTriangle size={12} color="#EF4444" />
            : <Zap size={12} color="#22C55E" />
          }
          <span style={{ fontSize: 12.5, fontWeight: 700, color: lowEff ? '#EF4444' : '#22C55E' }}>
            {record.efficiency.toFixed(1)} km/L
          </span>
        </div>
      </td>
      <td style={{ ...td, paddingRight: 18 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: 3 }}>
          <ActBtn title="View"   color="#3B82F6" onClick={() => onView?.(record)}><Eye    size={13} /></ActBtn>
          <ActBtn title="Edit"   color="#8B5CF6" onClick={() => onEdit?.(record)}><Pencil size={13} /></ActBtn>
          <ActBtn title="Delete" color="#EF4444" onClick={() => onDelete?.(record)}><Trash2 size={13} /></ActBtn>
        </div>
      </td>
    </tr>
  );
}

// ─── Shared sub-components ────────────────────────────────────
const td = { padding: '13px 14px', borderBottom: '1px solid rgba(51,65,85,0.3)', verticalAlign: 'middle' };

function ActBtn({ children, title, color, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button title={title} onClick={e => { e.stopPropagation(); onClick?.(); }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${h ? color + '40' : 'transparent'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: h ? `${color}18` : 'transparent', color: h ? color : '#64748B', transition: 'all 0.15s', transform: h ? 'scale(1.12)' : 'scale(1)' }}>
      {children}
    </button>
  );
}

function FilterPills({ label, opts, val, set }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', marginRight: 2 }}>{label}:</span>
      {opts.map(o => (
        <button key={o} onClick={() => set(o)}
          style={{ padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: val === o ? '#3B82F6' : 'rgba(15,23,42,0.7)', color: val === o ? '#fff' : '#64748B', border: `1px solid ${val === o ? '#3B82F6' : '#334155'}`, boxShadow: val === o ? '0 2px 8px rgba(59,130,246,0.3)' : 'none' }}>
          {o === 'all' ? 'All Vehicles' : o}
        </button>
      ))}
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <Search size={13} color={focused ? '#3B82F6' : '#64748B'} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', transition: 'color 0.15s' }} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 10, border: `1px solid ${focused ? '#3B82F6' : '#334155'}`, background: '#0F172A', color: '#F8FAFC', fontSize: 12.5, outline: 'none', width: 240, transition: 'all 0.15s', boxShadow: focused ? '0 0 0 3px rgba(59,130,246,0.12)' : 'none' }}
      />
    </div>
  );
}

function CountPill({ children, color }) {
  return (
    <span style={{ fontSize: 10.5, fontWeight: 600, color, background: `${color}14`, border: `1px solid ${color}28`, padding: '1px 7px', borderRadius: 999 }}>
      {children}
    </span>
  );
}

function EmptyRow({ colSpan, icon, msg }) {
  return (
    <tr><td colSpan={colSpan} style={{ padding: '64px 20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 600, margin: 0 }}>{msg}</p>
        <p style={{ fontSize: 12, color: '#334155', margin: 0 }}>Try adjusting your filters or search query</p>
      </div>
    </td></tr>
  );
}

function Pagination({ page, totalPages, total, pageSize, setPage }) {
  if (total <= pageSize) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderTop: '1px solid rgba(51,65,85,0.5)', flexWrap: 'wrap', gap: 8 }}>
      <span style={{ fontSize: 12, color: '#64748B' }}>
        Showing <span style={{ color: '#94A3B8', fontWeight: 600 }}>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)}</span> of <span style={{ color: '#94A3B8', fontWeight: 600 }}>{total}</span> records
      </span>
      <div style={{ display: 'flex', gap: 5 }}>
        <PagBtn disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={13} /></PagBtn>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <PagBtn key={p} active={p === page} onClick={() => setPage(p)}>{p}</PagBtn>)}
        <PagBtn disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={13} /></PagBtn>
      </div>
    </div>
  );
}

function PagBtn({ children, onClick, disabled, active }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ minWidth: 32, height: 32, borderRadius: 8, border: `1px solid ${active ? '#3B82F6' : '#334155'}`, background: active ? '#3B82F6' : h ? 'rgba(30,41,59,0.9)' : 'transparent', color: active ? '#fff' : disabled ? '#334155' : h ? '#F8FAFC' : '#94A3B8', fontSize: 12, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', boxShadow: active ? '0 2px 8px rgba(59,130,246,0.35)' : 'none' }}>
      {children}
    </button>
  );
}
