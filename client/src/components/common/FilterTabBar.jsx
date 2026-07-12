import { cn } from '@/utils'

/**
 * FilterTabBar — reusable horizontal tab strip with item counts.
 * Used on Trips, Maintenance, Fuel, Expenses pages.
 *
 * @prop {Array}    tabs      — [{ key, label }]
 * @prop {string}   active    — currently active tab key
 * @prop {function} onChange  — (key) => void
 * @prop {function} getCount  — (key) => number
 */
export default function FilterTabBar({ tabs, active, onChange, getCount }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
      {tabs.map(({ key, label }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
            )}
          >
            {label}
            <span className={cn(
              'px-1.5 py-0.5 rounded-full text-[10px] font-semibold',
              isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500',
            )}>
              {getCount(key)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
