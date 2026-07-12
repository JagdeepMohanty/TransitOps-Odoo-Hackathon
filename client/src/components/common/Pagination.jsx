import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className       = '',
}) {
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i + 1;
    if (page >= totalPages - 3) return totalPages - 6 + i;
    return page - 3 + i;
  });

  const btnBase = [
    'inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm',
    'border border-border bg-bg-card text-content-muted',
    'hover:bg-bg-hover hover:text-content-primary transition-colors duration-150',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' ');

  const btnActive = 'bg-primary text-white border-primary hover:bg-primary-hover hover:text-white';

  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-content-muted">
        {totalItems != null && (
          <span>
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalItems)} of {totalItems}
          </span>
        )}
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="ml-2 bg-bg-secondary border border-border-input rounded-lg px-2 py-1 text-xs text-content-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>{s} / page</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button className={btnBase} onClick={() => onPageChange(1)}          disabled={page === 1}>
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button className={btnBase} onClick={() => onPageChange(page - 1)}   disabled={page === 1}>
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${btnBase} ${p === page ? btnActive : ''}`}
          >
            {p}
          </button>
        ))}

        <button className={btnBase} onClick={() => onPageChange(page + 1)}   disabled={page === totalPages}>
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className={btnBase} onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
