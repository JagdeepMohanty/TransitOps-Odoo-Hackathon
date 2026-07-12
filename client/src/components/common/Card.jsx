import { cn } from '@/utils'

const VARIANTS = {
  default:  'bg-white border border-slate-100/80 shadow-card',
  flat:     'bg-white border border-slate-200',
  bordered: 'bg-white border-2 border-slate-200',
  elevated: 'bg-white border border-slate-100/80 shadow-card-lg',
  ghost:    'bg-surface-soft border border-slate-100',
  gradient: 'bg-gradient-to-br from-brand-600 to-brand-800 border-0 text-white',
}

const PADDING = {
  none: '',
  xs:   'p-3',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
  xl:   'p-8',
}

export default function Card({
  children,
  variant   = 'default',
  padding   = 'md',
  header,
  footer,
  hoverable = false,
  onClick,
  className,
  ...props
}) {
  const clickable = !!onClick || hoverable

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl overflow-hidden',
        VARIANTS[variant],
        clickable && [
          'cursor-pointer',
          'transition-all duration-200',
          'hover:-translate-y-0.5 hover:shadow-card-md',
          'active:translate-y-0 active:shadow-card',
        ],
        className,
      )}
      {...props}
    >
      {header && (
        <div className={cn(
          'border-b',
          variant === 'gradient' ? 'border-white/10' : 'border-slate-100',
          PADDING[padding],
        )}>
          {header}
        </div>
      )}

      <div className={cn(
        (header || footer) && padding !== 'none' ? PADDING[padding] : !header && !footer ? PADDING[padding] : '',
      )}>
        {children}
      </div>

      {footer && (
        <div className={cn(
          'border-t',
          variant === 'gradient' ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50/60',
          PADDING[padding],
        )}>
          {footer}
        </div>
      )}
    </div>
  )
}

export function CardHeader({ title, subtitle, actions, icon: Icon, iconBg = 'bg-brand-50' }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
            <Icon size={17} className="text-brand-600" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 leading-tight">{title}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5 leading-snug">{subtitle}</p>}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  )
}
