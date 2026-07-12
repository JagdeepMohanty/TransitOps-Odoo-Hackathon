const STATUS_CFG = {
  approved: { label: 'Approved', bg: 'rgba(34,197,94,0.12)',  color: '#86EFAC', border: 'rgba(34,197,94,0.3)',   dot: '#22C55E', pulse: false },
  pending:  { label: 'Pending',  bg: 'rgba(245,158,11,0.12)', color: '#FDE68A', border: 'rgba(245,158,11,0.3)',  dot: '#F59E0B', pulse: true  },
  rejected: { label: 'Rejected', bg: 'rgba(239,68,68,0.12)',  color: '#FCA5A5', border: 'rgba(239,68,68,0.3)',   dot: '#EF4444', pulse: false },
};

const TYPE_CFG = {
  Fuel:        { bg: 'rgba(59,130,246,0.12)',  color: '#93C5FD', border: 'rgba(59,130,246,0.3)'  },
  Maintenance: { bg: 'rgba(245,158,11,0.12)', color: '#FDE68A', border: 'rgba(245,158,11,0.3)' },
  Toll:        { bg: 'rgba(34,197,94,0.12)',  color: '#86EFAC', border: 'rgba(34,197,94,0.3)'  },
  Insurance:   { bg: 'rgba(139,92,246,0.12)', color: '#C4B5FD', border: 'rgba(139,92,246,0.3)' },
  Repairs:     { bg: 'rgba(239,68,68,0.12)',  color: '#FCA5A5', border: 'rgba(239,68,68,0.3)'  },
  Parking:     { bg: 'rgba(100,116,139,0.1)', color: '#94A3B8', border: 'rgba(100,116,139,0.25)'},
  Other:       { bg: 'rgba(100,116,139,0.1)', color: '#94A3B8', border: 'rgba(100,116,139,0.25)'},
};

export default function StatusBadge({ status, type, size = 'sm' }) {
  const cfg = status ? (STATUS_CFG[status] ?? STATUS_CFG.pending) : (TYPE_CFG[type] ?? TYPE_CFG.Other);
  const isLg = size === 'lg';

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: isLg ? '5px 12px' : '3px 9px',
      borderRadius: 999, fontSize: isLg ? 12 : 11, fontWeight: 600,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap', letterSpacing: '0.02em',
    }}>
      {status && cfg.dot && (
        <span style={{
          width: isLg ? 7 : 6, height: isLg ? 7 : 6, borderRadius: '50%',
          background: cfg.dot, flexShrink: 0,
          animation: cfg.pulse ? 'fePulse 1.8s ease-in-out infinite' : 'none',
        }} />
      )}
      {cfg.label ?? type}
    </span>
  );
}
