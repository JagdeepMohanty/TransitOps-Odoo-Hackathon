import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Edit2, Trash2, Upload, Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';

const ROLES = [
  { value: 'administrator', label: 'Administrator' },
  { value: 'fleet_manager', label: 'Fleet Manager' },
  { value: 'dispatcher', label: 'Dispatcher' },
  { value: 'safety_officer', label: 'Safety Officer' },
  { value: 'financial_analyst', label: 'Financial Analyst' },
  { value: 'driver', label: 'Driver' },
];
const DEPARTMENTS = ['IT', 'Operations', 'Logistics', 'Transport', 'Safety', 'Finance', 'HR'];
const EMPTY = { name: '', email: '', phone: '', role: 'driver', department: 'Operations', status: 'active', password: '', confirm: '' };

function PasswordStrength({ password }) {
  if (!password) return null;
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(password)).length;
  const levels = [
    { label: 'Weak',   color: 'bg-danger',      text: 'text-danger'      },
    { label: 'Fair',   color: 'bg-warning',     text: 'text-warning'     },
    { label: 'Good',   color: 'bg-[#38BDF8]',   text: 'text-[#38BDF8]'  },
    { label: 'Strong', color: 'bg-success',     text: 'text-success'     },
  ];
  const lvl = levels[Math.max(0, score - 1)];
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? lvl.color : 'bg-border'}`} />
        ))}
      </div>
      <p className={`text-[10px] font-bold ${lvl.text}`}>{lvl.label} password</p>
    </div>
  );
}

const overlay = { hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } };
const panel   = { hidden: { opacity: 0, scale: 0.95, y: 16 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } }, exit: { opacity: 0, scale: 0.95, y: 16, transition: { duration: 0.15 } } };

export default function UserModal({ mode, user, onClose, onConfirm }) {
  const [form, setForm]     = useState(EMPTY);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (user && mode !== 'delete') setForm({ ...EMPTY, ...user, password: '', confirm: '' });
    else setForm(EMPTY);
  }, [user, mode]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <AnimatePresence>
      {mode && (
        <motion.div variants={overlay} initial="hidden" animate="show" exit="exit"
          className="modal-overlay" onClick={onClose}>
          <motion.div variants={panel} initial="hidden" animate="show" exit="exit"
            className={`modal-panel ${mode === 'delete' ? 'max-w-md' : 'max-w-lg w-full'}`}
            onClick={e => e.stopPropagation()}>

            {mode === 'delete' ? (
              <>
                <div className="modal-header">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-danger/10 border border-danger/20"><Trash2 className="w-4 h-4 text-danger" /></div>
                    <span className="modal-title">Delete User</span>
                  </div>
                  <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
                </div>
                <div className="modal-body">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-danger/10 border border-danger/20 mb-4">
                    <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-content-primary">This action cannot be undone</p>
                      <p className="text-xs text-content-muted mt-1">You are about to permanently delete <strong className="text-content-primary">{user?.name}</strong>. All their data, sessions and permissions will be removed.</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-bg-base/50 border border-border/40">
                    <p className="text-[10px] text-content-muted font-medium">User details</p>
                    <p className="text-sm font-bold text-content-primary mt-1">{user?.name}</p>
                    <p className="text-xs text-content-muted">{user?.email}</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button onClick={onClose} className="btn-secondary btn-sm">Cancel</button>
                  <button onClick={() => onConfirm(user)} className="btn-danger btn-sm">Delete User</button>
                </div>
              </>
            ) : (
              <>
                {/* Header */}
                <div className="modal-header">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${mode === 'edit' ? 'bg-primary/10 border-primary/20' : 'bg-success/10 border-success/20'}`}>
                      {mode === 'edit' ? <Edit2 className="w-4 h-4 text-primary" /> : <UserPlus className="w-4 h-4 text-success" />}
                    </div>
                    <div>
                      <span className="modal-title">{mode === 'edit' ? 'Edit User' : 'Add New User'}</span>
                      <p className="text-xs text-content-muted mt-0.5">{mode === 'edit' ? 'Update user information and access' : 'Create a new team member account'}</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
                </div>

                {/* Body */}
                <div className="modal-body space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Avatar */}
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-border/60 bg-bg-base/30 hover:border-primary/40 transition-colors">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(59,130,246,0.3)]">
                      <span className="text-lg font-black text-white">{form.name ? form.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'U'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-content-primary">Profile Photo</p>
                      <p className="text-xs text-content-muted mt-0.5">PNG, JPG up to 2MB · Auto-generated from name</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-border text-xs font-bold text-content-secondary hover:border-primary/50 hover:text-primary transition-all">
                      <Upload className="w-3.5 h-3.5" />Upload
                    </button>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="input-label">Full Name *</label><input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Arjun Sharma" className="input-field" /></div>
                    <div><label className="input-label">Email Address *</label><input value={form.email} onChange={e=>set('email',e.target.value)} type="email" placeholder="arjun@transitops.com" className="input-field" /></div>
                    <div><label className="input-label">Phone Number</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+91 98765 43210" className="input-field" /></div>
                    <div><label className="input-label">Department</label><select value={form.department} onChange={e=>set('department',e.target.value)} className="select-field">{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></div>
                    <div><label className="input-label">Role *</label><select value={form.role} onChange={e=>set('role',e.target.value)} className="select-field">{ROLES.map(r=><option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
                    <div><label className="input-label">Status</label><select value={form.status} onChange={e=>set('status',e.target.value)} className="select-field"><option value="active">Active</option><option value="inactive">Inactive</option><option value="pending">Pending</option><option value="suspended">Suspended</option></select></div>
                  </div>

                  {/* Password (add only) */}
                  {mode !== 'edit' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border/40">
                      <div>
                        <label className="input-label">Password *</label>
                        <div className="relative">
                          <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e=>set('password',e.target.value)} placeholder="••••••••" className="input-field pr-10" />
                          <button onClick={()=>setShowPw(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <PasswordStrength password={form.password} />
                      </div>
                      <div>
                        <label className="input-label">Confirm Password *</label>
                        <input type="password" value={form.confirm} onChange={e=>set('confirm',e.target.value)} placeholder="••••••••" className={`input-field ${form.confirm && form.confirm !== form.password ? 'border-danger focus:ring-danger' : ''}`} />
                        {form.confirm && form.confirm !== form.password && <p className="input-error mt-1">Passwords do not match</p>}
                        {form.confirm && form.confirm === form.password && form.confirm.length > 0 && (
                          <div className="flex items-center gap-1 mt-1.5"><CheckCircle2 className="w-3 h-3 text-success" /><span className="text-[10px] text-success font-bold">Passwords match</span></div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button onClick={onClose} className="btn-secondary btn-sm">Cancel</button>
                  <button onClick={()=>onConfirm(form)} disabled={mode !== 'edit' && form.confirm !== form.password}
                    className={`btn-sm ${mode === 'edit' ? 'btn-primary' : 'btn-success'} disabled:opacity-40 disabled:cursor-not-allowed`}>
                    {mode === 'edit' ? 'Save Changes' : 'Create User'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
