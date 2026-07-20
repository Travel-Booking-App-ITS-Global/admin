import { useState, useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  mockUsers,
  mockFlightBookings,
  mockHotelBookings,
  mockCabBookings,
  mockDrivers,
  mockPackages,
  mockTickets,
  mockTransactions,
  mockItineraries,
  mockFAQs,
  mockAPIConfigs,
} from '../../data/mockData.js';

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

  // Dynamic search function over mock database collections
  const getDynamicResults = (q) => {
    const cleanQ = q.trim().toLowerCase();
    if (!cleanQ) return [];

    const results = [];

    // 1. Users
    mockUsers.forEach((u) => {
      if (
        u.name.toLowerCase().includes(cleanQ) ||
        u.email.toLowerCase().includes(cleanQ) ||
        u.id.toLowerCase().includes(cleanQ) ||
        u.phone.toLowerCase().includes(cleanQ) ||
        (u.tags && u.tags.some((t) => t.toLowerCase().includes(cleanQ)))
      ) {
        results.push({
          id: `db-user-${u.id}`,
          title: `User: ${u.name} (${u.email})`,
          category: "Users Directory",
          path: `/users?search=${encodeURIComponent(u.name)}`,
          icon: "Users",
        });
      }
    });

    // 2. Flight Bookings
    mockFlightBookings.forEach((f) => {
      if (
        f.id.toLowerCase().includes(cleanQ) ||
        f.user.toLowerCase().includes(cleanQ) ||
        f.pnr.toLowerCase().includes(cleanQ) ||
        f.from.toLowerCase().includes(cleanQ) ||
        f.to.toLowerCase().includes(cleanQ) ||
        f.airline.toLowerCase().includes(cleanQ) ||
        (f.tags && f.tags.some((t) => t.toLowerCase().includes(cleanQ)))
      ) {
        results.push({
          id: `db-flight-${f.id}`,
          title: `Flight ${f.id}: ${f.from} ➔ ${f.to} (${f.user})`,
          category: "Flight Bookings",
          path: `/flights?search=${encodeURIComponent(f.id)}`,
          icon: "Plane",
        });
      }
    });

    // 3. Hotel Bookings
    mockHotelBookings.forEach((h) => {
      if (
        h.id.toLowerCase().includes(cleanQ) ||
        h.user.toLowerCase().includes(cleanQ) ||
        h.hotel.toLowerCase().includes(cleanQ) ||
        h.city.toLowerCase().includes(cleanQ) ||
        (h.tags && h.tags.some((t) => t.toLowerCase().includes(cleanQ)))
      ) {
        results.push({
          id: `db-hotel-${h.id}`,
          title: `Hotel ${h.id}: ${h.hotel}, ${h.city} (${h.user})`,
          category: "Hotel Bookings",
          path: `/hotels?search=${encodeURIComponent(h.id)}`,
          icon: "Hotel",
        });
      }
    });

    // 4. Cab Bookings
    mockCabBookings.forEach((c) => {
      if (
        c.id.toLowerCase().includes(cleanQ) ||
        c.user.toLowerCase().includes(cleanQ) ||
        c.driver.toLowerCase().includes(cleanQ) ||
        c.vehicle.toLowerCase().includes(cleanQ) ||
        c.pickup.toLowerCase().includes(cleanQ) ||
        c.drop.toLowerCase().includes(cleanQ) ||
        (c.tags && c.tags.some((t) => t.toLowerCase().includes(cleanQ)))
      ) {
        results.push({
          id: `db-cab-${c.id}`,
          title: `Cab ${c.id}: ${c.pickup} ➔ ${c.drop} (${c.user})`,
          category: "Cab Bookings",
          path: `/cabs?tab=rides&search=${encodeURIComponent(c.id)}`,
          icon: "Car",
        });
      }
    });

    // 5. Drivers
    mockDrivers.forEach((d) => {
      if (
        d.id.toLowerCase().includes(cleanQ) ||
        d.name.toLowerCase().includes(cleanQ) ||
        d.vehicle.toLowerCase().includes(cleanQ) ||
        d.plate.toLowerCase().includes(cleanQ) ||
        d.city.toLowerCase().includes(cleanQ) ||
        (d.tags && d.tags.some((t) => t.toLowerCase().includes(cleanQ)))
      ) {
        results.push({
          id: `db-driver-${d.id}`,
          title: `Driver: ${d.name} (${d.plate}) - ${d.vehicle}`,
          category: "Drivers Directory",
          path: `/cabs?tab=drivers&search=${encodeURIComponent(d.name)}`,
          icon: "User",
        });
      }
    });

    // 6. Travel Packages
    mockPackages.forEach((p) => {
      if (
        p.id.toLowerCase().includes(cleanQ) ||
        p.name.toLowerCase().includes(cleanQ) ||
        p.category.toLowerCase().includes(cleanQ) ||
        (p.destinations && p.destinations.some((dest) => dest.toLowerCase().includes(cleanQ))) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(cleanQ)))
      ) {
        results.push({
          id: `db-package-${p.id}`,
          title: `Package: ${p.name} (${p.duration})`,
          category: "Travel Packages",
          path: `/packages?search=${encodeURIComponent(p.name)}`,
          icon: "Package",
        });
      }
    });

    // 7. Support Tickets
    mockTickets.forEach((t) => {
      if (
        t.id.toLowerCase().includes(cleanQ) ||
        t.user.toLowerCase().includes(cleanQ) ||
        t.subject.toLowerCase().includes(cleanQ) ||
        t.category.toLowerCase().includes(cleanQ) ||
        (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(cleanQ)))
      ) {
        results.push({
          id: `db-ticket-${t.id}`,
          title: `Ticket ${t.id}: ${t.subject} (${t.user})`,
          category: "Support Tickets",
          path: `/support?search=${encodeURIComponent(t.id)}`,
          icon: "Headphones",
        });
      }
    });

    // 8. Transactions
    mockTransactions.forEach((t) => {
      if (
        t.id.toLowerCase().includes(cleanQ) ||
        t.user.toLowerCase().includes(cleanQ) ||
        t.type.toLowerCase().includes(cleanQ) ||
        t.method.toLowerCase().includes(cleanQ) ||
        t.gateway.toLowerCase().includes(cleanQ) ||
        (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(cleanQ)))
      ) {
        results.push({
          id: `db-txn-${t.id}`,
          title: `Txn ${t.id}: ${t.amount} ${t.type} via ${t.method} (${t.user})`,
          category: "Transactions Ledger",
          path: `/payments?search=${encodeURIComponent(t.id)}`,
          icon: "CreditCard",
        });
      }
    });

    // 9. Itineraries
    mockItineraries.forEach((i) => {
      if (
        i.id.toLowerCase().includes(cleanQ) ||
        i.user.toLowerCase().includes(cleanQ) ||
        i.title.toLowerCase().includes(cleanQ) ||
        (i.tags && i.tags.some((t) => t.toLowerCase().includes(cleanQ)))
      ) {
        results.push({
          id: `db-itinerary-${i.id}`,
          title: `Itinerary: ${i.title} (${i.days} Days) - ${i.user}`,
          category: "AI Itineraries",
          path: `/itineraries`,
          icon: "Compass",
        });
      }
    });

    // 10. FAQs
    mockFAQs.forEach((f) => {
      if (
        f.question.toLowerCase().includes(cleanQ) ||
        f.category.toLowerCase().includes(cleanQ) ||
        (f.tags && f.tags.some((t) => t.toLowerCase().includes(cleanQ)))
      ) {
        results.push({
          id: `db-faq-${f.id}`,
          title: `FAQ: ${f.question}`,
          category: "FAQs & CMS",
          path: `/cms?tab=faqs`,
          icon: "HelpCircle",
        });
      }
    });

    // 11. API Configs
    mockAPIConfigs.forEach((a) => {
      if (
        a.id.toLowerCase().includes(cleanQ) ||
        a.name.toLowerCase().includes(cleanQ) ||
        a.provider.toLowerCase().includes(cleanQ) ||
        a.type.toLowerCase().includes(cleanQ) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(cleanQ)))
      ) {
        results.push({
          id: `db-api-${a.id}`,
          title: `API: ${a.name} (${a.provider})`,
          category: "API & Configurations",
          path: `/settings?tab=apis`,
          icon: "Settings",
        });
      }
    });

    return results;
  };

  const cleanQ = query.trim().toLowerCase();

  // Filter commands based on search query
  const filteredCommands = COMMANDS.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(cleanQ) ||
      cmd.category.toLowerCase().includes(cleanQ)
  );

  // Get dynamic mock database search results
  const dynamicResults = getDynamicResults(query);

  // Combine static actions and database records
  const allResults = [...filteredCommands, ...dynamicResults];

  // Group combined results by category for display
  const groupedCommands = allResults.reduce((acc, cmd) => {
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
