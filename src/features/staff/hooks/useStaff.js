import { useState, useEffect, useCallback } from 'react';
import { staffApi, rolesApi, auditApi } from '../../../services/api.js';
import { useApp } from '../../../store/AppContext.jsx';

export function useStaff() {
  const { addToast } = useApp();

  const [tab, setTab] = useState('staff'); // 'staff', 'roles', 'audit'
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Roles & Audit states
  const [roles, setRoles] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState(null);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await staffApi.getAll({
        page,
        limit,
        search: searchTerm || undefined,
        role: selectedRole !== 'All' ? selectedRole : undefined,
      });
      const data = res?.data !== undefined ? res.data : res;
      if (data && Array.isArray(data.items)) {
        setStaff(data.items);
        setTotal(data.pagination?.total ?? data.items.length);
        setTotalPages(data.pagination?.totalPages ?? 1);
      } else if (Array.isArray(data)) {
        setStaff(data);
        setTotal(data.length);
        setTotalPages(1);
      } else {
        setStaff([]);
        setTotal(0);
      }
    } catch (err) {
      console.warn('Could not load staff:', err);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, selectedRole]);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await rolesApi.getAll();
      const data = res?.data !== undefined ? res.data : res;
      if (Array.isArray(data)) {
        setRoles(data);
      }
    } catch (err) {
      console.warn('Could not load roles:', err);
    }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    setAuditLoading(true);
    try {
      const res = await auditApi.getAll({ limit: 50 });
      const data = res?.data !== undefined ? res.data : res;
      if (Array.isArray(data)) {
        setAuditLogs(data);
      } else if (data && Array.isArray(data.items)) {
        setAuditLogs(data.items);
      }
    } catch (err) {
      console.warn('Could not load audit logs:', err);
    } finally {
      setAuditLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (tab === 'audit') {
      fetchAuditLogs();
    }
  }, [tab, fetchAuditLogs]);

  const handleSaveStaff = async (staffPayload) => {
    try {
      if (staffToEdit) {
        await staffApi.update(staffToEdit.id, staffPayload);
        addToast?.('Staff profile updated successfully', 'success');
      } else {
        await staffApi.create(staffPayload);
        addToast?.('New team member invited & onboarded', 'success');
      }
      setModalOpen(false);
      setStaffToEdit(null);
      fetchStaff();
    } catch (err) {
      addToast?.(err.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;
    try {
      await staffApi.delete(staffToDelete.id);
      addToast?.('Staff access revoked and account deleted', 'success');
      setIsDeleteOpen(false);
      setStaffToDelete(null);
      fetchStaff();
    } catch (err) {
      addToast?.(err.message || 'Failed to delete staff member', 'error');
    }
  };

  const activeStaffCount = staff.filter((s) => s.status === 'active').length;

  return {
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
    refreshStaff: fetchStaff,
  };
}
