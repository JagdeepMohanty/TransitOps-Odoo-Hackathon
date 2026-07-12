import { motion } from 'framer-motion';
import { Settings, UserPlus, ShieldPlus, Save, Sparkles, Zap } from 'lucide-react';

export default function SettingsHeader({ onAddUser, onCreateRole, onSave }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-r from-bg-card via-bg-card to-bg-card/80 shadow-card-md"
    >
      {/* Gradient border top */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-accent" />

      {/* Background glows */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-8 right-32 w-48 h-48 bg-accent/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-4 min-w-0">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative shrink-0"
          >
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/25 to-accent/25 border border-primary/40 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-bg-card animate-pulse" />
          </motion.div>

          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-black text-content-primary tracking-tight">
                Settings &amp; Role Management
              </h1>
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/30 text-[10px] font-black text-primary uppercase tracking-wider"
              >
                <Sparkles className="w-2.5 h-2.5" />
                Enterprise
              </motion.span>
            </div>
            <p className="text-xs text-content-muted mt-0.5 truncate">
              Manage preferences, users, roles, permissions &amp; security across your fleet platform.
            </p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAddUser}
            className="group flex items-center gap-1.5 h-9 px-4 rounded-xl bg-bg-base border border-border text-xs font-bold text-content-secondary hover:border-success/60 hover:text-success hover:bg-success/8 hover:shadow-[0_0_16px_rgba(34,197,94,0.2)] transition-all duration-200 whitespace-nowrap"
          >
            <UserPlus className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
            Add User
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCreateRole}
            className="group flex items-center gap-1.5 h-9 px-4 rounded-xl bg-bg-base border border-border text-xs font-bold text-content-secondary hover:border-accent/60 hover:text-accent hover:bg-accent/8 hover:shadow-[0_0_16px_rgba(139,92,246,0.2)] transition-all duration-200 whitespace-nowrap"
          >
            <ShieldPlus className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
            Create Role
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSave}
            className="group relative flex items-center gap-1.5 h-9 px-5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-xs font-black shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_28px_rgba(59,130,246,0.5)] transition-all duration-200 whitespace-nowrap overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <Save className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform relative z-10" />
            <span className="relative z-10">Save Changes</span>
          </motion.button>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="relative px-6 py-2 border-t border-border/30 bg-bg-base/20 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-success" />
          <span className="text-[10px] font-bold text-success">All systems operational</span>
        </div>
        <div className="h-3 w-px bg-border/50" />
        <span className="text-[10px] text-content-disabled">Last saved: 2 minutes ago</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] text-content-muted font-medium">Auto-save enabled</span>
        </div>
      </div>
    </motion.div>
  );
}
