import { X, Edit2, Ban, History, Phone, Mail, MapPin, Truck, Shield, Star, Route, Navigation } from 'lucide-react';
import DriverStatusBadge from './DriverStatusBadge';

function Avatar({ name }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const COLORS = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444', '#10B981', '#EC4899', '#38BDF8'];
  const bg = COLORS[name.charCodeAt(0) % COLORS.length];
  return (
    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-card-lg" style={{ background: `linear-gradient(135deg, ${bg}, ${bg}99)` }}>
      {initials}
    </div>
  );
}

function ScoreRing({ score }) {
  const color = score >= 90 ? '#22C55E' : score >= 75 ? '#F59E0B' : '#EF4444';
  const r = 28, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="64" height="64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#1E293B" strokeWidth="5" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <span className="text-sm font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-bg-secondary flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-content-muted" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-content-disabled uppercase tracking-wider">{label}</p>
        <p className={`text-xs font-medium mt-0.5 truncate ${highlight ? 'text-warning' : 'text-content-secondary'}`}>{value}</p>
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div className="flex flex-col items-center p-3 rounded-xl bg-bg-secondary border border-border/50">
      <span className="text-lg font-bold" style={{ color }}>{value}</span>
      <span className="text-[10px] text-content-muted mt-0.5 text-center">{label}</span>
    </div>
  );
}

export default function DriverProfileDrawer({ driver, onClose, onEdit, onSuspend }) {
  if (!driver) return null;

  const today   = new Date();
  const expDate = new Date(driver.licenseExpiry);
  const daysLeft = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
  const isExpired  = daysLeft < 0;
  const isExpiring = daysLeft >= 0 && daysLeft <= 30;
  const scoreColor = driver.safetyScore >= 90 ? '#22C55E' : driver.safetyScore >= 75 ? '#F59E0B' : '#EF4444';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-bg-card border-l border-border shadow-modal z-50 flex flex-col overflow-hidden animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h3 className="text-sm font-bold text-content-primary">Driver Profile</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-secondary text-content-muted hover:text-content-primary hover:bg-bg-hover transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">

          {/* Profile hero */}
          <div className="px-5 py-6 border-b border-border">
            <div className="flex items-start gap-4">
              <Avatar name={driver.name} />
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-content-primary truncate">{driver.name}</h2>
                <p className="text-xs text-content-muted mt-0.5">{driver.empId}</p>
                <div className="mt-2">
                  <DriverStatusBadge status={isExpired ? 'expired' : isExpiring ? 'expiring' : driver.status} />
                </div>
              </div>
              <ScoreRing score={driver.safetyScore} />
            </div>

            {/* Expiry warning */}
            {(isExpired || isExpiring) && (
              <div className={`mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium ${isExpired ? 'bg-danger/10 border-danger/25 text-danger' : 'bg-warning/10 border-warning/25 text-warning'}`}>
                <Shield className="w-3.5 h-3.5 shrink-0" />
                {isExpired ? `License expired ${Math.abs(daysLeft)} days ago` : `License expires in ${daysLeft} days`}
              </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <StatPill label="Trips"    value={driver.trips}                                  color="#3B82F6" />
              <StatPill label="Km Driven" value={`${(driver.totalDistance / 1000).toFixed(0)}k`} color="#8B5CF6" />
              <StatPill label="Rating"   value={driver.rating}                                 color="#F59E0B" />
            </div>
          </div>

          {/* Safety score bar */}
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-content-secondary">Safety Score</span>
              <span className="text-xs font-bold" style={{ color: scoreColor }}>{driver.safetyScore}/100</span>
            </div>
            <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${driver.safetyScore}%`, background: `linear-gradient(90deg, ${scoreColor}99, ${scoreColor})` }}
              />
            </div>
            <p className="text-[10px] text-content-disabled mt-1.5">
              {driver.safetyScore >= 90 ? 'Excellent — Top performer' : driver.safetyScore >= 75 ? 'Good — Minor improvements needed' : 'Low — Immediate attention required'}
            </p>
          </div>

          {/* Contact & License info */}
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[10px] font-bold text-content-disabled uppercase tracking-widest mb-3">Contact & License</p>
            <InfoRow icon={Phone}    label="Phone"            value={driver.phone} />
            <InfoRow icon={Mail}     label="Email"            value={driver.email} />
            <InfoRow icon={MapPin}   label="Address"          value={driver.address} />
            <InfoRow icon={Shield}   label="License Number"   value={driver.license} />
            <InfoRow icon={Star}     label="License Category" value={driver.licenseCategory} />
            <InfoRow icon={Shield}   label="License Expiry"   value={driver.licenseExpiry} highlight={isExpired || isExpiring} />
          </div>

          {/* Assignment */}
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[10px] font-bold text-content-disabled uppercase tracking-widest mb-3">Assignment</p>
            <InfoRow icon={Truck}      label="Assigned Vehicle"   value={driver.vehicle} />
            <InfoRow icon={Route}      label="Trips Completed"    value={`${driver.trips} trips`} />
            <InfoRow icon={Navigation} label="Total Distance"     value={`${driver.totalDistance.toLocaleString()} km`} />
          </div>

          {/* Emergency & Notes */}
          <div className="px-5 py-4">
            <p className="text-[10px] font-bold text-content-disabled uppercase tracking-widest mb-3">Emergency & Notes</p>
            <InfoRow icon={Phone} label="Emergency Contact" value={driver.emergencyContact} />
            {driver.notes && (
              <div className="mt-3 p-3 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] font-semibold text-content-disabled uppercase tracking-wider mb-1">Notes</p>
                <p className="text-xs text-content-muted leading-relaxed">{driver.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="shrink-0 px-5 py-4 border-t border-border grid grid-cols-3 gap-2">
          <button
            onClick={() => onEdit(driver)}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all border border-primary/20"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          {driver.status !== 'suspended' ? (
            <button
              onClick={() => onSuspend(driver)}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-danger/10 text-danger text-xs font-semibold hover:bg-danger/20 transition-all border border-danger/20"
            >
              <Ban className="w-3.5 h-3.5" /> Suspend
            </button>
          ) : (
            <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-success/10 text-success text-xs font-semibold hover:bg-success/20 transition-all border border-success/20">
              <Shield className="w-3.5 h-3.5" /> Reinstate
            </button>
          )}
          <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-bg-secondary text-content-muted text-xs font-semibold hover:text-content-primary hover:bg-bg-hover transition-all border border-border">
            <History className="w-3.5 h-3.5" /> History
          </button>
        </div>
      </div>
    </>
  );
}
