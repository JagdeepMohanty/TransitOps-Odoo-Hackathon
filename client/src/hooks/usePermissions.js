import { useAuth } from '@/context/AuthContext'

export default function usePermissions() {
  const { hasRole, user } = useAuth()
  return { hasRole, role: user?.role?.name ?? user?.role ?? null }
}
