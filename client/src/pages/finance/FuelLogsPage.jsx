import { useState, useMemo } from 'react';
import { Plus, Fuel, Eye, Droplets } from 'lucide-react';
import PageShell      from '@components/layout/PageShell';
import Button         from '@components/common/Button';
import SearchBar      from '@components/common/SearchBar';
import FilterDropdown from '@components/common/FilterDropdown';
import Pagination     from '@components/common/Pagination';
import EmptyState     from '@components/common/EmptyState';
import { MOCK_FUEL_LOGS, MOCK_VEHICLES } from '@utils/mockData';

const PAGE_SIZE = 6;

const VEHICLE_OPTIONS = [
  { label: 'All Vehicles', value: '' },
  ...MOCK_VEHICLES.map(v => ({ label: v.plate, value: v.plate })),
];

function SummaryCard({ label, value, sub, color }) {
  return (
    <div className="bg-bg-card border border-border-card rounded-xl p-4 shadow-card">
      <p className="text-xs text-content-muted uppercase tracking-wider font-medium">{label}</p>
      <p className={`mt-1.5 text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-content-disabled mt-0.5">{sub}</p>}
    </div>
  );
}

export default function FuelLogsPage() {
  const [search,  setSearch]  = useState('');
  const [vehicle, setVehicle] = useState('');
  const [page,    setPage]    = useState(1);

  const filtered = useMemo(() => {
    let data = MOCK_FUEL_LOGS;
    if (search)  data = data.filter(f =>
      f.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      f.driver.toLowerCase().includes(search.toLowerCase())  ||
      f.station.toLowerCase().includes(search.toLowerCase())
    );
    if (vehicle) data = data.filter(f => f.vehicle === vehicle);
    return data;
  }, [search, vehicle]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged       = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalLiters = MOCK_FUEL_LOGS.reduce((s, f) => s + f.liters, 0);
  const totalCost   = MOCK_FUEL_LOGS.reduce((s, f) => s + f.totalCost, 0);
  const avgPrice    = (totalCost / totalLiters).toFixed(2);

  return (
    <PageShell
      title="Fuel Logs"
      subtitle="Track fuel consumption across your fleet"
      actions={<Button icon={Plus}>Log Fuel</Button>}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard label="Total Fuel Cost"  value={`₹${totalCost.toLocaleString()}`}  sub="All records"    color="text-content-primary" />
        <SummaryCard label="Total Liters"     value={`${totalLiters.toLocaleString()}L`} sub="Consumed"       color="text-info"            />
        <SummaryCard label="Avg Price/Liter"  value={`₹${avgPrice}`}                    sub="Across all logs" color="text-warning"        />
        <SummaryCard label="Total Logs"       value={MOCK_FUEL_LOGS.length}              sub="Entries"        color="text-content-primary" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search vehicle, driver, station…" className="flex-1 max-w-sm" />
        <FilterDropdown label="Vehicle" options={VEHICLE_OPTIONS} value={vehicle} onChange={v => { setVehicle(v ?? ''); setPage(1); }} />
      </div>

      <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-content-primary">All Fuel Logs</h2>
          <span className="text-xs text-content-muted">{filtered.length} records</span>
        </div>

        {paged.length === 0 ? (
          <EmptyState icon={Fuel} title="No fuel logs found" description="Try adjusting your search or filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-bg-secondary">
                <tr>
                  {['ID','Vehicle','Driver','Date','Liters','Price/L','Total Cost','Odometer','Station','Trip',''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-content-muted uppercase tracking-wider first:pl-6 last:pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map(f => (
                  <tr key={f.id} className="hover:bg-bg-hover transition-colors duration-100 group">
                    <td className="px-4 py-3.5 pl-6"><span className="text-xs font-mono font-semibold text-content-primary">{f.id}</span></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-info/10 flex items-center justify-center shrink-0">
                          <Droplets className="w-3 h-3 text-info" />
                        </div>
                        <span className="text-xs font-mono text-content-secondary">{f.vehicle}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><span className="text-xs text-content-secondary">{f.driver}</span></td>
                    <td className="px-4 py-3.5"><span className="text-xs text-content-muted">{f.date}</span></td>
                    <td className="px-4 py-3.5"><span className="text-xs font-semibold text-content-primary">{f.liters}L</span></td>
                    <td className="px-4 py-3.5"><span className="text-xs text-content-secondary">₹{f.pricePerLiter}</span></td>
                    <td className="px-4 py-3.5"><span className="text-sm font-bold text-content-primary">₹{f.totalCost.toLocaleString()}</span></td>
                    <td className="px-4 py-3.5"><span className="text-xs text-content-muted">{f.odometer.toLocaleString()} km</span></td>
                    <td className="px-4 py-3.5"><span className="text-xs text-content-muted truncate max-w-[120px] block">{f.station}</span></td>
                    <td className="px-4 py-3.5"><span className="text-xs text-content-muted">{f.trip ?? '—'}</span></td>
                    <td className="px-4 py-3.5 pr-6">
                      <button className="p-1.5 rounded-lg hover:bg-bg-active text-content-muted hover:text-content-primary transition-colors opacity-0 group-hover:opacity-100">
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
