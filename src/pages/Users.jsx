import React from 'react';
import { Plus, Download } from 'lucide-react';
import { PageHeader, Pagination } from '../components/ui/index.jsx';
import Modal from '../components/ui/Modal.jsx';
import { exportToCSV } from '../utils/export.js';
import { useUsers } from '../features/users/hooks/useUsers.js';
import { UserStats } from '../features/users/components/UserStats.jsx';
import { UserFilters } from '../features/users/components/UserFilters.jsx';
import { UserTable } from '../features/users/components/UserTable.jsx';
import { UserDrawer } from '../features/users/components/UserDrawer.jsx';
import { UserModal } from '../features/users/components/UserModal.jsx';

/**
 * Users Management Page Container
 */
export default function UsersPage() {
  const {
    users,
    loading,
    stats,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    viewMode,
    setViewMode,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    selectedUser,
    setSelectedUser,
    isDrawerOpen,
    setIsDrawerOpen,
    isModalOpen,
    setIsModalOpen,
    userToEdit,
    setUserToEdit,
    userToDelete,
    setUserToDelete,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleCreateOrUpdate,
    handleDeleteUser,
    handleToggleStatus,
  } = useUsers();

  const handleExport = () => {
    const exportData = users.map((u) => ({
      ID: u.usrCode || u.id,
      Name: u.name,
      Email: u.email,
      Phone: u.phone,
      Status: u.status,
      Bookings: u.bookingsCount || 0,
      TotalSpent: u.totalSpent || '₹0',
      Joined: u.joined,
    }));
    exportToCSV(exportData, 'users_export.csv');
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Users Management"
        subtitle="Manage customer profiles, booking histories, and account status."
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleExport}>
              <Download size={15} style={{ marginRight: '6px' }} />
              Export
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setUserToEdit(null);
                setIsModalOpen(true);
              }}
            >
              <Plus size={15} style={{ marginRight: '6px' }} />
              Add User
            </button>
          </div>
        }
      />

      {/* KPI Stats */}
      <UserStats stats={stats} loading={loading && users.length === 0} />

      {/* Search & Filters */}
      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Data Table / Cards */}
      <UserTable
        users={users}
        loading={loading}
        viewMode={viewMode}
        onView={(u) => {
          setSelectedUser(u);
          setIsDrawerOpen(true);
        }}
        onEdit={(u) => {
          setUserToEdit(u);
          setIsModalOpen(true);
        }}
        onDelete={(u) => {
          setUserToDelete(u);
          setIsDeleteModalOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
      />

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      )}

      {/* User Details Slide Drawer */}
      <UserDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Create / Edit User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUserToEdit(null);
        }}
        user={userToEdit}
        onSubmit={handleCreateOrUpdate}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          title="Confirm Deletion"
          onClose={() => {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
          }}
          footer={
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setUserToDelete(null);
                }}
              >
                Cancel
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleDeleteUser}>
                Delete User
              </button>
            </div>
          }
        >
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Are you sure you want to delete user{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{userToDelete?.name}</strong>? This will soft-delete
            their profile.
          </p>
        </Modal>
      )}
    </div>
  );
}
