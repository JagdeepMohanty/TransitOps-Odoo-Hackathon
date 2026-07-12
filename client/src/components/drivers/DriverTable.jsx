import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Edit2, Ban, Star } from 'lucide-react';
import DriverStatusBadge from './DriverStatusBadge';

const PAGE_SIZE = 6;

function Avatar({ name, size = 'sm' }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const COLORS = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444', '#10B981', '#EC4899', '#38BDF8'];
  const bg = COLORS[name.charCodeAt(0) % COLORS.length];
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  return (
    <div className={`${sz} rounded-full flex items-center justify-center shrink-0 font-bold text-white`} style={{ background: bg }}>
      {initials}
    </div>
  );
}

function SafetyBar({ score }) {
  const color = score >= 90 ? '#22C55E' : score >= 75 ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-bg-secondary rounded-full overflow-hidden w-16">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>{score}</span>
    </div>
  );
}

function getLicenseStatus(expiry) {
  const today = new Date();
  const exp   = new Date(expiry);
  const days  = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  if (days < 0)  return 'expired';
  if (days <= 30) return 'expiring';
  return 'valid';
}

export default function DriverTable({ drivers, onSelect, selectedId, onEdit, onSuspend }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(drivers.length / PAGE_SIZE));
  const paged = drivers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-bg-card border border-border rounded-[20px] shadow-card-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h2 className="text-sm font-bold text-content-primary">Driver Directory</h2>
          <p className="text-xs text-content-muted mt-0.5">{drivers.length} drivers registered</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-content-disabled">
            {Math.min((page - 1) * PAGE_SIZE + 1, drivers.length)}–{Math.min(page * PAGE_SIZE, drivers.length)} of {drivers.length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="sticky top-0 bg-bg-secondary border-b border-border z-10">
            <tr>
              {['Driver', 'License', 'Category', 'Phone', 'Safety Score', 'Expiry', 'Status', 'Vehicle', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-content-disabled uppercase tracking-widest whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <p className="text-sm font-semibold text-content-secondary">No drivers found</p>
                    <p className="text-xs text-content-muted">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : paged.map(d => {
              const licStatus = getLicenseStatus(d.licenseExpiry);
              const isSelected = d.id === selectedId;
              const expDate = new Date(d.licenseExpiry);
              const daysLeft = Math.ceil((expDate - new Date()) / (1000 * 60 * 60 * 24));

              return (
                <tr
                  key={d.id}
                  onClick={() => onSelect(d)}
                  className={`cursor-pointer transition-all duration-150 group ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-bg-hover/60'}`}
                >
                  {/* Driver */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={d.name} />
                      <div>
                        <p className="text-xs font-semibold text-content-primary">{d.name}</p>
                        <p className="text-[10px] text-content-disabled">{d.empId}</p>
                      </div>
                    </div>
                  </td>

                  {/* License */}
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono text-content-secondary">{d.license}</span>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                      {d.licenseCategory}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-content-muted">{d.phone}</span>
                  </td>

                  {/* Safety Score */}
                  <td className="px-5 py-3.5">
                    <SafetyBar score={d.safetyScore} />
                  </td>

                  {/* Expiry */}
                  <td className="px-5 py-3.5">
                    <div>
                      <p className={`text-xs font-medium ${licStatus === 'expired' ? 'text-danger' : licStatus === 'expiring' ? 'text-warning' : 'text-content-secondary'}`}>
                        {d.licenseExpiry}
                      </p>
                      {licStatus !== 'valid' && (
                        <p className={`text-[10px] ${licStatus === 'expired' ? 'text-danger' : 'text-warning'}`}>
                          {licStatus === 'expired' ? `Expired ${Math.abs(daysLeft)}d ago` : `${daysLeft}d left`}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <DriverStatusBadge status={licStatus !== 'valid' && d.status !== 'suspended' ? licStatus : d.status} />
                  </td>

                  {/* Vehicle */}
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono text-content-muted">{d.vehicle}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={e => { e.stopPropagation(); onSelect(d); }}
                        className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); onEdit(d); }}
                        className="p-1.5 rounded-lg bg-bg-hover text-content-muted hover:text-content-primary transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {d.status !== 'suspended' && (
                        <button
                          onClick={e => { e.stopPropagation(); onSuspend(d); }}
                          className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                          title="Suspend"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {drivers.length > PAGE_SIZE && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-border">
          <span className="text-xs text-content-muted">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-content-muted hover:text-content-primary hover:border-border-strong disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-all ${p === page ? 'bg-primary text-white' : 'border border-border text-content-muted hover:text-content-primary hover:border-border-strong'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-content-muted hover:text-content-primary hover:border-border-strong disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
