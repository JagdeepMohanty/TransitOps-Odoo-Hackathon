import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Truck, X } from 'lucide-react';
import { NAV_SECTIONS, NAV_BOTTOM } from '@constants/navigation';
import { useAuth } from '@context/AuthContext';

// ─── Collapsed tooltip wrapper ────────────────────────────────
function NavTooltip({ label, children }) {
  return (
    <div className="relative group/tip flex">
      {children}
      <span className="
        pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2
        px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap
        bg-bg-dropdown border border-border text-content-primary shadow-card-lg
        opacity-0 group-hover/tip:opacity-100 translate-x-1 group-hover/tip:translate-x-0
        transition-all duration-150 z-tooltip
      ">
        {label}
      </span>
    </div>
  );
}

// ─── Single nav item ──────────────────────────────────────────
function NavItem({ item, collapsed, onClick }) {
  const { icon: Icon, to, label, end, isDanger } = item;

  const baseClass = `
    relative flex items-center gap-3 w-full rounded-lg text-sm font-medium
    transition-all duration-200 cursor-pointer select-none
    ${collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'}
  `;

  const activeClass   = 'bg-primary/10 text-primary';
  const inactiveClass = isDanger
    ? 'text-danger hover:bg-danger-muted/40 hover:text-danger-text'
    : 'text-content-muted hover:text-content-primary hover:bg-bg-active';

  const inner = (isActive = false) => (
    <>
      {/* Blue active left border */}
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary" />
      )}
      <Icon className={`shrink-0 transition-transform duration-200 ${collapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'}`} />
      {!collapsed && <span className="truncate leading-none">{label}</span>}
    </>
  );

  const node = to ? (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `${baseClass} ${isActive ? activeClass : inactiveClass}`
      }
    >
      {({ isActive }) => inner(isActive)}
    </NavLink>
  ) : (
    <button
      onClick={onClick}
      className={`${baseClass} ${inactiveClass}`}
    >
      {inner(false)}
    </button>
  );

  return collapsed ? <NavTooltip label={label}>{node}</NavTooltip> : node;
}

// ─── Sidebar ──────────────────────────────────────────────────
export default function Sidebar({ collapsed, onToggle, onClose, isMobile }) {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside
      style={{ width: collapsed ? '80px' : '260px', backgroundColor: '#1E293B' }}
      className="
        flex flex-col h-full shrink-0
        border-r border-border shadow-sidebar
        transition-all duration-300 ease-in-out overflow-hidden
      "
    >
      {/* ── Logo / Header ── */}
      <div
        className="flex items-center border-b border-border shrink-0 px-4"
        style={{ height: '64px' }}
      >
        {/* Logo mark — always visible */}
        <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shrink-0">
          <Truck className="w-4 h-4 text-white" />
        </div>

        {/* Brand name — hidden when collapsed */}
        {!collapsed && (
          <span className="ml-2.5 text-[15px] font-bold text-content-primary tracking-tight truncate flex-1">
            TransitOps
          </span>
        )}

        {/* Toggle button */}
        <div className={collapsed ? 'mx-auto mt-0' : 'ml-auto'}>
          {isMobile ? (
            <button onClick={onClose} className="btn-icon btn-ghost" aria-label="Close menu">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onToggle}
              className="btn-icon btn-ghost"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed
                ? <ChevronRight className="w-4 h-4 text-content-muted" />
                : <ChevronLeft  className="w-4 h-4 text-content-muted" />
              }
            </button>
          )}
        </div>
      </div>

      {/* ── Main Navigation ── */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-3 px-2 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.id}>
            {/* Section label — hidden when collapsed */}
            {!collapsed && (
              <p className="px-3 mb-1 text-[10px] font-semibold text-content-disabled uppercase tracking-[0.1em]">
                {section.label}
              </p>
            )}
            {/* Divider when collapsed */}
            {collapsed && (
              <div className="mx-3 mb-2 border-t border-border/60" />
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.id}>
                  <NavItem
                    item={item}
                    collapsed={collapsed}
                    onClick={isMobile ? onClose : undefined}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Bottom Utility Items ── */}
      <div className="shrink-0 border-t border-border px-2 py-3 space-y-0.5">
        {NAV_BOTTOM.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            onClick={
              item.isDanger
                ? handleLogout
                : isMobile ? onClose : undefined
            }
          />
        ))}
      </div>

      {/* ── User Profile Strip ── */}
      <div className="shrink-0 border-t border-border px-2 py-3">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-bg-active/50 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold text-white">A</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-content-primary truncate leading-none">Admin User</p>
              <p className="text-[10px] text-content-muted truncate mt-0.5">admin@transitops.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
