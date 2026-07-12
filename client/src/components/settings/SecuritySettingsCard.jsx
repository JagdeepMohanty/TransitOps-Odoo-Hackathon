import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Smartphone, Clock, Activity, Monitor, Key, Trash2, Eye, EyeOff, Copy, Plus, CheckCircle2, Wifi, AlertTriangle } from 'lucide-react';
import { API_KEYS, ACTIVE_SESSIONS } from '@utils/settingsMockData';

function Toggle({ checked, onChange, color = 'bg-primary' }) {
  return (
    <button onClick={() => onChange(!checked)} style={{ height: '22px', width: '40px' }}
      className={`relative rounded-full transition-all duration-300 focus:outline-none shrink-0 ${checked ? color : 'bg-border'}`}>
      <motion.span animate={{ x: checked ? 18 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 left-0 w-4 h-4 rounded-full bg-white shadow-sm" />
    </button>
  );
}

function SectionCard({ icon: Icon, iconColor, title, children }) {
  return (
    <div className="p-5 rounded-xl border border-border/50 bg-bg-base/30 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-sm font-bold text-content-primary">{title}</span>
      </div>
      {children}
    </div>
  );
}

function PasswordSection() {
  const [show, setShow] = useState({ cur: false, new: false, conf: false });
  const [saved, setSaved] = useState(false);
  return (
    <SectionCard icon={Lock} iconColor="text-primary" title="Change Password">
      {[{ key: 'cur', label: 'Current Password' }, { key: 'new', label: 'New Password' }, { key: 'conf', label: 'Confirm Password' }].map(({ key, label }) => (
        <div key={key}>
          <label className="text-xs font-bold text-content-secondary mb-1 block">{label}</label>
          <div className="relative">
            <input type={show[key] ? 'text' : 'password'} placeholder="••••••••••••" className="input-field pr-10 text-sm" />
            <button onClick={() => setShow(s => ({ ...s, [key]: !s[key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors">
              {show[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ))}
      <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
        className={`w-full py-2 rounded-xl text-xs font-bold transition-all duration-300 ${saved ? 'bg-success/10 border border-success/30 text-success' : 'bg-primary text-white hover:bg-primary-hover shadow-[0_0_12px_rgba(59,130,246,0.3)]'}`}>
        {saved ? '✓ Password Updated' : 'Update Password'}
      </button>
    </SectionCard>
  );
}

function TwoFactorSection() {
  const [enabled, setEnabled] = useState(false);
  return (
    <SectionCard icon={Smartphone} iconColor="text-accent" title="Two-Factor Authentication">
      <div className="flex items-center justify-between p-3 rounded-lg bg-bg-card/50 border border-border/40">
        <div>
          <p className="text-xs font-bold text-content-primary">Authenticator App</p>
          <p className="text-[10px] text-content-muted mt-0.5">Google Authenticator or Authy</p>
        </div>
        <Toggle checked={enabled} onChange={setEnabled} color="bg-accent" />
      </div>
      <motion.div animate={{ opacity: 1 }} className={`flex items-center gap-2 p-3 rounded-lg border ${enabled ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'}`}>
        {enabled ? <CheckCircle2 className="w-4 h-4 text-success shrink-0" /> : <AlertTriangle className="w-4 h-4 text-warning shrink-0" />}
        <span className={`text-xs font-semibold ${enabled ? 'text-success' : 'text-warning'}`}>
          {enabled ? '2FA is enabled — your account is protected' : 'Enable 2FA to improve your security score'}
        </span>
      </motion.div>
    </SectionCard>
  );
}

function SessionSection() {
  const [timeout, setTimeoutVal] = useState('30');
  return (
    <SectionCard icon={Clock} iconColor="text-warning" title="Session Timeout">
      <div className="flex items-center gap-3">
        <select value={timeout} onChange={e => setTimeoutVal(e.target.value)} className="select-field flex-1 text-sm">
          {['15','30','60','120','240'].map(v => <option key={v} value={v}>{v} minutes</option>)}
        </select>
        <span className="text-xs text-content-muted whitespace-nowrap">of inactivity</span>
      </div>
      <p className="text-[10px] text-content-disabled">Users will be automatically logged out after the selected period.</p>
    </SectionCard>
  );
}

function ActiveSessionsSection() {
  return (
    <SectionCard icon={Wifi} iconColor="text-[#38BDF8]" title="Active Sessions">
      <div className="space-y-2">
        {ACTIVE_SESSIONS.map(s => (
          <div key={s.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${s.current ? 'border-primary/30 bg-primary/5' : 'border-border/40 hover:bg-bg-hover/30'}`}>
            <Monitor className={`w-4 h-4 shrink-0 ${s.current ? 'text-primary' : 'text-content-muted'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-content-primary truncate">{s.device}</p>
              <p className="text-[10px] text-content-muted">{s.location} · {s.ip}</p>
            </div>
            {s.current
              ? <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Current</span>
              : <button className="text-[10px] text-danger hover:underline font-bold">{s.time}</button>}
          </div>
        ))}
      </div>
      <button className="w-full py-2 rounded-xl border border-danger/30 text-xs font-bold text-danger hover:bg-danger/10 transition-colors">
        Revoke All Other Sessions
      </button>
    </SectionCard>
  );
}

function ApiKeysSection() {
  const [copied, setCopied] = useState(null);
  const handleCopy = id => { setCopied(id); setTimeout(() => setCopied(null), 1500); };
  return (
    <SectionCard icon={Key} iconColor="text-warning" title="API Keys">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] text-content-muted">Manage your API access tokens</p>
        <button className="flex items-center gap-1 text-[10px] font-black text-primary hover:underline"><Plus className="w-3 h-3" />New Key</button>
      </div>
      <div className="space-y-2">
        {API_KEYS.map(k => (
          <div key={k.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/40 hover:bg-bg-hover/30 transition-colors group">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-content-primary">{k.name}</p>
              <p className="text-[10px] font-mono text-content-muted mt-0.5 truncate">{k.key}</p>
              <p className="text-[10px] text-content-disabled mt-0.5">Last used: {k.lastUsed}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-black ${k.status === 'active' ? 'bg-success/10 text-success border-success/30' : 'bg-border/20 text-content-muted border-border'}`}>{k.status}</span>
              <button onClick={() => handleCopy(k.id)} className="p-1.5 rounded-lg text-content-muted hover:text-primary hover:bg-primary/10 transition-all">
                {copied === k.id ? <CheckCircle2 className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button className="p-1.5 rounded-lg text-content-muted hover:text-danger hover:bg-danger/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export default function SecuritySettingsCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}
      className="bg-bg-card/90 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      <div className="relative flex items-center gap-3 px-6 py-4 border-b border-border/50 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-danger/60 via-danger/30 to-transparent" />
        <div className="p-2 rounded-xl bg-danger/10 border border-danger/20"><ShieldCheck className="w-4 h-4 text-danger" /></div>
        <div><h3 className="text-sm font-bold text-content-primary">Security Settings</h3><p className="text-xs text-content-muted">Password, 2FA, sessions and API access</p></div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 border border-success/20">
          <Activity className="w-3 h-3 text-success" />
          <span className="text-[10px] font-black text-success">Score: 92%</span>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PasswordSection />
        <TwoFactorSection />
        <SessionSection />
        <ActiveSessionsSection />
        <div className="lg:col-span-2"><ApiKeysSection /></div>
      </div>
    </motion.div>
  );
}
