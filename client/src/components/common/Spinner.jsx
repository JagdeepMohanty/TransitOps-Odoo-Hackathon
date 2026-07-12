const SIZES = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
  xl: 'w-12 h-12 border-4',
};

const COLORS = {
  primary: 'border-primary/20 border-t-primary',
  white:   'border-white/20 border-t-white',
  muted:   'border-border border-t-content-muted',
};

export default function Spinner({
  size      = 'md',
  color     = 'primary',
  className = '',
}) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        'inline-block rounded-full animate-spin',
        SIZES[size]  ?? SIZES.md,
        COLORS[color] ?? COLORS.primary,
        className,
      ].join(' ')}
    />
  );
}
