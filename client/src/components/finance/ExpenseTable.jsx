import { DollarSign } from 'lucide-react';
import DataTable      from '@components/common/DataTable';
import Badge          from '@components/common/Badge';
import { formatDate } from '@utils/formatDate';
import { formatCurrency } from '@utils/formatCurrency';

const TYPE_VARIANT = {
  fuel:        'primary',
  maintenance: 'warning',
  toll:        'info',
  insurance:   'accent',
  salary:      'secondary',
  other:       'muted',
};

const COLUMNS = [
  { key: 'id',          label: 'ID',
    render: (v) => <span className="font-mono text-xs text-content-muted">#{v}</span>,
  },
  { key: 'type',        label: 'Type',    sortable: true,
    render: (v) => (
      <Badge variant={TYPE_VARIANT[v] ?? 'muted'} className="capitalize">{v}</Badge>
    ),
  },
  { key: 'vehicle',     label: 'Vehicle',
    render: (v) => <span className="font-mono text-xs">{v}</span>,
  },
  { key: 'description', label: 'Description',
    render: (v) => <span className="text-sm text-content-secondary">{v}</span>,
  },
  { key: 'date',        label: 'Date',    sortable: true,
    render: (v) => formatDate(v),
  },
  { key: 'amount',      label: 'Amount',  sortable: true, align: 'right',
    render: (v) => (
      <span className="font-semibold text-content-primary">{formatCurrency(v)}</span>
    ),
  },
];

export default function ExpenseTable({ data = [], loading = false }) {
  return (
    <DataTable
      columns={COLUMNS}
      data={data}
      loading={loading}
      emptyIcon={DollarSign}
      emptyTitle="No expenses recorded"
      emptyDesc="Start logging expenses to track your fleet's operational costs."
    />
  );
}
