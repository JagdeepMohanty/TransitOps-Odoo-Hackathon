import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import Loader from './Loader';
import EmptyState from './EmptyState';

export default function DataTable({
  columns      = [],
  data         = [],
  loading      = false,
  emptyTitle   = 'No records found',
  emptyDesc,
  emptyIcon,
  sortKey,
  sortDir      = 'asc',
  onSort,
  onRowClick,
  className    = '',
  stickyHeader = false,
}) {
  const SortIcon = ({ col }) => {
    if (!col.sortable) return null;
    if (sortKey !== col.key) return <ChevronsUpDown className="w-3.5 h-3.5 text-content-disabled" />;
    return sortDir === 'asc'
      ? <ChevronUp   className="w-3.5 h-3.5 text-primary" />
      : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
  };

  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-border-card ${className}`}>
      <table className="min-w-full divide-y divide-border">
        <thead className={`bg-bg-secondary ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={[
                  'px-4 py-3 text-left text-xs font-semibold text-content-muted uppercase tracking-wider',
                  col.sortable ? 'cursor-pointer select-none hover:text-content-primary transition-colors duration-150' : '',
                  col.align === 'right'  ? 'text-right'  : '',
                  col.align === 'center' ? 'text-center' : '',
                ].join(' ')}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <span className="inline-flex items-center gap-1.5">
                  {col.label}
                  <SortIcon col={col} />
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-16">
                <Loader label="Loading data…" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDesc} />
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id ?? i}
                onClick={() => onRowClick?.(row)}
                className={[
                  'border-b border-border transition-colors duration-100',
                  onRowClick ? 'cursor-pointer hover:bg-bg-hover' : 'hover:bg-bg-hover/50',
                ].join(' ')}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={[
                      'px-4 py-3.5 text-sm text-content-secondary',
                      col.align === 'right'  ? 'text-right'  : '',
                      col.align === 'center' ? 'text-center' : '',
                    ].join(' ')}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
