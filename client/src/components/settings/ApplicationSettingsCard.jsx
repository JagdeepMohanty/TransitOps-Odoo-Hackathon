import { useState } from 'react';
import { Building2, Upload, Globe, Clock, DollarSign, Palette, Phone, Mail } from 'lucide-react';

const TIMEZONES = ['Asia/Kolkata (IST)', 'UTC', 'America/New_York (EST)', 'Europe/London (GMT)', 'Asia/Dubai (GST)'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi'];
const CURRENCIES = ['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)'];
const THEMES     = ['Dark', 'Light', 'System'];

export default function ApplicationSettingsCard() {
  const [form, setForm] = useState({
    orgName:  'TransitOps Logistics Pvt. Ltd.',
    email:    'admin@transitops.com',
    phone:    '+91 98765 43210',
    timezone: 'Asia/Kolkata (IST)',
    language: 'English',
    currency: 'INR (₹)',
    theme:    'Dark',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
        <div className="p-2 rounded-xl bg-primary/10">
          <Building2 className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-content-primary">Company Information</h3>
          <p className="text-xs text-content-muted">Organization profile and regional preferences</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Logo Upload */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-border/60 bg-bg-base/40 hover:border-primary/40 transition-colors group cursor-pointer">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-glow-sm">
            <span className="text-lg font-black text-white">TO</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-content-primary">Company Logo</p>
            <p className="text-xs text-content-muted mt-0.5">PNG, JPG up to 2MB · Recommended 256×256</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-border text-xs text-content-secondary hover:border-primary/50 hover:text-primary transition-all">
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
        </div>

        {/* Fields grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="input-label flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />Organization Name</label>
            <input value={form.orgName} onChange={e => set('orgName', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="input-label flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />Email Address</label>
            <input value={form.email} onChange={e => set('email', e.target.value)} type="email" className="input-field" />
          </div>
          <div>
            <label className="input-label flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />Phone Number</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="input-label flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Timezone</label>
            <select value={form.timezone} onChange={e => set('timezone', e.target.value)} className="select-field">
              {TIMEZONES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />Language</label>
            <select value={form.language} onChange={e => set('language', e.target.value)} className="select-field">
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" />Currency</label>
            <select value={form.currency} onChange={e => set('currency', e.target.value)} className="select-field">
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" />Theme</label>
            <div className="flex gap-2 mt-1">
              {THEMES.map(t => (
                <button
                  key={t}
                  onClick={() => set('theme', t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                    form.theme === t
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'bg-bg-base border-border text-content-muted hover:border-border-strong'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
