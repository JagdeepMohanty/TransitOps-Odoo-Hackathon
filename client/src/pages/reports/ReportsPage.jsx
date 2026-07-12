import { BarChart3, Download } from 'lucide-react';
import PageShell      from '@components/layout/PageShell';
import Button         from '@components/common/Button';
import FilterDropdown from '@components/common/FilterDropdown';
import EmptyState     from '@components/common/EmptyState';

const PERIOD_OPTIONS = [
  { label: 'Last 7 days',  value: '7d'  },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 3 months',value: '3m'  },
  { label: 'Last year',    value: '1y'  },
];

function ReportCard({ title, description }) {
  return (
    <div className="bg-bg-card border border-border-card rounded-xl shadow-card">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-content-primary">{title}</h2>
      </div>
      <EmptyState
        icon={BarChart3}
        title="No data available"
        description={description}
      />
    </div>
  );
}

export default function ReportsPage() {
  return (
    <PageShell
      title="Reports"
      subtitle="Analytics and insights for your fleet operations"
      actions={
        <Button variant="secondary" icon={Download}>Export</Button>
      }
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <FilterDropdown label="Period" options={PERIOD_OPTIONS} />
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReportCard
          title="Fuel Efficiency"
          description="Fuel efficiency data will appear once trips and fuel logs are recorded."
        />
        <ReportCard
          title="Operational Costs"
          description="Cost breakdown will appear once expenses are logged."
        />
        <ReportCard
          title="Vehicle Performance"
          description="Performance metrics will appear once vehicles complete trips."
        />
        <ReportCard
          title="Fleet Utilization"
          description="Utilization rates will appear once fleet activity is recorded."
        />
      </div>
    </PageShell>
  );
}
