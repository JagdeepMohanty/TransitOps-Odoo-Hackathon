import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Smartphone, Wrench, Route, Fuel, DollarSign, BarChart3, Calendar, CheckCircle2 } from 'lucide-react';

function Toggle({ checked, onChange, color = 'bg-primary' }) {
  return (
    <button onClick={() => onChange(!checked)} style={{ height: '22px', width: '40px' }}
      className={`relative rounded-full transition-all duration-300 focus:outline-none shrink-0 ${checked ? color : 'bg-border'} ${checked ? 'shadow-[0_0_8px_rgba(59,130,246,0.4)]' : ''}`}>
      <motion.span animate={{ x: checked ? 18 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 left-0 w-4 h-4 rounded-full bg-white shadow-sm" />
    </button>
  );
}

const EMAIL_PREFS = [
  { key: 'maintenance',   label: 'Maintenance Alerts', desc: 'Scheduled & overdue maintenance',  icon: Wrench,     color: 'bg-warning',   iconColor: 'text-warning'   },
  { key: 'trip',          label: 'Trip Alerts',         desc: 'Trip start, complete & delays',   icon: Route,      color: 'bg-primary',   iconColor: 'text-primary'   },
  { key: 'fuel',          label: 'Fuel Alerts',         desc: 'Low fuel & refill notifications', icon: Fuel,       color: 'bg-[#38BDF8]', iconColor: 'text-[#38BDF8]' },
  { key: 'expense',       label: 'Expense Alerts',      desc: 'Budget exceeded & new expenses',  icon: DollarSign, color: 'bg-success',   iconColor: 'text-success'   },
  { key: 'weeklyReport',  label: 'Weekly Reports',      desc: 'Fleet summary every Monday',      icon: BarChart3,  color: 'bg-accent',    iconColor: 'text-accent'    },
  { key: 'monthlyReport', label: 'Monthly Reports',     desc: 'Full analytics on 1st of month',  icon: Calendar,   color: 'bg-danger',    iconColor: 'text-danger'    },
];

const PUSH_PREFS = [
  { key: 'pushMaintenance', label: 'Maintenance Reminders', icon: Wrench,     color: 'bg-warning',   iconColor: 'text-warning'   },
  { key: 'pushTrip',        label: 'Trip Updates',          icon: Route,      color: 'bg-primary',   iconColor: 'text-primary'   },
  { key: 'pushFuel',        label: 'Fuel Warnings',         icon: Fuel,       color: 'bg-[#38BDF8]', iconColor: 'text-[#38BDF8]' },
  { key: 'pushExpense',     label: 'Expense Approvals',     icon: DollarSign, color: 'bg-success',   iconColor: 'text-success'   },
];

const DIGEST_OPTIONS = ['Instant', 'Hourly', 'Daily'];

export default function NotificationSettingsCard() {
  const [prefs, setPrefs] = useState({ emailEnabled: true, pushEnabled: true, maintenance: true, trip: true, fuel: false, expense: true, weeklyReport: true, monthlyReport: false, pushMaintenance: true, pushTrip: true, pushFuel: false, pushExpense: false });
  const [digest, setDigest] = useState('Instant');
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setPrefs(p => ({ ...p, [k]: v }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-bg-card/90 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      <div className="relative flex items-center gap-3 px-6 py-4 border-b border-border/50 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent/60 via-accent/30 to-transparent" />
        <div className="p-2 rounded-xl bg-accent/10 border border-accent/20"><Bell className="w-4 h-4 text-accent" /></div>
        <div><h3 className="text-sm font-bold text-content-primary">Notification Preferences</h3><p className="text-xs text-content-muted">Control how and when you receive alerts</p></div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={handleSave}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${saved ? 'bg-success/10 border border-success/30 text-success' : 'bg-bg-base border border-border text-content-secondary hover:border-primary/40 hover:text-primary'}`}>
          {saved ? <><CheckCircle2 className="w-3.5 h-3.5" />Saved</> : 'Save Preferences'}
        </motion.button>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-base/50 border border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/10"><Mail className="w-3.5 h-3.5 text-primary" /></div>
              <div><p className="text-sm font-bold text-content-primary">Email Notifications</p><p className="text-[10px] text-content-muted">Receive alerts via email</p></div>
            </div>
            <Toggle checked={prefs.emailEnabled} onChange={v => set('emailEnabled', v)} />
          </div>
          <div className={`space-y-2 transition-all duration-300 ${prefs.emailEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {EMAIL_PREFS.map(({ key, label, desc, icon: Icon, color, iconColor }) => (
              <motion.div key={key} whileHover={{ x: 2 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/30 hover:bg-bg-hover/20 hover:border-border/60 transition-all group">
                <div className={`p-1.5 rounded-lg ${color}/10 shrink-0`}><Icon className={`w-3.5 h-3.5 ${iconColor}`} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-content-primary">{label}</p>
                  <p className="text-[10px] text-content-muted">{desc}</p>
                </div>
                <Toggle checked={prefs[key]} onChange={v => set(key, v)} color={color} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Push */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-base/50 border border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-accent/10"><Smartphone className="w-3.5 h-3.5 text-accent" /></div>
              <div><p className="text-sm font-bold text-content-primary">Push Notifications</p><p className="text-[10px] text-content-muted">Receive alerts on your device</p></div>
            </div>
            <Toggle checked={prefs.pushEnabled} onChange={v => set('pushEnabled', v)} color="bg-accent" />
          </div>
          <div className={`space-y-2 transition-all duration-300 ${prefs.pushEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {PUSH_PREFS.map(({ key, label, icon: Icon, color, iconColor }) => (
              <motion.div key={key} whileHover={{ x: 2 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/30 hover:bg-bg-hover/20 hover:border-border/60 transition-all">
                <div className={`p-1.5 rounded-lg ${color}/10 shrink-0`}><Icon className={`w-3.5 h-3.5 ${iconColor}`} /></div>
                <p className="flex-1 text-xs font-bold text-content-primary">{label}</p>
                <Toggle checked={prefs[key]} onChange={v => set(key, v)} color={color} />
              </motion.div>
            ))}
          </div>
          <div className="p-4 rounded-xl border border-accent/20 bg-accent/5">
            <p className="text-xs font-black text-accent mb-1">Notification Digest</p>
            <p className="text-[10px] text-content-muted mb-3">Receive a summary instead of individual alerts</p>
            <div className="flex gap-2">
              {DIGEST_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setDigest(opt)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-black border transition-all duration-200 ${digest === opt ? 'bg-accent/15 border-accent/40 text-accent shadow-[0_0_8px_rgba(139,92,246,0.2)]' : 'bg-bg-base border-border text-content-muted hover:border-border-strong hover:text-content-secondary'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
