import { useState, useMemo } from 'react';
import {
  ChevronUp, ChevronDown, ChevronsUpDown,
  Eye, Pencil, CheckCircle, XCircle, Trash2,
  ChevronLeft, ChevronRight, Search, Filter,
  AlertTriangle,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

const STATUS_FILTERS   = ['all', 'scheduled', 'in_progress', 'completed', 'overdue', 'cancelled'];
const PRIORITY_FILTERS = ['all', 'low', 'medium', 'high', 'critical'];
const PAGE_SIZE = 6;

export default function MaintenanceTable({ records = [], onView, onEdit, onComplete, onCancel, onDelete }) {
  const [sortKey, setSortKey]     = useState('startDate');
  const [sortDir, setSortDir]     = useState('desc');
  const [statusF, setStatusF]     = useState('all');
  const [priorityF, setPriorityF] = useState('all');
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  }

  const filtered = useMemo(() => {
    let data = [...records];
    if (statusF !== 'all')   data = data.filter(r => r.status === statusF);
    if (priorityF !== 'all') data = data.filter(r => r.priority === priorityF);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(r =>
        r.id.toLowerCase().includes(q)           ||
        r.vehicle.toLowerCase().includes(q)      ||
        r.registration.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)         ||
        r.technician.toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [records, statusF, priorityF, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const COLS = [
    { key: 'id',                 label: 'Maint. ID',      sortable: true  },
    { key: 'vehicle',            label: 'Vehicle',         sortable: true  },
    { key: 'registration',       label: 'Reg. No.',        sortable: false },
    { key: 'type',               label: 'Type',            sortable: true  },
    { key: 'technician',         label: 'Technician',      sortable: true  },
    { key: 'priority',           label: 'Priority',        sortable: true  },
    { key: 'startDate',          label: 'Start Date',      sortable: true  },
    { key: 'expectedCompletion', label: 'Est. Completion', sortable: true  },
    { key: 'cost',               label: 'Cost',            sortable: true  },
    { key: 'status',             label: 'Status',          sortable: true  },
    { key: '_actions',           label: 'Actions',         sortable: false },
  ];

  function SortIcon({ col }) {
    if (!col.sortable) return null;
    if (sortKey !== col.key) return <ChevronsUpDown size={11} color="#475569" />;
    return sortDir === 'asc'
      ? <ChevronUp size={11} color="#3B82F6" />
      : <ChevronDown size={11} color="#3B82F6" />;
  }

  return (
    <div style={{
      background: 'rgba(30,41,59,0.65)', backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid #334155', borderRadius: 20, overflow: 'hidden',
    }}>
      {/* Toolbar */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid rgba(51,65,85,0.6)',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC' }}>All Maintenance Records</span>
            <span style={{
              fontSize: 11, fontWeight: 600, color: '#64748B',
              background: 'rgba(100,116,139,0.12)', border: '1px solid rgba(100,116,139,0.2)',
              padding: '2px 8px', borderRadius: 999,
            }}>{filtered.length} records</span>
          </div>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={13} color="#64748B" style={{
              position: 'absolute', left: 10, top: '50%',
              transform: 'translateY(-50%)', pointerEvents: 'none',
            }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search ID, vehicle, technician…"
              style={{
                paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                borderRadius: 10, border: '1px solid #334155',
                background: '#0F172A', color: '#F8FAFC', fontSize: 12,
                outline: 'none', width: 230, transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#3B82F6'}
              onBlur={e => e.target.style.borderColor = '#334155'}
            />
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <FilterGroup label="Status"   options={STATUS_FILTERS}   value={statusF}   onChange={v => { setStatusF(v);   setPage(1); }} />
          <FilterGroup label="Priority" options={PRIORITY_FILTERS} value={priorityF} onChange={v => { setPriorityF(v); setPage(1); }} />
        </div>
      </div>

      {/* Scrollable table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1060 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2, background: '#0F172A' }}>
            <tr>
              {COLS.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && toggleSort(col.key)}
                  style={{
                    padding: '11px 14px', textAlign: 'left',
                    fontSize: 10, fontWeight: 700, color: '#64748B',
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                    borderBottom: '1px solid rgba(51,65,85,0.6)',
                    cursor: col.sortable ? 'pointer' : 'default',
                    whiteSpace: 'nowrap', userSelect: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => { if (col.sortable) e.currentTarget.style.color = '#CBD5E1'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    <SortIcon col={col} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={COLS.length} style={{ padding: '56px 20px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Filter size={20} color="#3B82F6" />
                    </div>
                    <p style={{ fontSize: 14, color: '#475569', fontWeight: 600 }}>No records match the current filters</p>
                    <p style={{ fontSize: 12, color: '#334155' }}>Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : paged.map((rec, i) => (
              <MaintenanceRow
                key={rec.id}
                record={rec}
                even={i % 2 === 0}
                onView={onView}
                onEdit={onEdit}
                onComplete={onComplete}
                onCancel={onCancel}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', borderTop: '1px solid rgba(51,65,85,0.5)',
          flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div style={{ display: 'flex', gap: 5 }}>
            <PagBtn disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={13} />
            </PagBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <PagBtn key={p} active={p === page} onClick={() => setPage(p)}>{p}</PagBtn>
            ))}
            <PagBtn disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight size={13} />
            </PagBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function MaintenanceRow({ record, even, onView, onEdit, onComplete, onCancel, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const isOverdue = record.status === 'overdue';

  const bg = hovered
    ? 'rgba(59,130,246,0.06)'
    : isOverdue
      ? 'rgba(239,68,68,0.04)'
      : even ? 'transparent' : 'rgba(15,23,42,0.2)';

  const canComplete = record.status === 'in_progress' || record.status === 'scheduled';
  const canCancel   = record.status === 'in_progress' || record.status === 'scheduled';

  return (
    <tr
      style={{ background: bg, transition: 'background 0.15s', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView?.(record)}
    >
      <td style={tdStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isOverdue && <AlertTriangle size={11} color="#EF4444" />}
          <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#93C5FD' }}>
            {record.id}
          </span>
        </div>
      </td>
      <td style={tdStyle}>
        <span style={{ fontSize: 12, color: '#CBD5E1', fontWeight: 500 }}>{record.vehicle}</span>
      </td>
      <td style={tdStyle}>
        <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748B' }}>{record.registration}</span>
      </td>
      <td style={tdStyle}>
        <span style={{ fontSize: 12, color: '#CBD5E1' }}>{record.type}</span>
      </td>
      <td style={tdStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#22C55E' }}>
              {record.technician?.charAt(0)}
            </span>
          </div>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>{record.technician}</span>
        </div>
      </td>
      <td style={tdStyle}>
        <PriorityBadge priority={record.priority} />
      </td>
      <td style={tdStyle}>
        <span style={{ fontSize: 11, color: '#64748B' }}>{record.startDate}</span>
      </td>
      <td style={tdStyle}>
        <span style={{
          fontSize: 11,
          color: isOverdue ? '#FCA5A5' : '#64748B',
          fontWeight: isOverdue ? 700 : 400,
        }}>
          {record.expectedCompletion}
          {isOverdue && <span style={{ marginLeft: 4, fontSize: 10 }}>⚠</span>}
        </span>
      </td>
      <td style={tdStyle}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC' }}>
          ₹{record.cost.toLocaleString()}
        </span>
      </td>
      <td style={tdStyle}>
        <StatusBadge status={record.status} />
      </td>
      <td style={{ ...tdStyle, paddingRight: 16 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: 3 }}>
          <ActionBtn title="View Details" color="#3B82F6" onClick={() => onView?.(record)}>
            <Eye size={12} />
          </ActionBtn>
          <ActionBtn title="Edit" color="#8B5CF6" onClick={() => onEdit?.(record)}>
            <Pencil size={12} />
          </ActionBtn>
          {canComplete && (
            <ActionBtn title="Complete" color="#22C55E" onClick={() => onComplete?.(record)}>
              <CheckCircle size={12} />
            </ActionBtn>
          )}
          {canCancel && (
            <ActionBtn title="Cancel" color="#F59E0B" onClick={() => onCancel?.(record)}>
              <XCircle size={12} />
            </ActionBtn>
          )}
          <ActionBtn title="Delete" color="#EF4444" onClick={() => onDelete?.(record)}>
            <Trash2 size={12} />
          </ActionBtn>
        </div>
      </td>
    </tr>
  );
}

const tdStyle = {
  padding: '12px 14px',
  borderBottom: '1px solid rgba(51,65,85,0.35)',
  verticalAlign: 'middle',
};

function ActionBtn({ children, title, color, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      title={title}
      onClick={e => { e.stopPropagation(); onClick?.(); }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 28, height: 28, borderRadius: 7, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: h ? `${color}22` : 'transparent',
        color: h ? color : '#64748B',
        transition: 'all 0.15s',
        transform: h ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      {children}
    </button>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        fontSize: 10, fontWeight: 700, color: '#475569',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 2,
      }}>{label}:</span>
      {options.map(o => (
        <button
          key={o}
          onClick={() => onChange(o)}
          style={{
            padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
            background: value === o ? '#3B82F6' : 'rgba(15,23,42,0.6)',
            color: value === o ? '#fff' : '#64748B',
            border: `1px solid ${value === o ? '#3B82F6' : '#334155'}`,
          }}
        >
          {o === 'all' ? 'All' : o.replace('_', ' ')}
        </button>
      ))}
    </div>
  );
}

function PagBtn({ children, onClick, disabled, active }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        minWidth: 30, height: 30, borderRadius: 7,
        border: `1px solid ${active ? '#3B82F6' : '#334155'}`,
        background: active ? '#3B82F6' : h ? 'rgba(30,41,59,0.8)' : 'transparent',
        color: active ? '#fff' : disabled ? '#334155' : h ? '#F8FAFC' : '#94A3B8',
        fontSize: 12, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}
