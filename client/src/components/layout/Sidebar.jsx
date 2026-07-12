import { NavLink } from 'react-router-dom'
import { Bus, LayoutDashboard, Route, Wrench, Fuel, Receipt, BarChart3, ChevronLeft, X } from 'lucide-react'

const NAV_GROUPS = [
  {
    label: 'Operations',
    items: [
      { label: 'Dashboard',   path: '/',            icon: LayoutDashboard },
      { label: 'Trips',       path: '/trips',        icon: Route },
    ],
  },
  {
    label: 'Fleet',
    items: [
      { label: 'Maintenance', path: '/maintenance',  icon: Wrench },
      { label: 'Fuel Logs',   path: '/fuel',         icon: Fuel },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Expenses',    path: '/expenses',     icon: Receipt },
      { label: 'Reports',     path: '/reports',      icon: BarChart3 },
    ],
  },
]

export default function Sidebar({ collapsed, mobileOpen, onClose, onToggleCollapse }) {
  return (
    <>
      {/* ── Mobile backdrop ─────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Sidebar panel ───────────────────────────── */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar-bg shadow-sidebar',
          'transition-all duration-250 ease-in-out',
          /* desktop width */
          collapsed ? 'w-[68px]' : 'w-[260px]',
          /* mobile: slide in/out */
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* ── Logo ──────────────────────────────────── */}
        <div
          className="flex items-center h-16 px-4 border-b shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 shrink-0 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-900/50">
              <Bus size={16} className="text-white" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-white font-bold text-sm leading-tight tracking-tight">TransitOps</p>
                <p className="text-sidebar-text text-[10px] font-medium tracking-wide uppercase">Operations Platform</p>
              </div>
            )}
          </div>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="ml-auto p-1.5 text-sidebar-text hover:text-white hover:bg-white/10 rounded-lg transition-colors lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Nav ───────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-4 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {/* Group label */}
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted">
                  {group.label}
                </p>
              )}
              {collapsed && (
                <div className="mx-auto mb-1.5 w-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              )}

              <div className="space-y-0.5">
                {group.items.map(({ label, path, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === '/'}
                    onClick={onClose}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) =>
                      isActive ? 'nav-link-active' : 'nav-link'
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active left bar */}
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full" />
                        )}
                        <Icon size={18} className="shrink-0" />
                        {!collapsed && <span className="truncate">{label}</span>}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── User footer ───────────────────────────── */}
        <div
          className="shrink-0 px-2.5 py-3 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className={`flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10">
              AD
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-semibold truncate">Admin User</p>
                <p className="text-sidebar-text text-[10px] truncate">admin@transitops.io</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Desktop collapse toggle ────────────────── */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center shadow-sm text-slate-500 hover:text-brand-600 hover:border-brand-300 transition-colors z-10"
        >
          <ChevronLeft
            size={13}
            className={`transition-transform duration-250 ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </aside>
    </>
  )
}
