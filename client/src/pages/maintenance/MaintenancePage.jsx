import { useState, useMemo } from 'react';
import { Plus, Wrench, Eye, AlertTriangle } from 'lucide-react';
import PageShell      from '@components/layout/PageShell';
import Button         from '@components/common/Button';
import SearchBar      from '@components/common/SearchBar';
import FilterDropdown from '@components/common/FilterDropdown';
import StatusBadge    from '@components/common/StatusBadge';
import Pagination     from '@components/common/Pagination';
import EmptyState     from '@components/common/EmptyState';
import { MOCK_MAINTENANCE } from '@utils/mockData';

const STATUS_OPTIONS = [
  { label: 'Scheduled',   value: 'scheduled'   },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed',   value: 'completed'   },
  { label: 'Overdue',     value: 'overdue'     },
];

const PAGE_SIZE = 6;

export default function MaintenancePage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(null);
  const [page,   setPage]   = useState(1);

  const filtered = useMemo(() => {
    let data = MOCK_MAINTENANCE;
    if (search) data = data.filter(m =>
      m.vehicle.toLowerCase().includes(search.toLowerCase())     ||
      m.type.toLowerCase().includes(search.toLowerCase())        ||
      m.technician.toLowerCase().includes(search.toLowerCase())
    );
    if (status) data = data.filter(m => m.status === status);
    return data;
  }, [search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const overdueCount = MOCK_MAINTENANCE.filter(m => m.status === 'overdue').length;

  function handleSearch(val) { setSearch(val); setPage(1); }
  function handleFilter(val) { setStatus(val); setPage(1); }

  return (
    <PageShell
      title="Maintenance"
      subtitle={`Track and schedule vehicle maintenance · ${MOCK_MAINTENANCE.length} records`}
      actions={<Button icon={Plus}>Schedule Maintenance</Button>}
    >
      {/* Overdue alert */}
      {overdueCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-muted border border-danger/30 text-danger-text text-sm animate-fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span><strong>{overdueCount} maintenance task{overdueCount > 1 ? 's are' : ' is'} overdue</strong> — immediate attention required.</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by vehicle, type, technician…"
          className="flex-1 max-w-sm"
        />
        <FilterDropdown label="Status" options={STATUS_OPTIONS} value={status} onChange={handleFilter} />
      </div>

      <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-content-primary">All Maintenance Records</h2>
          <span className="text-xs text-content-muted">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {paged.length === 0 ? (
          <EmptyState icon={Wrench} title="No maintenance records" description="Try adjusting your search or filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-bg-secondary">
                <tr>
                  {['ID', 'Vehicle', 'Type', 'Technician', 'Scheduled', 'Completed', 'Cost', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-content-muted uppercase tracking-wider first:pl-6 last:pr-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map(m => (
                  <tr key={m.id} className={`hover:bg-bg-hover transition-colors duration-100 group ${m.status === 'overdue' ? 'bg-danger/5' : ''}`}>
                    <td className="px-4 py-3.5 pl-6">
                      <span className="text-xs font-mono font-semibold text-content-primary">{m.id}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                          <Wrench className="w-3.5 h-3.5 text-warning" />
                        </div>
                        <span className="text-xs font-mono text-content-secondary">{m.vehicle}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary">{m.type}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-muted">{m.technician}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-muted">{m.scheduledDate}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-muted">{m.completedDate ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-semibold text-content-primary">₹{m.cost.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-4 py-3.5 pr-6">
                      <button className="p-1.5 rounded-lg hover:bg-bg-active text-content-muted hover:text-content-primary transition-colors opacity-0 group-hover:opacity-100" title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="px-6 py-4 border-t border-border">
            <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        )}
      </div>
    </PageShell>
  );
}
