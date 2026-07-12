import { useState, useMemo } from 'react';
import { Plus, DollarSign, Eye, TrendingUp } from 'lucide-react';
import PageShell      from '@components/layout/PageShell';
import Button         from '@components/common/Button';
import SearchBar      from '@components/common/SearchBar';
import FilterDropdown from '@components/common/FilterDropdown';
import Pagination     from '@components/common/Pagination';
import EmptyState     from '@components/common/EmptyState';
import Badge          from '@components/common/Badge';
import { MOCK_EXPENSES } from '@utils/mockData';

const TYPE_OPTIONS = [
  { label: 'Fuel',        value: 'Fuel'        },
  { label: 'Maintenance', value: 'Maintenance' },
  { label: 'Toll',        value: 'Toll'        },
  { label: 'Insurance',   value: 'Insurance'   },
  { label: 'Other',       value: 'Other'       },
];

const TYPE_BADGE = {
  Fuel:        'info',
  Maintenance: 'warning',
  Toll:        'muted',
  Insurance:   'accent',
  Other:       'muted',
};

const PAGE_SIZE = 6;

function SummaryCard({ label, value, sub, color }) {
  return (
    <div className="bg-bg-card border border-border-card rounded-xl p-4 shadow-card">
      <p className="text-xs text-content-muted uppercase tracking-wider font-medium">{label}</p>
      <p className={`mt-1.5 text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-content-disabled mt-0.5">{sub}</p>}
    </div>
  );
}

export default function ExpensesPage() {
  const [search, setSearch] = useState('');
  const [type,   setType]   = useState(null);
  const [page,   setPage]   = useState(1);

  const filtered = useMemo(() => {
    let data = MOCK_EXPENSES;
    if (search) data = data.filter(e =>
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.vehicle.toLowerCase().includes(search.toLowerCase())     ||
      (e.trip && e.trip.toLowerCase().includes(search.toLowerCase()))
    );
    if (type) data = data.filter(e => e.type === type);
    return data;
  }, [search, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalAmount  = MOCK_EXPENSES.reduce((s, e) => s + e.amount, 0);
  const fuelTotal    = MOCK_EXPENSES.filter(e => e.type === 'Fuel').reduce((s, e) => s + e.amount, 0);
  const maintTotal   = MOCK_EXPENSES.filter(e => e.type === 'Maintenance').reduce((s, e) => s + e.amount, 0);

  function handleSearch(val) { setSearch(val); setPage(1); }
  function handleFilter(val) { setType(val);   setPage(1); }

  return (
    <PageShell
      title="Expenses"
      subtitle="Monitor and manage all fleet expenses"
      actions={<Button icon={Plus}>Add Expense</Button>}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard label="Total Expenses"   value={`₹${totalAmount.toLocaleString()}`}  sub="All time"       color="text-content-primary" />
        <SummaryCard label="Fuel Costs"       value={`₹${fuelTotal.toLocaleString()}`}    sub="This period"    color="text-info"            />
        <SummaryCard label="Maintenance"      value={`₹${maintTotal.toLocaleString()}`}   sub="This period"    color="text-warning"         />
        <SummaryCard label="Total Records"    value={MOCK_EXPENSES.length}                sub="Logged entries" color="text-content-primary" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by description, vehicle, trip…"
          className="flex-1 max-w-sm"
        />
        <FilterDropdown label="Type" options={TYPE_OPTIONS} value={type} onChange={handleFilter} />
      </div>

      <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-content-primary">All Expenses</h2>
          <span className="text-xs text-content-muted">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {paged.length === 0 ? (
          <EmptyState icon={DollarSign} title="No expenses found" description="Try adjusting your search or filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-bg-secondary">
                <tr>
                  {['ID', 'Type', 'Description', 'Vehicle', 'Trip', 'Date', 'Approved By', 'Amount', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-content-muted uppercase tracking-wider first:pl-6 last:pr-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map(e => (
                  <tr key={e.id} className="hover:bg-bg-hover transition-colors duration-100 group">
                    <td className="px-4 py-3.5 pl-6">
                      <span className="text-xs font-mono font-semibold text-content-primary">{e.id}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={TYPE_BADGE[e.type] ?? 'muted'}>{e.type}</Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary truncate max-w-[200px] block">{e.description}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono text-content-muted">{e.vehicle}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-muted">{e.trip ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-muted">{e.date}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-content-secondary">{e.approvedBy}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-content-primary">₹{e.amount.toLocaleString()}</span>
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
