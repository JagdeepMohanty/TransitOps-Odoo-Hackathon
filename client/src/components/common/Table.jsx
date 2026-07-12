import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/utils'
import EmptyState from './EmptyState'

export default function Table({
  columns = [],
  data = [],
  loading = false,
  skeletonRows = 5,
  selectable = false,
  selected = [],
  onSelect,
  onRowClick,
  emptyTitle,
  emptyDesc,
  emptyAction,
  className,
}) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''), undefined, { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  const allSelected  = data.length > 0 && selected.length === data.length
  const someSelected = selected.length > 0 && !allSelected
  const toggleAll    = () => onSelect?.(allSelected ? [] : data.map(r => r.id))
  const toggleRow    = (id) => onSelect?.(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])

  const SortIcon = ({ colKey }) => {
    if (sortKey !== colKey) return <ChevronsUpDown size={13} className="text-slate-300" />
    return sortDir === 'asc'
      ? <ChevronUp   size={13} className="text-brand-500" />
      : <ChevronDown size={13} className="text-brand-500" />
  }

  const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' }

  // Visible columns (exclude action-only columns from mobile cards)
  const dataColumns = columns.filter(c => c.label)

  if (!loading && sortedData.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDesc} action={emptyAction} />
  }

  return (
    <div className={cn('w-full', className)}>

      {/* ── Desktop table (sm+) ─────────────────────── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              {selectable && (
                <th className="th w-10 pr-0">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={el => { if (el) el.indeterminate = someSelected }}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={cn('th', ALIGN[col.align ?? 'left'], col.sortable && 'cursor-pointer select-none hover:bg-slate-100 transition-colors')}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && <SortIcon colKey={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading
              ? Array.from({ length: skeletonRows }).map((_, i) => (
                  <tr key={i}>
                    {selectable && <td className="td"><div className="w-4 h-4 bg-slate-100 rounded animate-pulse" /></td>}
                    {columns.map(col => (
                      <td key={col.key} className="td">
                        <div className={cn('h-4 bg-slate-100 rounded animate-pulse', col.align === 'right' ? 'ml-auto' : '')}
                             style={{ width: `${Math.random() * 40 + 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              : sortedData.map(row => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'transition-colors',
                      onRowClick && 'cursor-pointer',
                      selected.includes(row.id) ? 'bg-brand-50' : 'hover:bg-slate-50/80',
                    )}
                  >
                    {selectable && (
                      <td className="td pr-0" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.includes(row.id)}
                          onChange={() => toggleRow(row.id)}
                          className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.key} className={cn('td', ALIGN[col.align ?? 'left'])}>
                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {/* ── Mobile card list (< sm) ──────────────────── */}
      <div className="sm:hidden divide-y divide-slate-100">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 space-y-2">
                {Array.from({ length: 3 }).map((__, j) => (
                  <div key={j} className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + j * 15}%` }} />
                ))}
              </div>
            ))
          : sortedData.map(row => (
              <div
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'p-4 space-y-2.5 transition-colors',
                  onRowClick && 'cursor-pointer active:bg-slate-50',
                  selected.includes(row.id) ? 'bg-brand-50' : '',
                )}
              >
                {/* Top row: checkbox + first two data columns + action */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {selectable && (
                      <input
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        onChange={e => { e.stopPropagation(); toggleRow(row.id) }}
                        className="w-4 h-4 mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      {/* Primary field */}
                      {dataColumns[0] && (
                        <div className="font-medium text-sm text-slate-900">
                          {dataColumns[0].render
                            ? dataColumns[0].render(row[dataColumns[0].key], row)
                            : row[dataColumns[0].key]}
                        </div>
                      )}
                      {/* Secondary field */}
                      {dataColumns[1] && (
                        <div className="text-sm text-slate-600 mt-0.5">
                          {dataColumns[1].render
                            ? dataColumns[1].render(row[dataColumns[1].key], row)
                            : row[dataColumns[1].key]}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Action column (last column with no label) */}
                  {columns.find(c => !c.label) && (
                    <div className="shrink-0">
                      {columns.find(c => !c.label).render('', row)}
                    </div>
                  )}
                </div>

                {/* Remaining fields as label: value pairs */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pl-0">
                  {dataColumns.slice(2).map(col => (
                    <div key={col.key} className="min-w-0">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{col.label}</p>
                      <div className="text-xs text-slate-700 mt-0.5 truncate">
                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        }
      </div>
    </div>
  )
}
