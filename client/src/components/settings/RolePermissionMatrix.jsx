import { useState } from 'react';
import { ShieldCheck, Check, X, Eye, Plus, Pencil, Trash2, Download, Settings2 } from 'lucide-react';
import { PERMISSION_MATRIX } from '@utils/settingsMockData';
import { ROLE_CONFIG } from './RoleBadge';

const PERM_LABELS = ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'];
const PERM_ICONS  = [Eye, Plus, Pencil, Trash2, Download, Settings2];

const ROLE_SHORT = {
  administrator:     'Admin',
  fleet_manager:     'Fleet Mgr',
  dispatcher:        'Dispatcher',
  safety_officer:    'Safety',
  financial_analyst: 'Finance',
  driver:            'Driver',
};

export default function RolePermissionMatrix() {
  const [expanded, setExpanded] = useState(null);
  const { modules, roles, matrix } = PERMISSION_MATRIX;

  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
        <div className="p-2 rounded-xl bg-accent/10">
          <ShieldCheck className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-content-primary">Role &amp; Permission Matrix</h3>
          <p className="text-xs text-content-muted">Module-level access control per role</p>
        </div>
        <div className="ml-auto flex items-center gap-3 text-[10px] text-content-muted">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success/20 border border-success/40 flex items-center justify-center"><Check className="w-2 h-2 text-success" /></span> Allowed</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-danger/10 border border-danger/20 flex items-center justify-center"><X className="w-2 h-2 text-danger/60" /></span> Denied</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-bg-base/60 sticky top-0 z-10">
            <tr className="border-b border-border/50">
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-content-muted uppercase tracking-wider w-36">Module</th>
              {roles.map(role => {
                const cfg = ROLE_CONFIG[role];
                return (
                  <th key={role} className="px-3 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        {ROLE_SHORT[role]}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {modules.map(mod => {
              const isExp = expanded === mod;
              return (
                <>
                  {/* Module row */}
                  <tr
                    key={mod}
                    onClick={() => setExpanded(isExp ? null : mod)}
                    className="hover:bg-bg-hover/40 transition-colors duration-150 cursor-pointer group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full bg-primary transition-all duration-200 ${isExp ? 'scale-125' : ''}`} />
                        <span className="text-sm font-semibold text-content-primary group-hover:text-primary transition-colors">{mod}</span>
                      </div>
                    </td>
                    {roles.map(role => {
                      const perms = matrix[mod][role];
                      const allowed = perms.filter(Boolean).length;
                      const total   = perms.length;
                      const pct     = Math.round((allowed / total) * 100);
                      return (
                        <td key={role} className="px-3 py-3.5 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="flex items-center gap-0.5">
                              {perms.map((p, i) => (
                                <span
                                  key={i}
                                  title={PERM_LABELS[i]}
                                  className={`w-4 h-4 rounded flex items-center justify-center transition-all duration-200 ${
                                    p
                                      ? 'bg-success/15 border border-success/30'
                                      : 'bg-bg-base border border-border/40'
                                  }`}
                                >
                                  {p
                                    ? <Check className="w-2.5 h-2.5 text-success" />
                                    : <X className="w-2 h-2 text-content-disabled/40" />
                                  }
                                </span>
                              ))}
                            </div>
                            <div className="w-full h-1 bg-bg-base rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${pct}%`,
                                  background: pct === 100 ? '#22C55E' : pct > 50 ? '#3B82F6' : pct > 0 ? '#F59E0B' : '#334155',
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Expanded detail row */}
                  {isExp && (
                    <tr key={`${mod}-detail`} className="bg-bg-base/40">
                      <td colSpan={roles.length + 1} className="px-5 py-3">
                        <div className="grid grid-cols-6 gap-2">
                          {roles.map(role => {
                            const perms = matrix[mod][role];
                            const cfg   = ROLE_CONFIG[role];
                            return (
                              <div key={role} className={`p-3 rounded-xl border ${cfg.border} ${cfg.bg}`}>
                                <p className={`text-[10px] font-bold mb-2 ${cfg.text}`}>{ROLE_SHORT[role]}</p>
                                <div className="space-y-1">
                                  {PERM_LABELS.map((lbl, i) => {
                                    const PIcon = PERM_ICONS[i];
                                    return (
                                      <div key={lbl} className="flex items-center gap-1.5">
                                        <PIcon className={`w-3 h-3 ${perms[i] ? cfg.text : 'text-content-disabled'}`} />
                                        <span className={`text-[10px] ${perms[i] ? 'text-content-secondary' : 'text-content-disabled line-through'}`}>{lbl}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-border/40 bg-bg-base/30 flex flex-wrap gap-4">
        {PERM_LABELS.map((lbl, i) => {
          const PIcon = PERM_ICONS[i];
          return (
            <span key={lbl} className="flex items-center gap-1.5 text-[10px] text-content-muted">
              <PIcon className="w-3 h-3 text-content-disabled" />{lbl}
            </span>
          );
        })}
        <span className="ml-auto text-[10px] text-content-disabled italic">Click a module row to expand details</span>
      </div>
    </div>
  );
}
