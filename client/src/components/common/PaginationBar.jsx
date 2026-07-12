import Pagination from './Pagination'

/**
 * PaginationBar — shows "Showing X–Y of Z items" text + prev/next controls.
 * Eliminates the repeated footer pattern across all list pages.
 *
 * @prop {number}   page        — current page (1-based)
 * @prop {number}   totalPages  — total page count
 * @prop {number}   totalItems  — total filtered item count
 * @prop {number}   pageSize    — items per page
 * @prop {string}   itemLabel   — plural noun for items (e.g. "trips", "records")
 * @prop {function} onPageChange — (page) => void
 */
export default function PaginationBar({ page, totalPages, totalItems, pageSize, itemLabel = 'items', onPageChange }) {
  if (totalItems <= pageSize) return null

  const from = (page - 1) * pageSize + 1
  const to   = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
      <p className="text-xs text-slate-500">
        Showing{' '}
        <span className="font-medium text-slate-700">{from}–{to}</span>
        {' '}of{' '}
        <span className="font-medium text-slate-700">{totalItems}</span>
        {' '}{itemLabel}
      </p>
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  )
}
