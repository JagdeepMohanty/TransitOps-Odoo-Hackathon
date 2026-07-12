import { Wrench } from 'lucide-react';
import DataTable      from '@components/common/DataTable';
import StatusBadge    from '@components/common/StatusBadge';
import { formatDate } from '@utils/formatDate';
import { formatCurrency } from '@utils/formatCurrency';

const COLUMNS = [
  { key: 'id',      label: 'ID',      sortable: true,
    render: (v) => <span className="font-mono text-xs font-semibold text-content-muted">#{v}</span>,
  },
  { key: 'vehicle', label: 'Vehicle',
    render: (v) => <span className="font-mono text-xs">{v}</span>,
  },
  { key: 'type',    label: 'Type',    sortable: true,
    render: (v) => <span className="font-medium text-content-primary">{v}</span>,
  },
  { key: 'date',    label: 'Date',    sortable: true,
    render: (v) => formatDate(v),
  },
  { key: 'cost',    label: 'Est. Cost', sortable: true, align: 'right',
    render: (v) => formatCurrency(v),
  },
  { key: 'notes',   label: 'Notes',
    render: (v) => <span className="text-xs text-content-muted truncate max-w-[200px] block">{v || '—'}</span>,
  },
  { key: 'status',  label: 'Status',
    render: (v) => <StatusBadge status={v} />,
  },
];

export default function MaintenanceTable({ data = [], loading = false }) {
  return (
    <DataTable
      columns={COLUMNS}
      data={data}
      loading={loading}
      emptyIcon={Wrench}
      emptyTitle="No maintenance records"
      emptyDesc="Schedule your first maintenance task to keep your fleet in top condition."
    />
  );
}
