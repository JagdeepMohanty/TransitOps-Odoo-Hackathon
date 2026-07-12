import { useState, useMemo } from 'react';
import { Plus, Truck, Eye, Edit2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell    from '@components/layout/PageShell';
import Button       from '@components/common/Button';
import SearchBar    from '@components/common/SearchBar';
import FilterDropdown from '@components/common/FilterDropdown';
import StatusBadge  from '@components/common/StatusBadge';
import Pagination   from '@components/common/Pagination';
import EmptyState   from '@components/common/EmptyState';
import { MOCK_VEHICLES } from '@utils/mockData';

const STATUS_OPTIONS = [
  { label: 'Available',   value: 'available'   },
  { label: 'On Trip',     value: 'on_trip'      },
  { label: 'Maintenance', value: 'maintenance'  },
  { label: 'Retired',     value: 'retired'      },
];

const PAGE_SIZE = 6;

export default function VehiclesPage() {
  const navigate = useNavigate();
  const [search,     setSearch]     = useState('');
  const [statusFilter, setStatus]   = useState(null);
  const [page,       setPage]       = useState(1);

  const filtered = useMemo(() => {
    let data = MOCK_VEHICLES;
    if (search)       data = data.filter(v =>
      v.plate.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase())  ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.driver.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter) data = data.filter(v => v.status === statusFilter);
    return data;
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(val) { setSearch(val); setPage(1); }
  function handleFilter(val) { setStatus(val); setPage(1); }

  return (
    <PageShell
      title="Vehicles"
      subtitle={`Manage your fleet · ${MOCK_VEHICLES.length} total vehicles`}
      actions={
        <Link to="/vehicles/add">
          <Button icon={Plus}>Add Vehicle</Button>
        </Link>
      }
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by plate, make, model, driver…"
          className="flex-1 max-w-sm"
        />
        <FilterDropdown label="Status" options={STATUS_OPTIONS} value={statusFilter} onChange={handleFilter} />
      </div>

      {/* Table Card */}
      <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-content-primary">All Vehicles</h2>
          <span className="text-xs text-content-muted">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {paged.length === 0 ? (
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
                  {['Vehicle', 'Type', 'Driver', 'Mileage', 'Last Service', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-content-muted uppercase tracking-wider first:pl-6 last:pr-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map(v => (
                  <tr key={v.id} className="hover:bg-bg-hover transition-colors duration-100 group">
                    <td className="px-4 py-3.5 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Truck className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-content-primary">{v.plate}</p>
                          <p className="text-xs text-content-muted">{v.make} {v.model} · {v.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary">{v.type}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary">{v.driver}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary">{v.mileage.toLocaleString()} km</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-muted">{v.lastService}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-4 py-3.5 pr-6">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button className="p-1.5 rounded-lg hover:bg-bg-active text-content-muted hover:text-content-primary transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link to={`/vehicles/${v.id}/edit`} className="p-1.5 rounded-lg hover:bg-bg-active text-content-muted hover:text-primary transition-colors" title="Edit">
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

        {filtered.length > PAGE_SIZE && (
          <div className="px-6 py-4 border-t border-border">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </PageShell>
  );
}
