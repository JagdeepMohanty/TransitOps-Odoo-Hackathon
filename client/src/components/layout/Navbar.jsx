import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Menu, Search, Bell, Settings, LogOut, ChevronRight,
  User, Shield, X, CheckCheck, Clock, Truck, AlertTriangle,
} from 'lucide-react';
import { useAuth }  from '@context/AuthContext';
import { useTheme } from '@context/ThemeContext';

// ─── Route → Breadcrumb label map ────────────────────────────
const ROUTE_LABELS = {
  dashboard:   'Dashboard',
  vehicles:    'Vehicles',
  drivers:     'Drivers',
  trips:       'Trips',
  maintenance: 'Maintenance',
  finance:     'Finance',
  fuel:        'Fuel Logs',
  expenses:    'Expenses',
  reports:     'Reports',
  profile:     'Profile',
  settings:    'Settings',
};

// ─── Role badge colours ───────────────────────────────────────
const ROLE_STYLES = {
  admin:    'bg-primary/15 text-primary border-primary/30',
  manager:  'bg-accent/15 text-accent border-accent/30',
  driver:   'bg-secondary/15 text-secondary border-secondary/30',
  viewer:   'bg-bg-hover text-content-muted border-border',
};

// ─── Mock notifications ───────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, icon: Truck,         color: 'text-primary',   title: 'Trip #1042 dispatched',          time: '2 min ago',  unread: true  },
  { id: 2, icon: AlertTriangle, color: 'text-warning',   title: 'Vehicle KA-01 needs service',    time: '18 min ago', unread: true  },
  { id: 3, icon: CheckCheck,    color: 'text-success',   title: 'Expense report approved',        time: '1 hr ago',   unread: true  },
  { id: 4, icon: Clock,         color: 'text-info',      title: 'Driver license expiring soon',   time: '3 hr ago',   unread: false },
  { id: 5, icon: Truck,         color: 'text-content-muted', title: 'Trip #1039 completed',       time: 'Yesterday',  unread: false },
];

// ─── Click-outside hook ───────────────────────────────────────
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

// ─── Breadcrumb ───────────────────────────────────────────────
function Breadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  if (!segments.length) return null;

  return (
    <nav className="hidden md:flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
      <Link to="/dashboard" className="text-content-disabled hover:text-content-muted transition-colors duration-150 text-xs">
        Home
      </Link>
      {segments.map((seg, i) => {
        const label = ROUTE_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
        const path  = '/' + segments.slice(0, i + 1).join('/');
        const isLast = i === segments.length - 1;
        return (
          <span key={path} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-content-disabled" />
            {isLast ? (
              <span className="text-xs font-semibold text-content-primary">{label}</span>
            ) : (
              <Link to={path} className="text-xs text-content-disabled hover:text-content-muted transition-colors duration-150">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

// ─── Search Bar ───────────────────────────────────────────────
function SearchBar({ mobile, onClose }) {
  const [query, setQuery] = useState('');

  if (mobile) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-navbar">
        <Search className="w-4 h-4 text-content-disabled shrink-0" />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search vehicles, drivers, trips..."
          className="flex-1 bg-transparent text-sm text-content-primary placeholder:text-content-disabled outline-none"
        />
        <button onClick={onClose} className="btn-icon btn-ghost p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative hidden sm:flex items-center">
      <Search className="absolute left-3 w-4 h-4 text-content-disabled pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="
          pl-9 pr-4 h-9 w-52 lg:w-64 xl:w-72 rounded-lg text-sm
          bg-bg-base border border-border text-content-primary
          placeholder:text-content-disabled
          focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus
          transition-all duration-200
        "
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-2.5 text-content-disabled hover:text-content-muted transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// ─── Notification Panel ───────────────────────────────────────
function NotificationPanel({ onClose }) {
  const [items, setItems] = useState(NOTIFICATIONS);
  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <div className="
      absolute right-0 top-full mt-2 w-80 sm:w-96
      bg-bg-dropdown border border-border rounded-xl shadow-modal
      animate-fade-up overflow-hidden z-tooltip
    ">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-content-primary">Notifications</span>
          {unreadCount > 0 && (
            <span className="badge badge-primary text-[10px] px-1.5 py-0.5">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs text-primary hover:text-primary-hover transition-colors">
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <ul className="max-h-72 overflow-y-auto divide-y divide-border/50 scrollbar-hide">
        {items.map(({ id, icon: Icon, color, title, time, unread }) => (
          <li
            key={id}
            className={`
              flex items-start gap-3 px-4 py-3 cursor-pointer
              hover:bg-bg-hover transition-colors duration-150
              ${unread ? 'bg-primary/5' : ''}
            `}
          >
            <div className={`w-8 h-8 rounded-lg bg-bg-base flex items-center justify-center shrink-0 mt-0.5 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs leading-snug truncate ${unread ? 'font-semibold text-content-primary' : 'text-content-secondary'}`}>
                {title}
              </p>
              <p className="text-[10px] text-content-disabled mt-0.5">{time}</p>
            </div>
            {unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border text-center">
        <button className="text-xs text-primary hover:text-primary-hover transition-colors font-medium">
          View all notifications
        </button>
      </div>
    </div>
  );
}

// ─── Profile Dropdown ─────────────────────────────────────────
function ProfileDropdown({ user, onClose }) {
  const navigate  = useNavigate();
  const { logout } = useAuth();

  const role      = user?.role ?? 'admin';
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const initials  = (user?.name ?? 'Admin User').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  function handleLogout() {
    onClose();
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="
      absolute right-0 top-full mt-2 w-64
      bg-bg-dropdown border border-border rounded-xl shadow-modal
      animate-fade-up overflow-hidden z-tooltip
    ">
      {/* User info */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center shrink-0 shadow-glow-sm">
            <span className="text-sm font-bold text-white">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-content-primary truncate">
              {user?.name ?? 'Admin User'}
            </p>
            <p className="text-xs text-content-muted truncate">
              {user?.email ?? 'admin@transitops.com'}
            </p>
            <span className={`badge border text-[10px] mt-1 ${ROLE_STYLES[role] ?? ROLE_STYLES.viewer}`}>
              <Shield className="w-2.5 h-2.5" />
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        <button
          onClick={() => { onClose(); navigate('/profile'); }}
          className="dropdown-item w-full"
        >
          <User className="w-4 h-4" />
          My Profile
        </button>
        <button
          onClick={() => { onClose(); navigate('/settings'); }}
          className="dropdown-item w-full"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      <div className="dropdown-divider" />

      <div className="py-1">
        <button onClick={handleLogout} className="dropdown-item-danger w-full">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────
export default function Navbar({ onMenuClick }) {
  const { user }  = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  const closeNotif   = useCallback(() => setNotifOpen(false),   []);
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  useClickOutside(notifRef,   closeNotif);
  useClickOutside(profileRef, closeProfile);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;
  const initials    = (user?.name ?? 'Admin User').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const role        = user?.role ?? 'admin';
  const roleLabel   = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <>
      <header
        style={{ height: '72px', backgroundColor: '#1F2937' }}
        className="
          sticky top-0 z-navbar shrink-0
          flex items-center justify-between
          px-4 sm:px-6
          border-b border-border
          shadow-[0_4px_24px_rgba(0,0,0,0.35)]
          rounded-b-none
        "
      >
        {/* ── LEFT ── */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={onMenuClick}
            className="btn-icon btn-ghost lg:hidden shrink-0"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5 text-content-secondary" />
          </button>

          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Desktop search */}
          <div className="hidden sm:block">
            <SearchBar />
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Mobile search toggle */}
          <button
            onClick={() => setMobileSearch(true)}
            className="btn-icon btn-ghost sm:hidden"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-content-muted" />
          </button>

          {/* Divider */}
          <div className="hidden sm:block w-px h-5 bg-border mx-1" />

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); }}
              className="btn-icon btn-ghost relative"
              aria-label="Notifications"
            >
              <Bell className="w-[18px] h-[18px] text-content-muted" />
              {unreadCount > 0 && (
                <span className="
                  absolute top-1 right-1 min-w-[16px] h-4 px-1
                  rounded-full bg-danger border-2 border-[#1F2937]
                  flex items-center justify-center
                  text-[9px] font-bold text-white leading-none
                ">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && <NotificationPanel onClose={closeNotif} />}
          </div>

          {/* Settings */}
          <button className="btn-icon btn-ghost" aria-label="Settings">
            <Settings className="w-[18px] h-[18px] text-content-muted" />
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-border mx-1" />

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); }}
              className="
                flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl
                hover:bg-bg-hover transition-all duration-200
                border border-transparent hover:border-border
              "
              aria-label="Profile menu"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center shrink-0 shadow-glow-sm">
                <span className="text-xs font-bold text-white">{initials}</span>
              </div>
              {/* Name + Role — hidden on small screens */}
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-content-primary leading-none">
                  {user?.name ?? 'Admin User'}
                </p>
                <span className={`badge border text-[9px] mt-0.5 py-0 px-1.5 ${ROLE_STYLES[role] ?? ROLE_STYLES.viewer}`}>
                  <Shield className="w-2 h-2" />
                  {roleLabel}
                </span>
              </div>
            </button>
            {profileOpen && <ProfileDropdown user={user} onClose={closeProfile} />}
          </div>
        </div>
      </header>

      {/* Mobile search bar — slides in below navbar */}
      {mobileSearch && (
        <div className="sm:hidden animate-fade-in">
          <SearchBar mobile onClose={() => setMobileSearch(false)} />
        </div>
      )}
    </>
  );
}
