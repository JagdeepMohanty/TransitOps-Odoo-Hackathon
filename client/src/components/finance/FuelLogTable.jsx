import { Fuel } from 'lucide-react';
import DataTable      from '@components/common/DataTable';
import { formatDate } from '@utils/formatDate';
import { formatCurrency } from '@utils/formatCurrency';

const COLUMNS = [
  { key: 'id',         label: 'ID',
    render: (v) => <span className="font-mono text-xs text-content-muted">#{v}</span>,
  },
  { key: 'vehicle',    label: 'Vehicle',
    render: (v) => <span className="font-mono text-xs">{v}</span>,
  },
  { key: 'driver',     label: 'Driver',   sortable: true },
  { key: 'station',    label: 'Station',
    render: (v) => <span className="text-xs text-content-muted">{v}</span>,
  },
  { key: 'liters',     label: 'Litres',   sortable: true, align: 'right',
    render: (v) => <span className="font-mono text-xs">{v} L</span>,
  },
  { key: 'pricePerL',  label: '₹/Litre',  sortable: true, align: 'right',
    render: (v) => <span className="font-mono text-xs">₹{v}</span>,
  },
  { key: 'odometer',   label: 'Odometer', sortable: true, align: 'right',
    render: (v) => <span className="font-mono text-xs">{v?.toLocaleString('en-IN')} km</span>,
  },
  { key: 'date',       label: 'Date',     sortable: true,
    render: (v) => formatDate(v),
  },
  { key: 'total',      label: 'Total',    sortable: true, align: 'right',
    render: (v) => (
      <span className="font-semibold text-content-primary">{formatCurrency(v)}</span>
    ),
  },
];

export default function FuelLogTable({ data = [], loading = false }) {
  return (
    <DataTable
      columns={COLUMNS}
      data={data}
      loading={loading}
      emptyIcon={Fuel}
      emptyTitle="No fuel logs found"
      emptyDesc="Log your first fuel fill-up to start tracking consumption and costs."
    />
  );
}
