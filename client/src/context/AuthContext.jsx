import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as authApi from '@/api/auth.api'
import { getToken, setToken, setUser, clearAuth } from '@/utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,        setUserState] = useState(null)
  const [token,       setTokenState] = useState(() => getToken())
  const [isLoading,   setIsLoading]  = useState(true)

  // On mount: validate stored token
  useEffect(() => {
    const stored = getToken()
    if (!stored) { setIsLoading(false); return }

    authApi.getCurrentUser()
      .then(res => {
        const u = res.data.data
        setUserState(u)
        setUser(u)
      })
      .catch(() => {
        clearAuth()
        setTokenState(null)
        setUserState(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const res   = await authApi.login(email, password)
    const { token: t, user: u } = res.data.data
    setToken(t)
    setUser(u)
    setTokenState(t)
    setUserState(u)
    return u
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    clearAuth()
    setTokenState(null)
    setUserState(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const res = await authApi.getCurrentUser()
    const u   = res.data.data
    setUserState(u)
    setUser(u)
    return u
  }, [])

  const hasRole = useCallback((roles) => {
    if (!user) return false
    const allowed = Array.isArray(roles) ? roles : [roles]
    return allowed.includes(user.role?.name ?? user.role)
  }, [user])

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refreshUser,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
