import {
  FileSpreadsheet, FileText, CalendarClock, Mail, Printer, Sparkles, Zap,
} from 'lucide-react';

const ACTIONS = [
  { icon: FileSpreadsheet, label: 'Export CSV',       color: 'success', desc: 'Download as spreadsheet' },
  { icon: FileText,        label: 'Export PDF',       color: 'warning', desc: 'Download as PDF report'  },
  { icon: CalendarClock,   label: 'Schedule Report',  color: 'primary', desc: 'Set auto-delivery'       },
  { icon: Mail,            label: 'Email Report',     color: 'accent',  desc: 'Send to stakeholders'    },
  { icon: Printer,         label: 'Print Dashboard',  color: 'info',    desc: 'Print current view'      },
  { icon: Sparkles,        label: 'Generate Summary', color: 'danger',  desc: 'AI-powered summary'      },
];

const COLOR_STYLES = {
  success: { bg: 'bg-success/10 hover:bg-success/20', icon: 'text-success', border: 'border-success/20 hover:border-success/40' },
  warning: { bg: 'bg-warning/10 hover:bg-warning/20', icon: 'text-warning', border: 'border-warning/20 hover:border-warning/40' },
  primary: { bg: 'bg-primary/10 hover:bg-primary/20', icon: 'text-primary', border: 'border-primary/20 hover:border-primary/40' },
  accent:  { bg: 'bg-accent/10  hover:bg-accent/20',  icon: 'text-accent',  border: 'border-accent/20  hover:border-accent/40'  },
  info:    { bg: 'bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20', icon: 'text-[#38BDF8]', border: 'border-[#38BDF8]/20 hover:border-[#38BDF8]/40' },
  danger:  { bg: 'bg-danger/10  hover:bg-danger/20',  icon: 'text-danger',  border: 'border-danger/20  hover:border-danger/40'  },
};

export default function QuickActions() {
  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
        <div className="p-2 rounded-xl bg-primary/10">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-content-primary">Quick Actions</h3>
          <p className="text-xs text-content-muted">Common report operations</p>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ACTIONS.map(a => {
          const Icon = a.icon;
          const s    = COLOR_STYLES[a.color];
          return (
            <button
              key={a.label}
              className={`flex flex-col items-start gap-2 p-3.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-md ${s.bg} ${s.border}`}
            >
              <div className={`p-2 rounded-lg bg-bg-card/60 ${s.icon}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-content-primary">{a.label}</p>
                <p className="text-[10px] text-content-muted mt-0.5">{a.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
