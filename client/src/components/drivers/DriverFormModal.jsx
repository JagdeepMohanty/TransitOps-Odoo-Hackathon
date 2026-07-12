import { useState } from 'react';
import { X, Save, Upload, User } from 'lucide-react';

const LICENSE_CATEGORIES = ['HMV', 'LMV', 'MCWG', 'TRANS', 'HTV'];
const STATUS_OPTIONS = ['available', 'off_duty', 'suspended'];

function Field({ label, required, children, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-content-secondary">
        {label}{required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-danger">{error}</p>}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-xl text-xs bg-bg-secondary border border-border text-content-primary placeholder:text-content-disabled focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus transition-all duration-200";

export default function DriverFormModal({ mode = 'add', driver = null, onClose, onSave }) {
  const [form, setForm] = useState({
    name:              driver?.name              ?? '',
    email:             driver?.email             ?? '',
    phone:             driver?.phone             ?? '',
    license:           driver?.license           ?? '',
    licenseCategory:   driver?.licenseCategory   ?? 'HMV',
    licenseExpiry:     driver?.licenseExpiry      ?? '',
    safetyScore:       driver?.safetyScore        ?? 90,
    status:            driver?.status             ?? 'available',
    address:           driver?.address            ?? '',
    emergencyContact:  driver?.emergencyContact   ?? '',
    notes:             driver?.notes              ?? '',
  });
  const [errors, setErrors] = useState({});

  function set(k, v) {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    if (!form.phone.trim())   e.phone   = 'Phone is required';
    if (!form.license.trim()) e.license = 'License number is required';
    if (!form.licenseExpiry)  e.licenseExpiry = 'Expiry date is required';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
    onClose();
  }

  const title = mode === 'add' ? 'Add New Driver' : 'Edit Driver';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      <div className="bg-bg-card border border-border rounded-[20px] shadow-modal w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-sm font-bold text-content-primary">{title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-secondary text-content-muted hover:text-content-primary hover:bg-bg-hover transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar-hide px-6 py-5 space-y-4">

          {/* Photo upload placeholder */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-secondary border border-dashed border-border hover:border-border-strong transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-bg-hover flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5 text-content-muted" />
            </div>
            <div>
              <p className="text-xs font-semibold text-content-secondary">Upload Profile Photo</p>
              <p className="text-[11px] text-content-muted mt-0.5">PNG, JPG up to 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Full Name" required error={errors.name}>
                <input className={inputCls} placeholder="Ravi Kumar" value={form.name} onChange={e => set('name', e.target.value)} />
              </Field>
            </div>
            <Field label="Email" required error={errors.email}>
              <input className={inputCls} type="email" placeholder="driver@transitops.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </Field>
            <Field label="Phone" required error={errors.phone}>
              <input className={inputCls} placeholder="+91-98765-43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </Field>
            <Field label="License Number" required error={errors.license}>
              <input className={inputCls} placeholder="KA-DL-2019-001234" value={form.license} onChange={e => set('license', e.target.value)} />
            </Field>
            <Field label="License Category">
              <select className={inputCls} value={form.licenseCategory} onChange={e => set('licenseCategory', e.target.value)}>
                {LICENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="License Expiry" required error={errors.licenseExpiry}>
              <input className={inputCls} type="date" value={form.licenseExpiry} onChange={e => set('licenseExpiry', e.target.value)} />
            </Field>
            <Field label="Safety Score">
              <div className="flex items-center gap-3">
                <input
                  type="range" min="0" max="100" value={form.safetyScore}
                  onChange={e => set('safetyScore', Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="text-xs font-bold text-content-primary w-8 text-right">{form.safetyScore}</span>
              </div>
            </Field>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </Field>
            <div className="col-span-2">
              <Field label="Address">
                <input className={inputCls} placeholder="Street, City, State PIN" value={form.address} onChange={e => set('address', e.target.value)} />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Emergency Contact">
                <input className={inputCls} placeholder="Name — +91-XXXXX-XXXXX" value={form.emergencyContact} onChange={e => set('emergencyContact', e.target.value)} />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Notes">
                <textarea
                  className={`${inputCls} resize-none`} rows={3}
                  placeholder="Additional notes about this driver..."
                  value={form.notes} onChange={e => set('notes', e.target.value)}
                />
              </Field>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-content-muted bg-bg-secondary border border-border hover:text-content-primary hover:bg-bg-hover transition-all">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-all shadow-glow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            {mode === 'add' ? 'Add Driver' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
