import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/layout/PageHeader'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="page-container">
      <PageHeader title="My Profile" subtitle="Your account information" />
      <div className="card p-6 max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xl font-bold">
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Role</span>
            <span className="font-medium text-slate-800">{user?.role?.name ?? user?.role ?? '—'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Email</span>
            <span className="font-medium text-slate-800">{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
