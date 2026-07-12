export const ROLE_CONFIG = {
  administrator:     { label: 'Administrator',     bg: 'bg-danger/10',    text: 'text-danger',    border: 'border-danger/30',    dot: 'bg-danger'    },
  fleet_manager:     { label: 'Fleet Manager',     bg: 'bg-primary/10',   text: 'text-primary',   border: 'border-primary/30',   dot: 'bg-primary'   },
  dispatcher:        { label: 'Dispatcher',        bg: 'bg-accent/10',    text: 'text-accent',    border: 'border-accent/30',    dot: 'bg-accent'    },
  safety_officer:    { label: 'Safety Officer',    bg: 'bg-warning/10',   text: 'text-warning',   border: 'border-warning/30',   dot: 'bg-warning'   },
  financial_analyst: { label: 'Financial Analyst', bg: 'bg-[#38BDF8]/10', text: 'text-[#38BDF8]', border: 'border-[#38BDF8]/30', dot: 'bg-[#38BDF8]' },
  driver:            { label: 'Driver',            bg: 'bg-success/10',   text: 'text-success',   border: 'border-success/30',   dot: 'bg-success'   },
};

export default function RoleBadge({ role, size = 'sm' }) {
  const cfg = ROLE_CONFIG[role];
  if (!cfg) return null;
  const sz = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${sz} ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
