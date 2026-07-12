import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Navbar from './Navbar';

function Footer() {
  return (
    <footer className="shrink-0 border-t border-border bg-bg-secondary px-6 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-content-disabled">
          © {new Date().getFullYear()} TransitOps. All rights reserved.
        </p>
        <p className="text-xs text-content-disabled">
          v1.0.0 · Enterprise Transport Management
        </p>
      </div>
    </footer>
  );
}

export default function AppLayout() {
  const [collapsed,    setCollapsed]    = useState(false);
  const [mobileOpen,  setMobileOpen]   = useState(false);

  const toggleCollapse = useCallback(() => setCollapsed(p => !p), []);
  const openMobile     = useCallback(() => setMobileOpen(true),   []);
  const closeMobile    = useCallback(() => setMobileOpen(false),  []);

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">

      {/* ── Desktop Sidebar — fixed, visible lg+ ── */}
      <div className="hidden lg:flex shrink-0 transition-all duration-300 ease-in-out"
           style={{ width: collapsed ? '80px' : '260px' }}>
        <Sidebar
          collapsed={collapsed}
          onToggle={toggleCollapse}
          isMobile={false}
        />
      </div>

      {/* ── Mobile Drawer Sidebar ── */}
      <MobileSidebar open={mobileOpen} onClose={closeMobile} />

      {/* ── Right Column: Navbar + Content + Footer ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Sticky Navbar — 72px */}
        <Navbar onMenuClick={openMobile} />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto bg-bg-base">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
