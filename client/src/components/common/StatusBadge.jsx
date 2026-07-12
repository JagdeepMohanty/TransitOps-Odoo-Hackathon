import { cn } from '@/utils'

const PRESETS = {
  // ── Backend trip statuses (UPPER_SNAKE_CASE) ──────────────────────────────
  DRAFT:       { label: 'Draft',       dot: 'bg-slate-400',   pill: 'bg-slate-100  text-slate-600  ring-slate-200/80'   },
  DISPATCHED:  { label: 'Dispatched',  dot: 'bg-amber-400',   pill: 'bg-amber-50   text-amber-700  ring-amber-200/80'   },
  COMPLETED:   { label: 'Completed',   dot: 'bg-emerald-400', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80' },
  CANCELLED:   { label: 'Cancelled',   dot: 'bg-red-400',     pill: 'bg-red-50     text-red-700    ring-red-200/80'     },
  // ── Backend vehicle statuses ───────────────────────────────────────────────
  AVAILABLE:   { label: 'Available',   dot: 'bg-emerald-400', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80' },
  ON_TRIP:     { label: 'On Trip',     dot: 'bg-amber-400',   pill: 'bg-amber-50   text-amber-700  ring-amber-200/80'   },
  IN_SHOP:     { label: 'In Shop',     dot: 'bg-blue-400',    pill: 'bg-blue-50    text-blue-700   ring-blue-200/80'    },
  RETIRED:     { label: 'Retired',     dot: 'bg-slate-300',   pill: 'bg-slate-100  text-slate-500  ring-slate-200/80'   },
  // ── Backend maintenance statuses ──────────────────────────────────────────
  ACTIVE:      { label: 'Active',      dot: 'bg-amber-400',   pill: 'bg-amber-50   text-amber-700  ring-amber-200/80'   },
  // ── Backend driver statuses ───────────────────────────────────────────────
  OFF_DUTY:    { label: 'Off Duty',    dot: 'bg-slate-300',   pill: 'bg-slate-100  text-slate-500  ring-slate-200/80'   },
  SUSPENDED:   { label: 'Suspended',   dot: 'bg-red-400',     pill: 'bg-red-50     text-red-700    ring-red-200/80'     },
  // ── Legacy lowercase presets (kept for backward compat) ───────────────────
  scheduled:   { label: 'Scheduled',   dot: 'bg-blue-400',    pill: 'bg-blue-50    text-blue-700   ring-blue-200/80'   },
  in_progress: { label: 'In Progress', dot: 'bg-amber-400',   pill: 'bg-amber-50   text-amber-700  ring-amber-200/80'  },
  completed:   { label: 'Completed',   dot: 'bg-emerald-400', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80'},
  cancelled:   { label: 'Cancelled',   dot: 'bg-red-400',     pill: 'bg-red-50     text-red-700    ring-red-200/80'    },
  active:      { label: 'Active',      dot: 'bg-emerald-400', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80'},
  maintenance: { label: 'Maintenance', dot: 'bg-amber-400',   pill: 'bg-amber-50   text-amber-700  ring-amber-200/80'  },
  inactive:    { label: 'Inactive',    dot: 'bg-slate-300',   pill: 'bg-slate-100  text-slate-500  ring-slate-200/80'  },
  open:        { label: 'Open',        dot: 'bg-red-400',     pill: 'bg-red-50     text-red-700    ring-red-200/80'    },
  closed:      { label: 'Closed',      dot: 'bg-slate-300',   pill: 'bg-slate-100  text-slate-500  ring-slate-200/80'  },
  pending:     { label: 'Pending',     dot: 'bg-yellow-400',  pill: 'bg-yellow-50  text-yellow-700 ring-yellow-200/80' },
  on_leave:    { label: 'On Leave',    dot: 'bg-purple-400',  pill: 'bg-purple-50  text-purple-700 ring-purple-200/80' },
  critical:    { label: 'Critical',    dot: 'bg-rose-500',    pill: 'bg-rose-50    text-rose-700   ring-rose-200/80'   },
}

const SIZES = {
  sm: 'text-[10px] px-2   py-0.5 gap-1   rounded-full',
  md: 'text-xs     px-2.5 py-1   gap-1.5 rounded-full',
  lg: 'text-sm     px-3   py-1.5 gap-2   rounded-full',
}

const LIVE_STATUSES = new Set(['in_progress', 'active'])

export default function StatusBadge({
  status,
  label:  labelOverride,
  color:  colorOverride,
  dot     = true,
  pulse,
  size    = 'md',
  className,
}) {
  const key        = status ?? ''
  const preset     = PRESETS[key] ?? PRESETS[key?.toLowerCase().replace(/\s+/g, '_')] ?? {}
  const label      = labelOverride ?? preset.label ?? status ?? '—'
  const pillColor  = colorOverride ?? preset.pill  ?? 'bg-slate-100 text-slate-500 ring-slate-200/80'
  const dotColor   = preset.dot ?? 'bg-slate-300'
  const shouldPulse = pulse ?? (key === 'DISPATCHED' || key === 'in_progress' || key === 'active')

  return (
    <span className={cn(
      'inline-flex items-center font-semibold ring-1 tracking-wide',
      pillColor,
      SIZES[size],
      className,
    )}>
      {dot && (
        <span className="relative flex shrink-0 items-center justify-center w-1.5 h-1.5">
          {shouldPulse && (
            <span className={cn(
              'absolute inline-flex w-full h-full rounded-full opacity-75 animate-pulse-ring',
              dotColor,
            )} />
          )}
          <span className={cn('relative inline-block w-1.5 h-1.5 rounded-full', dotColor)} />
        </span>
      )}
      {label}
    </span>
  )
}
