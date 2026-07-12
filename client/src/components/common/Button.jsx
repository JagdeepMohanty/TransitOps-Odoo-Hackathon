import { Loader2 } from 'lucide-react'
import { cn } from '@/utils'

const VARIANTS = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  danger:    'btn-danger',
  ghost:     'btn-ghost',
  outline:   'btn-outline',
  success:   'btn-success',
}

const SIZES = {
  xs: 'h-7  px-2.5 text-xs  gap-1   rounded-lg',
  sm: 'h-8  px-3.5 text-xs  gap-1.5 rounded-xl',
  md: 'h-9  px-4   text-sm  gap-2   rounded-xl',
  lg: 'h-11 px-5   text-sm  gap-2   rounded-xl',
  xl: 'h-12 px-6   text-base gap-2.5 rounded-2xl',
}

export default function Button({
  children,
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        VARIANTS[variant] ?? 'btn-primary',
        SIZES[size]       ?? SIZES.md,
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin shrink-0" />
      ) : leftIcon ? (
        <span className="shrink-0 flex items-center">{leftIcon}</span>
      ) : null}

      {children && <span className="leading-none">{children}</span>}

      {!loading && rightIcon && (
        <span className="shrink-0 flex items-center">{rightIcon}</span>
      )}
    </button>
  )
}
