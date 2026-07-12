import { useState, useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Navbar  from '@/components/layout/Navbar'

const SIDEBAR_FULL      = 260
const SIDEBAR_COLLAPSED = 68
const LG_BREAKPOINT     = 1024

export default function AppLayout() {
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const mainRef = useRef(null)

  // Sync content margin with sidebar width on desktop; zero on mobile
  useEffect(() => {
    const el = mainRef.current
    if (!el) return

    const update = () => {
      const isDesktop = window.innerWidth >= LG_BREAKPOINT
      el.style.marginLeft = isDesktop
        ? `${collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_FULL}px`
        : '0px'
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [collapsed])

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= LG_BREAKPOINT) setMobileOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed(v => !v)}
      />

      {/*
        Desktop: content shifts right by sidebar width (via useEffect above).
        Mobile/tablet: sidebar is a fixed overlay, content stays full-width.
      */}
      <div
        ref={mainRef}
        className="flex flex-col flex-1 min-w-0 overflow-hidden transition-[margin-left] duration-[250ms] ease-in-out"
      >
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
