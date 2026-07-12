import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function RoleProtectedRoute({ allowedRoles = [] }) {
  const { user, hasRole } = useAuth()

  const allowed = hasRole
    ? hasRole(allowedRoles)
    : user && allowedRoles.includes(user.role?.name ?? user.role)

  if (!allowed) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
