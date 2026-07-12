import { useState } from 'react';
import { Bell, Mail, Smartphone, Wrench, Route, Fuel, DollarSign, BarChart3, Calendar } from 'lucide-react';

function Toggle({ checked, onChange, color = 'bg-primary' }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative rounded-full transition-all duration-300 focus:outline-none shrink-0 ${checked ? color : 'bg-border'}`}
      style={{ height: '22px', width: '40px' }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`}
      />
    </button>
  );
}

const EMAIL_PREFS = [
  { key: 'maintenance', label: 'Maintenance Alerts',  desc: 'Scheduled & overdue maintenance',  icon: Wrench,    color: 'bg-warning' },
  { key: 'trip',        label: 'Trip Alerts',          desc: 'Trip start, complete & delays',    icon: Route,     color: 'bg-primary' },
  { key: 'fuel',        label: 'Fuel Alerts',          desc: 'Low fuel & refill notifications',  icon: Fuel,      color: 'bg-[#38BDF8]' },
  { key: 'expense',     label: 'Expense Alerts',       desc: 'Budget exceeded & new expenses',   icon: DollarSign,color: 'bg-success' },
  { key: 'weeklyReport',label: 'Weekly Reports',       desc: 'Fleet summary every Monday',       icon: BarChart3, color: 'bg-accent' },
  { key: 'monthlyReport',label:'Monthly Reports',      desc: 'Full analytics on 1st of month',   icon: Calendar,  color: 'bg-danger' },
];

const PUSH_PREFS = [
  { key: 'pushMaintenance', label: 'Maintenance Reminders', icon: Wrench,     color: 'bg-warning' },
  { key: 'pushTrip',        label: 'Trip Updates',          icon: Route,      color: 'bg-primary' },
  { key: 'pushFuel',        label: 'Fuel Warnings',         icon: Fuel,       color: 'bg-[#38BDF8]' },
  { key: 'pushExpense',     label: 'Expense Approvals',     icon: DollarSign, color: 'bg-success' },
];

export default function NotificationSettingsCard() {
  const [prefs, setPrefs] = useState({
    emailEnabled:   true,
    pushEnabled:    true,
    maintenance:    true,
    trip:           true,
    fuel:           false,
    expense:        true,
    weeklyReport:   true,
    monthlyReport:  false,
    pushMaintenance:true,
    pushTrip:       true,
    pushFuel:       false,
    pushExpense:    false,
  });

  const set = (k, v) => setPrefs(p => ({ ...p, [k]: v }));

  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
        <div className="p-2 rounded-xl bg-accent/10">
          <Bell className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-content-primary">Notification Preferences</h3>
          <p className="text-xs text-content-muted">Control how and when you receive alerts</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Email Notifications */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-bg-base/50 border border-border/40">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-content-primary">Email Notifications</span>
            </div>
            <Toggle checked={prefs.emailEnabled} onChange={v => set('emailEnabled', v)} />
          </div>

          <div className={`space-y-2 transition-opacity duration-300 ${prefs.emailEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {EMAIL_PREFS.map(({ key, label, desc, icon: Icon, color }) => (
              <div key={key} className="flex items-center gap-3 p-3 rounded-xl border border-border/30 hover:bg-bg-hover/30 transition-colors group">
                <div className={`p-1.5 rounded-lg ${color}/10`}>
                  <Icon className={`w-3.5 h-3.5 text-content-secondary`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-content-primary">{label}</p>
                  <p className="text-[10px] text-content-muted">{desc}</p>
                </div>
                <Toggle checked={prefs[key]} onChange={v => set(key, v)} color={color} />
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-bg-base/50 border border-border/40">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-content-primary">Push Notifications</span>
            </div>
            <Toggle checked={prefs.pushEnabled} onChange={v => set('pushEnabled', v)} color="bg-accent" />
          </div>

          <div className={`space-y-2 transition-opacity duration-300 ${prefs.pushEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {PUSH_PREFS.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="flex items-center gap-3 p-3 rounded-xl border border-border/30 hover:bg-bg-hover/30 transition-colors">
                <div className={`p-1.5 rounded-lg ${color}/10`}>
                  <Icon className="w-3.5 h-3.5 text-content-secondary" />
                </div>
                <p className="flex-1 text-xs font-semibold text-content-primary">{label}</p>
                <Toggle checked={prefs[key]} onChange={v => set(key, v)} color={color} />
              </div>
            ))}
          </div>

          {/* Digest summary */}
          <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 mt-2">
            <p className="text-xs font-semibold text-accent mb-1">Notification Digest</p>
            <p className="text-[10px] text-content-muted mb-3">Receive a daily summary instead of individual alerts</p>
            <div className="flex gap-2">
              {['Instant', 'Hourly', 'Daily'].map(opt => (
                <button
                  key={opt}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${
                    opt === 'Instant'
                      ? 'bg-accent/10 border-accent/40 text-accent'
                      : 'bg-bg-base border-border text-content-muted hover:border-border-strong'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
