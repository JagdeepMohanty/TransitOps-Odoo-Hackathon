import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import {
  Truck, Mail, Lock, Eye, EyeOff, ArrowRight,
  CheckCircle2, Shield, BarChart3, Zap, Globe,
  AlertCircle, Loader2,
} from 'lucide-react';

// ─── Feature list data ────────────────────────────────────────
const FEATURES = [
  { icon: Truck,      label: 'Real-time Fleet Tracking',       desc: 'Monitor every vehicle live on the map'         },
  { icon: BarChart3,  label: 'Advanced Analytics & Reports',   desc: 'Data-driven insights for smarter decisions'    },
  { icon: Shield,     label: 'Enterprise-grade Security',      desc: 'Role-based access with audit trails'           },
  { icon: Zap,        label: 'Automated Maintenance Alerts',   desc: 'Never miss a service schedule again'           },
  { icon: Globe,      label: 'Multi-branch Management',        desc: 'Manage operations across all locations'        },
];

// ─── Stats ────────────────────────────────────────────────────
const STATS = [
  { value: '12K+',  label: 'Trips Managed'  },
  { value: '850+',  label: 'Vehicles'        },
  { value: '99.9%', label: 'Uptime'          },
  { value: '200+',  label: 'Companies'       },
];

// ─── Fleet Illustration ───────────────────────────────────────
function FleetIllustration() {
  return (
    <div className="relative w-full max-w-sm mx-auto my-8 select-none">
      {/* Road */}
      <div className="relative h-28 rounded-2xl overflow-hidden"
           style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)' }}>
        {/* Road surface */}
        <div className="absolute bottom-0 left-0 right-0 h-10 rounded-b-2xl"
             style={{ background: 'linear-gradient(180deg, #1E293B 0%, #273549 100%)' }} />
        {/* Road dashes */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-6 h-1 rounded-full bg-warning/40" />
          ))}
        </div>

        {/* Truck 1 — large */}
        <div className="absolute bottom-8 left-6 flex flex-col items-center gap-0.5">
          <div className="w-16 h-8 rounded-lg bg-primary/80 border border-primary/40 flex items-center justify-center shadow-glow-sm">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-border-strong border border-border" />
            <div className="w-3 h-3 rounded-full bg-border-strong border border-border" />
          </div>
        </div>

        {/* Truck 2 — medium */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
          <div className="w-12 h-7 rounded-lg bg-secondary/70 border border-secondary/40 flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-border-strong border border-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-border-strong border border-border" />
          </div>
        </div>

        {/* Truck 3 — small */}
        <div className="absolute bottom-8 right-6 flex flex-col items-center gap-0.5">
          <div className="w-10 h-6 rounded-md bg-accent/70 border border-accent/40 flex items-center justify-center">
            <Truck className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-border-strong border border-border" />
            <div className="w-2 h-2 rounded-full bg-border-strong border border-border" />
          </div>
        </div>

        {/* Glow dots */}
        <div className="absolute top-3 left-8 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <div className="absolute top-5 right-10 w-1 h-1 rounded-full bg-secondary animate-pulse-slow" />
        <div className="absolute top-2 right-1/3 w-1 h-1 rounded-full bg-accent animate-pulse" />
      </div>

      {/* Live badge */}
      <div className="absolute -top-2 -right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-muted border border-success/30">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        <span className="text-[10px] font-semibold text-success-text">LIVE TRACKING</span>
      </div>
    </div>
  );
}

// ─── Input Field ──────────────────────────────────────────────
function FormInput({ id, label, type, value, onChange, onBlur, error, placeholder, icon: Icon, rightSlot }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="input-label">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-disabled pointer-events-none" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={id}
          className={`
            w-full pl-10 pr-10 py-3 rounded-xl text-sm
            bg-bg-base/60 border text-content-primary
            placeholder:text-content-disabled
            focus:outline-none focus:ring-2 focus:border-transparent
            transition-all duration-200
            ${error
              ? 'border-danger focus:ring-danger/40'
              : 'border-border-input focus:ring-border-focus/50 hover:border-border-strong'
            }
          `}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-danger-text">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────
function validate(email, password) {
  const errors = {};
  if (!email)                              errors.email    = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(email))   errors.email    = 'Enter a valid email address';
  if (!password)                           errors.password = 'Password is required';
  else if (password.length < 6)           errors.password = 'Password must be at least 6 characters';
  return errors;
}

// ─── Login Page ───────────────────────────────────────────────
const MOCK_USERS = {
  'admin@transitops.com':   { name: 'Admin User',   role: 'Admin',   token: 'mock-admin-token'   },
  'manager@transitops.com': { name: 'Manager User', role: 'Manager', token: 'mock-manager-token' },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form,       setForm]       = useState({ email: '', password: '', remember: false });
  const [errors,     setErrors]     = useState({});
  const [touched,    setTouched]    = useState({});
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [submitErr,  setSubmitErr]  = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (touched[name]) {
      const errs = validate(
        name === 'email'    ? value : form.email,
        name === 'password' ? value : form.password,
      );
      setErrors((p) => ({ ...p, [name]: errs[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    const errs = validate(form.email, form.password);
    setErrors((p) => ({ ...p, [name]: errs[name] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const errs = validate(form.email, form.password);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setSubmitErr('');
    await new Promise((r) => setTimeout(r, 1000));
    const mock = MOCK_USERS[form.email];
    if (!mock) {
      setLoading(false);
      setSubmitErr('Invalid email or password.');
      return;
    }
    login({ name: mock.name, email: form.email, role: mock.role }, mock.token);
    setLoading(false);
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0F172A' }}>

      {/* ══════════════════════════════════════════
          LEFT PANEL
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[520px] xl:w-[600px] shrink-0 flex-col justify-between
                      relative overflow-hidden border-r border-border"
           style={{ backgroundColor: '#1E293B' }}>

        {/* Ambient glows */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-20 w-[400px] h-[400px] rounded-full bg-accent/8 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-secondary/5 blur-[80px] pointer-events-none" />

        {/* ── Logo ── */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-content-primary tracking-tight">TransitOps</span>
              <p className="text-[10px] text-content-disabled uppercase tracking-widest font-medium">Enterprise Edition</p>
            </div>
          </div>
        </div>

        {/* ── Hero + Illustration ── */}
        <div className="relative z-10 px-10 flex-1 flex flex-col justify-center">
          <h1 className="text-[2rem] font-bold text-content-primary leading-tight tracking-tight">
            The Smarter Way to<br />
            <span className="text-gradient-brand">Manage Your Fleet</span>
          </h1>
          <p className="mt-3 text-content-muted text-[15px] leading-relaxed max-w-xs">
            One platform for vehicles, drivers, trips, maintenance, and finances — built for enterprise scale.
          </p>

          <FleetIllustration />

          {/* Feature list */}
          <ul className="space-y-3 mt-2">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <li key={label} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-content-primary leading-none">{label}</p>
                  <p className="text-[11px] text-content-muted mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Stats row ── */}
        <div className="relative z-10 px-10 pb-10">
          <div className="grid grid-cols-4 gap-3 pt-6 border-t border-border">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-lg font-bold text-primary leading-none">{value}</p>
                <p className="text-[10px] text-content-disabled mt-1">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-content-disabled mt-6">
            © {new Date().getFullYear()} TransitOps · All rights reserved
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL
      ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">

        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-8 lg:hidden">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-content-primary tracking-tight">TransitOps</p>
            <p className="text-[10px] text-content-disabled uppercase tracking-widest">Enterprise Edition</p>
          </div>
        </div>

        {/* ── Glassmorphism Login Card ── */}
        <div className="w-full max-w-[420px]">
          <div
            className="rounded-2xl border border-border-card p-8 shadow-modal"
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            {/* Card header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-xs font-medium text-success-text">Secure Login</span>
              </div>
              <h2 className="text-2xl font-bold text-content-primary tracking-tight">Welcome back</h2>
              <p className="text-sm text-content-muted mt-1">Sign in to your TransitOps account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Global error */}
              {submitErr && (
                <div className="alert-danger text-xs animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {submitErr}
                </div>
              )}

              {/* Email */}
              <FormInput
                id="email"
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => handleChange({ target: { name: 'email', value: e.target.value } })}
                onBlur={(e) => handleBlur({ target: { name: 'email' } })}
                placeholder="admin@transitops.com"
                icon={Mail}
                error={touched.email && errors.email}
              />

              {/* Password */}
              <FormInput
                id="password"
                label="Password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => handleChange({ target: { name: 'password', value: e.target.value } })}
                onBlur={(e) => handleBlur({ target: { name: 'password' } })}
                placeholder="Enter your password"
                icon={Lock}
                error={touched.password && errors.password}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="text-content-disabled hover:text-content-muted transition-colors"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={form.remember}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`
                      w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150
                      ${form.remember
                        ? 'bg-primary border-primary'
                        : 'bg-transparent border-border-input group-hover:border-border-strong'
                      }
                    `}>
                      {form.remember && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-content-secondary select-none">Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:text-primary-hover transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full flex items-center justify-center gap-2.5
                  py-3 rounded-xl text-sm font-semibold
                  bg-primary hover:bg-primary-hover active:bg-primary-active
                  text-white shadow-glow-sm hover:shadow-glow
                  transition-all duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed
                  mt-2
                "
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-content-disabled uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Demo credentials */}
            <div className="rounded-xl border border-border bg-bg-base/40 p-4 space-y-2">
              <p className="text-[11px] font-semibold text-content-disabled uppercase tracking-wider">Demo Credentials</p>
              {[
                { role: 'Admin',   email: 'admin@transitops.com',   pass: 'admin123'   },
                { role: 'Manager', email: 'manager@transitops.com', pass: 'manager123' },
              ].map(({ role, email, pass }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, email, password: pass }))}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-bg-hover hover:bg-bg-active border border-border hover:border-border-strong transition-all duration-150 group"
                >
                  <div className="flex items-center gap-2">
                    <span className={`badge border text-[9px] ${role === 'Admin' ? 'badge-primary' : 'badge-accent'}`}>
                      {role}
                    </span>
                    <span className="text-xs text-content-muted font-mono">{email}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-content-disabled group-hover:text-content-muted transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Below card */}
          <p className="text-center text-xs text-content-disabled mt-6">
            Protected by enterprise-grade encryption ·{' '}
            <Link to="/privacy" className="text-content-muted hover:text-content-secondary transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
