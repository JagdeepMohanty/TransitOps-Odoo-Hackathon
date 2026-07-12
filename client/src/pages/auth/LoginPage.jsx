import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bus, LogIn } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { loginSchema } from '@/schemas/auth.schema'

const DEMO_USERS = [
  { role: 'Fleet Manager',     email: 'fleet@transitops.com',      password: 'Fleet@123'      },
  { role: 'Dispatcher',        email: 'dispatcher@transitops.com', password: 'Dispatcher@123' },
  { role: 'Safety Officer',    email: 'safety@transitops.com',     password: 'Safety@123'     },
  { role: 'Financial Analyst', email: 'finance@transitops.com',    password: 'Finance@123'    },
]

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, isLoading, navigate, from])

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      setError('root', { message: msg })
    }
  }

  const fillDemo = (email, password) => {
    setValue('email', email)
    setValue('password', password)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">

        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex w-14 h-14 bg-brand-600 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-brand-900/20">
            <Bus size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">TransitOps</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {errors.root && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {errors.root.message}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors
                  ${errors.email
                    ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-300 bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                  }`}
                placeholder="you@transitops.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors
                  ${errors.password
                    ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-300 bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
                  }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Demo credentials */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Demo credentials
          </p>
          <div className="space-y-2">
            {DEMO_USERS.map(({ role, email, password }) => (
              <button
                key={email}
                type="button"
                onClick={() => fillDemo(email, password)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors text-left group"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-700">{role}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{email}</p>
                </div>
                <span className="text-[10px] text-brand-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Fill
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
