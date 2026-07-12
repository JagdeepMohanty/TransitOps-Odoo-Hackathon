import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Upload, Globe, Clock, DollarSign, Palette, Phone, Mail, CheckCircle2 } from 'lucide-react';

const TIMEZONES = ['Asia/Kolkata (IST)', 'UTC', 'America/New_York (EST)', 'Europe/London (GMT)', 'Asia/Dubai (GST)'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi'];
const CURRENCIES = ['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)'];
const THEMES = [{ value: 'Dark', icon: '🌙' }, { value: 'Light', icon: '☀️' }, { value: 'System', icon: '💻' }];

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold text-content-secondary mb-1.5">
        <Icon className="w-3.5 h-3.5 text-content-muted" />{label}
      </label>
      {children}
    </div>
  );
}

export default function ApplicationSettingsCard() {
  const [form, setForm] = useState({ orgName: 'TransitOps Logistics Pvt. Ltd.', email: 'admin@transitops.com', phone: '+91 98765 43210', timezone: 'Asia/Kolkata (IST)', language: 'English', currency: 'INR (₹)', theme: 'Dark' });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-bg-card/90 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      <div className="relative flex items-center gap-3 px-6 py-4 border-b border-border/50 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20"><Building2 className="w-4 h-4 text-primary" /></div>
        <div><h3 className="text-sm font-bold text-content-primary">Company Information</h3><p className="text-xs text-content-muted">Organization profile and regional preferences</p></div>
      </div>
      <div className="p-6 space-y-5">
        {/* Logo Upload */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-border/60 bg-bg-base/30 hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-200 group cursor-pointer">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform duration-200">
            <span className="text-lg font-black text-white">TO</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-content-primary">Company Logo</p>
            <p className="text-xs text-content-muted mt-0.5">PNG, JPG up to 2MB · Recommended 256×256px</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-border text-xs font-bold text-content-secondary hover:border-primary/50 hover:text-primary transition-all">
            <Upload className="w-3.5 h-3.5" />Upload
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field icon={Building2} label="Organization Name">
              <input value={form.orgName} onChange={e => set('orgName', e.target.value)} className="input-field text-sm" />
            </Field>
          </div>
          <Field icon={Mail} label="Email Address">
            <input value={form.email} onChange={e => set('email', e.target.value)} type="email" className="input-field text-sm" />
          </Field>
          <Field icon={Phone} label="Phone Number">
            <input value={form.phone} onChange={e => set('phone', e.target.value)} className="input-field text-sm" />
          </Field>
          <Field icon={Clock} label="Timezone">
            <select value={form.timezone} onChange={e => set('timezone', e.target.value)} className="select-field text-sm">
              {TIMEZONES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field icon={Globe} label="Language">
            <select value={form.language} onChange={e => set('language', e.target.value)} className="select-field text-sm">
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field icon={DollarSign} label="Currency">
            <select value={form.currency} onChange={e => set('currency', e.target.value)} className="select-field text-sm">
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field icon={Palette} label="Theme">
            <div className="flex gap-2 mt-0.5">
              {THEMES.map(t => (
                <button key={t.value} onClick={() => set('theme', t.value)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${form.theme === t.value ? 'bg-primary/10 border-primary/40 text-primary shadow-[0_0_12px_rgba(59,130,246,0.2)]' : 'bg-bg-base border-border text-content-muted hover:border-border-strong hover:text-content-secondary'}`}>
                  <span>{t.icon}</span>{t.value}
                </button>
              ))}
            </div>
          </Field>
        </div>
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${saved ? 'bg-success/10 border border-success/30 text-success' : 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_28px_rgba(59,130,246,0.45)]'}`}>
          {saved ? <><CheckCircle2 className="w-4 h-4" />Saved Successfully</> : 'Save Company Settings'}
        </motion.button>
      </div>
    </motion.div>
  );
}
