import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Menu, ChevronDown, LogOut, User,
  Bus,
} from 'lucide-react'
import { NAV_ITEMS } from '@/constants'
import { useAuth } from '@/context/AuthContext'

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) handler() }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [ref, handler])
}

function getPageTitle(pathname) {
  const match = NAV_ITEMS.find(item =>
    item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)
  )
  return match?.label ?? 'TransitOps'
}

export default function Navbar({ onMenuClick }) {
  const { pathname }                      = useLocation()
  const navigate                          = useNavigate()
  const { user, logout }                  = useAuth()
  const [profileOpen, setProfileOpen]     = useState(false)
  const profileRef = useRef(null)

  useOutsideClick(profileRef, () => setProfileOpen(false))

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const displayName = user?.name || 'User'
  const initials    = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const roleName    = user?.role?.name ?? user?.role ?? ''

  return (
    <header className="sticky top-0 z-30 h-16 bg-white shadow-navbar flex items-center gap-3 px-4 lg:px-6 shrink-0 min-w-0">

      {/* Hamburger — mobile/tablet only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile logo */}
      <div className="flex items-center gap-2 lg:hidden shrink-0">
        <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
          <Bus size={14} className="text-white" />
        </div>
        <span className="font-bold text-sm text-slate-900">TransitOps</span>
      </div>

      {/* Desktop breadcrumb */}
      <div className="hidden lg:flex items-center gap-2 min-w-0">
        <span className="text-xs text-slate-400 font-medium shrink-0">TransitOps</span>
        <span className="text-slate-300 shrink-0">/</span>
        <span className="text-sm font-semibold text-slate-800 truncate">{getPageTitle(pathname)}</span>
      </div>

      <div className="flex-1 min-w-0" />

      {/* Right actions */}
      <div className="flex items-center gap-1 shrink-0">

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1 shrink-0" />

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(v => !v)}
            className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold ring-2 ring-brand-100 shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{displayName}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{roleName}</p>
            </div>
            <ChevronDown
              size={14}
              className={`hidden sm:block text-slate-400 transition-transform duration-150 shrink-0 ${profileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-dropdown border border-slate-100 py-1.5 z-50 min-w-[200px]">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                <p className="text-xs text-slate-400 mt-0.5">{user?.email ?? ''}</p>
              </div>
              <div className="py-1">
                <button className="dropdown-item w-full" onClick={() => { navigate('/profile'); setProfileOpen(false) }}><User size={15} className="text-slate-400" />My Profile</button>
              </div>
              <div className="border-t border-slate-100 py-1">
                <button onClick={handleLogout} className="dropdown-item w-full text-red-600 hover:bg-red-50">
                  <LogOut size={15} className="text-red-500" />Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
