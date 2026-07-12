import { Outlet } from 'react-router-dom';
import { Truck, Bus, MapPin, BarChart3, Users, Route, FileText, Zap } from 'lucide-react';

/* ─── Animated Grid Background ─────────────────────────────── */
function GridPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3B82F6" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

/* ─── Floating Stat Card ────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, delay, position }) {
  return (
    <div
      className="absolute flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 shadow-2xl"
      style={{
        background: 'rgba(30,41,59,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: `floatCard 4s ease-in-out ${delay}s infinite`,
        ...position,
      }}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-[11px] text-slate-400 leading-none">{label}</p>
        <p className="text-base font-bold text-white mt-0.5 leading-none">{value}</p>
      </div>
      <div className={`w-1.5 h-1.5 rounded-full ml-1 animate-pulse ${color.replace('bg-', 'bg-').split(' ')[0]}`} />
    </div>
  );
}

/* ─── Fleet Illustration ────────────────────────────────────── */
function FleetIllustration() {
  return (
    <div className="relative w-full max-w-[340px] mx-auto select-none" style={{ animation: 'floatSlow 6s ease-in-out infinite' }}>
      {/* Main road card */}
      <div
        className="relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
        style={{ background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(20px)' }}
      >
        {/* Map header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">Live Fleet Map</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">24 active</span>
        </div>

        {/* Fake map area */}
        <div className="relative h-44 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2744 50%, #0f172a 100%)' }}>
          {/* Road lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 340 176">
            <line x1="0" y1="88" x2="340" y2="88" stroke="#3B82F6" strokeWidth="2" strokeDasharray="12,8" />
            <line x1="170" y1="0" x2="170" y2="176" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="8,6" />
            <line x1="0" y1="44" x2="340" y2="132" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="6,10" />
            <circle cx="170" cy="88" r="40" stroke="#3B82F6" strokeWidth="1" fill="none" opacity="0.4" />
            <circle cx="170" cy="88" r="70" stroke="#3B82F6" strokeWidth="0.5" fill="none" opacity="0.2" />
          </svg>

          {/* Glow center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-blue-500/20 blur-2xl" />

          {/* Vehicle dots */}
          {[
            { x: '20%', y: '30%', color: 'bg-blue-400',   delay: '0s'    },
            { x: '65%', y: '20%', color: 'bg-emerald-400', delay: '0.5s' },
            { x: '75%', y: '65%', color: 'bg-violet-400',  delay: '1s'   },
            { x: '30%', y: '70%', color: 'bg-amber-400',   delay: '1.5s' },
            { x: '50%', y: '45%', color: 'bg-blue-300',    delay: '0.8s' },
          ].map((dot, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full ${dot.color} shadow-lg`}
              style={{ left: dot.x, top: dot.y, animation: `pulse 2s ease-in-out ${dot.delay} infinite` }}
            >
              <div className={`absolute inset-0 rounded-full ${dot.color} opacity-40 animate-ping`} />
            </div>
          ))}

          {/* Route line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 176">
            <path d="M 68 53 Q 170 88 255 114" stroke="#3B82F6" strokeWidth="1.5" fill="none" strokeDasharray="4,4" opacity="0.6" />
          </svg>
        </div>

        {/* Bottom stats row */}
        <div className="grid grid-cols-3 divide-x divide-white/5 px-0">
          {[
            { label: 'On Route', value: '18', color: 'text-blue-400' },
            { label: 'Idle',     value: '4',  color: 'text-amber-400' },
            { label: 'Offline',  value: '2',  color: 'text-slate-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="py-3 text-center">
              <p className={`text-sm font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Auth Layout ───────────────────────────────────────────── */
export default function AuthLayout() {
  return (
    <>
      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .auth-card-enter {
          animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .auth-fade-in {
          animation: fadeIn 0.4s ease both;
        }
      `}</style>

      <div className="min-h-screen flex overflow-hidden" style={{ backgroundColor: '#0F172A' }}>

        {/* ══════════════════════════════════════════════════════
            LEFT PANEL — 60%
        ══════════════════════════════════════════════════════ */}
        <div
          className="hidden lg:flex lg:w-[58%] xl:w-[60%] shrink-0 flex-col relative overflow-hidden"
          style={{ backgroundColor: '#0D1526' }}
        >
          {/* Grid */}
          <GridPattern />

          {/* Ambient glows */}
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)' }} />

          {/* ── Logo ── */}
          <div className="relative z-10 p-10 pb-0">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', boxShadow: '0 0 24px rgba(59,130,246,0.4)' }}
              >
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-white tracking-tight">TransitOps</p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#3B82F6' }}>
                  Enterprise Platform
                </p>
              </div>
            </div>
          </div>

          {/* ── Hero Content ── */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-10 xl:px-14">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit mb-6"
                 style={{ borderColor: 'rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.08)' }}>
              <Zap className="w-3 h-3" style={{ color: '#3B82F6' }} />
              <span className="text-xs font-medium" style={{ color: '#93C5FD' }}>Smart Transport Operations</span>
            </div>

            <h1 className="text-4xl xl:text-[2.75rem] font-bold text-white leading-[1.15] tracking-tight">
              Manage Your Fleet<br />
              <span style={{
                background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Smarter & Faster
              </span>
            </h1>

            <p className="mt-4 text-base leading-relaxed max-w-sm" style={{ color: '#94A3B8' }}>
              Smart Transport Operations Platform for Fleet, Drivers, Trips, Maintenance and Analytics.
            </p>

            {/* Fleet Illustration */}
            <div className="mt-10 relative">
              <FleetIllustration />

              {/* Floating stat cards */}
              <StatCard
                icon={Bus}
                label="Active Vehicles"
                value="248"
                color="bg-blue-600"
                delay={0}
                position={{ top: '-18px', right: '-10px' }}
              />
              <StatCard
                icon={Users}
                label="Drivers Online"
                value="183"
                color="bg-violet-600"
                delay={1}
                position={{ bottom: '10px', left: '-10px' }}
              />
            </div>

            {/* Bottom mini stats */}
            <div className="mt-8 grid grid-cols-4 gap-3">
              {[
                { icon: Route,    label: 'Trips Today', value: '1,240', color: '#3B82F6' },
                { icon: Bus,      label: 'Vehicles',    value: '850+',  color: '#8B5CF6' },
                { icon: Users,    label: 'Drivers',     value: '620+',  color: '#10B981' },
                { icon: FileText, label: 'Reports',     value: '99.9%', color: '#F59E0B' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="rounded-2xl border p-3 text-center"
                  style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(30,41,59,0.5)' }}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color }} />
                  <p className="text-sm font-bold text-white">{value}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: '#64748B' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="relative z-10 px-10 pb-8">
            <div className="flex items-center gap-2 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <MapPin className="w-3.5 h-3.5" style={{ color: '#475569' }} />
              <p className="text-xs" style={{ color: '#475569' }}>
                © {new Date().getFullYear()} TransitOps · All rights reserved
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            RIGHT PANEL — 40%
        ══════════════════════════════════════════════════════ */}
        <div
          className="flex-1 min-w-0 flex flex-col items-center justify-center p-6 sm:p-8 overflow-y-auto relative"
          style={{ backgroundColor: '#0F172A' }}
        >
          {/* Subtle right-panel glow */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)' }} />

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' }}
            >
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">TransitOps</p>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: '#3B82F6' }}>Enterprise</p>
            </div>
          </div>

          {/* Form outlet */}
          <div className="w-full max-w-[400px] auth-card-enter">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
