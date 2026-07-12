import { useState, useRef, useEffect } from 'react';
import {
  BarChart3, Download, FileText, RefreshCw, Calendar,
  ChevronDown, FileSpreadsheet,
} from 'lucide-react';

const RANGES = [
  'Today', 'Last 7 days', 'Last 30 days',
  'Last 3 months', 'Last 6 months', 'Last year',
];

export default function ReportsHeader({ onRefresh, isRefreshing }) {
  const [dateRange, setDateRange]     = useState('Last 30 days');
  const [showDateMenu, setShowDateMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowDateMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">

      {/* ── Left: Title ── */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-glow-sm shrink-0">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-content-primary tracking-tight leading-tight">
            Reports &amp; Analytics
          </h1>
          <p className="text-xs text-content-muted mt-0.5 truncate">
            Fleet performance insights and business analytics
          </p>
        </div>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">

        {/* Date Range Picker */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowDateMenu(v => !v)}
            className="flex items-center gap-2 h-9 px-3 rounded-xl bg-bg-card border border-border text-xs text-content-secondary hover:border-primary/50 hover:text-content-primary transition-all duration-200 whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{dateRange}</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showDateMenu ? 'rotate-180' : ''}`} />
          </button>
          {showDateMenu && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-44 bg-bg-card border border-border rounded-xl shadow-modal overflow-hidden animate-fade-up">
              {RANGES.map(r => (
                <button
                  key={r}
                  onClick={() => { setDateRange(r); setShowDateMenu(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs transition-colors duration-150 ${
                    r === dateRange
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-content-secondary hover:bg-bg-hover hover:text-content-primary'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export CSV */}
        <button className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-bg-card border border-border text-xs text-content-secondary hover:border-success/50 hover:text-success transition-all duration-200 whitespace-nowrap">
          <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
          <span>Export CSV</span>
        </button>

        {/* Export PDF */}
        <button className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-bg-card border border-border text-xs text-content-secondary hover:border-warning/50 hover:text-warning transition-all duration-200 whitespace-nowrap">
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>Export PDF</span>
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          title="Refresh"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-bg-card border border-border text-content-muted hover:border-primary/50 hover:text-primary transition-all duration-200"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
        </button>

        {/* Download Report — primary CTA */}
        <button className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-glow-sm transition-all duration-200 whitespace-nowrap">
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>Download Report</span>
        </button>
      </div>
    </div>
  );
}
