import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Menu, Bell, ChevronDown, LogOut, User, Settings,
  Bus, CheckCircle2, AlertCircle, Clock,
} from 'lucide-react'
import { NAV_ITEMS } from '@/constants'
import { useAuth } from '@/context/AuthContext'

const NOTIFICATIONS = [
  { id: 1, icon: AlertCircle,  color: 'text-red-500',   bg: 'bg-red-50',   title: 'Vehicle AB-002-BB overdue for service', time: '5 min ago',  unread: true  },
  { id: 2, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', title: 'Trip T-005 completed successfully',      time: '22 min ago', unread: true  },
  { id: 3, icon: Clock,        color: 'text-amber-500', bg: 'bg-amber-50', title: 'Driver license expiry in 7 days',        time: '1 hr ago',   unread: false },
]

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
  const [notifOpen,   setNotifOpen]       = useState(false)
  const [profileOpen, setProfileOpen]     = useState(false)
  const notifRef   = useRef(null)
  const profileRef = useRef(null)

  useOutsideClick(notifRef,   () => setNotifOpen(false))
  useOutsideClick(profileRef, () => setProfileOpen(false))

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const displayName = user?.name || 'User'
  const initials    = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const roleName    = user?.role?.name ?? user?.role ?? ''

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length

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

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(v => !v); setProfileOpen(false) }}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-dropdown border border-slate-100 py-1.5 z-50
                            w-[calc(100vw-2rem)] max-w-sm sm:w-80">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <span className="badge bg-brand-100 text-brand-700">{unreadCount} new</span>
              </div>
              <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                {NOTIFICATIONS.map(({ id, icon: Icon, color, bg, title, time, unread }) => (
                  <div key={id} className={`flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${unread ? 'bg-brand-50/40' : ''}`}>
                    <div className={`w-8 h-8 shrink-0 rounded-full ${bg} flex items-center justify-center`}>
                      <Icon size={15} className={color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-700 font-medium leading-snug">{title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{time}</p>
                    </div>
                    {unread && <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 mt-1.5" />}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-slate-100">
                <button className="text-xs text-brand-600 font-medium hover:underline w-full text-center">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1 shrink-0" />

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(v => !v); setNotifOpen(false) }}
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
                <button className="dropdown-item w-full"><User size={15} className="text-slate-400" />My Profile</button>
                <button className="dropdown-item w-full"><Settings size={15} className="text-slate-400" />Settings</button>
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
