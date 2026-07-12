import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Check, X, Eye, Plus, Pencil, Trash2, Download, Settings2, ChevronDown } from 'lucide-react';
import { PERMISSION_MATRIX } from '@utils/settingsMockData';
import { ROLE_CONFIG } from './RoleBadge';

const PERM_LABELS = ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'];
const PERM_ICONS  = [Eye, Plus, Pencil, Trash2, Download, Settings2];
const PERM_COLORS = ['text-[#38BDF8]', 'text-success', 'text-primary', 'text-danger', 'text-warning', 'text-accent'];
const PERM_BG     = ['bg-[#38BDF8]/10', 'bg-success/10', 'bg-primary/10', 'bg-danger/10', 'bg-warning/10', 'bg-accent/10'];

const ROLE_SHORT = {
  administrator:     'Admin',
  fleet_manager:     'Fleet',
  dispatcher:        'Dispatch',
  safety_officer:    'Safety',
  financial_analyst: 'Finance',
  driver:            'Driver',
};

const MODULE_ICONS = {
  Dashboard: '📊', Vehicles: '🚛', Drivers: '👤', Trips: '🗺️',
  Maintenance: '🔧', Fuel: '⛽', Expenses: '💰', Reports: '📈', Settings: '⚙️',
};

export default function RolePermissionMatrix() {
  const [expanded, setExpanded] = useState(null);
  const { modules, roles, matrix } = PERMISSION_MATRIX;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-bg-card/90 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden"
    >
      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 border-b border-border/50 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent/60 via-accent/30 to-transparent" />
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
            <ShieldCheck className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-content-primary">Role &amp; Permission Matrix</h3>
            <p className="text-xs text-content-muted">Module-level access control per role — click a row to expand</p>
          </div>
        </div>
        <div className="sm:ml-auto flex items-center gap-4 text-[10px] text-content-muted flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-success/15 border border-success/30 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-success" />
            </span>
            Allowed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-danger/10 border border-danger/20 flex items-center justify-center">
              <X className="w-2 h-2 text-danger/50" />
            </span>
            Denied
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-bg-base/70 sticky top-0 z-10 backdrop-blur-sm">
            <tr className="border-b border-border/50">
              <th className="px-5 py-3.5 text-left text-[10px] font-black text-content-muted uppercase tracking-widest w-40">Module</th>
              {roles.map(role => {
                const cfg = ROLE_CONFIG[role];
                return (
                  <th key={role} className="px-3 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {ROLE_SHORT[role]}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/25">
            {modules.map((mod, mi) => {
              const isExp = expanded === mod;
              return (
                <>
                  <motion.tr
                    key={mod}
                    onClick={() => setExpanded(isExp ? null : mod)}
                    whileHover={{ backgroundColor: 'rgba(59,130,246,0.04)' }}
                    className={`transition-colors duration-150 cursor-pointer group ${mi % 2 === 1 ? 'bg-bg-base/20' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base leading-none">{MODULE_ICONS[mod]}</span>
                        <span className="text-sm font-bold text-content-primary group-hover:text-primary transition-colors">{mod}</span>
                        <motion.span
                          animate={{ rotate: isExp ? 0 : -90 }}
                          transition={{ duration: 0.2 }}
                          className="ml-auto text-content-muted"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </motion.span>
                      </div>
                    </td>
                    {roles.map(role => {
                      const perms   = matrix[mod][role];
                      const allowed = perms.filter(Boolean).length;
                      const pct     = Math.round((allowed / perms.length) * 100);
                      const barColor = pct === 100 ? '#22C55E' : pct > 50 ? '#3B82F6' : pct > 0 ? '#F59E0B' : '#334155';
                      return (
                        <td key={role} className="px-3 py-3.5 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="flex items-center gap-0.5">
                              {perms.map((p, i) => (
                                <span
                                  key={i}
                                  title={PERM_LABELS[i]}
                                  className={`w-4 h-4 rounded-md flex items-center justify-center transition-all duration-200 ${
                                    p ? 'bg-success/15 border border-success/35' : 'bg-bg-base border border-border/40'
                                  }`}
                                >
                                  {p
                                    ? <Check className="w-2.5 h-2.5 text-success" />
                                    : <X className="w-2 h-2 text-content-disabled/30" />
                                  }
                                </span>
                              ))}
                            </div>
                            <div className="w-full h-1 bg-bg-base rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, delay: mi * 0.05 }}
                                className="h-full rounded-full"
                                style={{ background: barColor }}
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </motion.tr>

                  <AnimatePresence>
                    {isExp && (
                      <motion.tr
                        key={`${mod}-detail`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td colSpan={roles.length + 1} className="px-5 py-4 bg-bg-base/40 border-b border-border/30">
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                            {roles.map(role => {
                              const perms   = matrix[mod][role];
                              const cfg     = ROLE_CONFIG[role];
                              const allowed = perms.filter(Boolean).length;
                              return (
                                <motion.div
                                  key={role}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                  className={`p-3 rounded-xl border ${cfg.border} ${cfg.bg} hover:scale-[1.03] transition-transform duration-150`}
                                >
                                  <p className={`text-[10px] font-black mb-2.5 uppercase tracking-wider ${cfg.text}`}>{ROLE_SHORT[role]}</p>
                                  <div className="space-y-1.5">
                                    {PERM_LABELS.map((lbl, i) => {
                                      const PIcon  = PERM_ICONS[i];
                                      const pColor = PERM_COLORS[i];
                                      const pBg    = PERM_BG[i];
                                      return (
                                        <div key={lbl} className="flex items-center gap-1.5">
                                          <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${perms[i] ? pBg : 'bg-bg-base'}`}>
                                            <PIcon className={`w-3 h-3 ${perms[i] ? pColor : 'text-content-disabled/40'}`} />
                                          </span>
                                          <span className={`text-[10px] font-medium flex-1 ${perms[i] ? 'text-content-secondary' : 'text-content-disabled line-through'}`}>
                                            {lbl}
                                          </span>
                                          {perms[i]
                                            ? <Check className="w-2.5 h-2.5 text-success shrink-0" />
                                            : <X className="w-2.5 h-2.5 text-danger/40 shrink-0" />
                                          }
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="mt-2.5 pt-2 border-t border-border/30">
                                    <span className={`text-[10px] font-black ${cfg.text}`}>{allowed}/{perms.length} granted</span>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend footer */}
      <div className="px-6 py-3 border-t border-border/40 bg-bg-base/20 flex flex-wrap items-center gap-4">
        {PERM_LABELS.map((lbl, i) => {
          const PIcon  = PERM_ICONS[i];
          const pColor = PERM_COLORS[i];
          return (
            <span key={lbl} className="flex items-center gap-1.5 text-[10px] text-content-muted">
              <PIcon className={`w-3 h-3 ${pColor}`} />
              {lbl}
            </span>
          );
        })}
        <span className="ml-auto text-[10px] text-content-disabled italic hidden sm:block">
          Click any module row to expand permission details
        </span>
      </div>
    </motion.div>
  );
}
