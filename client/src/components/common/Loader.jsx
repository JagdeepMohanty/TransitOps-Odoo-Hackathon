import { cn } from '@/utils'

/* ── Dual-ring spinner ──────────────────────────────────────────── */
function Spinner({ size = 'md', className }) {
  const DIM = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' }
  const BRD = { sm: 'border-2', md: 'border-[3px]', lg: 'border-4', xl: 'border-[5px]' }

  return (
    <div className={cn('relative flex items-center justify-center', DIM[size], className)}>
      {/* Outer track */}
      <div className={cn('absolute inset-0 rounded-full border-slate-200', BRD[size])} />
      {/* Spinning arc */}
      <div className={cn(
        'absolute inset-0 rounded-full border-transparent border-t-brand-600 animate-spin-slow',
        BRD[size],
      )} />
      {/* Inner glow dot */}
      <div className="w-1.5 h-1.5 rounded-full bg-brand-600 opacity-60" />
    </div>
  )
}

/* ── Bouncing dots ──────────────────────────────────────────────── */
function Dots({ size = 'md' }) {
  const DIM = { sm: 'w-1.5 h-1.5', md: 'w-2 h-2', lg: 'w-2.5 h-2.5' }
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{ animationDelay: `${i * 160}ms` }}
          className={cn('rounded-full bg-brand-600 animate-bounce', DIM[size])}
        />
      ))}
    </div>
  )
}

/* ── Shimmer skeleton line ──────────────────────────────────────── */
export function SkeletonLine({ width = '100%', height = 'h-4', className }) {
  return (
    <div
      className={cn('skeleton rounded-lg', height, className)}
      style={{ width }}
    />
  )
}

/* ── Skeleton block (card placeholder) ─────────────────────────── */
export function SkeletonCard({ lines = 3, className }) {
  return (
    <div className={cn('space-y-3 p-5', className)}>
      <SkeletonLine width="60%" height="h-5" />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={i === lines - 1 ? '45%' : '100%'} />
      ))}
    </div>
  )
}

/* ── Main Loader component ──────────────────────────────────────── */
const TEXT_SIZE = { sm: 'text-xs', md: 'text-sm', lg: 'text-base', xl: 'text-lg' }

export default function Loader({
  variant  = 'spinner',
  size     = 'md',
  label,
  overlay  = false,
  fullPage = false,
  lines    = 4,
  className,
}) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      {variant === 'spinner' && <Spinner size={size} />}
      {variant === 'dots'    && <Dots    size={size} />}
      {variant === 'skeleton' && (
        <div className="w-full space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <SkeletonLine
              key={i}
              width={i === lines - 1 ? '55%' : i % 3 === 1 ? '80%' : '100%'}
            />
          ))}
        </div>
      )}
      {label && variant !== 'skeleton' && (
        <p className={cn('text-slate-500 font-medium', TEXT_SIZE[size])}>{label}</p>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center glass">
        <div className="flex flex-col items-center gap-5 p-8 bg-white rounded-3xl shadow-card-lg border border-slate-100">
          <Spinner size="lg" />
          {label && <p className="text-sm font-semibold text-slate-700">{label}</p>}
        </div>
      </div>
    )
  }

  if (fullPage) {
    return (
      <div className={cn('flex flex-col items-center justify-center min-h-[55vh] gap-5', className)}>
        <Spinner size="lg" />
        {label && <p className="text-sm font-semibold text-slate-600">{label}</p>}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-center justify-center py-10 px-6', className)}>
      {content}
    </div>
  )
}
