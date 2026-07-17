import { useState, useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/analytics': 'Analytics & Reports',
  '/users': 'User Management',
  '/flights': 'Flight Bookings',
  '/hotels': 'Hotel Bookings',
  '/cabs': 'Cab Management',
  '/packages': 'Package Management',
  '/itineraries': 'AI Itinerary Monitor',
  '/ai-chat': 'AI Chat Monitor',
  '/reports': 'Reports',
  '/cms': 'Content Management',
  '/notifications': 'Notifications',
  '/support': 'Support & Tickets',
  '/payments': 'Payments & Refunds',
  '/contacts': 'Contact Management',
  '/settings': 'Settings & APIs',
};

const COMMANDS = [
  // Navigation
  { id: 'dash',     title: 'Dashboard',             category: 'Navigation',  path: '/dashboard',     icon: 'LayoutDashboard' },
  { id: 'anal',     title: 'Analytics & Reports',   category: 'Navigation',  path: '/analytics',     icon: 'Activity' },
  { id: 'todo',     title: 'Tasks & To-Dos Tracker', category: 'Navigation', path: '/todos',         icon: 'CheckSquare' },
  { id: 'user',     title: 'User Directory',        category: 'Navigation',  path: '/users',         icon: 'Users' },
  { id: 'stf',      title: 'Staff & Emergency Services', category: 'Navigation', path: '/staff',      icon: 'Shield' },
  { id: 'flt',      title: 'Flight Bookings',       category: 'Navigation',  path: '/flights',       icon: 'Plane' },
  { id: 'htl',      title: 'Hotel Bookings',        category: 'Navigation',  path: '/hotels',        icon: 'Hotel' },
  { id: 'cab',      title: 'Cab Management',        category: 'Navigation',  path: '/cabs',          icon: 'Car' },
  { id: 'pkg',      title: 'Package Management',    category: 'Navigation',  path: '/packages',      icon: 'Package' },
  { id: 'itin',     title: 'AI Itineraries Monitor', category: 'Navigation', path: '/itineraries',   icon: 'Compass' },
  { id: 'chat',     title: 'AI Chat Conversations', category: 'Navigation',  path: '/ai-chat',       icon: 'MessageSquare' },
  { id: 'cms',      title: 'Content Management (CMS)', category: 'Navigation', path: '/cms',         icon: 'FileText' },
  { id: 'notif',    title: 'Notifications Center',  category: 'Navigation',  path: '/notifications', icon: 'Bell' },
  { id: 'supp',     title: 'Customer Support Tickets', category: 'Navigation', path: '/support',     icon: 'Headphones' },
  { id: 'pay',      title: 'Payments & Refund Queue', category: 'Navigation', path: '/payments',      icon: 'CreditCard' },
  { id: 'set',      title: 'Settings & APIs Config', category: 'Navigation', path: '/settings',      icon: 'Settings' },

  // Quick Actions
  { id: 'act-task', title: 'Add New Task',          category: 'Quick Actions', path: '/todos?action=new', icon: 'Plus' },
  { id: 'act-pkg',  title: 'Create New Travel Package', category: 'Quick Actions', path: '/packages', icon: 'Package' },
  { id: 'act-drv',  title: 'Register Cab Driver',   category: 'Quick Actions', path: '/cabs',          icon: 'Car' },
  { id: 'act-ref',  title: 'Review Pending Refunds', category: 'Quick Actions', path: '/payments',      icon: 'RefreshCw' },
];

export default function Header() {
  const { sidebarCollapsed, toggleSidebar, theme, toggleTheme, addToast, adminName, adminAvatar } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[location.pathname] || 'Admin Panel';

  const initials = adminName
    ? adminName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'SA';

  // Search & Spotlight state
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef(null);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Auto-focus search input when Spotlight opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filter commands based on search query
  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Group commands by category for display
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  // Flattened list to allow easy index-based keyboard navigation
  const flatList = Object.values(groupedCommands).flat();

  const handleSelect = (cmd) => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
    navigate(cmd.path);
    addToast(`Navigating to ${cmd.title}`, 'info');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatList.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatList.length) % flatList.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatList[selectedIndex]) {
        handleSelect(flatList[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <>
      <header className={`header${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
        {/* Left */}
        <div className="header-left">
          <button className="header-icon-btn" onClick={toggleSidebar} title="Toggle Sidebar">
            {sidebarCollapsed ? (
              <LucideIcons.PanelLeftOpen size={20} />
            ) : (
              <LucideIcons.PanelLeftClose size={20} />
            )}
          </button>

          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
              {title}
            </div>
          </div>

          {/* Search trigger */}
          <div className="header-search" style={{ marginLeft: 8 }} onClick={() => setIsOpen(true)}>
            <LucideIcons.Search className="header-search-icon" />
            <input
              className="header-search-input"
              placeholder="Search bookings, users, tickets…"
              aria-label="Global search"
              readOnly
            />
            <span className="header-search-kbd">⌘K</span>
          </div>
        </div>

        {/* Right */}
        <div className="header-right">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <LucideIcons.Sun size={18} /> : <LucideIcons.Moon size={18} />}
          </button>

          <button className="header-icon-btn" title="Help">
            <LucideIcons.HelpCircle size={18} />
          </button>

          <button className="header-icon-btn" title="Notifications">
            <LucideIcons.Bell size={18} />
            <span className="notif-dot" />
          </button>

          {adminAvatar ? (
            <img
              src={adminAvatar}
              alt="avatar"
              className="header-avatar"
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => navigate('/settings')}
              title="Profile Settings"
            />
          ) : (
            <div
              className="header-avatar"
              title="Profile Settings"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/settings')}
            >
              {initials}
            </div>
          )}
        </div>
      </header>

      {/* Global Spotlight / Command Palette Overlay */}
      {isOpen && (
        <div className="spotlight-overlay" onClick={() => setIsOpen(false)}>
          <div className="spotlight-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="spotlight-search-wrap">
              <LucideIcons.Search size={18} className="spotlight-icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="spotlight-input"
                placeholder="Type a page, category, or action..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
              />
              <span className="spotlight-esc">ESC</span>
            </div>

            <div className="spotlight-results">
              {flatList.length === 0 ? (
                <div className="spotlight-empty">No matching pages or actions found.</div>
              ) : (
                Object.entries(groupedCommands).map(([category, items]) => (
                  <div key={category} className="spotlight-group">
                    <div className="spotlight-group-title">{category}</div>
                    {items.map((cmd) => {
                      const isSelected = flatList[selectedIndex]?.id === cmd.id;
                      const Icon = LucideIcons[cmd.icon] || LucideIcons.Search;
                      return (
                        <div
                          key={cmd.id}
                          className={`spotlight-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSelect(cmd)}
                          onMouseEnter={() => {
                            const idx = flatList.findIndex((x) => x.id === cmd.id);
                            if (idx !== -1) setSelectedIndex(idx);
                          }}
                        >
                          <div className="spotlight-item-left">
                            <Icon size={16} className="spotlight-item-icon" />
                            <span className="spotlight-item-title">{cmd.title}</span>
                          </div>
                          <span className="spotlight-item-path">{cmd.path}</span>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
