import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Edit2, Check, Info } from 'lucide-react';
import { PERMISSION_MATRIX } from '@utils/settingsMockData';

const COLORS = [
  { value: 'primary', label: 'Blue',   cls: 'bg-primary'   },
  { value: 'success', label: 'Green',  cls: 'bg-success'   },
  { value: 'warning', label: 'Amber',  cls: 'bg-warning'   },
  { value: 'danger',  label: 'Red',    cls: 'bg-danger'    },
  { value: 'accent',  label: 'Purple', cls: 'bg-accent'    },
  { value: 'info',    label: 'Cyan',   cls: 'bg-[#38BDF8]' },
];

const PERM_LABELS = ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'];

const MODULE_ICONS = {
  Dashboard:'📊', Vehicles:'🚛', Drivers:'👤', Trips:'🗺️',
  Maintenance:'🔧', Fuel:'⛽', Expenses:'💰', Reports:'📈', Settings:'⚙️',
};

const EMPTY_PERMS = () => Object.fromEntries(PERMISSION_MATRIX.modules.map(m => [m, [0,0,0,0,0,0]]));

const overlay = { hidden:{opacity:0}, show:{opacity:1}, exit:{opacity:0} };
const panel   = { hidden:{opacity:0,scale:0.95,y:16}, show:{opacity:1,scale:1,y:0,transition:{type:'spring',stiffness:300,damping:28}}, exit:{opacity:0,scale:0.95,y:16,transition:{duration:0.15}} };

export default function RoleModal({ mode, role, onClose, onConfirm }) {
  const [form, setForm] = useState({ name:'', description:'', color:'primary' });
  const [perms, setPerms] = useState(EMPTY_PERMS());

  useEffect(() => {
    if (role && mode === 'edit') setForm({ name: role.label, description: role.description || '', color: role.color || 'primary' });
    else { setForm({ name:'', description:'', color:'primary' }); setPerms(EMPTY_PERMS()); }
  }, [role, mode]);

  const togglePerm = (mod, idx) => setPerms(p => ({ ...p, [mod]: p[mod].map((v,i) => i===idx ? (v?0:1) : v) }));
  const toggleAll  = (mod) => { const allOn = perms[mod].every(Boolean); setPerms(p => ({ ...p, [mod]: p[mod].map(() => allOn?0:1) })); };
  const totalGranted = Object.values(perms).flat().filter(Boolean).length;
  const selectedColor = COLORS.find(c => c.value === form.color) || COLORS[0];

  return (
    <AnimatePresence>
      {mode && (
        <motion.div variants={overlay} initial="hidden" animate="show" exit="exit" className="modal-overlay" onClick={onClose}>
          <motion.div variants={panel} initial="hidden" animate="show" exit="exit" className="modal-panel max-w-2xl w-full" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="modal-header">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
                  {mode === 'edit' ? <Edit2 className="w-4 h-4 text-accent" /> : <Shield className="w-4 h-4 text-accent" />}
                </div>
                <div>
                  <span className="modal-title">{mode === 'edit' ? 'Edit Role' : 'Create New Role'}</span>
                  <p className="text-xs text-content-muted mt-0.5">{mode === 'edit' ? 'Update role details and permissions' : 'Define a new role with custom permissions'}</p>
                </div>
              </div>
              <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
            </div>

            {/* Body */}
            <div className="modal-body space-y-5 max-h-[72vh] overflow-y-auto">
              {/* Role info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Role Name *</label>
                  <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Fleet Supervisor" className="input-field" />
                </div>
                <div>
                  <label className="input-label">Badge Color</label>
                  <div className="flex gap-2 mt-1.5 items-center">
                    {COLORS.map(c => (
                      <button key={c.value} onClick={() => setForm(f=>({...f,color:c.value}))} title={c.label}
                        className={`w-7 h-7 rounded-lg ${c.cls} transition-all duration-200 ${form.color===c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-modal scale-110 shadow-md' : 'opacity-50 hover:opacity-80 hover:scale-105'}`} />
                    ))}
                    <span className="ml-1 text-xs font-bold text-content-secondary px-2 py-0.5 rounded-full border border-border bg-bg-base/50">{selectedColor.label}</span>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="input-label">Description</label>
                  <input value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="Brief description of this role's responsibilities" className="input-field" />
                </div>
              </div>

              {/* Permissions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-content-primary">Assign Permissions</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-content-muted">{totalGranted} permissions granted</span>
                    <span className="flex items-center gap-1 text-[10px] text-content-muted"><Info className="w-3 h-3" />Click row to toggle all</span>
                  </div>
                </div>
                <div className="rounded-xl border border-border/50 overflow-hidden">
                  <div className="grid bg-bg-base/70 border-b border-border/50" style={{gridTemplateColumns:'160px repeat(6,1fr)'}}>
                    <div className="px-4 py-2.5 text-[10px] font-black text-content-muted uppercase tracking-widest">Module</div>
                    {PERM_LABELS.map(l => <div key={l} className="px-2 py-2.5 text-[10px] font-black text-content-muted uppercase tracking-widest text-center">{l}</div>)}
                  </div>
                  {PERMISSION_MATRIX.modules.map((mod, mi) => (
                    <div key={mod} className={`grid items-center border-b border-border/25 last:border-0 hover:bg-bg-hover/20 transition-colors ${mi%2===1?'bg-bg-base/15':''}`} style={{gridTemplateColumns:'160px repeat(6,1fr)'}}>
                      <div className="px-4 py-3 flex items-center gap-2 cursor-pointer group" onClick={() => toggleAll(mod)}>
                        <span className="text-sm leading-none">{MODULE_ICONS[mod]}</span>
                        <span className="text-xs font-bold text-content-primary group-hover:text-primary transition-colors">{mod}</span>
                      </div>
                      {PERM_LABELS.map((_,idx) => (
                        <div key={idx} className="flex items-center justify-center py-3">
                          <motion.button whileHover={{scale:1.15}} whileTap={{scale:0.9}} onClick={() => togglePerm(mod,idx)}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${perms[mod][idx] ? 'bg-primary border-primary shadow-[0_0_8px_rgba(59,130,246,0.4)]' : 'bg-transparent border-border hover:border-primary/50'}`}>
                            {perms[mod][idx] ? <Check className="w-3 h-3 text-white" /> : null}
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button onClick={onClose} className="btn-secondary btn-sm">Cancel</button>
              <button onClick={() => onConfirm({...form,perms})} disabled={!form.name.trim()} className="btn-primary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">
                {mode === 'edit' ? 'Save Role' : 'Create Role'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
