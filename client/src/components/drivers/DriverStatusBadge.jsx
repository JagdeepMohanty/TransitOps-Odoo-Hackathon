// Driver-specific status badge — standalone, no conflicts
const BADGE_CONFIG = {
  available:  { label: 'Available',        cls: 'bg-success/10 text-success border-success/25',     dot: 'bg-success'  },
  on_trip:    { label: 'On Trip',           cls: 'bg-blue-500/10 text-blue-400 border-blue-500/25',  dot: 'bg-blue-400' },
  off_duty:   { label: 'Off Duty',          cls: 'bg-slate-500/10 text-slate-400 border-slate-500/25', dot: 'bg-slate-400' },
  suspended:  { label: 'Suspended',         cls: 'bg-danger/10 text-danger border-danger/25',        dot: 'bg-danger'   },
  expiring:   { label: 'License Expiring',  cls: 'bg-warning/10 text-warning border-warning/25',     dot: 'bg-warning'  },
  expired:    { label: 'License Expired',   cls: 'bg-danger/10 text-danger border-danger/25',        dot: 'bg-danger'   },
};

export default function DriverStatusBadge({ status }) {
  const cfg = BADGE_CONFIG[status] ?? BADGE_CONFIG.off_duty;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
