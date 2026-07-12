import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react'
import { cn } from '@/utils'

/**
 * Breadcrumb
 * @prop {Array}   items      — [{ label, path?, icon? }] — if omitted, auto-generates from URL
 * @prop {string}  separator  — chevron | slash | dot  (default: chevron)
 * @prop {number}  maxItems   — collapse middle items beyond this count (default: 4)
 * @prop {boolean} showHome   — prepend a Home icon item (default: true)
 * @prop {string}  className
 */
export default function Breadcrumb({
  items: customItems,
  separator = 'chevron',
  maxItems = 4,
  showHome = true,
  className,
}) {
  const { pathname } = useLocation()

  // Auto-generate from pathname if no custom items
  const autoItems = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, i, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      path:  '/' + arr.slice(0, i + 1).join('/'),
    }))

  const rawItems = customItems ?? autoItems

  // Prepend home
  const allItems = showHome
    ? [{ label: 'Home', path: '/', icon: Home }, ...rawItems]
    : rawItems

  // Collapse middle items if too many
  let displayItems = allItems
  let collapsed    = false
  if (allItems.length > maxItems) {
    collapsed    = true
    displayItems = [
      allItems[0],
      { label: '…', collapsed: true },
      ...allItems.slice(-(maxItems - 2)),
    ]
  }

  const Separator = () => {
    if (separator === 'slash') return <span className="text-slate-300 text-sm select-none">/</span>
    if (separator === 'dot')   return <span className="w-1 h-1 rounded-full bg-slate-300 select-none" />
    return <ChevronRight size={13} className="text-slate-300 shrink-0" />
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center gap-1 flex-wrap">
        {displayItems.map((item, i) => {
          const isLast = i === displayItems.length - 1

          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <Separator />}

              {item.collapsed ? (
                <span className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded cursor-default">
                  <MoreHorizontal size={14} />
                </span>
              ) : isLast ? (
                <span
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-700 px-1"
                  aria-current="page"
                >
                  {item.icon && <item.icon size={13} className="shrink-0" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path ?? '#'}
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-brand-600 px-1 rounded transition-colors"
                >
                  {item.icon && <item.icon size={13} className="shrink-0" />}
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
