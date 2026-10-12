import React from 'react';
import { PageHeader, Pagination } from '../components/ui/index.jsx';
import Modal from '../components/ui/Modal.jsx';
import { useStaff } from '../features/staff/hooks/useStaff.js';
import { StaffStats } from '../features/staff/components/StaffStats.jsx';
import { StaffTable } from '../features/staff/components/StaffTable.jsx';
import { RolesTab } from '../features/staff/components/RolesTab.jsx';
import { AuditLogsTab } from '../features/staff/components/AuditLogsTab.jsx';
import { StaffModal } from '../features/staff/components/StaffModal.jsx';

export default function StaffPage() {
  const {
    tab,
    setTab,
    staff,
    loading,
    total,
    totalPages,
    page,
    setPage,
    limit,
    setLimit,
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    roles,
    auditLogs,
    auditLoading,
    modalOpen,
    setModalOpen,
    staffToEdit,
    setStaffToEdit,
    staffToDelete,
    setStaffToDelete,
    isDeleteOpen,
    setIsDeleteOpen,
    handleSaveStaff,
    handleDeleteStaff,
    activeStaffCount,
  } = useStaff();

  return (
    <div className="page-container">
      <PageHeader
        title="Staff & Access Management"
        subtitle="Manage team members, roles & permissions, and audit security trail."
      />

      {/* KPI Stats */}
      <StaffStats
        totalStaff={total}
        activeStaff={activeStaffCount}
        rolesCount={roles.length}
        loading={loading}
      />

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', borderBottom: '1px solid var(--border-default)', marginBottom: 'var(--space-5)' }}>
        {[
          { id: 'staff', label: `Team Members (${total})` },
          { id: 'roles', label: `Roles & Permissions (${roles.length || 4})` },
          { id: 'audit', label: 'Security & Audit Logs' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              border: 'none',
              background: 'transparent',
              fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? 'var(--brand-600)' : 'var(--text-secondary)',
              borderBottom: tab === t.id ? '2px solid var(--brand-600)' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '0.9375rem',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {tab === 'staff' && (
        <>
          <StaffTable
            staff={staff}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            roles={roles}
            onAddStaff={() => {
              setStaffToEdit(null);
              setModalOpen(true);
            }}
            onEditStaff={(s) => {
              setStaffToEdit(s);
              setModalOpen(true);
            }}
            onDeleteStaff={(s) => {
              setStaffToDelete(s);
              setIsDeleteOpen(true);
            }}
          />
          {!loading && totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {tab === 'roles' && <RolesTab roles={roles} />}

      {tab === 'audit' && <AuditLogsTab logs={auditLogs} loading={auditLoading} />}

      {/* Add / Edit Staff Modal */}
      <StaffModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setStaffToEdit(null);
        }}
        staff={staffToEdit}
        roles={roles}
        onSubmit={handleSaveStaff}
      />

      {/* Delete Staff Confirmation Modal */}
      {isDeleteOpen && (
        <Modal
          title="Revoke Staff Access"
          onClose={() => {
            setIsDeleteOpen(false);
            setStaffToDelete(null);
          }}
          footer={
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleDeleteStaff}>
                Revoke Access
              </button>
            </div>
          }
        >
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            Are you sure you want to revoke access for team member <strong>{staffToDelete?.name}</strong>?
          </p>
        </Modal>
      )}
    </div>
  );
}
