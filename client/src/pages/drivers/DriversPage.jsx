import { useState, useEffect, useCallback } from 'react';
import { Plus, Users, Edit2, Star, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageShell      from '@components/layout/PageShell';
import Button         from '@components/common/Button';
import SearchBar      from '@components/common/SearchBar';
import FilterDropdown from '@components/common/FilterDropdown';
import StatusBadge    from '@components/common/StatusBadge';
import Pagination     from '@components/common/Pagination';
import EmptyState     from '@components/common/EmptyState';
import Spinner        from '@components/common/Spinner';
import { driversApi } from '@api/drivers.api';
import { DRIVER_STATUSES } from '@utils/constants';
import useDebounce    from '@hooks/useDebounce';

function DriverAvatar({ name }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors   = ['bg-primary/20 text-primary', 'bg-secondary/20 text-secondary', 'bg-accent/20 text-accent', 'bg-warning/20 text-warning'];
  const color    = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${color}`}>
      {initials}
    </div>
  );
}

export default function DriversPage() {
  const [drivers,    setDrivers]    = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [search,     setSearch]     = useState('');
  const [status,     setStatus]     = useState('');
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 10 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status)          params.status = status;
      const res = await driversApi.getAll(params);
      setDrivers(res.data.data.data);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status]);

  useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

  function handleSearch(val) { setSearch(val); setPage(1); }
  function handleFilter(val) { setStatus(val); setPage(1); }

  const formatExpiry = (iso) => iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <PageShell
      title="Drivers"
      subtitle={`Manage your driver roster · ${pagination.total} total drivers`}
      actions={
        <Link to="/drivers/add">
          <Button icon={Plus}>Add Driver</Button>
        </Link>
      }
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, license, contact…"
          className="flex-1 max-w-sm"
        />
        <FilterDropdown label="Status" options={DRIVER_STATUSES} value={status} onChange={handleFilter} />
      </div>

      <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-content-primary">All Drivers</h2>
          <span className="text-xs text-content-muted">
            {pagination.total} record{pagination.total !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="px-6 py-10 text-center text-sm text-red-500">{error}</div>
        ) : drivers.length === 0 ? (
          <EmptyState icon={Users} title="No drivers found" description="Try adjusting your search or filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-bg-secondary">
                <tr>
                  {['Driver', 'Contact', 'License', 'Category', 'Safety Score', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-content-muted uppercase tracking-wider first:pl-6 last:pr-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {drivers.map(d => (
                  <tr key={d.id} className="hover:bg-bg-hover transition-colors duration-100 group">
                    <td className="px-4 py-3.5 pl-6">
                      <div className="flex items-center gap-3">
                        <DriverAvatar name={d.name} />
                        <p className="text-sm font-semibold text-content-primary">{d.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-content-disabled" />
                        <span className="text-xs text-content-secondary">{d.contactNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-mono text-content-secondary">{d.licenseNumber}</p>
                      <p className="text-[11px] text-content-muted">Exp: {formatExpiry(d.licenseExpiryDate)}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary">{d.licenseCategory}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-warning fill-warning" />
                        <span className="text-xs font-semibold text-content-primary">{d.safetyScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-4 py-3.5 pr-6">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <Link
                          to={`/drivers/${d.id}/edit`}
                          className="p-1.5 rounded-lg hover:bg-bg-active text-content-muted hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              pageSize={pagination.limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </PageShell>
  );
}
