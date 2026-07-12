const STATUS_CONFIG = {
  active:    { label: 'Active',    bg: 'bg-success/10',      text: 'text-success',       border: 'border-success/30',  dot: 'bg-success animate-pulse' },
  inactive:  { label: 'Inactive',  bg: 'bg-border/20',       text: 'text-content-muted', border: 'border-border',      dot: 'bg-content-muted'         },
  pending:   { label: 'Pending',   bg: 'bg-warning/10',      text: 'text-warning',       border: 'border-warning/30',  dot: 'bg-warning animate-pulse' },
  suspended: { label: 'Suspended', bg: 'bg-danger/10',       text: 'text-danger',        border: 'border-danger/30',   dot: 'bg-danger'                },
};

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wide transition-all duration-200 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
