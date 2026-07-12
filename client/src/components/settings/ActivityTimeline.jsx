import { motion } from 'framer-motion';
import { LogIn, Shield, Key, UserPlus, Lock, Download, UserX, Activity } from 'lucide-react';
import { ACTIVITY_TIMELINE } from '@utils/settingsMockData';

const TYPE_CONFIG = {
  login:      { Icon: LogIn,    bg: 'bg-success/10',   icon: 'text-success',    border: 'border-success/25',   label: 'Login',      labelBg: 'bg-success/10 text-success border-success/20'      },
  role:       { Icon: Shield,   bg: 'bg-primary/10',   icon: 'text-primary',    border: 'border-primary/25',   label: 'Role',       labelBg: 'bg-primary/10 text-primary border-primary/20'      },
  permission: { Icon: Key,      bg: 'bg-accent/10',    icon: 'text-accent',     border: 'border-accent/25',    label: 'Permission', labelBg: 'bg-accent/10 text-accent border-accent/20'          },
  user:       { Icon: UserPlus, bg: 'bg-[#38BDF8]/10', icon: 'text-[#38BDF8]', border: 'border-[#38BDF8]/25', label: 'User',       labelBg: 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20'},
  password:   { Icon: Lock,     bg: 'bg-warning/10',   icon: 'text-warning',    border: 'border-warning/25',   label: 'Security',   labelBg: 'bg-warning/10 text-warning border-warning/20'      },
  report:     { Icon: Download, bg: 'bg-success/10',   icon: 'text-success',    border: 'border-success/25',   label: 'Report',     labelBg: 'bg-success/10 text-success border-success/20'      },
  suspend:    { Icon: UserX,    bg: 'bg-danger/10',    icon: 'text-danger',     border: 'border-danger/25',    label: 'Suspend',    labelBg: 'bg-danger/10 text-danger border-danger/20'          },
};

export default function ActivityTimeline() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
      className="bg-bg-card/90 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden flex flex-col">
      <div className="relative flex items-center gap-3 px-6 py-4 border-b border-border/50 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20"><Activity className="w-4 h-4 text-primary" /></div>
        <div><h3 className="text-sm font-bold text-content-primary">System Activity</h3><p className="text-xs text-content-muted">Recent logins, role changes &amp; security events</p></div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black text-success">LIVE</span>
        </div>
      </div>

      <div className="flex-1 p-5 overflow-y-auto">
        <div className="relative">
          <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-border/60 via-border/30 to-transparent" />
          <div className="space-y-3">
            {ACTIVITY_TIMELINE.map((item, i) => {
              const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.login;
              const { Icon } = cfg;
              return (
                <motion.div key={item.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  whileHover={{ x: 3 }}
                  className="flex items-start gap-3 group">
                  <div className={`relative z-10 w-8 h-8 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                    <Icon className={`w-3.5 h-3.5 ${cfg.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-black text-content-primary">{item.user}</span>
                        <p className="text-[11px] text-content-muted mt-0.5 leading-relaxed">{item.action}</p>
                      </div>
                      <span className="text-[10px] text-content-disabled whitespace-nowrap shrink-0 mt-0.5">{item.time}</span>
                    </div>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md border text-[10px] font-black capitalize ${cfg.labelBg}`}>
                      {cfg.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-6 py-3 border-t border-border/40 bg-bg-base/20">
        <button className="w-full text-xs font-black text-primary hover:text-primary-hover transition-colors flex items-center justify-center gap-1.5">
          View Full Audit Log <span className="text-content-muted">→</span>
        </button>
      </div>
    </motion.div>
  );
}
