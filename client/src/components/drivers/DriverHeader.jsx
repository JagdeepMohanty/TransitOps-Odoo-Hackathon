import { useState } from 'react';
import { Plus, Download, SlidersHorizontal, Search, X } from 'lucide-react';

export default function DriverHeader({ search, onSearch, onAdd, onExport, statusFilter, onStatusFilter }) {
  const [showSearch, setShowSearch] = useState(false);

  const STATUS_OPTS = [
    { value: '', label: 'All Status' },
    { value: 'available',  label: 'Available'  },
    { value: 'on_trip',    label: 'On Trip'    },
    { value: 'off_duty',   label: 'Off Duty'   },
    { value: 'suspended',  label: 'Suspended'  },
  ];

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-content-primary tracking-tight">
            Driver &amp; Safety Profiles
          </h1>
          <p className="text-sm text-content-muted mt-0.5">
            Manage driver information, license compliance, and safety performance.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search toggle (mobile) */}
          <button
            onClick={() => setShowSearch(p => !p)}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-bg-card border border-border text-content-muted hover:text-content-primary hover:border-border-strong transition-all duration-200"
            aria-label="Search"
          >
            {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          {/* Desktop search */}
          <div className="hidden sm:flex relative items-center">
            <Search className="absolute left-3 w-3.5 h-3.5 text-content-disabled pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search drivers..."
              className="pl-9 pr-4 h-9 w-52 rounded-xl text-xs bg-bg-card border border-border text-content-primary placeholder:text-content-disabled focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus transition-all duration-200"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => onStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-xl text-xs bg-bg-card border border-border text-content-secondary focus:outline-none focus:ring-2 focus:ring-border-focus transition-all duration-200 cursor-pointer"
          >
            {STATUS_OPTS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Export */}
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-card border border-border text-xs text-content-muted hover:text-content-primary hover:border-border-strong transition-all duration-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Add Driver */}
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-all duration-200 shadow-glow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Driver
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {showSearch && (
        <div className="sm:hidden relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-disabled pointer-events-none" />
          <input
            autoFocus
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search drivers..."
            className="w-full pl-9 pr-4 h-10 rounded-xl text-sm bg-bg-card border border-border text-content-primary placeholder:text-content-disabled focus:outline-none focus:ring-2 focus:ring-border-focus transition-all duration-200"
          />
        </div>
      )}
    </div>
  );
}
