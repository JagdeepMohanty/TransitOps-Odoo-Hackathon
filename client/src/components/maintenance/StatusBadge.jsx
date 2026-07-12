const STATUS_MAP = {
  scheduled:   { label: 'Scheduled',   bg: 'rgba(59,130,246,0.12)',  color: '#93C5FD', border: 'rgba(59,130,246,0.3)',   dot: '#3B82F6', pulse: false },
  in_progress: { label: 'In Progress', bg: 'rgba(245,158,11,0.12)', color: '#FDE68A', border: 'rgba(245,158,11,0.3)',  dot: '#F59E0B', pulse: true  },
  completed:   { label: 'Completed',   bg: 'rgba(34,197,94,0.12)',  color: '#86EFAC', border: 'rgba(34,197,94,0.3)',   dot: '#22C55E', pulse: false },
  overdue:     { label: 'Overdue',     bg: 'rgba(239,68,68,0.12)',  color: '#FCA5A5', border: 'rgba(239,68,68,0.3)',   dot: '#EF4444', pulse: true  },
  cancelled:   { label: 'Cancelled',   bg: 'rgba(100,116,139,0.1)', color: '#94A3B8', border: 'rgba(100,116,139,0.25)',dot: '#64748B', pulse: false },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.scheduled;
  const isLg = size === 'lg';

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: isLg ? '5px 12px' : '3px 9px',
      borderRadius: 999,
      fontSize: isLg ? 12 : 11,
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
      border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap',
      letterSpacing: '0.01em',
    }}>
      <span style={{
        width: isLg ? 7 : 6,
        height: isLg ? 7 : 6,
        borderRadius: '50%',
        background: cfg.dot,
        flexShrink: 0,
        animation: cfg.pulse ? 'statusPulse 1.8s ease-in-out infinite' : 'none',
      }} />
      {cfg.label}
    </span>
  );
}
