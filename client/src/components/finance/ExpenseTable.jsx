import { useState, useMemo } from 'react';
import {
  ChevronUp, ChevronDown, ChevronsUpDown, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, Search, Receipt, AlertCircle,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const PAGE_SIZE   = 6;
const TYPE_OPTS   = ['all', 'Fuel', 'Maintenance', 'Toll', 'Insurance', 'Repairs', 'Parking', 'Other'];
const STATUS_OPTS = ['all', 'approved', 'pending', 'rejected'];

export default function ExpenseTable({ expenses = [], onView, onEdit, onDelete }) {
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [search,  setSearch]  = useState('');
  const [typeF,   setTypeF]   = useState('all');
  const [statusF, setStatusF] = useState('all');
  const [page,    setPage]    = useState(1);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  }

  const filtered = useMemo(() => {
    let data = [...expenses];
    if (typeF   !== 'all') data = data.filter(r => r.type   === typeF);
    if (statusF !== 'all') data = data.filter(r => r.status === statusF);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(r =>
        r.id.toLowerCase().includes(q) || r.vehicle.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) || r.notes.toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => {
      const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [expenses, typeF, statusF, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalAmt = filtered.reduce((s, r) => s + r.amount, 0);
  const pendingCount = filtered.filter(r => r.status === 'pending').length;

  const COLS = [
    { key: 'id',       label: 'Expense ID', sortable: true  },
    { key: 'vehicle',  label: 'Vehicle',    sortable: true  },
    { key: 'type',     label: 'Type',       sortable: true  },
    { key: 'category', label: 'Category',   sortable: true  },
    { key: 'amount',   label: 'Amount',     sortable: true  },
    { key: 'date',     label: 'Date',       sortable: true  },
    { key: 'status',   label: 'Status',     sortable: true  },
    { key: 'notes',    label: 'Notes',      sortable: false },
    { key: '_actions', label: 'Actions',    sortable: false },
  ];

  function SortIcon({ col }) {
    if (!col.sortable) return null;
    if (sortKey !== col.key) return <ChevronsUpDown size={11} color="#475569" />;
    return sortDir === 'asc' ? <ChevronUp size={11} color="#8B5CF6" /> : <ChevronDown size={11} color="#8B5CF6" />;
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
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Receipt size={16} color="#8B5CF6" />
            </div>
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC' }}>Expense Records</span>
              <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                <CountPill color="#8B5CF6">{filtered.length} records</CountPill>
                <CountPill color="#F8FAFC">₹{(totalAmt / 1000).toFixed(1)}K total</CountPill>
                {pendingCount > 0 && <CountPill color="#F59E0B">{pendingCount} pending</CountPill>}
              </div>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={13} color="#64748B" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search vehicle, type, notes…"
              style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 10, border: '1px solid #334155', background: '#0F172A', color: '#F8FAFC', fontSize: 12.5, outline: 'none', width: 240, transition: 'all 0.15s' }}
              onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#334155'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <Pills label="Type"   opts={TYPE_OPTS}   val={typeF}   set={v => { setTypeF(v);   setPage(1); }} accent="#8B5CF6" />
          <Pills label="Status" opts={STATUS_OPTS} val={statusF} set={v => { setStatusF(v); setPage(1); }} accent="#3B82F6" />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2, background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(12px)' }}>
            <tr>
              {COLS.map(col => (
                <th key={col.key} onClick={() => col.sortable && toggleSort(col.key)}
                  style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: sortKey === col.key ? '#8B5CF6' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(51,65,85,0.6)', cursor: col.sortable ? 'pointer' : 'default', whiteSpace: 'nowrap', userSelect: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => { if (col.sortable) e.currentTarget.style.color = '#CBD5E1'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = sortKey === col.key ? '#8B5CF6' : '#64748B'; }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{col.label}<SortIcon col={col} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={COLS.length} style={{ padding: '64px 20px', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Receipt size={22} color="#8B5CF6" /></div>
                  <p style={{ fontSize: 14, color: '#475569', fontWeight: 600, margin: 0 }}>No expenses match the current filters</p>
                  <p style={{ fontSize: 12, color: '#334155', margin: 0 }}>Try adjusting your filters or search query</p>
                </div>
              </td></tr>
            ) : paged.map((rec, i) => (
              <ExpRow key={rec.id} record={rec} even={i % 2 === 0} onView={onView} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderTop: '1px solid rgba(51,65,85,0.5)', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>
            Showing <span style={{ color: '#94A3B8', fontWeight: 600 }}>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span style={{ color: '#94A3B8', fontWeight: 600 }}>{filtered.length}</span>
          </span>
          <div style={{ display: 'flex', gap: 5 }}>
            <PagBtn disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={13} /></PagBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <PagBtn key={p} active={p === page} onClick={() => setPage(p)}>{p}</PagBtn>)}
            <PagBtn disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={13} /></PagBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function ExpRow({ record, even, onView, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const isPending = record.status === 'pending';
  const isHighAmt = record.amount > 40000;
  const bg = hovered ? 'rgba(139,92,246,0.06)' : isPending ? 'rgba(245,158,11,0.04)' : even ? 'transparent' : 'rgba(15,23,42,0.25)';

  return (
    <tr style={{ background: bg, transition: 'background 0.15s', cursor: 'pointer', borderLeft: isPending ? '2px solid rgba(245,158,11,0.4)' : '2px solid transparent' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => onView?.(record)}
    >
      <td style={td}><span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#C4B5FD', letterSpacing: '0.02em' }}>{record.id}</span></td>
      <td style={td}>
        <p style={{ fontSize: 12.5, color: '#CBD5E1', fontWeight: 600, margin: 0 }}>{record.vehicle}</p>
        <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#475569', margin: '2px 0 0' }}>{record.registration}</p>
      </td>
      <td style={td}><StatusBadge type={record.type} /></td>
      <td style={td}><span style={{ fontSize: 11.5, color: '#94A3B8' }}>{record.category}</span></td>
      <td style={td}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {isHighAmt && <AlertCircle size={12} color="#F59E0B" />}
          <span style={{ fontSize: 14, fontWeight: 800, color: isHighAmt ? '#FDE68A' : '#F8FAFC' }}>₹{record.amount.toLocaleString()}</span>
        </div>
      </td>
      <td style={td}><span style={{ fontSize: 11.5, color: '#64748B' }}>{record.date}</span></td>
      <td style={td}><StatusBadge status={record.status} /></td>
      <td style={td}><span style={{ fontSize: 11.5, color: '#64748B', maxWidth: 180, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.notes || '—'}</span></td>
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

function Pills({ label, opts, val, set, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', marginRight: 2 }}>{label}:</span>
      {opts.map(o => (
        <button key={o} onClick={() => set(o)}
          style={{ padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize', background: val === o ? accent : 'rgba(15,23,42,0.7)', color: val === o ? '#fff' : '#64748B', border: `1px solid ${val === o ? accent : '#334155'}`, boxShadow: val === o ? `0 2px 8px ${accent}40` : 'none' }}>
          {o === 'all' ? 'All' : o}
        </button>
      ))}
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

function PagBtn({ children, onClick, disabled, active }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ minWidth: 32, height: 32, borderRadius: 8, border: `1px solid ${active ? '#8B5CF6' : '#334155'}`, background: active ? '#8B5CF6' : h ? 'rgba(30,41,59,0.9)' : 'transparent', color: active ? '#fff' : disabled ? '#334155' : h ? '#F8FAFC' : '#94A3B8', fontSize: 12, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', boxShadow: active ? '0 2px 8px rgba(139,92,246,0.35)' : 'none' }}>
      {children}
    </button>
  );
}
