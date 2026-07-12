// StatusBadge.jsx — Trip Dispatcher status badges

const STATUS_CONFIG = {
  draft:       { label: 'Draft',       dot: '#94A3B8', bg: 'rgba(148,163,184,0.12)', text: '#CBD5E1', border: 'rgba(148,163,184,0.25)' },
  dispatched:  { label: 'Dispatched',  dot: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  text: '#93C5FD', border: 'rgba(59,130,246,0.3)'   },
  completed:   { label: 'Completed',   dot: '#22C55E', bg: 'rgba(34,197,94,0.12)',   text: '#86EFAC', border: 'rgba(34,197,94,0.3)'    },
  cancelled:   { label: 'Cancelled',   dot: '#EF4444', bg: 'rgba(239,68,68,0.12)',   text: '#FCA5A5', border: 'rgba(239,68,68,0.3)'    },
  on_trip:     { label: 'On Trip',     dot: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  text: '#93C5FD', border: 'rgba(59,130,246,0.3)'   },
  available:   { label: 'Available',   dot: '#22C55E', bg: 'rgba(34,197,94,0.12)',   text: '#86EFAC', border: 'rgba(34,197,94,0.3)'    },
  suspended:   { label: 'Suspended',   dot: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  text: '#FDE68A', border: 'rgba(245,158,11,0.3)'   },
  maintenance: { label: 'Maintenance', dot: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  text: '#FDE68A', border: 'rgba(245,158,11,0.3)'   },
  retired:     { label: 'Retired',     dot: '#64748B', bg: 'rgba(100,116,139,0.12)', text: '#94A3B8', border: 'rgba(100,116,139,0.25)' },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const key = String(status || '').toLowerCase();
  const cfg = STATUS_CONFIG[key] ?? STATUS_CONFIG.draft;
  const padding = size === 'lg' ? '4px 12px' : '2px 10px';
  const fontSize = size === 'lg' ? '12px' : '11px';

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding, borderRadius: 999, fontSize, fontWeight: 600,
        letterSpacing: '0.02em', background: cfg.bg, color: cfg.text,
        border: `1px solid ${cfg.border}`, whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0, boxShadow: `0 0 6px ${cfg.dot}` }} />
      {cfg.label}
    </span>
  );
}
