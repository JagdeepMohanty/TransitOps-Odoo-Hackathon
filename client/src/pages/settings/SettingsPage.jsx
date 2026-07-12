import { useState } from 'react';
import { motion } from 'framer-motion';

import SettingsHeader           from '@components/settings/SettingsHeader';
import SettingsKpiCards         from '@components/settings/SettingsKpiCards';
import UserManagementTable      from '@components/settings/UserManagementTable';
import RolesCard                from '@components/settings/RolesCard';
import RolePermissionMatrix     from '@components/settings/RolePermissionMatrix';
import ApplicationSettingsCard  from '@components/settings/ApplicationSettingsCard';
import SecuritySettingsCard     from '@components/settings/SecuritySettingsCard';
import NotificationSettingsCard from '@components/settings/NotificationSettingsCard';
import ActivityTimeline         from '@components/settings/ActivityTimeline';
import UserModal                from '@components/settings/UserModal';
import RoleModal                from '@components/settings/RoleModal';

function Divider({ label, description }) {
  return (
    <div className="flex items-center gap-4 py-1">
      <div className="flex-1 h-px bg-gradient-to-r from-border/60 to-transparent" />
      <div className="text-center shrink-0">
        <span className="text-[10px] font-black text-content-disabled uppercase tracking-[0.2em] px-3">{label}</span>
        {description && <p className="text-[9px] text-content-disabled/60 mt-0.5">{description}</p>}
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-border/60 to-transparent" />
    </div>
  );
}

export default function SettingsPage() {
  const [userModal, setUserModal] = useState({ mode: null, user: null });
  const [roleModal, setRoleModal] = useState({ mode: null, role: null });

  const openAddUser    = ()     => setUserModal({ mode: 'add',    user: null });
  const openEditUser   = (user) => setUserModal({ mode: 'edit',   user });
  const openDeleteUser = (user) => setUserModal({ mode: 'delete', user });
  const closeUserModal = ()     => setUserModal({ mode: null,     user: null });

  const openCreateRole = ()     => setRoleModal({ mode: 'create', role: null });
  const openEditRole   = (role) => setRoleModal({ mode: 'edit',   role });
  const closeRoleModal = ()     => setRoleModal({ mode: null,     role: null });

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
        className="space-y-6 pb-12">

        <SettingsHeader onAddUser={openAddUser} onCreateRole={openCreateRole} onSave={() => {}} />

        <Divider label="Overview" description="Platform-wide metrics at a glance" />
        <SettingsKpiCards />

        <Divider label="User Management" description="Manage team members and access control" />
        <UserManagementTable onEdit={openEditUser} onDelete={openDeleteUser} onAdd={openAddUser} />

        <Divider label="Roles" description="Define and manage organizational roles" />
        <RolesCard onEdit={openEditRole} onCreate={openCreateRole} />

        <Divider label="Permission Matrix" description="Module-level access control per role" />
        <RolePermissionMatrix />

        <Divider label="Application & Security" description="Company settings and security configuration" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <ApplicationSettingsCard />
          <SecuritySettingsCard />
        </div>

        <Divider label="Notifications & Activity" description="Alert preferences and system audit log" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2"><NotificationSettingsCard /></div>
          <ActivityTimeline />
        </div>

      </motion.div>

      <UserModal mode={userModal.mode} user={userModal.user} onClose={closeUserModal} onConfirm={closeUserModal} />
      <RoleModal mode={roleModal.mode} role={roleModal.role} onClose={closeRoleModal} onConfirm={closeRoleModal} />
    </>
  );
}
