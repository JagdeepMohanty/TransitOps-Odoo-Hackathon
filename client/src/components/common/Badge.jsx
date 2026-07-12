const VARIANTS = {
  primary:   'bg-primary/15 text-primary border border-primary/30',
  secondary: 'bg-secondary/15 text-secondary border border-secondary/30',
  success:   'bg-success-muted text-success-text border border-success/30',
  warning:   'bg-warning-muted text-warning-text border border-warning/30',
  danger:    'bg-danger-muted text-danger-text border border-danger/30',
  info:      'bg-info-muted text-info-text border border-info/30',
  muted:     'bg-bg-hover text-content-muted border border-border',
  accent:    'bg-accent/15 text-accent border border-accent/30',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-2xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export default function Badge({
  children,
  variant   = 'primary',
  size      = 'md',
  dot       = false,
  icon,
  className = '',
}) {
  const Icon = icon;

  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full font-medium',
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size]       ?? SIZES.md,
        className,
      ].join(' ')}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      )}
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}
