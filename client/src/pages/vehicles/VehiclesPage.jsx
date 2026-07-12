import { useState, useEffect, useCallback } from 'react';
import { Plus, Truck, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageShell      from '@components/layout/PageShell';
import Button         from '@components/common/Button';
import SearchBar      from '@components/common/SearchBar';
import FilterDropdown from '@components/common/FilterDropdown';
import StatusBadge    from '@components/common/StatusBadge';
import Pagination     from '@components/common/Pagination';
import EmptyState     from '@components/common/EmptyState';
import Spinner        from '@components/common/Spinner';
import { vehiclesApi } from '@api/vehicles.api';
import { VEHICLE_STATUSES } from '@utils/constants';
import useDebounce    from '@hooks/useDebounce';

export default function VehiclesPage() {
  const [vehicles,     setVehicles]     = useState([]);
  const [pagination,   setPagination]   = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page,         setPage]         = useState(1);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 10 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter)    params.status = statusFilter;
      const res = await vehiclesApi.getAll(params);
      setVehicles(res.data.data.data);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  function handleSearch(val)  { setSearch(val);       setPage(1); }
  function handleFilter(val)  { setStatusFilter(val); setPage(1); }

  return (
    <PageShell
      title="Vehicles"
      subtitle={`Manage your fleet · ${pagination.total} total vehicles`}
      actions={
        <Link to="/vehicles/add">
          <Button icon={Plus}>Add Vehicle</Button>
        </Link>
      }
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by registration, name, type, region…"
          className="flex-1 max-w-sm"
        />
        <FilterDropdown
          label="Status"
          options={VEHICLE_STATUSES}
          value={statusFilter}
          onChange={handleFilter}
        />
      </div>

      <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-content-primary">All Vehicles</h2>
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
        ) : vehicles.length === 0 ? (
          <EmptyState
            icon={Truck}
            title="No vehicles found"
            description="Try adjusting your search or filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-bg-secondary">
                <tr>
                  {['Vehicle', 'Type', 'Region', 'Odometer', 'Capacity', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-content-muted uppercase tracking-wider first:pl-6 last:pr-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {vehicles.map(v => (
                  <tr key={v.id} className="hover:bg-bg-hover transition-colors duration-100 group">
                    <td className="px-4 py-3.5 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Truck className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-content-primary">{v.registrationNumber}</p>
                          <p className="text-xs text-content-muted">{v.name}{v.model ? ` · ${v.model}` : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary">{v.type}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary">{v.region ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary">
                        {parseFloat(v.odometer).toLocaleString()} km
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary">
                        {parseFloat(v.maxLoadCapacity).toLocaleString()} kg
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-4 py-3.5 pr-6">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <Link
                          to={`/vehicles/${v.id}/edit`}
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
