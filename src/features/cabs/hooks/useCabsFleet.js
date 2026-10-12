import { useState, useEffect, useCallback } from 'react';
import { driversApi, vehiclesApi } from '../../../services/api.js';
import { mockCabBookings } from '../../../data/mockData.js';
import { useApp } from '../../../store/AppContext.jsx';

export function useCabsFleet() {
  const { addToast } = useApp();

  const [tab, setTab] = useState('drivers'); // 'rides', 'drivers', 'vehicles'
  const [rides, setRides] = useState(mockCabBookings);
  const [ridesSearch, setRidesSearch] = useState('');
  const [driverSearch, setDriverSearch] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');

  // Drivers State
  const [drivers, setDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(true);
  const [driversPage, setDriversPage] = useState(1);
  const [driversTotal, setDriversTotal] = useState(0);
  const [driversTotalPages, setDriversTotalPages] = useState(1);
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState(null);
  const [driverToDelete, setDriverToDelete] = useState(null);
  const [isDeleteDriverOpen, setIsDeleteDriverOpen] = useState(false);

  // Vehicles State
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehiclesPage, setVehiclesPage] = useState(1);
  const [vehiclesTotal, setVehiclesTotal] = useState(0);
  const [vehiclesTotalPages, setVehiclesTotalPages] = useState(1);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [isDeleteVehicleOpen, setIsDeleteVehicleOpen] = useState(false);

  const perPage = 12;

  const loadDrivers = useCallback(async () => {
    setDriversLoading(true);
    try {
      const res = await driversApi.getAll({
        page: driversPage,
        limit: perPage,
        search: driverSearch || undefined,
      });
      const data = res?.data !== undefined ? res.data : res;
      if (data && Array.isArray(data.items)) {
        setDrivers(data.items);
        setDriversTotal(data.pagination?.total ?? data.items.length);
        setDriversTotalPages(data.pagination?.totalPages ?? 1);
      } else if (Array.isArray(data)) {
        setDrivers(data);
        setDriversTotal(data.length);
        setDriversTotalPages(1);
      } else {
        setDrivers([]);
        setDriversTotal(0);
      }
    } catch (err) {
      console.warn('Could not load drivers:', err);
      setDrivers([]);
    } finally {
      setDriversLoading(false);
    }
  }, [driversPage, driverSearch]);

  const loadVehicles = useCallback(async () => {
    setVehiclesLoading(true);
    try {
      const res = await vehiclesApi.getAll({
        page: vehiclesPage,
        limit: perPage,
        search: vehicleSearch || undefined,
      });
      const data = res?.data !== undefined ? res.data : res;
      if (data && Array.isArray(data.items)) {
        setVehicles(data.items);
        setVehiclesTotal(data.pagination?.total ?? data.items.length);
        setVehiclesTotalPages(data.pagination?.totalPages ?? 1);
      } else if (Array.isArray(data)) {
        setVehicles(data);
        setVehiclesTotal(data.length);
        setVehiclesTotalPages(1);
      } else {
        setVehicles([]);
        setVehiclesTotal(0);
      }
    } catch (err) {
      console.warn('Could not load vehicles:', err);
      setVehicles([]);
    } finally {
      setVehiclesLoading(false);
    }
  }, [vehiclesPage, vehicleSearch]);

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const handleSaveDriver = async (driverPayload) => {
    try {
      if (driverToEdit) {
        await driversApi.update(driverToEdit.id, driverPayload);
        addToast?.('Driver details updated successfully', 'success');
      } else {
        await driversApi.create(driverPayload);
        addToast?.('Driver registered and onboarded successfully', 'success');
      }
      setDriverModalOpen(false);
      setDriverToEdit(null);
      loadDrivers();
    } catch (err) {
      addToast?.(err.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteDriver = async () => {
    if (!driverToDelete) return;
    try {
      await driversApi.delete(driverToDelete.id);
      addToast?.('Driver removed from active fleet', 'success');
      setIsDeleteDriverOpen(false);
      setDriverToDelete(null);
      loadDrivers();
    } catch (err) {
      addToast?.(err.message || 'Failed to delete driver', 'error');
    }
  };

  const handleSaveVehicle = async (vehiclePayload) => {
    try {
      if (vehicleToEdit) {
        await vehiclesApi.update(vehicleToEdit.id, vehiclePayload);
        addToast?.('Vehicle details updated successfully', 'success');
      } else {
        await vehiclesApi.create(vehiclePayload);
        addToast?.('New cab vehicle added to fleet', 'success');
      }
      setVehicleModalOpen(false);
      setVehicleToEdit(null);
      loadVehicles();
    } catch (err) {
      addToast?.(err.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;
    try {
      await vehiclesApi.delete(vehicleToDelete.id);
      addToast?.('Vehicle deregistered from fleet', 'success');
      setIsDeleteVehicleOpen(false);
      setVehicleToDelete(null);
      loadVehicles();
    } catch (err) {
      addToast?.(err.message || 'Failed to delete vehicle', 'error');
    }
  };

  return {
    tab,
    setTab,
    rides,
    ridesSearch,
    setRidesSearch,
    driverSearch,
    setDriverSearch,
    vehicleSearch,
    setVehicleSearch,
    drivers,
    driversLoading,
    driversPage,
    setDriversPage,
    driversTotal,
    driversTotalPages,
    driverModalOpen,
    setDriverModalOpen,
    driverToEdit,
    setDriverToEdit,
    driverToDelete,
    setDriverToDelete,
    isDeleteDriverOpen,
    setIsDeleteDriverOpen,
    vehicles,
    vehiclesLoading,
    vehiclesPage,
    setVehiclesPage,
    vehiclesTotal,
    vehiclesTotalPages,
    vehicleModalOpen,
    setVehicleModalOpen,
    vehicleToEdit,
    setVehicleToEdit,
    vehicleToDelete,
    setVehicleToDelete,
    isDeleteVehicleOpen,
    setIsDeleteVehicleOpen,
    handleSaveDriver,
    handleDeleteDriver,
    handleSaveVehicle,
    handleDeleteVehicle,
    refreshDrivers: loadDrivers,
    refreshVehicles: loadVehicles,
  };
}
