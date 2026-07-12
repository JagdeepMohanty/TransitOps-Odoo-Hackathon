import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:   'bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-sm hover:shadow-glow-sm',
  secondary: 'bg-bg-card text-content-secondary border border-border hover:bg-bg-hover hover:text-content-primary hover:border-border-strong',
  success:   'bg-success text-white hover:bg-green-600 active:bg-green-700 shadow-sm',
  warning:   'bg-warning text-white hover:bg-amber-600 active:bg-amber-700 shadow-sm',
  danger:    'bg-danger text-white hover:bg-danger-hover active:bg-red-700 shadow-sm',
  ghost:     'bg-transparent text-content-secondary hover:bg-bg-hover hover:text-content-primary',
  outline:   'bg-transparent text-primary border border-primary hover:bg-primary/10',
};

const SIZES = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5',
  sm: 'px-3 py-2 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-5 py-3 text-sm rounded-xl gap-2',
  xl: 'px-6 py-3.5 text-base rounded-xl gap-2.5',
};

export default function Button({
  children,
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  disabled  = false,
  icon,
  iconRight,
  fullWidth = false,
  className = '',
  type      = 'button',
  onClick,
  ...props
}) {
  const Icon      = icon;
  const IconRight = iconRight;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-medium',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size]       ?? SIZES.md,
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading
        ? <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        : Icon && <Icon className="w-4 h-4 shrink-0" />
      }
      {children}
      {!loading && IconRight && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
}
