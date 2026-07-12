import { Link } from 'react-router-dom';
import { Edit, Eye, Truck } from 'lucide-react';
import DataTable   from '@components/common/DataTable';
import StatusBadge from '@components/common/StatusBadge';
import Button      from '@components/common/Button';

const COLUMNS = [
  { key: 'regNo',  label: 'Reg. Number', sortable: true },
  { key: 'type',   label: 'Type',        sortable: true },
  { key: 'make',   label: 'Make / Model',sortable: true,
    render: (_, row) => (
      <span className="text-content-primary font-medium">{row.make} {row.model}</span>
    ),
  },
  { key: 'year',   label: 'Year',        sortable: true },
  { key: 'fuel',   label: 'Fuel',
    render: (v) => <span className="capitalize">{v}</span>,
  },
  { key: 'km',     label: 'Odometer',    sortable: true, align: 'right',
    render: (v) => <span className="font-mono text-xs">{v?.toLocaleString('en-IN')} km</span>,
  },
  { key: 'status', label: 'Status',
    render: (v) => <StatusBadge status={v} />,
  },
  { key: 'actions', label: '', align: 'right', width: '100px',
    render: (_, row) => (
      <div className="flex items-center justify-end gap-1">
        <Link to={`/vehicles/${row.id}/edit`}>
          <Button variant="ghost" size="xs" icon={Edit} aria-label="Edit" />
        </Link>
      </div>
    ),
  },
];

export default function VehicleTable({ data = [], loading = false }) {
  return (
    <DataTable
      columns={COLUMNS}
      data={data}
      loading={loading}
      emptyIcon={Truck}
      emptyTitle="No vehicles found"
      emptyDesc="Add your first vehicle to start managing your fleet."
    />
  );
}
