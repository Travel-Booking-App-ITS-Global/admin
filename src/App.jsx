import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import ToastContainer from './components/ui/ToastContainer.jsx';

import PageLoader from './components/ui/PageLoader.jsx';
import './index.css';
import './App.css';

// Pages
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import Flights from './pages/Flights.jsx';
import { Hotels, Cabs } from './pages/HotelsCabs.jsx';
import Packages from './pages/Packages.jsx';
import Support from './pages/Support.jsx';
import Payments from './pages/Payments.jsx';
import Staff from './pages/Staff.jsx';
import Todos from './pages/Todos.jsx';
import Analytics from './pages/Analytics.jsx';
import Reports from './pages/Reports.jsx';
import {
  Itineraries, AIChat, CMS, Notifications, Settings, Contacts
} from './pages/OtherPages.jsx';

function AdminShell() {
  const { sidebarCollapsed, toggleSidebar } = useApp();
  return (
    <div className="admin-shell">
      {/* Page Loader Transitions */}
      <PageLoader />

      {/* Ambient background blur blobs */}
      <div className="bg-blur-blob blob-1" />
      <div className="bg-blur-blob blob-2" />
      <div className="bg-blur-blob blob-3" />

      <Sidebar />
      {!sidebarCollapsed && (
        <div className="mobile-sidebar-overlay" onClick={toggleSidebar} />
      )}
      <div className={`admin-main${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
        <Header />
        <main className="page-content" style={{ position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"    element={<Dashboard />} />
            <Route path="analytics"    element={<Analytics />} />
            <Route path="users"        element={<Users />} />
            <Route path="staff"        element={<Staff />} />
            <Route path="todos"        element={<Todos />} />
            <Route path="flights"      element={<Flights />} />
            <Route path="hotels"       element={<Hotels />} />
            <Route path="cabs"         element={<Cabs />} />
            <Route path="packages"     element={<Packages />} />
            <Route path="itineraries"  element={<Itineraries />} />
            <Route path="ai-chat"      element={<AIChat />} />
            <Route path="reports"      element={<Reports />} />
            <Route path="cms"          element={<CMS />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="support"      element={<Support />} />
            <Route path="payments"     element={<Payments />} />
            <Route path="contacts"     element={<Contacts />} />
            <Route path="settings"     element={<Settings />} />
            <Route path="*"            element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<AdminShell />} />
    </Routes>
  );
}

function ThemeInit() {
  const { theme } = useApp();
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProvider>
        <ThemeInit />
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
