import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { ANALYTICS_TABLE_DATA } from '@utils/reportsMockData';

const STATUS_STYLES = {
  available:   'bg-success/10 text-success border-success/20',
  on_trip:     'bg-primary/10 text-primary border-primary/20',
  maintenance: 'bg-warning/10 text-warning border-warning/20',
  retired:     'bg-danger/10  text-danger  border-danger/20',
};
const STATUS_LABELS = { available: 'Available', on_trip: 'On Trip', maintenance: 'Maintenance', retired: 'Retired' };

const COLS = [
  { key: 'vehicle',         label: 'Vehicle',        sortable: true  },
  { key: 'trips',           label: 'Trips',          sortable: true  },
  { key: 'distance',        label: 'Distance',       sortable: true  },
  { key: 'fuelUsed',        label: 'Fuel Used',      sortable: true  },
  { key: 'fuelEfficiency',  label: 'Efficiency',     sortable: true  },
  { key: 'maintenanceCost', label: 'Maint. Cost',    sortable: true  },
  { key: 'operationalCost', label: 'Op. Cost',       sortable: true  },
  { key: 'revenue',         label: 'Revenue',        sortable: true  },
  { key: 'roi',             label: 'ROI',            sortable: true  },
  { key: 'status',          label: 'Status',         sortable: false },
  { key: 'actions',         label: 'Actions',        sortable: false },
];

const PAGE_SIZE = 5;

export default function AnalyticsTable() {
  const [search, setSearch]     = useState('');
  const [sortKey, setSortKey]   = useState('revenue');
  const [sortDir, setSortDir]   = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage]         = useState(1);

  const filtered = useMemo(() => {
    let d = ANALYTICS_TABLE_DATA;
    if (search) d = d.filter(r => r.vehicle.toLowerCase().includes(search.toLowerCase()) || r.plate.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') d = d.filter(r => r.status === statusFilter);
    d = [...d].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return d;
  }, [search, sortKey, sortDir, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(1);
  };

  const SortIcon = ({ col }) => {
    if (!col.sortable) return null;
    if (sortKey !== col.key) return <ChevronsUpDown className="w-3 h-3 text-content-disabled" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-primary" />
      : <ChevronDown className="w-3 h-3 text-primary" />;
  };

  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 border-b border-border/50">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search vehicles..."
            className="w-full pl-9 pr-4 py-2 bg-bg-base border border-border rounded-xl text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-bg-base border border-border rounded-xl text-sm text-content-secondary focus:outline-none focus:border-primary/60 transition-all"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="on_trip">On Trip</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-bg-base border border-border rounded-xl text-sm text-content-secondary hover:border-success/50 hover:text-success transition-all">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="sticky top-0 z-10 bg-bg-base/90 backdrop-blur-sm">
            <tr className="border-b border-border/50">
              {COLS.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-[10px] font-semibold text-content-muted uppercase tracking-wider whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:text-content-secondary select-none' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {paged.map(row => (
              <tr key={row.id} className="hover:bg-bg-hover/40 transition-colors duration-150 group">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-content-primary">{row.vehicle}</p>
                    <p className="text-xs text-content-muted font-mono">{row.plate}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-content-primary">{row.trips}</td>
                <td className="px-4 py-3 text-sm text-content-secondary">{row.distance.toLocaleString()} km</td>
                <td className="px-4 py-3 text-sm text-content-secondary">{row.fuelUsed} L</td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-semibold ${row.fuelEfficiency >= 8.5 ? 'text-success' : row.fuelEfficiency >= 8 ? 'text-primary' : 'text-warning'}`}>
                    {row.fuelEfficiency} km/L
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-content-secondary">₹{row.maintenanceCost.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-content-secondary">₹{row.operationalCost.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-semibold text-success">₹{row.revenue.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-bold ${row.roi < 0 ? 'text-danger' : row.roi >= 25 ? 'text-success' : 'text-primary'}`}>
                    {row.roi > 0 ? '+' : ''}{row.roi}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-[10px] font-semibold ${STATUS_STYLES[row.status]}`}>
                    {STATUS_LABELS[row.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 rounded-lg text-content-muted hover:text-primary hover:bg-primary/10 transition-all duration-150">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border/50">
        <span className="text-xs text-content-muted">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} vehicles
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                p === page ? 'bg-primary text-white' : 'text-content-muted hover:text-content-primary hover:bg-bg-hover'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
