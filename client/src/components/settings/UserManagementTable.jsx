import { useState, useMemo } from 'react';
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown,
  MoreHorizontal, Edit2, Trash2, UserX, UserCheck2,
  ChevronLeft, ChevronRight, Filter,
} from 'lucide-react';
import { USERS_DATA } from '@utils/settingsMockData';
import RoleBadge from './RoleBadge';
import StatusBadge from './StatusBadge';

const AVATAR_COLORS = [
  'from-primary to-accent', 'from-success to-[#38BDF8]',
  'from-warning to-danger', 'from-accent to-primary',
  'from-[#38BDF8] to-success', 'from-danger to-warning',
];

const PAGE_SIZE = 6;

export default function UserManagementTable({ onEdit, onDelete, onAdd }) {
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatus] = useState('all');
  const [sortKey, setSortKey]     = useState('name');
  const [sortDir, setSortDir]     = useState('asc');
  const [page, setPage]           = useState(1);
  const [openMenu, setOpenMenu]   = useState(null);

  const filtered = useMemo(() => {
    let d = USERS_DATA;
    if (search)       d = d.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
    if (roleFilter !== 'all')   d = d.filter(u => u.role === roleFilter);
    if (statusFilter !== 'all') d = d.filter(u => u.status === statusFilter);
    d = [...d].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return d;
  }, [search, roleFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 text-content-disabled" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-primary" />
      : <ChevronDown className="w-3 h-3 text-primary" />;
  };

  return (
    <div className="bg-bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/50">
        <div className="p-2 rounded-xl bg-primary/10">
          <UserCheck2 className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-content-primary">User Management</h3>
          <p className="text-xs text-content-muted">Manage team members, roles and access</p>
        </div>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold border border-primary/20">
          {USERS_DATA.length} Users
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 border-b border-border/40 bg-bg-base/30">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users by name or email…"
            className="w-full pl-9 pr-4 py-2 bg-bg-secondary border border-border rounded-xl text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-bg-secondary border border-border rounded-xl text-xs text-content-muted">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <select
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-bg-secondary border border-border rounded-xl text-xs text-content-secondary focus:outline-none focus:border-primary/60 transition-all"
          >
            <option value="all">All Roles</option>
            <option value="administrator">Administrator</option>
            <option value="fleet_manager">Fleet Manager</option>
            <option value="dispatcher">Dispatcher</option>
            <option value="safety_officer">Safety Officer</option>
            <option value="financial_analyst">Financial Analyst</option>
            <option value="driver">Driver</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-bg-secondary border border-border rounded-xl text-xs text-content-secondary focus:outline-none focus:border-primary/60 transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="sticky top-0 z-10 bg-bg-base/90 backdrop-blur-sm">
            <tr className="border-b border-border/50">
              {[
                { key: 'name',      label: 'User'       },
                { key: 'role',      label: 'Role'       },
                { key: 'department',label: 'Department' },
                { key: 'status',    label: 'Status'     },
                { key: 'lastLogin', label: 'Last Login' },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-[10px] font-semibold text-content-muted uppercase tracking-wider cursor-pointer hover:text-content-secondary select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-content-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {paged.map((user, idx) => (
              <tr key={user.id} className="hover:bg-bg-hover/40 transition-colors duration-150 group">
                {/* Avatar + Name */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center shrink-0 shadow-sm`}>
                      <span className="text-xs font-bold text-white">{user.avatar}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-content-primary truncate">{user.name}</p>
                      <p className="text-xs text-content-muted truncate">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5"><RoleBadge role={user.role} /></td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-content-secondary bg-bg-base px-2 py-1 rounded-lg border border-border/50">
                    {user.department}
                  </span>
                </td>
                <td className="px-4 py-3.5"><StatusBadge status={user.status} /></td>
                <td className="px-4 py-3.5 text-xs text-content-muted">{user.lastLogin}</td>
                <td className="px-4 py-3.5">
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                      className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-bg-hover transition-all duration-150"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenu === user.id && (
                      <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-bg-card border border-border rounded-xl shadow-modal overflow-hidden animate-fade-up">
                        <button
                          onClick={() => { onEdit(user); setOpenMenu(null); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-content-secondary hover:bg-bg-hover hover:text-content-primary transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit User
                        </button>
                        <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-content-secondary hover:bg-bg-hover hover:text-content-primary transition-colors">
                          <UserX className="w-3.5 h-3.5" /> Suspend User
                        </button>
                        <div className="border-t border-border/50 my-0.5" />
                        <button
                          onClick={() => { onDelete(user); setOpenMenu(null); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-danger hover:bg-danger/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border/50">
        <span className="text-xs text-content-muted">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                p === page ? 'bg-primary text-white' : 'text-content-muted hover:text-content-primary hover:bg-bg-hover'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
