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

  // Help Center states
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpTab, setHelpTab] = useState('shortcuts'); // 'shortcuts' or 'faqs'
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Notification states
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('itsglobal_notifications');
      return stored ? JSON.parse(stored) : [
        { id: 1, text: 'New booking FLT8825 created by Arjun Nair',    time: '2 min ago',  type: 'booking' },
        { id: 2, text: 'Refund processed for TXN88223 - Rohit Verma',  time: '15 min ago', type: 'refund'  },
        { id: 3, text: 'Support ticket TKT0095 opened – high priority', time: '32 min ago', type: 'ticket'  },
        { id: 4, text: 'Driver Suresh Pillai went online in Kochi',     time: '1 hr ago',   type: 'driver'  },
        { id: 5, text: 'Package PKG002 sold out, bookings paused',      time: '2 hrs ago',  type: 'package' },
        { id: 6, text: 'MakeMyTrip Hotels API showing high latency',    time: '3 hrs ago',  type: 'alert'   },
      ];
    } catch {
      return [];
    }
  });

  const [unreadCount, setUnreadCount] = useState(() => {
    try {
      const stored = localStorage.getItem('itsglobal_notif_unread');
      return stored ? parseInt(stored, 10) : 6;
    } catch {
      return 6;
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('itsglobal_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('itsglobal_notif_unread', unreadCount.toString());
    } catch (e) {
      console.error(e);
    }
  }, [unreadCount]);

  // Click outside listener for notifications dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut listeners: Ctrl+K / Ctrl+Shift+L / Ctrl+Shift+P
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        toggleTheme();
        addToast(`Theme toggled`, 'success');
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        navigate('/settings');
        addToast('Navigating to Profile Settings', 'info');
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [toggleTheme, navigate, addToast]);

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

  const handleNotifClick = (n) => {
    setIsNotifOpen(false);
    setUnreadCount((prev) => Math.max(0, prev - 1));

    if (n.text.includes('FLT')) {
      navigate('/flights?search=FLT8825');
      addToast('Navigating to Flight Booking FLT8825', 'info');
    } else if (n.text.includes('TXN')) {
      navigate('/payments?search=TXN88223');
      addToast('Navigating to Transaction TXN88223', 'info');
    } else if (n.text.includes('TKT')) {
      navigate('/support?search=TKT0095');
      addToast('Navigating to Support Ticket TKT0095', 'info');
    } else if (n.text.includes('Driver')) {
      navigate('/cabs?tab=drivers&search=Suresh');
      addToast('Viewing Driver Suresh Pillai', 'info');
    } else if (n.text.includes('Package') || n.text.includes('PKG')) {
      navigate('/packages?search=PKG002');
      addToast('Viewing Package PKG002', 'info');
    } else if (n.text.includes('API')) {
      navigate('/settings?tab=apis');
      addToast('Checking API latency reports', 'warning');
    } else {
      navigate('/dashboard');
    }
  };

  const handleDeleteNotif = (e, id) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    addToast('Notification dismissed', 'success');
  };

  const handleMarkAllRead = () => {
    setUnreadCount(0);
    addToast('All notifications marked as read', 'success');
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'booking':
        return <LucideIcons.Plane size={16} />;
      case 'refund':
        return <LucideIcons.RefreshCw size={16} />;
      case 'ticket':
        return <LucideIcons.Headphones size={16} />;
      case 'driver':
        return <LucideIcons.Car size={16} />;
      case 'package':
        return <LucideIcons.Package size={16} />;
      case 'alert':
        return <LucideIcons.AlertTriangle size={16} />;
      default:
        return <LucideIcons.Bell size={16} />;
    }
  };

  const FAQ_ANSWERS = {
    1: "To cancel a flight booking, navigate to the Flight Bookings module, search for the PNR or Booking ID, select the booking, and click the 'Cancel Booking' action. Refunds are processed based on the airline's cancellation policy.",
    2: "Hotel booking refunds are typically processed within 5-7 business days from the cancellation date. The funds will be credited back to the original payment gateway/method used during transaction.",
    3: "Yes, travel packages can be modified up to 48 hours prior to the departure date. To modify a package, navigate to the Package Management console, choose the user's booking, and apply the custom overrides.",
    4: "Real-time cab tracking can be monitored via the Cabs module. Choose the active ride under the 'Rides' tab to view the driver's current coordinates, license plate details, and estimated time of arrival (ETA)."
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

          <button 
            className="header-icon-btn" 
            title="Help Center"
            onClick={() => setIsHelpOpen(true)}
          >
            <LucideIcons.HelpCircle size={18} />
          </button>

          <div className="notif-dropdown-wrapper" ref={notifRef}>
            <button 
              className="header-icon-btn" 
              title="Notifications"
              onClick={() => setIsNotifOpen((prev) => !prev)}
            >
              <LucideIcons.Bell size={18} />
              {unreadCount > 0 && <span className="notif-dot" />}
            </button>

            {isNotifOpen && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <span className="notif-title">Notifications</span>
                  {unreadCount > 0 && (
                    <button className="notif-action-btn" onClick={handleMarkAllRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">
                      <LucideIcons.BellOff size={24} style={{ opacity: 0.5, marginBottom: 4 }} />
                      <span>No new notifications</span>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className="notif-item" 
                        onClick={() => handleNotifClick(n)}
                      >
                        <div className="notif-item-left">
                          <div className={`notif-item-icon-wrap ${n.type}`}>
                            {getNotifIcon(n.type)}
                          </div>
                          <div>
                            <div className="notif-item-text">{n.text}</div>
                            <div className="notif-item-time">{n.time}</div>
                          </div>
                        </div>
                        <button 
                          className="notif-item-delete" 
                          onClick={(e) => handleDeleteNotif(e, n.id)}
                          title="Remove notification"
                        >
                          <LucideIcons.X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="notif-footer">
                  <span 
                    className="notif-footer-link" 
                    onClick={() => { 
                      setIsNotifOpen(false); 
                      navigate('/settings?tab=apis'); 
                    }}
                  >
                    View System Status & APIs
                  </span>
                </div>
              </div>
            )}
          </div>

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

      {/* Help Center Modal Overlay */}
      {isHelpOpen && (
        <div className="modal-overlay" onClick={() => setIsHelpOpen(false)}>
          <div className="modal" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Admin Portal Help Center</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  Keyboard shortcuts, system guides and FAQs
                </p>
              </div>
              <button 
                className="btn-close" 
                onClick={() => setIsHelpOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <LucideIcons.X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ minHeight: 380 }}>
              <div className="help-tabs">
                <button 
                  className={`help-tab-btn ${helpTab === 'shortcuts' ? 'active' : ''}`}
                  onClick={() => setHelpTab('shortcuts')}
                >
                  Shortcuts & Commands
                </button>
                <button 
                  className={`help-tab-btn ${helpTab === 'faqs' ? 'active' : ''}`}
                  onClick={() => setHelpTab('faqs')}
                >
                  Quick FAQ Finder
                </button>
              </div>

              {helpTab === 'shortcuts' ? (
                <div className="help-shortcut-list">
                  <div className="help-shortcut-item">
                    <span className="help-shortcut-desc">Open Spotlight Search</span>
                    <div className="help-shortcut-keys">
                      <kbd className="help-kbd">Ctrl</kbd>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+</span>
                      <kbd className="help-kbd">K</kbd>
                    </div>
                  </div>
                  <div className="help-shortcut-item">
                    <span className="help-shortcut-desc">Toggle Theme (Light/Dark)</span>
                    <div className="help-shortcut-keys">
                      <kbd className="help-kbd">Ctrl</kbd>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+</span>
                      <kbd className="help-kbd">Shift</kbd>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+</span>
                      <kbd className="help-kbd">L</kbd>
                    </div>
                  </div>
                  <div className="help-shortcut-item">
                    <span className="help-shortcut-desc">Go to Profile settings</span>
                    <div className="help-shortcut-keys">
                      <kbd className="help-kbd">Ctrl</kbd>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+</span>
                      <kbd className="help-kbd">Shift</kbd>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+</span>
                      <kbd className="help-kbd">P</kbd>
                    </div>
                  </div>
                  <div className="help-shortcut-item">
                    <span className="help-shortcut-desc">Close Spotlight / Modals</span>
                    <div className="help-shortcut-keys">
                      <kbd className="help-kbd">ESC</kbd>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="help-faq-search">
                    <LucideIcons.Search size={16} className="help-faq-search-icon" />
                    <input
                      type="text"
                      className="help-faq-search-input"
                      placeholder="Search FAQs by question or category..."
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                    />
                  </div>
                  <div className="help-faq-accordion">
                    {mockFAQs
                      .filter(
                        (faq) =>
                          faq.question.toLowerCase().includes(faqSearch.trim().toLowerCase()) ||
                          faq.category.toLowerCase().includes(faqSearch.trim().toLowerCase())
                      )
                      .map((faq) => (
                        <div key={faq.id} className="help-faq-item">
                          <button
                            className="help-faq-question-btn"
                            onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                          >
                            <span>{faq.question}</span>
                            {expandedFaq === faq.id ? <LucideIcons.ChevronUp size={16} /> : <LucideIcons.ChevronDown size={16} />}
                          </button>
                          {expandedFaq === faq.id && (
                            <div className="help-faq-answer">
                              {FAQ_ANSWERS[faq.id] || "For details on this FAQ, please contact customer support."}
                            </div>
                          )}
                        </div>
                      ))}
                    {mockFAQs.filter(
                      (faq) =>
                        faq.question.toLowerCase().includes(faqSearch.trim().toLowerCase()) ||
                        faq.category.toLowerCase().includes(faqSearch.trim().toLowerCase())
                    ).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
                        No matching FAQs found. Try searching for "flight" or "refund".
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsHelpOpen(false)}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
