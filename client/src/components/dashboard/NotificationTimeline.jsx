import { Truck, CheckCircle2, Wrench, Fuel, AlertTriangle, UserCheck, Route } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, icon: Truck,        color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  title: 'Vehicle Van-05 dispatched',              sub: 'Route: Mumbai → Pune',          time: '2 min ago',  dot: 'bg-primary' },
  { id: 2, icon: CheckCircle2, color: '#22C55E', bg: 'rgba(34,197,94,0.12)',   title: 'Trip #T1042 completed successfully',      sub: 'Driver: Ravi Kumar',            time: '18 min ago', dot: 'bg-success' },
  { id: 3, icon: Wrench,       color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  title: 'Maintenance scheduled for MH-03-EF-9012', sub: 'Engine Overhaul — Tata Auth.',  time: '1 hr ago',   dot: 'bg-warning' },
  { id: 4, icon: Fuel,         color: '#38BDF8', bg: 'rgba(56,189,248,0.12)',  title: 'Fuel log added — 120L at HPCL Mumbai',    sub: 'Vehicle: KA-01-AB-1234',        time: '2 hr ago',   dot: 'bg-info'    },
  { id: 5, icon: AlertTriangle,color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   title: 'Driver license expires in 5 days',        sub: 'Driver: Mohan Das — WB-DL-...',  time: '3 hr ago',   dot: 'bg-danger'  },
  { id: 6, icon: UserCheck,    color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)',  title: 'Driver Kavya Reddy assigned to UP-08',    sub: 'Trip: Kolkata → Bhubaneswar',   time: '5 hr ago',   dot: 'bg-accent'  },
  { id: 7, icon: Route,        color: '#10B981', bg: 'rgba(16,185,129,0.12)',  title: 'Trip #T1041 in progress',                 sub: 'Delhi → Jaipur — 282 km',       time: 'Yesterday',  dot: 'bg-secondary'},
];

export default function NotificationTimeline() {
  return (
    <div className="bg-bg-card border border-border rounded-[20px] shadow-card-md overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h2 className="text-sm font-bold text-content-primary">Recent Notifications</h2>
          <p className="text-xs text-content-muted mt-0.5">Live activity feed</p>
        </div>
        <button className="text-xs text-primary hover:text-primary-hover font-medium transition-colors">
          Mark all read
        </button>
      </div>

      <div className="px-6 py-4">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/60" />

          <div className="space-y-0">
            {NOTIFICATIONS.map((n, i) => (
              <div key={n.id} className="relative flex gap-4 group">
                {/* Icon circle */}
                <div
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-border/60 group-hover:scale-110 transition-transform duration-200"
                  style={{ background: n.bg }}
                >
                  <n.icon className="w-4 h-4" style={{ color: n.color }} />
                </div>

                {/* Content */}
                <div className={`flex-1 min-w-0 pb-5 ${i === NOTIFICATIONS.length - 1 ? 'pb-0' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-content-primary leading-snug">{n.title}</p>
                      <p className="text-[11px] text-content-muted mt-0.5 truncate">{n.sub}</p>
                    </div>
                    <span className="text-[10px] text-content-disabled whitespace-nowrap shrink-0 mt-0.5">{n.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
