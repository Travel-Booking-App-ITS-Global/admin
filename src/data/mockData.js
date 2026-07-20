// Mock data for the Travel Booking Admin Panel

export const mockStats = {
  revenue:       { value: '₹48,32,150', change: '+12.4%', up: true },
  bookings:      { value: '12,847',      change: '+8.1%',  up: true },
  activeUsers:   { value: '3,241',       change: '+5.6%',  up: true },
  failedTxns:    { value: '143',         change: '-2.3%',  up: false },
  flightBookings:{ value: '5,124',       change: '+10.2%', up: true },
  hotelBookings: { value: '4,380',       change: '+6.7%',  up: true },
  cabBookings:   { value: '2,891',       change: '+9.4%',  up: true },
  packages:      { value: '452',         change: '+18.3%', up: true },
};

export const revenueData = [
  { month: 'Jan', flights: 420000, hotels: 310000, cabs: 180000, packages: 90000 },
  { month: 'Feb', flights: 380000, hotels: 290000, cabs: 160000, packages: 75000 },
  { month: 'Mar', flights: 510000, hotels: 380000, cabs: 210000, packages: 120000 },
  { month: 'Apr', flights: 490000, hotels: 360000, cabs: 195000, packages: 140000 },
  { month: 'May', flights: 560000, hotels: 420000, cabs: 240000, packages: 165000 },
  { month: 'Jun', flights: 620000, hotels: 480000, cabs: 280000, packages: 190000 },
  { month: 'Jul', flights: 710000, hotels: 530000, cabs: 310000, packages: 220000 },
];

export const bookingTrendData = [
  { day: 'Mon', bookings: 142 }, { day: 'Tue', bookings: 198 },
  { day: 'Wed', bookings: 176 }, { day: 'Thu', bookings: 231 },
  { day: 'Fri', bookings: 287 }, { day: 'Sat', bookings: 312 },
  { day: 'Sun', bookings: 264 },
];

export const pieData = [
  { name: 'Flights', value: 40, color: '#3b82f6' },
  { name: 'Hotels',  value: 34, color: '#8b5cf6' },
  { name: 'Cabs',    value: 19, color: '#22c55e' },
  { name: 'Packages',value: 7,  color: '#f59e0b' },
];

export const mockUsers = [
  { id: 'USR001', name: 'Aarav Sharma',   email: 'aarav@gmail.com',   phone: '+91 98765 43210', status: 'active',   bookings: 14, spent: '₹1,24,500', joined: '12 Jan 2024', avatar: 'AS', tags: ["VIP", "Frequent Flyer"] },
  { id: 'USR002', name: 'Priya Mehta',    email: 'priya@gmail.com',   phone: '+91 87654 32109', status: 'active',   bookings: 8,  spent: '₹78,200',   joined: '3 Mar 2024',  avatar: 'PM', tags: ["HolidayMaker", "Luxury"] },
  { id: 'USR003', name: 'Rohit Verma',    email: 'rohit@gmail.com',   phone: '+91 76543 21098', status: 'blocked',  bookings: 2,  spent: '₹12,000',   joined: '19 Apr 2024', avatar: 'RV', tags: ["Disputed", "Budget"] },
  { id: 'USR004', name: 'Sneha Kapoor',   email: 'sneha@gmail.com',   phone: '+91 65432 10987', status: 'active',   bookings: 21, spent: '₹2,45,800', joined: '5 Feb 2024',  avatar: 'SK', tags: ["VIP", "Corporate"] },
  { id: 'USR005', name: 'Arjun Nair',     email: 'arjun@gmail.com',   phone: '+91 54321 09876', status: 'inactive', bookings: 0,  spent: '₹0',        joined: '1 Jun 2024',  avatar: 'AN', tags: ["New User"] },
  { id: 'USR006', name: 'Kavitha Rajan',  email: 'kavitha@gmail.com', phone: '+91 43210 98765', status: 'active',   bookings: 6,  spent: '₹54,300',   joined: '22 May 2024', avatar: 'KR', tags: ["Regular"] },
  { id: 'USR007', name: 'Vikram Singh',   email: 'vikram@gmail.com',  phone: '+91 32109 87654', status: 'active',   bookings: 11, spent: '₹98,750',   joined: '14 Jan 2024', avatar: 'VS', tags: ["Family Travel", "Active"] },
];

export const mockFlightBookings = [
  { id: 'FLT8821', user: 'Aarav Sharma',  from: 'DEL', to: 'BOM', date: '12 Jul 2025', airline: 'IndiGo',     pnr: '6E4921', class: 'Economy', amount: '₹8,420',  status: 'confirmed', pax: 2, tags: ["Domestic", "Leisure"] },
  { id: 'FLT8822', user: 'Priya Mehta',   from: 'BOM', to: 'GOI', date: '14 Jul 2025', airline: 'Air India',  pnr: 'AI3312', class: 'Business', amount: '₹24,800', status: 'confirmed', pax: 1, tags: ["Business", "Urgent"] },
  { id: 'FLT8823', user: 'Rohit Verma',   from: 'HYD', to: 'DEL', date: '15 Jul 2025', airline: 'Vistara',    pnr: 'UK8871', class: 'Economy', amount: '₹6,100',  status: 'cancelled', pax: 1, tags: ["Domestic", "Refund Pending"] },
  { id: 'FLT8824', user: 'Sneha Kapoor',  from: 'DEL', to: 'LHR', date: '18 Jul 2025', airline: 'Air India',  pnr: 'AI1023', class: 'Business', amount: '₹1,42,000', status: 'pending',   pax: 2, tags: ["International", "Holiday"] },
  { id: 'FLT8825', user: 'Arjun Nair',    from: 'COK', to: 'DXB', date: '20 Jul 2025', airline: 'Emirates',   pnr: 'EK5521', class: 'Economy', amount: '₹28,500', status: 'confirmed', pax: 3, tags: ["International", "Family"] },
  { id: 'FLT8826', user: 'Vikram Singh',  from: 'BOM', to: 'SIN', date: '22 Jul 2025', airline: 'Singapore',  pnr: 'SQ3345', class: 'Economy', amount: '₹32,000', status: 'refunded',  pax: 1, tags: ["Corporate", "Refunded"] },
];

export const mockHotelBookings = [
  { id: 'HTL3301', user: 'Priya Mehta',  hotel: 'The Taj Mahal Palace', city: 'Mumbai', checkin: '14 Jul', checkout: '17 Jul', rooms: 1, nights: 3, amount: '₹45,000', status: 'confirmed', tags: ["Heritage", "Luxury"] },
  { id: 'HTL3302', user: 'Sneha Kapoor', hotel: 'ITC Maurya',            city: 'Delhi',  checkin: '18 Jul', checkout: '20 Jul', rooms: 2, nights: 2, amount: '₹38,000', status: 'confirmed', tags: ["Business", "Five Star"] },
  { id: 'HTL3303', user: 'Aarav Sharma', hotel: 'The Leela Goa',         city: 'Goa',    checkin: '20 Jul', checkout: '24 Jul', rooms: 1, nights: 4, amount: '₹52,000', status: 'pending',   tags: ["Resort", "Holiday"]   },
  { id: 'HTL3304', user: 'Rohit Verma',  hotel: 'Vivanta Hyderabad',     city: 'Hyd',    checkin: '15 Jul', checkout: '16 Jul', rooms: 1, nights: 1, amount: '₹8,500',  status: 'cancelled', tags: ["Express", "Budget"] },
];

export const mockCabBookings = [
  { id: 'CAB5501', user: 'Kavitha Rajan', driver: 'Ramu Kumar',  pickup: 'Kochi Airport', drop: 'Marine Drive', date: '14 Jul 2025 09:30', vehicle: 'Swift Dzire', amount: '₹850',  status: 'completed', rating: 4.8, tags: ["Airport Transfer", "Sedan"] },
  { id: 'CAB5502', user: 'Arjun Nair',   driver: 'Suresh Pillai', pickup: 'Cochin Hotel', drop: 'Ernakulam Stn', date: '14 Jul 2025 11:00', vehicle: 'Innova',      amount: '₹1,200', status: 'ongoing',   rating: null, tags: ["Outstation", "SUV"] },
  { id: 'CAB5503', user: 'Vikram Singh', driver: 'Mohan Das',    pickup: 'BOM Airport',  drop: 'BKC',           date: '15 Jul 2025 06:00', vehicle: 'Etios',       amount: '₹650',  status: 'scheduled', rating: null, tags: ["Local Ride", "Budget"] },
  { id: 'CAB5504', user: 'Aarav Sharma', driver: 'Rajesh Tiwari', pickup: 'CP Delhi',     drop: 'DEL Airport',   date: '16 Jul 2025 04:00', vehicle: 'Swift Dzire', amount: '₹1,100', status: 'scheduled', rating: null, tags: ["Airport Transfer", "Early Morning"] },
];

export const mockDrivers = [
  { id: 'DRV001', name: 'Ramu Kumar',    phone: '+91 98400 11223', vehicle: 'Swift Dzire', plate: 'KL07AE4521', status: 'active',    rating: 4.8, rides: 1240, joined: '2022-03-10', city: 'Kochi', tags: ["Top Rated", "English Speaking"] },
  { id: 'DRV002', name: 'Suresh Pillai', phone: '+91 94471 22334', vehicle: 'Innova Crysta', plate: 'KL09BC8812', status: 'busy',      rating: 4.6, rides: 892,  joined: '2023-01-05', city: 'Kochi', tags: ["SUV Expert", "Local Guide"] },
  { id: 'DRV003', name: 'Mohan Das',     phone: '+91 90211 33445', vehicle: 'Toyota Etios', plate: 'MH01ZZ9923', status: 'active',    rating: 4.9, rides: 2105, joined: '2021-11-12', city: 'Mumbai', tags: ["Veteran", "No Cancellations"] },
  { id: 'DRV004', name: 'Rajesh Tiwari', phone: '+91 88012 44556', vehicle: 'Swift Dzire', plate: 'DL05AB3341', status: 'inactive',  rating: 4.2, rides: 421,  joined: '2023-07-20', city: 'Delhi', tags: ["Pending Verification"] },
];

export const mockPackages = [
  { id: 'PKG001', name: 'Kerala Backwaters Escape', destinations: ['Alleppey','Kochi','Munnar'], duration: '5N/6D', price: '₹24,999', inclusions: ['Hotel','Meals','Transfers'], status: 'active',   bookings: 48, category: 'Leisure', tags: ['Best Seller', 'Waterfront'] },
  { id: 'PKG002', name: 'Rajasthan Royal Trail',    destinations: ['Jaipur','Jodhpur','Jaisalmer'], duration: '7N/8D', price: '₹38,500', inclusions: ['Hotel','Meals','Transfers','Guide'], status: 'active',   bookings: 32, category: 'Heritage', tags: ['Cultural', 'Luxury'] },
  { id: 'PKG003', name: 'Goa Beach Fiesta',          destinations: ['North Goa','South Goa'], duration: '3N/4D', price: '₹14,999', inclusions: ['Hotel','Breakfast'], status: 'draft',    bookings: 0,  category: 'Beach', tags: ['Party', 'Budget Friendly'] },
  { id: 'PKG004', name: 'Himalayan Trek Adventure',  destinations: ['Manali','Spiti','Kaza'], duration: '8N/9D', price: '₹42,000', inclusions: ['Camping','Meals','Guide'], status: 'active',   bookings: 19, category: 'Adventure', tags: ['Adventure', 'Trending'] },
];

export const mockTickets = [
  { id: 'TKT0091', user: 'Aarav Sharma',  subject: 'Flight booking not confirmed after payment', category: 'Booking', priority: 'high',   status: 'open',       created: '2 hrs ago',  assigned: 'Pooja S.', tags: ['Payment', 'Urgent'] },
  { id: 'TKT0092', user: 'Priya Mehta',   subject: 'Need refund for cancelled hotel',            category: 'Refund',  priority: 'medium', status: 'in_progress', created: '5 hrs ago',  assigned: 'Rahul M.', tags: ['Hotel', 'Refund'] },
  { id: 'TKT0093', user: 'Rohit Verma',   subject: 'Driver did not arrive for airport cab',      category: 'Cab',     priority: 'high',   status: 'open',       created: '1 day ago',  assigned: null, tags: ['Cab', 'No-Show'] },
  { id: 'TKT0094', user: 'Sneha Kapoor',  subject: 'Package itinerary PDF not downloading',      category: 'Tech',    priority: 'low',    status: 'resolved',   created: '2 days ago', assigned: 'Pooja S.', tags: ['Download', 'App'] },
  { id: 'TKT0095', user: 'Vikram Singh',  subject: 'Wrong name on flight ticket',                category: 'Booking', priority: 'high',   status: 'open',       created: '3 hrs ago',  assigned: null, tags: ['Flight', 'NameCorrection'] },
];

export const mockTransactions = [
  { id: 'TXN88221', user: 'Aarav Sharma',  type: 'Flight',  amount: '₹8,420',  method: 'UPI',         status: 'success',  date: '12 Jul 2025, 10:24 AM', gateway: 'Razorpay', tags: ['UPI', 'Domestic'] },
  { id: 'TXN88222', user: 'Priya Mehta',   type: 'Hotel',   amount: '₹45,000', method: 'Credit Card', status: 'success',  date: '14 Jul 2025, 02:11 PM', gateway: 'Stripe',    tags: ['CreditCard', 'Luxury'] },
  { id: 'TXN88223', user: 'Rohit Verma',   type: 'Flight',  amount: '₹6,100',  method: 'Net Banking', status: 'refunded', date: '14 Jul 2025, 08:45 AM', gateway: 'Razorpay', tags: ['Refunded', 'Cancelled'] },
  { id: 'TXN88224', user: 'Sneha Kapoor',  type: 'Package', amount: '₹38,500', method: 'Credit Card', status: 'pending',  date: '15 Jul 2025, 11:00 AM', gateway: 'Stripe',    tags: ['Package', 'Pending'] },
  { id: 'TXN88225', user: 'Arjun Nair',    type: 'Cab',     amount: '₹1,200',  method: 'UPI',         status: 'success',  date: '14 Jul 2025, 11:02 AM', gateway: 'Razorpay', tags: ['Cab', 'Quick Ride'] },
  { id: 'TXN88226', user: 'Kavitha Rajan', type: 'Cab',     amount: '₹850',    method: 'Cash',        status: 'success',  date: '14 Jul 2025, 09:45 AM', gateway: 'Manual',    tags: ['Cash', 'Manual Entry'] },
];

export const mockItineraries = [
  { id: 'ITN001', user: 'Aarav Sharma',  title: 'Kerala 6 Days Trip',      days: 6, status: 'completed', aiGenerated: true,  destinations: 3, created: '10 Jul 2025', tags: ['Beach', 'Leisure'] },
  { id: 'ITN002', user: 'Priya Mehta',   title: 'Europe 14 Days Explorer', days: 14, status: 'draft',     aiGenerated: true,  destinations: 6, created: '12 Jul 2025', tags: ['International', 'Luxury'] },
  { id: 'ITN003', user: 'Vikram Singh',  title: 'Rajasthan Heritage 8D',   days: 8,  status: 'shared',    aiGenerated: false, destinations: 3, created: '8 Jul 2025',  tags: ['Heritage', 'Family'] },
];

export const mockNotifTemplates = [
  { id: 'NT001', name: 'Booking Confirmed', channel: 'Email+SMS', trigger: 'On Booking', status: 'active' },
  { id: 'NT002', name: 'Flight Reminder',   channel: 'Push+Email', trigger: '24h Before', status: 'active' },
  { id: 'NT003', name: 'Refund Processed',  channel: 'Email+SMS',  trigger: 'On Refund',  status: 'active' },
  { id: 'NT004', name: 'Driver Assigned',   channel: 'Push+SMS',   trigger: 'On Assign',  status: 'inactive' },
];

export const mockFAQs = [
  { id: 1, question: 'How do I cancel my flight booking?',     category: 'Flights', status: 'published', views: 4120, tags: ['Cancellation', 'Flight'] },
  { id: 2, question: 'What is the refund timeline for hotels?', category: 'Hotels',  status: 'published', views: 2841, tags: ['Refund', 'Hotel'] },
  { id: 3, question: 'Can I modify my package after booking?',  category: 'Packages', status: 'draft',    views: 0,    tags: ['Package', 'Modification'] },
  { id: 4, question: 'How to track my cab in real time?',       category: 'Cabs',    status: 'published', views: 1563, tags: ['Cab', 'Tracking'] },
];

export const mockAPIConfigs = [
  { id: 'API001', name: 'Amadeus Flights API',   type: 'Flight', provider: 'Amadeus',   status: 'active',   lastPing: '2 min ago',  latency: '124ms', tags: ["GDS", "Flights"] },
  { id: 'API002', name: 'Booking.com Hotels API', type: 'Hotel',  provider: 'Booking',   status: 'active',   lastPing: '1 min ago',  latency: '98ms', tags: ["Hotels", "Global"] },
  { id: 'API003', name: 'MakeMyTrip Hotels',      type: 'Hotel',  provider: 'MMT',       status: 'warning',  lastPing: '10 min ago', latency: '540ms', tags: ["Hotels", "Domestic"] },
  { id: 'API004', name: 'Sabre GDS',              type: 'Flight', provider: 'Sabre',     status: 'inactive', lastPing: '2 hrs ago',  latency: '-', tags: ["GDS", "Flights"] },
  { id: 'API005', name: 'Google Maps Cabs',        type: 'Cab',    provider: 'Google',    status: 'active',   lastPing: '30 sec ago', latency: '45ms', tags: ["Maps", "Navigation"] },
];

export const quickActions = [
  { label: 'Add Package',     icon: 'Package',  color: '#8b5cf6', path: '/packages/create' },
  { label: 'New Driver',      icon: 'Car',      color: '#22c55e', path: '/cabs/drivers/new' },
  { label: 'View Tickets',    icon: 'Headphones',color: '#f59e0b', path: '/support' },
  { label: 'Refund Request',  icon: 'RefreshCw', color: '#ef4444', path: '/payments/refunds' },
  { label: 'Manage To-Dos',   icon: 'CheckSquare',color:'#10b981', path: '/todos' },
  { label: 'API Health',      icon: 'Activity',  color: '#06b6d4', path: '/settings/apis' },
];

export const recentActivity = [
  { id: 1, text: 'New booking FLT8825 created by Arjun Nair',    time: '2 min ago',  type: 'booking' },
  { id: 2, text: 'Refund processed for TXN88223 - Rohit Verma',  time: '15 min ago', type: 'refund'  },
  { id: 3, text: 'Support ticket TKT0095 opened – high priority', time: '32 min ago', type: 'ticket'  },
  { id: 4, text: 'Driver Suresh Pillai went online in Kochi',     time: '1 hr ago',   type: 'driver'  },
  { id: 5, text: 'Package PKG002 sold out, bookings paused',      time: '2 hrs ago',  type: 'package' },
  { id: 6, text: 'MakeMyTrip Hotels API showing high latency',    time: '3 hrs ago',  type: 'alert'   },
];
