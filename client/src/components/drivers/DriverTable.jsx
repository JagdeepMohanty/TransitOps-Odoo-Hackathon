import { Link } from 'react-router-dom';
import { Edit, Star, Users } from 'lucide-react';
import DataTable   from '@components/common/DataTable';
import StatusBadge from '@components/common/StatusBadge';
import Button      from '@components/common/Button';

function Rating({ value }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Star className="w-3.5 h-3.5 text-warning fill-warning" />
      <span className="text-xs font-medium text-content-primary">{value}</span>
    </span>
  );
}

const COLUMNS = [
  { key: 'name',    label: 'Driver',   sortable: true,
    render: (v, row) => (
      <div>
        <p className="font-medium text-content-primary">{v}</p>
        <p className="text-xs text-content-muted font-mono">{row.phone}</p>
      </div>
    ),
  },
  { key: 'license', label: 'License No.', sortable: true,
    render: (v) => <span className="font-mono text-xs">{v}</span>,
  },
  { key: 'trips',   label: 'Trips',    sortable: true, align: 'right',
    render: (v) => <span className="font-semibold text-content-primary">{v}</span>,
  },
  { key: 'rating',  label: 'Rating',   sortable: true,
    render: (v) => <Rating value={v} />,
  },
  { key: 'status',  label: 'Status',
    render: (v) => <StatusBadge status={v} />,
  },
  { key: 'actions', label: '', align: 'right', width: '80px',
    render: (_, row) => (
      <Link to={`/drivers/${row.id}/edit`}>
        <Button variant="ghost" size="xs" icon={Edit} aria-label="Edit" />
      </Link>
    ),
  },
];

export default function DriverTable({ data = [], loading = false }) {
  return (
    <DataTable
      columns={COLUMNS}
      data={data}
      loading={loading}
      emptyIcon={Users}
      emptyTitle="No drivers found"
      emptyDesc="Add your first driver to start managing your roster."
    />
  );
}
