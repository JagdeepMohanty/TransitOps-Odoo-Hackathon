import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, MoreHorizontal } from 'lucide-react';

const TRIPS = [
  { id: 'T1042', vehicle: 'KA-01-AB-1234', driver: 'Ravi Kumar',   source: 'Mumbai, MH',    destination: 'Pune, MH',       status: 'completed',   date: '10 Dec 2024' },
  { id: 'T1041', vehicle: 'KA-02-CD-5678', driver: 'Suresh Nair',  source: 'Delhi, DL',     destination: 'Jaipur, RJ',     status: 'in_progress', date: '12 Dec 2024' },
  { id: 'T1040', vehicle: 'DL-04-GH-3456', driver: 'Amit Sharma',  source: 'Bangalore, KA', destination: 'Chennai, TN',    status: 'completed',   date: '08 Dec 2024' },
  { id: 'T1039', vehicle: 'TN-05-IJ-7890', driver: 'Priya Menon',  source: 'Hyderabad, TS', destination: 'Vijayawada, AP', status: 'completed',   date: '07 Dec 2024' },
  { id: 'T1038', vehicle: 'GJ-06-KL-2345', driver: 'Deepak Verma', source: 'Ahmedabad, GJ', destination: 'Surat, GJ',      status: 'dispatched',  date: '12 Dec 2024' },
  { id: 'T1037', vehicle: 'UP-08-OP-0123', driver: 'Kavya Reddy',  source: 'Kolkata, WB',   destination: 'Bhubaneswar, OD',status: 'pending',     date: '14 Dec 2024' },
  { id: 'T1036', vehicle: 'KA-01-AB-1234', driver: 'Mohan Das',    source: 'Chennai, TN',   destination: 'Coimbatore, TN', status: 'cancelled',   date: '05 Dec 2024' },
  { id: 'T1035', vehicle: 'TN-05-IJ-7890', driver: 'Sunita Patel', source: 'Pune, MH',      destination: 'Nagpur, MH',     status: 'completed',   date: '03 Dec 2024' },
];

const STATUS_CONFIG = {
  completed:   { label: 'Completed',   cls: 'bg-success/10 text-success border-success/20' },
  in_progress: { label: 'In Progress', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  dispatched:  { label: 'Dispatched',  cls: 'bg-primary/10 text-primary border-primary/20' },
  pending:     { label: 'Pending',     cls: 'bg-warning/10 text-warning border-warning/20' },
  cancelled:   { label: 'Cancelled',   cls: 'bg-danger/10 text-danger border-danger/20' },
};

const PAGE_SIZE = 5;

export default function RecentTripsTable() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = TRIPS.filter((t) =>
    [t.id, t.vehicle, t.driver, t.source, t.destination, t.status]
      .join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-bg-card border border-border rounded-[20px] shadow-card-md overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-border">
        <div>
          <h2 className="text-sm font-bold text-content-primary">Recent Trips</h2>
          <p className="text-xs text-content-muted mt-0.5">{filtered.length} trips found</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-disabled pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search trips..."
            className="pl-9 pr-4 h-8 w-full sm:w-56 rounded-xl text-xs bg-bg-secondary border border-border text-content-primary placeholder:text-content-disabled focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus transition-all duration-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="sticky top-0 bg-bg-secondary border-b border-border">
            <tr>
              {['Trip ID', 'Vehicle', 'Driver', 'Source', 'Destination', 'Status', 'Date', 'Action'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-content-disabled uppercase tracking-widest whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-content-muted">
                  No trips match your search.
                </td>
              </tr>
            ) : paged.map((trip) => {
              const s = STATUS_CONFIG[trip.status] ?? STATUS_CONFIG.pending;
              return (
                <tr key={trip.id} className="hover:bg-bg-hover/60 transition-colors duration-150 group">
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold text-primary">#{trip.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono text-content-secondary">{trip.vehicle}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-content-secondary">{trip.driver}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-content-muted truncate max-w-[120px] block">{trip.source}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-content-muted truncate max-w-[120px] block">{trip.destination}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${s.cls}`}>
                      {s.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-content-muted">{trip.date}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-medium hover:bg-primary/20 transition-all duration-150">
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border">
        <span className="text-xs text-content-muted">
          Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-content-muted hover:text-content-primary hover:border-border-strong disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-150 ${p === page ? 'bg-primary text-white' : 'border border-border text-content-muted hover:text-content-primary hover:border-border-strong'}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-content-muted hover:text-content-primary hover:border-border-strong disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
