import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import {
  Truck, Mail, Lock, Eye, EyeOff, ArrowRight,
  Shield, BarChart3, Zap, Globe,
  AlertCircle, Loader2, CheckCircle2,
} from 'lucide-react';

const FEATURES = [
  { icon: Truck,     label: 'Real-time Fleet Tracking'     },
  { icon: BarChart3, label: 'Advanced Analytics & Reports' },
  { icon: Shield,    label: 'Enterprise-grade Security'    },
  { icon: Zap,       label: 'Automated Maintenance Alerts' },
  { icon: Globe,     label: 'Multi-branch Management'      },
];

const MOCK_USERS = {
  'admin@transitops.com':   { name: 'Admin User',   role: 'Admin',   token: 'mock-admin-token'   },
  'manager@transitops.com': { name: 'Manager User', role: 'Manager', token: 'mock-manager-token' },
};

function validate(email, password) {
  const errors = {};
  if (!email)                            errors.email    = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email    = 'Enter a valid email';
  if (!password)                         errors.password = 'Password is required';
  else if (password.length < 6)         errors.password = 'At least 6 characters';
  return errors;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form,      setForm]      = useState({ email: '', password: '', remember: false });
  const [errors,    setErrors]    = useState({});
  const [touched,   setTouched]   = useState({});
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [submitErr, setSubmitErr] = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm(p => ({ ...p, [name]: val }));
    if (touched[name]) {
      const errs = validate(name === 'email' ? val : form.email, name === 'password' ? val : form.password);
      setErrors(p => ({ ...p, [name]: errs[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    setErrors(p => ({ ...p, [name]: validate(form.email, form.password)[name] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const errs = validate(form.email, form.password);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setSubmitErr('');
    await new Promise(r => setTimeout(r, 900));
    const mock = MOCK_USERS[form.email];
    if (!mock) { setLoading(false); setSubmitErr('Invalid email or password.'); return; }
    login({ name: mock.name, email: form.email, role: mock.role }, mock.token);
    setLoading(false);
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex bg-[#0F172A]">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[380px] xl:w-[460px] shrink-0 flex-col bg-[#1E293B] border-r border-[#334155] relative overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-violet-500/10 blur-[80px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 p-8 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-white tracking-tight">TransitOps</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Enterprise Edition</p>
            </div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 px-8 flex-1 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-white leading-tight">
            The Smarter Way to<br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Manage Your Fleet
            </span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm leading-relaxed max-w-xs">
            One platform for vehicles, drivers, trips, maintenance, and finances — built for enterprise scale.
          </p>

          {/* Feature list */}
          <ul className="mt-7 space-y-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stats */}
        <div className="relative z-10 px-8 pb-8">
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-[#334155]">
            {[['12K+','Trips'],['850+','Vehicles'],['99.9%','Uptime'],['200+','Companies']].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-base font-bold text-blue-400">{v}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center p-6 lg:p-8 xl:p-10 overflow-y-auto">

        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-8 lg:hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <p className="text-lg font-bold text-white">TransitOps</p>
        </div>

        {/* Card */}
        <div className="w-full max-w-[400px]">
          <div className="rounded-2xl border border-[#334155] bg-[#1E293B] p-8 shadow-2xl shadow-black/50">

            {/* Header */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">Secure Login</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="text-sm text-slate-400 mt-1">Sign in to your TransitOps account</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Global error */}
              {submitErr && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {submitErr}
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="admin@transitops.com"
                    autoComplete="email"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-[#0F172A] text-white placeholder:text-slate-600 border focus:outline-none focus:ring-2 transition-all ${
                      touched.email && errors.email
                        ? 'border-red-500 focus:ring-red-500/30'
                        : 'border-[#475569] focus:ring-blue-500/40 focus:border-blue-500 hover:border-slate-400'
                    }`}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle className="w-3.5 h-3.5" />{errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm bg-[#0F172A] text-white placeholder:text-slate-600 border focus:outline-none focus:ring-2 transition-all ${
                      touched.password && errors.password
                        ? 'border-red-500 focus:ring-red-500/30'
                        : 'border-[#475569] focus:ring-blue-500/40 focus:border-blue-500 hover:border-slate-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle className="w-3.5 h-3.5" />{errors.password}
                  </p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-[#475569] bg-[#0F172A] accent-blue-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 select-none">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</>
                ) : (
                  <>Sign In<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#334155]" />
              <span className="text-[11px] text-slate-600 uppercase tracking-wider">demo</span>
              <div className="flex-1 h-px bg-[#334155]" />
            </div>

            {/* Demo credentials */}
            <div className="rounded-xl border border-[#334155] bg-[#0F172A] p-4 space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Login</p>
              {[
                { role: 'Admin',   email: 'admin@transitops.com',   pass: 'admin123',   color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'   },
                { role: 'Manager', email: 'manager@transitops.com', pass: 'manager123', color: 'text-violet-400 bg-violet-500/10 border-violet-500/30' },
              ].map(({ role, email, pass, color }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, email, password: pass }))}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#1E293B] hover:bg-[#273549] border border-[#334155] hover:border-[#475569] transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color}`}>{role}</span>
                    <span className="text-xs text-slate-400 font-mono">{email}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-slate-600 mt-5">
            Protected by enterprise-grade encryption ·{' '}
            <Link to="/privacy" className="text-slate-500 hover:text-slate-400 transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
