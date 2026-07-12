const PRIORITY_MAP = {
  low:      { label: 'Low',      bg: 'rgba(100,116,139,0.1)', color: '#94A3B8', border: 'rgba(100,116,139,0.22)', dot: null      },
  medium:   { label: 'Medium',   bg: 'rgba(59,130,246,0.1)',  color: '#93C5FD', border: 'rgba(59,130,246,0.22)',  dot: null      },
  high:     { label: 'High',     bg: 'rgba(249,115,22,0.1)',  color: '#FDBA74', border: 'rgba(249,115,22,0.22)',  dot: null      },
  critical: { label: 'Critical', bg: 'rgba(239,68,68,0.12)',  color: '#FCA5A5', border: 'rgba(239,68,68,0.28)',   dot: '#EF4444' },
};

export default function PriorityBadge({ priority }) {
  const cfg = PRIORITY_MAP[priority] ?? PRIORITY_MAP.low;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 999,
      fontSize: 11, fontWeight: 700,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
    }}>
      {cfg.dot && (
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: cfg.dot, flexShrink: 0,
          animation: 'statusPulse 1.4s ease-in-out infinite',
        }} />
      )}
      {cfg.label}
    </span>
  );
}
