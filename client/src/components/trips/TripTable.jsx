import { Link } from 'react-router-dom';
import { ArrowRight, Route } from 'lucide-react';
import DataTable      from '@components/common/DataTable';
import StatusBadge    from '@components/common/StatusBadge';
import Button         from '@components/common/Button';
import { formatDate } from '@utils/formatDate';
import { formatCurrency } from '@utils/formatCurrency';

const COLUMNS = [
  { key: 'id',      label: 'Trip ID',  sortable: true,
    render: (v) => <span className="font-mono text-xs font-semibold text-primary">#{v}</span>,
  },
  { key: 'from',    label: 'Route',    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-content-primary font-medium">{row.from}</span>
        <ArrowRight className="w-3.5 h-3.5 text-content-disabled shrink-0" />
        <span className="text-content-primary font-medium">{row.to}</span>
      </div>
    ),
  },
  { key: 'driver',  label: 'Driver',   sortable: true },
  { key: 'vehicle', label: 'Vehicle',
    render: (v) => <span className="font-mono text-xs">{v}</span>,
  },
  { key: 'date',    label: 'Date',     sortable: true,
    render: (v) => formatDate(v),
  },
  { key: 'distance',label: 'Distance', sortable: true, align: 'right',
    render: (v) => v ? `${v} km` : '—',
  },
  { key: 'cost',    label: 'Cost',     sortable: true, align: 'right',
    render: (v) => formatCurrency(v),
  },
  { key: 'status',  label: 'Status',
    render: (v) => <StatusBadge status={v} />,
  },
  { key: 'actions', label: '', align: 'right', width: '80px',
    render: (_, row) => (
      <Link to={`/trips/${row.id}`}>
        <Button variant="ghost" size="xs" icon={ArrowRight} aria-label="View" />
      </Link>
    ),
  },
];

export default function TripTable({ data = [], loading = false }) {
  return (
    <DataTable
      columns={COLUMNS}
      data={data}
      loading={loading}
      emptyIcon={Route}
      emptyTitle="No trips found"
      emptyDesc="Create your first trip to start tracking operations."
    />
  );
}
