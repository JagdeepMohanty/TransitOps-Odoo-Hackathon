import { useState, useMemo } from 'react';
import { Plus, Route, Eye, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageShell      from '@components/layout/PageShell';
import Button         from '@components/common/Button';
import SearchBar      from '@components/common/SearchBar';
import FilterDropdown from '@components/common/FilterDropdown';
import StatusBadge    from '@components/common/StatusBadge';
import Pagination     from '@components/common/Pagination';
import EmptyState     from '@components/common/EmptyState';
import { MOCK_TRIPS } from '@utils/mockData';

const STATUS_OPTIONS = [
  { label: 'Pending',     value: 'pending'     },
  { label: 'Dispatched',  value: 'dispatched'  },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed',   value: 'completed'   },
  { label: 'Cancelled',   value: 'cancelled'   },
];

const PAGE_SIZE = 6;

export default function TripsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(null);
  const [page,   setPage]   = useState(1);

  const filtered = useMemo(() => {
    let data = MOCK_TRIPS;
    if (search) data = data.filter(t =>
      t.id.toLowerCase().includes(search.toLowerCase())          ||
      t.origin.toLowerCase().includes(search.toLowerCase())      ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      t.driver.toLowerCase().includes(search.toLowerCase())      ||
      t.cargo.toLowerCase().includes(search.toLowerCase())
    );
    if (status) data = data.filter(t => t.status === status);
    return data;
  }, [search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(val) { setSearch(val); setPage(1); }
  function handleFilter(val) { setStatus(val); setPage(1); }

  return (
    <PageShell
      title="Trips"
      subtitle={`Track and manage all trips · ${MOCK_TRIPS.length} total`}
      actions={
        <Link to="/trips/create">
          <Button icon={Plus}>Create Trip</Button>
        </Link>
      }
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by trip ID, route, driver, cargo…"
          className="flex-1 max-w-sm"
        />
        <FilterDropdown label="Status" options={STATUS_OPTIONS} value={status} onChange={handleFilter} />
      </div>

      <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-content-primary">All Trips</h2>
          <span className="text-xs text-content-muted">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {paged.length === 0 ? (
          <EmptyState icon={Route} title="No trips found" description="Try adjusting your search or filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-bg-secondary">
                <tr>
                  {['Trip ID', 'Route', 'Driver', 'Vehicle', 'Cargo', 'Distance', 'Date', 'Cost', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-content-muted uppercase tracking-wider first:pl-6 last:pr-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map(t => (
                  <tr key={t.id} className="hover:bg-bg-hover transition-colors duration-100 group">
                    <td className="px-4 py-3.5 pl-6">
                      <span className="text-sm font-bold text-content-primary">#{t.id}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3 h-3 text-content-disabled mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-content-secondary truncate max-w-[140px]">{t.origin}</p>
                          <p className="text-[11px] text-content-muted truncate max-w-[140px]">→ {t.destination}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary">{t.driver}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono text-content-muted">{t.vehicle}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary">{t.cargo}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary">{t.distance} km</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-muted">{t.startDate}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-semibold text-content-primary">
                        {t.cost > 0 ? `₹${t.cost.toLocaleString()}` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3.5 pr-6">
                      <Link
                        to={`/trips/${t.id}`}
                        className="p-1.5 rounded-lg hover:bg-bg-active text-content-muted hover:text-content-primary transition-colors opacity-0 group-hover:opacity-100 inline-flex"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
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
