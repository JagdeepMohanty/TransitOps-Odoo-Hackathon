/**
 * BulkActionBar — shows selected count and action buttons when rows are selected.
 * Eliminates the repeated pattern across all list pages.
 *
 * @prop {number}  count    — number of selected rows
 * @prop {node}    actions  — action buttons to render
 */
export default function BulkActionBar({ count, actions }) {
  if (count === 0) return null
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500">{count} selected</span>
      {actions}
    </div>
  )
}
