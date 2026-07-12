import { Link } from 'react-router-dom'
import { Bus } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mb-6">
        <Bus size={32} className="text-white" />
      </div>
      <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
      <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to Dashboard</Link>
    </div>
  )
}
