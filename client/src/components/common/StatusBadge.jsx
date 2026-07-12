const STATUS_MAP = {
  // Trip statuses
  active:      { label: 'Active',      cls: 'bg-success-muted text-success-text border-success/30'  },
  inactive:    { label: 'Inactive',    cls: 'bg-bg-hover text-content-muted border-border'           },
  pending:     { label: 'Pending',     cls: 'bg-warning-muted text-warning-text border-warning/30'  },
  in_progress: { label: 'In Progress', cls: 'bg-info-muted text-info-text border-info/30'            },
  completed:   { label: 'Completed',   cls: 'bg-success-muted text-success-text border-success/30'  },
  cancelled:   { label: 'Cancelled',   cls: 'bg-danger-muted text-danger-text border-danger/30'     },
  dispatched:  { label: 'Dispatched',  cls: 'bg-primary/15 text-primary border-primary/30'          },
  // Maintenance
  scheduled:   { label: 'Scheduled',   cls: 'bg-info-muted text-info-text border-info/30'            },
  overdue:     { label: 'Overdue',     cls: 'bg-danger-muted text-danger-text border-danger/30'     },
  closed:      { label: 'Closed',      cls: 'bg-bg-hover text-content-muted border-border'           },
  // Vehicle
  available:   { label: 'Available',   cls: 'bg-success-muted text-success-text border-success/30'  },
  on_trip:     { label: 'On Trip',     cls: 'bg-primary/15 text-primary border-primary/30'          },
  maintenance: { label: 'Maintenance', cls: 'bg-warning-muted text-warning-text border-warning/30'  },
  retired:     { label: 'Retired',     cls: 'bg-bg-hover text-content-muted border-border'           },
};

export default function StatusBadge({ status, label, dot = true, className = '' }) {
  const key = String(status).toLowerCase().replace(/\s+/g, '_');
  const cfg = STATUS_MAP[key] ?? {
    label: label ?? status,
    cls:   'bg-bg-hover text-content-muted border-border',
  };

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        cfg.cls,
        className,
      ].join(' ')}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
      {label ?? cfg.label}
    </span>
  );
}
