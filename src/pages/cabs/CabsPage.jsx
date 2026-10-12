import React from 'react';
import { Plus, Download } from 'lucide-react';
import { PageHeader, Pagination } from '../../components/ui/index.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useCabsFleet } from '../../features/cabs/hooks/useCabsFleet.js';
import { CabStats } from '../../features/cabs/components/CabStats.jsx';
import { DriversTab } from '../../features/cabs/components/DriversTab.jsx';
import { VehiclesTab } from '../../features/cabs/components/VehiclesTab.jsx';
import { RidesTab } from '../../features/cabs/components/RidesTab.jsx';
import { DriverModal } from '../../features/cabs/components/DriverModal.jsx';
import { VehicleModal } from '../../features/cabs/components/VehicleModal.jsx';

export default function CabsPage() {
  const {
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
  } = useCabsFleet();

  return (
    <div className="page-container">
      <PageHeader
        title="Cabs & Fleet Management"
        subtitle="Manage taxi fleet vehicles, verified drivers, and live passenger ride bookings."
      />

      {/* KPI Stats */}
      <CabStats
        driversTotal={driversTotal}
        vehiclesTotal={vehiclesTotal}
        ridesTotal={rides.length}
        loading={driversLoading || vehiclesLoading}
      />

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', borderBottom: '1px solid var(--border-default)', marginBottom: 'var(--space-5)' }}>
        {[
          { id: 'drivers', label: `Fleet Drivers (${driversTotal})` },
          { id: 'vehicles', label: `Fleet Vehicles (${vehiclesTotal})` },
          { id: 'rides', label: `Passenger Rides (${rides.length})` },
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
      {tab === 'drivers' && (
        <>
          <DriversTab
            drivers={drivers}
            loading={driversLoading}
            searchTerm={driverSearch}
            onSearchChange={setDriverSearch}
            onAddDriver={() => {
              setDriverToEdit(null);
              setDriverModalOpen(true);
            }}
            onEditDriver={(d) => {
              setDriverToEdit(d);
              setDriverModalOpen(true);
            }}
            onDeleteDriver={(d) => {
              setDriverToDelete(d);
              setIsDeleteDriverOpen(true);
            }}
          />
          {!driversLoading && driversTotalPages > 1 && (
            <Pagination
              page={driversPage}
              totalPages={driversTotalPages}
              total={driversTotal}
              limit={12}
              onPageChange={setDriversPage}
            />
          )}
        </>
      )}

      {tab === 'vehicles' && (
        <>
          <VehiclesTab
            vehicles={vehicles}
            loading={vehiclesLoading}
            searchTerm={vehicleSearch}
            onSearchChange={setVehicleSearch}
            onAddVehicle={() => {
              setVehicleToEdit(null);
              setVehicleModalOpen(true);
            }}
            onEditVehicle={(v) => {
              setVehicleToEdit(v);
              setVehicleModalOpen(true);
            }}
            onDeleteVehicle={(v) => {
              setVehicleToDelete(v);
              setIsDeleteVehicleOpen(true);
            }}
          />
          {!vehiclesLoading && vehiclesTotalPages > 1 && (
            <Pagination
              page={vehiclesPage}
              totalPages={vehiclesTotalPages}
              total={vehiclesTotal}
              limit={12}
              onPageChange={setVehiclesPage}
            />
          )}
        </>
      )}

      {tab === 'rides' && (
        <RidesTab rides={rides} searchTerm={ridesSearch} onSearchChange={setRidesSearch} />
      )}

      {/* Driver Onboarding / Edit Modal */}
      <DriverModal
        isOpen={driverModalOpen}
        onClose={() => {
          setDriverModalOpen(false);
          setDriverToEdit(null);
        }}
        driver={driverToEdit}
        onSubmit={handleSaveDriver}
      />

      {/* Vehicle Registration / Edit Modal */}
      <VehicleModal
        isOpen={vehicleModalOpen}
        onClose={() => {
          setVehicleModalOpen(false);
          setVehicleToEdit(null);
        }}
        vehicle={vehicleToEdit}
        onSubmit={handleSaveVehicle}
      />

      {/* Delete Driver Confirmation Modal */}
      {isDeleteDriverOpen && (
        <Modal
          title="Remove Driver"
          onClose={() => {
            setIsDeleteDriverOpen(false);
            setDriverToDelete(null);
          }}
          footer={
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsDeleteDriverOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleDeleteDriver}>
                Remove Driver
              </button>
            </div>
          }
        >
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            Are you sure you want to remove driver <strong>{driverToDelete?.name}</strong> from the fleet?
          </p>
        </Modal>
      )}

      {/* Delete Vehicle Confirmation Modal */}
      {isDeleteVehicleOpen && (
        <Modal
          title="Deregister Vehicle"
          onClose={() => {
            setIsDeleteVehicleOpen(false);
            setVehicleToDelete(null);
          }}
          footer={
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsDeleteVehicleOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleDeleteVehicle}>
                Delete Vehicle
              </button>
            </div>
          }
        >
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            Are you sure you want to delete vehicle <strong>{vehicleToDelete?.model} ({vehicleToDelete?.plate})</strong> from the fleet?
          </p>
        </Modal>
      )}
    </div>
  );
}
