import { Plus, Fuel } from 'lucide-react';
import PageShell      from '@components/layout/PageShell';
import Button         from '@components/common/Button';
import SearchBar      from '@components/common/SearchBar';
import FilterDropdown from '@components/common/FilterDropdown';
import EmptyState     from '@components/common/EmptyState';

const VEHICLE_OPTIONS = [
  { label: 'All Vehicles', value: '' },
];

export default function FuelLogsPage() {
  return (
    <PageShell
      title="Fuel Logs"
      subtitle="Track fuel consumption across your fleet"
      actions={
        <Button icon={Plus}>Log Fuel</Button>
      }
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar placeholder="Search fuel logs…" className="flex-1 max-w-sm" />
        <FilterDropdown label="Vehicle" options={VEHICLE_OPTIONS} />
      </div>

      <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-content-primary">All Fuel Logs</h2>
          <span className="text-xs text-content-muted">0 records</span>
        </div>
        <EmptyState
          icon={Fuel}
          title="No fuel logs found"
          description="Log your first fuel fill-up to start tracking consumption and costs."
          action={<Button icon={Plus} size="sm">Log Fuel</Button>}
        />
      </div>
    </PageShell>
  );
}
