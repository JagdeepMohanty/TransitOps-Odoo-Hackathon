import { motion } from 'framer-motion';
import { Shield, Edit2, Trash2, Users, Plus, Lock, Key } from 'lucide-react';
import { ROLES_DATA } from '@utils/settingsMockData';
import { ROLE_CONFIG } from './RoleBadge';

const ROLE_META = {
  administrator:     { gradient: 'from-danger/15 to-danger/5',       ring: 'ring-danger/20'    },
  fleet_manager:     { gradient: 'from-primary/15 to-primary/5',     ring: 'ring-primary/20'   },
  dispatcher:        { gradient: 'from-accent/15 to-accent/5',       ring: 'ring-accent/20'    },
  safety_officer:    { gradient: 'from-warning/15 to-warning/5',     ring: 'ring-warning/20'   },
  financial_analyst: { gradient: 'from-[#38BDF8]/15 to-[#38BDF8]/5', ring: 'ring-[#38BDF8]/20' },
  driver:            { gradient: 'from-success/15 to-success/5',     ring: 'ring-success/20'   },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } } };

export default function RolesCard({ onEdit, onCreate }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-bg-card/90 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      <div className="relative flex items-center gap-3 px-6 py-4 border-b border-border/50 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent/60 via-accent/30 to-transparent" />
        <div className="p-2 rounded-xl bg-accent/10 border border-accent/20"><Shield className="w-4 h-4 text-accent" /></div>
        <div><h3 className="text-sm font-bold text-content-primary">Roles Overview</h3><p className="text-xs text-content-muted">Manage roles and their access descriptions</p></div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onCreate}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/30 text-xs font-black text-accent hover:bg-accent/20 hover:shadow-[0_0_12px_rgba(139,92,246,0.25)] transition-all duration-200">
          <Plus className="w-3.5 h-3.5" />Create Role
        </motion.button>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ROLES_DATA.map(role => {
          const cfg  = ROLE_CONFIG[role.id];
          const meta = ROLE_META[role.id] || ROLE_META.driver;
          return (
            <motion.div key={role.id} variants={item} whileHover={{ y: -3, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`group relative p-4 rounded-xl border ${cfg.border} bg-gradient-to-br ${meta.gradient} cursor-default overflow-hidden`}>
              {/* Top accent line */}
              <div className={`absolute inset-x-0 top-0 h-[2px] rounded-t-xl ${cfg.dot} opacity-60`} style={{ background: `var(--color-${cfg.dot.replace('bg-','')})` }} />
              <div className={`absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-gradient-to-r ${cfg.dot.replace('bg-','from-')} to-transparent`} />

              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl bg-bg-card/60 border ${cfg.border} ${cfg.text} ring-1 ${meta.ring}`}>
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button onClick={() => onEdit(role)} className="p-1.5 rounded-lg text-content-muted hover:text-primary hover:bg-primary/10 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-lg text-content-muted hover:text-danger hover:bg-danger/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <p className={`text-sm font-black mb-1 ${cfg.text}`}>{role.label}</p>
              <p className="text-[11px] text-content-muted mb-3 leading-relaxed line-clamp-2">{role.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[10px] text-content-muted font-medium">
                    <Users className="w-3 h-3 text-content-disabled" />{role.users} user{role.users !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-content-muted font-medium">
                    <Key className="w-3 h-3 text-content-disabled" />{role.permissions} perms
                  </span>
                </div>
                {role.id === 'administrator' && (
                  <div className="flex items-center gap-1 text-[10px] text-danger/70">
                    <Lock className="w-2.5 h-2.5" /><span>Protected</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
