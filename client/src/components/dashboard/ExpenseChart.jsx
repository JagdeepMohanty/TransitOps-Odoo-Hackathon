import { MOCK_EXPENSES } from '@utils/constants';
import { formatCurrency } from '@utils/formatCurrency';

const TYPE_COLORS = {
  fuel:        { bar: 'bg-primary',   label: 'Fuel'        },
  maintenance: { bar: 'bg-warning',   label: 'Maintenance' },
  toll:        { bar: 'bg-info',      label: 'Toll'        },
  insurance:   { bar: 'bg-accent',    label: 'Insurance'   },
  salary:      { bar: 'bg-secondary', label: 'Salary'      },
  other:       { bar: 'bg-content-disabled', label: 'Other' },
};

export default function ExpenseChart() {
  const totals = MOCK_EXPENSES.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + e.amount;
    return acc;
  }, {});

  const max    = Math.max(...Object.values(totals), 1);
  const grand  = Object.values(totals).reduce((a, b) => a + b, 0);

  return (
    <div className="px-6 py-4 space-y-3">
      {Object.entries(totals).map(([type, amount]) => {
        const cfg = TYPE_COLORS[type] ?? { bar: 'bg-content-disabled', label: type };
        const pct = Math.round((amount / max) * 100);
        return (
          <div key={type} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-content-secondary capitalize">{cfg.label}</span>
              <span className="text-xs font-semibold text-content-primary">{formatCurrency(amount)}</span>
            </div>
            <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <span className="text-xs text-content-muted">Total Expenses</span>
        <span className="text-sm font-bold text-content-primary">{formatCurrency(grand)}</span>
      </div>
    </div>
  );
}
