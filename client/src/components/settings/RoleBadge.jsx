export const ROLE_CONFIG = {
  administrator:     { label: 'Administrator',     bg: 'bg-danger/10',    text: 'text-danger',    border: 'border-danger/30',    dot: 'bg-danger',    glow: 'hover:shadow-[0_0_12px_rgba(239,68,68,0.35)]'    },
  fleet_manager:     { label: 'Fleet Manager',     bg: 'bg-primary/10',   text: 'text-primary',   border: 'border-primary/30',   dot: 'bg-primary',   glow: 'hover:shadow-[0_0_12px_rgba(59,130,246,0.35)]'   },
  dispatcher:        { label: 'Dispatcher',        bg: 'bg-accent/10',    text: 'text-accent',    border: 'border-accent/30',    dot: 'bg-accent',    glow: 'hover:shadow-[0_0_12px_rgba(139,92,246,0.35)]'   },
  safety_officer:    { label: 'Safety Officer',    bg: 'bg-warning/10',   text: 'text-warning',   border: 'border-warning/30',   dot: 'bg-warning',   glow: 'hover:shadow-[0_0_12px_rgba(245,158,11,0.35)]'   },
  financial_analyst: { label: 'Financial Analyst', bg: 'bg-[#38BDF8]/10', text: 'text-[#38BDF8]', border: 'border-[#38BDF8]/30', dot: 'bg-[#38BDF8]', glow: 'hover:shadow-[0_0_12px_rgba(56,189,248,0.35)]'   },
  driver:            { label: 'Driver',            bg: 'bg-success/10',   text: 'text-success',   border: 'border-success/30',   dot: 'bg-success',   glow: 'hover:shadow-[0_0_12px_rgba(34,197,94,0.35)]'    },
};

export default function RoleBadge({ role, size = 'sm' }) {
  const cfg = ROLE_CONFIG[role];
  if (!cfg) return null;
  const sz = size === 'xs'
    ? 'text-[9px] px-1.5 py-0.5 gap-1'
    : size === 'lg'
    ? 'text-sm px-3.5 py-1.5 gap-2'
    : 'text-[11px] px-2.5 py-1 gap-1.5';
  const dotSz = size === 'xs' ? 'w-1 h-1' : size === 'lg' ? 'w-2 h-2' : 'w-1.5 h-1.5';
  return (
    <span className={`inline-flex items-center rounded-full border font-bold tracking-wide transition-all duration-200 cursor-default ${sz} ${cfg.bg} ${cfg.text} ${cfg.border} ${cfg.glow}`}>
      <span className={`rounded-full shrink-0 ${dotSz} ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
