import { useState, useMemo } from 'react';
import { Plus, Users, Eye, Edit2, Star, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageShell      from '@components/layout/PageShell';
import Button         from '@components/common/Button';
import SearchBar      from '@components/common/SearchBar';
import FilterDropdown from '@components/common/FilterDropdown';
import StatusBadge    from '@components/common/StatusBadge';
import Pagination     from '@components/common/Pagination';
import EmptyState     from '@components/common/EmptyState';
import { MOCK_DRIVERS } from '@utils/mockData';

const STATUS_OPTIONS = [
  { label: 'Active',   value: 'active'   },
  { label: 'Inactive', value: 'inactive' },
  { label: 'On Trip',  value: 'on_trip'  },
];

const PAGE_SIZE = 6;

function DriverAvatar({ name }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors   = ['bg-primary/20 text-primary', 'bg-secondary/20 text-secondary', 'bg-accent/20 text-accent', 'bg-warning/20 text-warning', 'bg-info/20 text-info'];
  const color    = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${color}`}>
      {initials}
    </div>
  );
}

export default function DriversPage() {
  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState(null);
  const [page,    setPage]    = useState(1);

  const filtered = useMemo(() => {
    let data = MOCK_DRIVERS;
    if (search) data = data.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase())    ||
      d.phone.includes(search)                               ||
      d.license.toLowerCase().includes(search.toLowerCase()) ||
      d.vehicle.toLowerCase().includes(search.toLowerCase())
    );
    if (status) data = data.filter(d => d.status === status);
    return data;
  }, [search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(val) { setSearch(val); setPage(1); }
  function handleFilter(val) { setStatus(val); setPage(1); }

  return (
    <PageShell
      title="Drivers"
      subtitle={`Manage your driver roster · ${MOCK_DRIVERS.length} total drivers`}
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
          placeholder="Search by name, phone, license…"
          className="flex-1 max-w-sm"
        />
        <FilterDropdown label="Status" options={STATUS_OPTIONS} value={status} onChange={handleFilter} />
      </div>

      <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-content-primary">All Drivers</h2>
          <span className="text-xs text-content-muted">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {paged.length === 0 ? (
          <EmptyState icon={Users} title="No drivers found" description="Try adjusting your search or filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-bg-secondary">
                <tr>
                  {['Driver', 'Contact', 'License', 'Vehicle', 'Trips', 'Rating', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-content-muted uppercase tracking-wider first:pl-6 last:pr-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map(d => (
                  <tr key={d.id} className="hover:bg-bg-hover transition-colors duration-100 group">
                    <td className="px-4 py-3.5 pl-6">
                      <div className="flex items-center gap-3">
                        <DriverAvatar name={d.name} />
                        <div>
                          <p className="text-sm font-semibold text-content-primary">{d.name}</p>
                          <p className="text-xs text-content-muted">Joined {d.joined}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-content-disabled" />
                        <span className="text-xs text-content-secondary">{d.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-mono text-content-secondary">{d.license}</p>
                      <p className="text-[11px] text-content-muted">Exp: {d.licenseExpiry}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary">{d.vehicle}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-semibold text-content-primary">{d.trips}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-warning fill-warning" />
                        <span className="text-xs font-semibold text-content-primary">{d.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-4 py-3.5 pr-6">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button className="p-1.5 rounded-lg hover:bg-bg-active text-content-muted hover:text-content-primary transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link to={`/drivers/${d.id}/edit`} className="p-1.5 rounded-lg hover:bg-bg-active text-content-muted hover:text-primary transition-colors" title="Edit">
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
            <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        )}
      </div>
    </PageShell>
  );
}
