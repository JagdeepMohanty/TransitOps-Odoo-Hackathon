import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown,
  MoreHorizontal, Edit2, Trash2, UserX, UserCheck2,
  ChevronLeft, ChevronRight, Filter, UserPlus, Download,
  Mail, Phone, MapPin,
} from 'lucide-react';
import { USERS_DATA } from '@utils/settingsMockData';
import RoleBadge from './RoleBadge';
import StatusBadge from './StatusBadge';

const AVATAR_GRADIENTS = [
  'from-blue-500 to-violet-600',
  'from-emerald-500 to-cyan-500',
  'from-orange-500 to-rose-500',
  'from-violet-500 to-blue-500',
  'from-cyan-500 to-emerald-500',
  'from-rose-500 to-orange-500',
  'from-indigo-500 to-purple-600',
  'from-teal-500 to-blue-500',
];

const PAGE_SIZE = 6;

export default function UserManagementTable({ onEdit, onDelete, onAdd }) {
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatus]   = useState('all');
  const [sortKey, setSortKey]       = useState('name');
  const [sortDir, setSortDir]       = useState('asc');
  const [page, setPage]             = useState(1);
  const [openMenu, setOpenMenu]     = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const filtered = useMemo(() => {
    let d = USERS_DATA;
    if (search)               d = d.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
    if (roleFilter !== 'all') d = d.filter(u => u.role === roleFilter);
    if (statusFilter !== 'all') d = d.filter(u => u.status === statusFilter);
    d = [...d].sort((a, b) => {
      const av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return d;
  }, [search, roleFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
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

  const activeCount    = USERS_DATA.filter(u => u.status === 'active').length;
  const pendingCount   = USERS_DATA.filter(u => u.status === 'pending').length;
  const suspendedCount = USERS_DATA.filter(u => u.status === 'suspended').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-bg-card/90 backdrop-blur-sm border border-border/60 rounded-2xl shadow-card-md overflow-hidden"
    >
      {/* ── Card Header ── */}
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 border-b border-border/50 bg-gradient-to-r from-bg-card to-bg-card/80 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <UserCheck2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-content-primary">User Management</h3>
            <p className="text-xs text-content-muted">Manage team members, roles and access control</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
          <span className="px-2.5 py-1 rounded-full bg-success/10 border border-success/20 text-[10px] font-black text-success">{activeCount} Active</span>
          <span className="px-2.5 py-1 rounded-full bg-warning/10 border border-warning/20 text-[10px] font-black text-warning">{pendingCount} Pending</span>
          <span className="px-2.5 py-1 rounded-full bg-danger/10 border border-danger/20 text-[10px] font-black text-danger">{suspendedCount} Suspended</span>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white text-[10px] font-black shadow-[0_0_16px_rgba(59,130,246,0.3)] hover:shadow-[0_0_24px_rgba(59,130,246,0.45)] transition-all duration-200"
          >
            <UserPlus className="w-3 h-3" /> Add User
          </motion.button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-3.5 border-b border-border/40 bg-bg-base/20">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-muted" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2 bg-bg-secondary border border-border rounded-xl text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-2 bg-bg-secondary border border-border rounded-xl text-xs text-content-muted">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filter</span>
          </div>
          <select
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-bg-secondary border border-border rounded-xl text-xs text-content-secondary focus:outline-none focus:border-primary/60 transition-all cursor-pointer"
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
            className="px-3 py-2 bg-bg-secondary border border-border rounded-xl text-xs text-content-secondary focus:outline-none focus:border-primary/60 transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-bg-secondary border border-border rounded-xl text-xs text-content-muted hover:text-content-primary hover:border-border-strong transition-all">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead className="sticky top-0 z-10 bg-bg-base/95 backdrop-blur-sm">
            <tr className="border-b border-border/50">
              {[
                { key: 'name',       label: 'User'       },
                { key: 'role',       label: 'Role'       },
                { key: 'department', label: 'Department' },
                { key: 'status',     label: 'Status'     },
                { key: 'lastLogin',  label: 'Last Login' },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-5 py-3 text-left text-[10px] font-black text-content-muted uppercase tracking-widest cursor-pointer hover:text-content-secondary select-none whitespace-nowrap transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-5 py-3 text-left text-[10px] font-black text-content-muted uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/25">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-content-muted">
                  No users match your filters.
                </td>
              </tr>
            ) : paged.map((user, idx) => (
              <>
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => setExpandedRow(expandedRow === user.id ? null : user.id)}
                  className="hover:bg-primary/[0.04] transition-colors duration-150 group cursor-pointer"
                >
                  {/* Avatar + Name + Email */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-200`}>
                        <span className="text-xs font-black text-white">{user.avatar}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-content-primary truncate group-hover:text-primary transition-colors">{user.name}</p>
                        <p className="text-[11px] text-content-muted truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><RoleBadge role={user.role} /></td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-content-secondary bg-bg-base/80 px-2.5 py-1 rounded-lg border border-border/50 font-semibold">
                      {user.department}
                    </span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={user.status} /></td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-content-muted">{user.lastLogin}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative">
                      <button
                        onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === user.id ? null : user.id); }}
                        className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-bg-hover transition-all duration-150 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {openMenu === user.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 top-full mt-1 z-50 w-48 bg-bg-card border border-border/80 rounded-xl shadow-modal overflow-hidden"
                            >
                              <div className="px-3 py-2 border-b border-border/50">
                                <p className="text-[10px] font-black text-content-muted uppercase tracking-wider">Actions for {user.name.split(' ')[0]}</p>
                              </div>
                              <button
                                onClick={() => { onEdit(user); setOpenMenu(null); }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-content-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" /> Edit User
                              </button>
                              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-content-secondary hover:bg-warning/10 hover:text-warning transition-colors">
                                <UserX className="w-3.5 h-3.5" /> Suspend User
                              </button>
                              <div className="border-t border-border/50 my-0.5" />
                              <button
                                onClick={() => { onDelete(user); setOpenMenu(null); }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-danger hover:bg-danger/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete User
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>

                {/* Expanded detail row */}
                <AnimatePresence>
                  {expandedRow === user.id && (
                    <motion.tr
                      key={`${user.id}-detail`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td colSpan={6} className="px-5 py-3 bg-primary/[0.03] border-b border-primary/10">
                        <div className="flex flex-wrap items-center gap-4 text-xs text-content-muted">
                          {user.phone && (
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-primary" />
                              {user.phone}
                            </span>
                          )}
                          {user.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-accent" />
                              {user.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-success" />
                            {user.email}
                          </span>
                          <span className="ml-auto text-[10px] text-content-disabled">Joined {user.joined}</span>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between px-6 py-3.5 border-t border-border/50 bg-bg-base/20">
        <span className="text-xs text-content-muted">
          Showing <span className="font-bold text-content-secondary">{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="font-bold text-content-secondary">{filtered.length}</span> users
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
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all duration-150 ${
                p === page
                  ? 'bg-primary text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                  : 'text-content-muted hover:text-content-primary hover:bg-bg-hover'
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
    </motion.div>
  );
}
