import { useState } from 'react';
import { RefreshCw, Bell, Download, Calendar } from 'lucide-react';

export default function DashboardHeader() {
  const [refreshing, setRefreshing] = useState(false);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-content-primary tracking-tight">Dashboard</h1>
        <p className="text-sm text-content-muted mt-0.5">Monitor your transport operations in real time.</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Date */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-card border border-border text-xs text-content-muted">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline">{dateStr}</span>
          <span className="sm:hidden">{now.toLocaleDateString('en-IN')}</span>
        </div>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-card border border-border text-xs text-content-muted hover:text-content-primary hover:border-border-strong transition-all duration-200"
          aria-label="Refresh dashboard"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-bg-card border border-border text-content-muted hover:text-content-primary hover:border-border-strong transition-all duration-200"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger border-2 border-bg-card" />
        </button>

        {/* Export */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-all duration-200 shadow-glow-sm">
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>
    </div>
  );
}
