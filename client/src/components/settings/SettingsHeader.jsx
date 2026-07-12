import { Settings, UserPlus, ShieldPlus, Save } from 'lucide-react';

export default function SettingsHeader({ onAddUser, onCreateRole, onSave }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">

      {/* Left: Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-glow-sm shrink-0">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-content-primary tracking-tight leading-tight">
            Settings &amp; Role Management
          </h1>
          <p className="text-xs text-content-muted mt-0.5 truncate">
            Manage application preferences, users, roles, permissions, and security.
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
          onClick={onAddUser}
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-bg-card border border-border text-xs text-content-secondary hover:border-success/50 hover:text-success transition-all duration-200 whitespace-nowrap"
        >
          <UserPlus className="w-3.5 h-3.5 shrink-0" />
          <span>Add User</span>
        </button>

        <button
          onClick={onCreateRole}
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-bg-card border border-border text-xs text-content-secondary hover:border-accent/50 hover:text-accent transition-all duration-200 whitespace-nowrap"
        >
          <ShieldPlus className="w-3.5 h-3.5 shrink-0" />
          <span>Create Role</span>
        </button>

        <button
          onClick={onSave}
          className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-glow-sm transition-all duration-200 whitespace-nowrap"
        >
          <Save className="w-3.5 h-3.5 shrink-0" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
