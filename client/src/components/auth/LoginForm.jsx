import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight,
  Loader2, AlertCircle, CheckCircle2, Chrome,
} from 'lucide-react';

const DEMO = [
  { role: 'Admin',   email: 'admin@transitops.com',   password: 'admin123',   badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30'      },
  { role: 'Manager', email: 'manager@transitops.com', password: 'manager123', badge: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
];

function Field({ label, id, icon: Icon, error, rightSlot, inputProps }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium" style={{ color: '#CBD5E1' }}>
        {label}
      </label>
      <div className="relative">
        <Icon
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: error ? '#EF4444' : '#475569' }}
        />
        <input
          id={id}
          {...inputProps}
          className="w-full h-[52px] pl-11 pr-11 rounded-xl text-sm border outline-none transition-all duration-200"
          style={{ backgroundColor: '#0A1628', color: '#F8FAFC', borderColor: error ? '#EF4444' : '#334155' }}
          onFocus={e => {
            e.target.style.borderColor = error ? '#EF4444' : '#3B82F6';
            e.target.style.boxShadow   = error ? '0 0 0 3px rgba(239,68,68,0.15)' : '0 0 0 3px rgba(59,130,246,0.15)';
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? '#EF4444' : '#334155';
            e.target.style.boxShadow   = 'none';
          }}
        />
        {rightSlot && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</div>}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs" style={{ color: '#FCA5A5' }}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

export default function LoginForm({ onSubmit: handleLogin }) {
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', remember: false },
  });

  async function onSubmit(data) {
    setLoading(true);
    setApiError('');
    try {
      await handleLogin(data);
    } catch (err) {
      setApiError(err?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(email, password) {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
  }

  return (
    <div>
      {/* Glass Card */}
      <div
        className="rounded-[20px] border p-8"
        style={{
          background: 'rgba(30,41,59,0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderColor: '#334155',
          boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
        }}
      >
        {/* Header */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4" style={{ color: '#22C55E' }} />
            <span className="text-xs font-semibold" style={{ color: '#86EFAC' }}>
              Secure · Encrypted · Enterprise
            </span>
          </div>
          <h2 className="text-[1.6rem] font-bold text-white tracking-tight">Welcome back</h2>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            Sign in to continue managing your transport operations.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* API Error */}
          {apiError && (
            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm border"
              style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)', color: '#FCA5A5' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />{apiError}
            </div>
          )}

          <Field
            id="email" label="Email Address" icon={Mail} error={errors.email?.message}
            inputProps={{
              type: 'email', placeholder: 'you@transitops.com', autoComplete: 'email',
              ...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
              }),
            }}
          />

          <Field
            id="password" label="Password" icon={Lock} error={errors.password?.message}
            rightSlot={
              <button
                type="button" onClick={() => setShowPass(p => !p)}
                style={{ color: '#475569' }} aria-label={showPass ? 'Hide password' : 'Show password'}
                onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
                onMouseLeave={e => e.currentTarget.style.color = '#475569'}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            inputProps={{
              type: showPass ? 'text' : 'password', placeholder: '••••••••',
              autoComplete: 'current-password',
              ...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 characters' },
              }),
            }}
          />

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox" {...register('remember')}
                className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: '#3B82F6' }}
              />
              <span className="text-xs select-none" style={{ color: '#64748B' }}>Remember me</span>
            </label>
            <Link
              to="/forgot-password" className="text-xs font-medium transition-colors duration-150"
              style={{ color: '#3B82F6' }}
              onMouseEnter={e => e.currentTarget.style.color = '#60A5FA'}
              onMouseLeave={e => e.currentTarget.style.color = '#3B82F6'}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className="relative w-full h-[52px] rounded-xl text-sm font-semibold text-white overflow-hidden transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              boxShadow: '0 4px 24px rgba(59,130,246,0.35)',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.5)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(59,130,246,0.35)'; }}
          >
            <span className="flex items-center justify-center gap-2">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</>
                : <>Sign In <ArrowRight className="w-4 h-4" /></>
              }
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ backgroundColor: '#1E293B' }} />
          <span className="text-[11px] font-medium uppercase tracking-widest" style={{ color: '#334155' }}>or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#1E293B' }} />
        </div>

        {/* Google (disabled) */}
        <button
          type="button" disabled
          className="w-full h-[52px] rounded-xl text-sm font-medium flex items-center justify-center gap-3 border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ borderColor: '#334155', background: 'rgba(255,255,255,0.02)', color: '#94A3B8' }}
        >
          <Chrome className="w-4 h-4" />
          Continue with Google
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: '#334155', color: '#475569' }}>
            Soon
          </span>
        </button>

        {/* Demo Credentials */}
        <div className="mt-6 rounded-xl border p-4" style={{ borderColor: '#1E293B', background: 'rgba(15,23,42,0.6)' }}>
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>
            ⚡ Quick Demo Access
          </p>
          <div className="space-y-2">
            {DEMO.map(({ role, email, password, badge }) => (
              <button
                key={role} type="button" onClick={() => fillDemo(email, password)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all duration-150 group"
                style={{ borderColor: '#1E293B', background: 'rgba(30,41,59,0.5)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.background = 'rgba(30,41,59,0.9)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E293B'; e.currentTarget.style.background = 'rgba(30,41,59,0.5)'; }}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge}`}>{role}</span>
                  <span className="text-xs font-mono" style={{ color: '#64748B' }}>{email}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" style={{ color: '#334155' }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs mt-5" style={{ color: '#334155' }}>
        © {new Date().getFullYear()} TransitOps · Enterprise Edition ·{' '}
        <Link to="/privacy" style={{ color: '#475569' }}
          onMouseEnter={e => e.currentTarget.style.color = '#64748B'}
          onMouseLeave={e => e.currentTarget.style.color = '#475569'}
        >Privacy</Link>
      </p>
    </div>
  );
}
