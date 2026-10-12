import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '../../../services/api.js';
import { useApp } from '../../../store/AppContext.jsx';

/**
 * Custom hook encapsulating user list, stats, pagination, and mutation logic
 */
export function useUsers() {
  const { addToast } = useApp();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, blocked: 0 });

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Selected User / Modals State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await usersApi.getStats();
      const payload = res?.data !== undefined ? res.data : res;
      if (payload && typeof payload === 'object') {
        setStats(payload);
      }
    } catch (err) {
      console.error('Failed to load user stats:', err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAll({
        page,
        skip: (page - 1) * limit,
        limit,
        search: searchTerm || undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      });

      const payload = res?.data !== undefined ? res.data : res;
      if (payload) {
        const items = Array.isArray(payload) ? payload : payload.items || [];
        setUsers(items);
        setTotal(payload.pagination?.total ?? items.length);
        setTotalPages(payload.pagination?.totalPages ?? 1);
      }
    } catch (err) {
      addToast?.('Failed to load users: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, selectedStatus, addToast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateOrUpdate = async (userData) => {
    try {
      if (userToEdit) {
        await usersApi.update(userToEdit.id, userData);
        addToast?.('User updated successfully', 'success');
      } else {
        await usersApi.create(userData);
        addToast?.('User created successfully', 'success');
      }
      setIsModalOpen(false);
      setUserToEdit(null);
      fetchUsers();
      fetchStats();
    } catch (err) {
      addToast?.(err.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await usersApi.delete(userToDelete.id);
      addToast?.('User deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
      fetchStats();
    } catch (err) {
      addToast?.(err.message || 'Failed to delete user', 'error');
    }
  };

  const handleToggleStatus = async (user, newStatus) => {
    try {
      await usersApi.toggleStatus(user.id, newStatus);
      addToast?.(`User status updated to ${newStatus}`, 'success');
      fetchUsers();
      fetchStats();
    } catch (err) {
      addToast?.(err.message || 'Failed to update user status', 'error');
    }
  };

  return {
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
    refresh: fetchUsers,
  };
}
