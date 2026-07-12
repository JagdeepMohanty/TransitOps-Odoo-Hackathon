import { Wrench } from 'lucide-react';

const MAINTENANCE = [
  { vehicle: 'MH-03-EF-9012', issue: 'Engine Overhaul',    engineer: 'Tata Authorized',   status: 'in_progress', date: '01 Dec 2024', priority: 'high'   },
  { vehicle: 'DL-04-GH-3456', issue: 'Brake Service',      engineer: 'Delhi Auto Hub',    status: 'overdue',     date: '25 Nov 2024', priority: 'critical'},
  { vehicle: 'KA-02-CD-5678', issue: 'Tyre Replacement',   engineer: 'SpeedFit Tyres',    status: 'scheduled',   date: '20 Dec 2024', priority: 'medium' },
  { vehicle: 'GJ-06-KL-2345', issue: 'Annual Inspection',  engineer: 'RTO Approved',      status: 'scheduled',   date: '28 Dec 2024', priority: 'low'    },
  { vehicle: 'KA-01-AB-1234', issue: 'Oil Change',         engineer: 'Raj Auto Works',    status: 'completed',   date: '10 Nov 2024', priority: 'low'    },
];

const STATUS_CONFIG = {
  in_progress: { label: 'In Progress', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  overdue:     { label: 'Overdue',     cls: 'bg-danger/10 text-danger border-danger/20'       },
  scheduled:   { label: 'Scheduled',   cls: 'bg-warning/10 text-warning border-warning/20'   },
  completed:   { label: 'Completed',   cls: 'bg-success/10 text-success border-success/20'   },
};

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', cls: 'bg-danger/15 text-danger'     },
  high:     { label: 'High',     cls: 'bg-orange-500/15 text-orange-400' },
  medium:   { label: 'Medium',   cls: 'bg-warning/15 text-warning'   },
  low:      { label: 'Low',      cls: 'bg-success/15 text-success'   },
};

export default function MaintenanceCard() {
  return (
    <div className="bg-bg-card border border-border rounded-[20px] shadow-card-md overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h2 className="text-sm font-bold text-content-primary">Recent Maintenance</h2>
          <p className="text-xs text-content-muted mt-0.5">Vehicle service & repair tracking</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger/10 border border-danger/20">
          <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
          <span className="text-[11px] font-semibold text-danger">1 Overdue</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-bg-secondary border-b border-border">
            <tr>
              {['Vehicle', 'Issue', 'Engineer', 'Status', 'Date', 'Priority'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-content-disabled uppercase tracking-widest whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {MAINTENANCE.map((m, i) => {
              const s = STATUS_CONFIG[m.status];
              const p = PRIORITY_CONFIG[m.priority];
              return (
                <tr key={i} className="hover:bg-bg-hover/50 transition-colors duration-150">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                        <Wrench className="w-3.5 h-3.5 text-warning" />
                      </div>
                      <span className="text-xs font-mono text-content-secondary">{m.vehicle}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-content-primary font-medium">{m.issue}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-content-muted">{m.engineer}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${s.cls}`}>
                      {s.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-content-muted">{m.date}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${p.cls}`}>
                      {p.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
