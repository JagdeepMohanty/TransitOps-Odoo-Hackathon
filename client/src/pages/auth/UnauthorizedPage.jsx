import { Link } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
        <ShieldOff size={32} className="text-red-500" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">403</h1>
      <p className="text-slate-500 mb-6">You don't have permission to access this page.</p>
      <Link to="/" className="btn-primary">Back to Dashboard</Link>
    </div>
  )
}
