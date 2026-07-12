import { useState } from 'react';
import {
  ShieldCheck, Lock, Smartphone, Clock, Activity,
  Monitor, Key, Trash2, Eye, EyeOff, Copy, Plus,
  CheckCircle2, AlertTriangle, Wifi,
} from 'lucide-react';
import { API_KEYS, ACTIVE_SESSIONS } from '@utils/settingsMockData';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-all duration-300 focus:outline-none ${checked ? 'bg-primary' : 'bg-border'}`}
      style={{ height: '22px', width: '40px' }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`}
      />
    </button>
  );
}

function PasswordSection() {
  const [show, setShow] = useState({ cur: false, new: false, conf: false });
  return (
    <div className="p-5 rounded-xl border border-border/50 bg-bg-base/30 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Lock className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-content-primary">Change Password</span>
      </div>
      {[
        { key: 'cur',  label: 'Current Password'  },
        { key: 'new',  label: 'New Password'       },
        { key: 'conf', label: 'Confirm Password'   },
      ].map(({ key, label }) => (
        <div key={key}>
          <label className="input-label">{label}</label>
          <div className="relative">
            <input
              type={show[key] ? 'text' : 'password'}
              placeholder="••••••••••••"
              className="input-field pr-10"
            />
            <button
              onClick={() => setShow(s => ({ ...s, [key]: !s[key] }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors"
            >
              {show[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ))}
      <button className="btn-primary btn-sm mt-1 w-full">Update Password</button>
    </div>
  );
}

function TwoFactorSection() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="p-5 rounded-xl border border-border/50 bg-bg-base/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-accent" />
          <div>
            <p className="text-sm font-semibold text-content-primary">Two-Factor Authentication</p>
            <p className="text-xs text-content-muted mt-0.5">Add an extra layer of security</p>
          </div>
        </div>
        <Toggle checked={enabled} onChange={setEnabled} />
      </div>
      {enabled && (
        <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          <span className="text-xs text-success font-medium">2FA is enabled via Authenticator App</span>
        </div>
      )}
    </div>
  );
}

function SessionSection() {
  const [timeout, setTimeout_] = useState('30');
  return (
    <div className="p-5 rounded-xl border border-border/50 bg-bg-base/30">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-warning" />
        <span className="text-sm font-semibold text-content-primary">Session Timeout</span>
      </div>
      <div className="flex items-center gap-3">
        <select
          value={timeout}
          onChange={e => setTimeout_(e.target.value)}
          className="select-field flex-1"
        >
          {['15','30','60','120','240'].map(v => (
            <option key={v} value={v}>{v} minutes</option>
          ))}
        </select>
        <span className="text-xs text-content-muted whitespace-nowrap">of inactivity</span>
      </div>
    </div>
  );
}

function ActiveSessionsSection() {
  return (
    <div className="p-5 rounded-xl border border-border/50 bg-bg-base/30">
      <div className="flex items-center gap-2 mb-3">
        <Wifi className="w-4 h-4 text-[#38BDF8]" />
        <span className="text-sm font-semibold text-content-primary">Active Sessions</span>
        <span className="ml-auto text-[10px] text-content-muted">{ACTIVE_SESSIONS.length} sessions</span>
      </div>
      <div className="space-y-2">
        {ACTIVE_SESSIONS.map(s => (
          <div key={s.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${s.current ? 'border-primary/30 bg-primary/5' : 'border-border/40 hover:bg-bg-hover/40'}`}>
            <Monitor className={`w-4 h-4 shrink-0 ${s.current ? 'text-primary' : 'text-content-muted'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-content-primary truncate">{s.device}</p>
              <p className="text-[10px] text-content-muted">{s.location} · {s.ip}</p>
            </div>
            <div className="text-right shrink-0">
              {s.current
                ? <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Current</span>
                : <button className="text-[10px] text-danger hover:underline">{s.time}</button>
              }
            </div>
          </div>
        ))}
      </div>
      <button className="mt-3 w-full py-2 rounded-lg border border-danger/30 text-xs text-danger hover:bg-danger/10 transition-colors font-semibold">
        Revoke All Other Sessions
      </button>
    </div>
  );
}

function ApiKeysSection() {
  const [copied, setCopied] = useState(null);
  const handleCopy = id => {
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };
  return (
    <div className="p-5 rounded-xl border border-border/50 bg-bg-base/30">
      <div className="flex items-center gap-2 mb-3">
        <Key className="w-4 h-4 text-warning" />
        <span className="text-sm font-semibold text-content-primary">API Keys</span>
        <button className="ml-auto flex items-center gap-1 text-[10px] text-primary hover:underline">
          <Plus className="w-3 h-3" /> New Key
        </button>
      </div>
      <div className="space-y-2">
        {API_KEYS.map(k => (
          <div key={k.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/40 hover:bg-bg-hover/40 transition-colors group">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-content-primary">{k.name}</p>
              <p className="text-[10px] font-mono text-content-muted mt-0.5">{k.key}</p>
              <p className="text-[10px] text-content-disabled mt-0.5">Last used: {k.lastUsed}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${k.status === 'active' ? 'bg-success/10 text-success border-success/30' : 'bg-border/20 text-content-muted border-border'}`}>
                {k.status}
              </span>
              <button
                onClick={() => handleCopy(k.id)}
                className="p-1.5 rounded-lg text-content-muted hover:text-primary hover:bg-primary/10 transition-all"
                title="Copy key"
              >
                {copied === k.id ? <CheckCircle2 className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button className="p-1.5 rounded-lg text-content-muted hover:text-danger hover:bg-danger/10 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SecuritySettingsCard() {
  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
        <div className="p-2 rounded-xl bg-danger/10">
          <ShieldCheck className="w-4 h-4 text-danger" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-content-primary">Security Settings</h3>
          <p className="text-xs text-content-muted">Password, 2FA, sessions and API access</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20">
          <Activity className="w-3 h-3 text-success" />
          <span className="text-[10px] font-semibold text-success">Score: 87%</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PasswordSection />
        <TwoFactorSection />
        <SessionSection />
        <ActiveSessionsSection />
        <div className="lg:col-span-2">
          <ApiKeysSection />
        </div>
      </div>
    </div>
  );
}
