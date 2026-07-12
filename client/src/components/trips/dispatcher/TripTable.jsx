import { useState, useMemo } from 'react';
import {
  ChevronUp, ChevronDown, ChevronsUpDown,
  Eye, Zap, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, Filter,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const STATUS_FILTERS = ['all', 'draft', 'dispatched', 'completed', 'cancelled'];
const PAGE_SIZE = 5;

export default function TripTable({ trips = [], onView, onDispatch, onComplete, onCancel }) {
  const [sortKey, setSortKey]     = useState('id');
  const [sortDir, setSortDir]     = useState('desc');
  const [statusFilter, setStatus] = useState('all');
  const [page, setPage]           = useState(1);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  }

  const filtered = useMemo(() => {
    let data = [...trips];
    if (statusFilter !== 'all') data = data.filter(t => t.status === statusFilter);
    data.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [trips, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const COLS = [
    { key: 'id',          label: 'Trip ID',      sortable: true  },
    { key: 'vehicle',     label: 'Vehicle',       sortable: true  },
    { key: 'driver',      label: 'Driver',        sortable: true  },
    { key: 'source',      label: 'Source',        sortable: false },
    { key: 'destination', label: 'Destination',   sortable: false },
    { key: 'cargoWeight', label: 'Cargo (kg)',     sortable: true  },
    { key: 'distance',    label: 'Distance',       sortable: true  },
    { key: 'status',      label: 'Status',         sortable: true  },
    { key: 'dispatchTime',label: 'Dispatch Time',  sortable: false },
    { key: 'eta',         label: 'ETA',            sortable: false },
    { key: '_actions',    label: 'Actions',        sortable: false },
  ];

  function SortIcon({ col }) {
    if (!col.sortable) return null;
    if (sortKey !== col.key) return <ChevronsUpDown size={12} color="#475569" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} color="#3B82F6" />
      : <ChevronDown size={12} color="#3B82F6" />;
  }

  return (
    <div style={{
      background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(12px)',
      border: '1px solid #334155', borderRadius: 20, overflow: 'hidden',
    }}>
      {/* Table header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: '1px solid #1E293B',
        flexWrap: 'wrap', gap: 10,
      }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>All Trips</span>
          <span style={{ fontSize: 12, color: '#64748B', marginLeft: 8 }}>{filtered.length} records</span>
        </div>
        {/* Status filter pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Filter size={13} color="#64748B" />
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              style={{
                padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
                background: statusFilter === s ? '#3B82F6' : '#0F172A',
                color: statusFilter === s ? '#fff' : '#64748B',
                border: `1px solid ${statusFilter === s ? '#3B82F6' : '#334155'}`,
                textTransform: 'capitalize',
              }}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2, background: '#0F172A' }}>
            <tr>
              {COLS.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && toggleSort(col.key)}
                  style={{
                    padding: '10px 14px', textAlign: 'left',
                    fontSize: 10, fontWeight: 700, color: '#64748B',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    borderBottom: '1px solid #1E293B',
                    cursor: col.sortable ? 'pointer' : 'default',
                    whiteSpace: 'nowrap', userSelect: 'none',
                  }}
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
                <td colSpan={COLS.length} style={{ padding: '40px 20px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
                  No trips match the current filter.
                </td>
              </tr>
            ) : paged.map((trip, i) => (
              <TripRow
                key={trip.id}
                trip={trip}
                even={i % 2 === 0}
                onView={onView}
                onDispatch={onDispatch}
                onComplete={onComplete}
                onCancel={onCancel}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', borderTop: '1px solid #1E293B',
          flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <PagBtn disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14} /></PagBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <PagBtn key={p} active={p === page} onClick={() => setPage(p)}>{p}</PagBtn>
            ))}
            <PagBtn disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14} /></PagBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function TripRow({ trip, even, onView, onDispatch, onComplete, onCancel }) {
  const [hovered, setHovered] = useState(false);

  const bg = hovered ? 'rgba(59,130,246,0.05)' : even ? 'transparent' : 'rgba(15,23,42,0.3)';

  return (
    <tr
      style={{ background: bg, transition: 'background 0.15s', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td style={tdStyle}>
        <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#93C5FD' }}>{trip.id}</span>
      </td>
      <td style={tdStyle}>
        <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#CBD5E1' }}>{trip.vehicle}</span>
      </td>
      <td style={tdStyle}>
        <span style={{ fontSize: 12, color: '#CBD5E1' }}>{trip.driver}</span>
      </td>
      <td style={tdStyle}>
        <span style={{ fontSize: 12, color: '#94A3B8', maxWidth: 120, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trip.source}</span>
      </td>
      <td style={tdStyle}>
        <span style={{ fontSize: 12, color: '#94A3B8', maxWidth: 120, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trip.destination}</span>
      </td>
      <td style={tdStyle}>
        <span style={{ fontSize: 12, color: '#CBD5E1' }}>{trip.cargoWeight?.toLocaleString()} kg</span>
      </td>
      <td style={tdStyle}>
        <span style={{ fontSize: 12, color: '#CBD5E1' }}>{trip.distance} km</span>
      </td>
      <td style={tdStyle}>
        <StatusBadge status={trip.status} />
      </td>
      <td style={tdStyle}>
        <span style={{ fontSize: 11, color: '#64748B' }}>{trip.dispatchTime ?? '—'}</span>
      </td>
      <td style={tdStyle}>
        <span style={{ fontSize: 11, color: '#64748B' }}>{trip.eta ?? '—'}</span>
      </td>
      <td style={{ ...tdStyle, paddingRight: 16 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <ActionBtn title="View" color="#3B82F6" onClick={() => onView?.(trip)}>
            <Eye size={13} />
          </ActionBtn>
          {trip.status === 'draft' && (
            <ActionBtn title="Dispatch" color="#22C55E" onClick={() => onDispatch?.(trip)}>
              <Zap size={13} />
            </ActionBtn>
          )}
          {trip.status === 'dispatched' && (
            <ActionBtn title="Complete" color="#22C55E" onClick={() => onComplete?.(trip)}>
              <CheckCircle size={13} />
            </ActionBtn>
          )}
          {(trip.status === 'draft' || trip.status === 'dispatched') && (
            <ActionBtn title="Cancel" color="#EF4444" onClick={() => onCancel?.(trip)}>
              <XCircle size={13} />
            </ActionBtn>
          )}
        </div>
      </td>
    </tr>
  );
}

const tdStyle = {
  padding: '11px 14px',
  borderBottom: '1px solid rgba(51,65,85,0.5)',
  verticalAlign: 'middle',
};

function ActionBtn({ children, title, color, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 26, height: 26, borderRadius: 6, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: h ? `${color}22` : 'transparent',
        color: h ? color : '#64748B',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

function PagBtn({ children, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 28, height: 28, borderRadius: 6, border: `1px solid ${active ? '#3B82F6' : '#334155'}`,
        background: active ? '#3B82F6' : 'transparent',
        color: active ? '#fff' : disabled ? '#334155' : '#94A3B8',
        fontSize: 12, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}
