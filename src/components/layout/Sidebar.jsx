import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Plane, Hotel, Car, Package, Map,
  MessageSquare, BarChart2, FileText, Bell, Headphones,
  Settings, CreditCard, Phone, ChevronRight, LogOut, Activity, Shield, Compass, CheckSquare
} from 'lucide-react';
import { useApp } from '../../store/AppContext';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard',  label: 'Dashboard',       icon: LayoutDashboard },
      { to: '/analytics',  label: 'Analytics',       icon: Activity },
      { to: '/todos',      label: 'Tasks & To-Dos',  icon: CheckSquare },
    ],
  },
  {
    label: 'People',
    items: [
      { to: '/users',      label: 'Users',           icon: Users,     badge: '3.2k' },
      { to: '/staff',      label: 'Staff & EMS',     icon: Shield },
    ],
  },
  {
    label: 'Bookings',
    items: [
      { to: '/flights',    label: 'Flights',         icon: Plane },
      { to: '/hotels',     label: 'Hotels',          icon: Hotel },
      { to: '/cabs',       label: 'Cabs',            icon: Car },
      { to: '/packages',   label: 'Packages',        icon: Package },
    ],
  },
  {
    label: 'AI Features',
    items: [
      { to: '/itineraries', label: 'Itinerary AI',  icon: Map },
      { to: '/ai-chat',     label: 'AI Chat',        icon: MessageSquare, badge: 'New' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/reports',    label: 'Reports',         icon: BarChart2 },
      { to: '/cms',        label: 'CMS',             icon: FileText },
      { to: '/notifications', label: 'Notifications', icon: Bell },
      { to: '/support',    label: 'Support',         icon: Headphones, badge: '5' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { to: '/payments',   label: 'Payments',        icon: CreditCard },
      { to: '/contacts',   label: 'Contacts',        icon: Phone },
    ],
  },
  {
    label: 'Config',
    items: [
      { to: '/settings',   label: 'Settings',        icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const { sidebarCollapsed, adminName, adminEmail, adminAvatar } = useApp();

  const initials = adminName
    ? adminName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'SA';

  return (
    <aside className={`sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Compass size={20} className="logo-compass" />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-name">ITS Global</span>
          <span className="sidebar-logo-sub">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <div className="nav-section-label">{group.label}</div>
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                data-tooltip={sidebarCollapsed ? item.label : undefined}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <item.icon className="nav-item-icon" size={18} />
                <span className="nav-item-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-item-badge">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="sidebar-footer">
        <NavLink to="/login" className="nav-item" style={{ marginBottom: 8 }}>
          <LogOut className="nav-item-icon" size={18} />
          <span className="nav-item-label">Logout</span>
        </NavLink>
        <div className="sidebar-user">
          {adminAvatar ? (
            <img
              src={adminAvatar}
              alt="avatar"
              className="avatar avatar-md"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff' }}>
              {initials}
            </div>
          )}
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{adminName}</div>
            <div className="sidebar-user-role">{adminEmail}</div>
          </div>
          <ChevronRight size={14} style={{ color: 'var(--sidebar-text)', flexShrink: 0 }} />
        </div>
      </div>
    </aside>
  );
}
