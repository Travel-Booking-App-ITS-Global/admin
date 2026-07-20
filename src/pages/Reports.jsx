import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  FileText, Download, Filter, Users, Plane, Hotel,
  Car, Package, CreditCard, TrendingUp, Search,
  CheckCircle, XCircle, Clock, AlertTriangle,
  ChevronDown, ChevronUp, RefreshCw
} from 'lucide-react';
import {
  mockUsers, mockFlightBookings, mockHotelBookings,
  mockCabBookings, mockTransactions, mockPackages
} from '../data/mockData.js';
import { useNavigate } from 'react-router-dom';

/* ── Download CSV helper ───────────────────── */
function downloadCSV(rows, filename) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => `"${r[k] ?? ''}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ── Status badge helper ───────────────────── */
const STATUS_COLOR = {
  active:'#16a34a', inactive:'#94a3b8', blocked:'#dc2626',
  confirmed:'#16a34a', cancelled:'#dc2626', pending:'#d97706',
  refunded:'#8b5cf6', completed:'#16a34a', ongoing:'#3b82f6',
  scheduled:'#d97706', success:'#16a34a',
};

function StatusPill({ status }) {
  const color = STATUS_COLOR[status] || '#94a3b8';
  return (
    <span style={{ fontSize:10, fontWeight:700, padding:'2px 9px', borderRadius:20,
      background:`${color}18`, border:`1px solid ${color}40`, color, textTransform:'capitalize' }}>
      {status}
    </span>
  );
}

const REPORT_TABS = [
  { id:'users',    label:'User Report',    icon:Users,      count: mockUsers.length },
  { id:'flights',  label:'Flight Report',  icon:Plane,      count: mockFlightBookings.length },
  { id:'hotels',   label:'Hotel Report',   icon:Hotel,      count: mockHotelBookings.length },
  { id:'cabs',     label:'Cab Report',     icon:Car,        count: mockCabBookings.length },
  { id:'payments', label:'Payment Report', icon:CreditCard, count: mockTransactions.length },
  { id:'packages', label:'Package Report', icon:Package,    count: mockPackages.length },
];

/* ── Summary stat for each report ─────────────────────────── */
const SUMMARY = {
  users: [
    { label:'Total Users',   val: mockUsers.length,                                   color:'#3b82f6', icon:Users },
    { label:'Active',        val: mockUsers.filter(u=>u.status==='active').length,     color:'#16a34a', icon:CheckCircle },
    { label:'Blocked',       val: mockUsers.filter(u=>u.status==='blocked').length,    color:'#ef4444', icon:XCircle },
    { label:'Total Spent',   val:'₹6,12,750',                                          color:'#8b5cf6', icon:TrendingUp },
  ],
  flights: [
    { label:'Total Bookings',  val: mockFlightBookings.length,                                         color:'#3b82f6', icon:Plane },
    { label:'Confirmed',       val: mockFlightBookings.filter(f=>f.status==='confirmed').length,        color:'#16a34a', icon:CheckCircle },
    { label:'Cancelled',       val: mockFlightBookings.filter(f=>f.status==='cancelled').length,        color:'#ef4444', icon:XCircle },
    { label:'Revenue',         val:'₹2,21,820',                                                         color:'#8b5cf6', icon:TrendingUp },
  ],
  hotels: [
    { label:'Total Bookings',  val: mockHotelBookings.length,                                          color:'#3b82f6', icon:Hotel },
    { label:'Confirmed',       val: mockHotelBookings.filter(h=>h.status==='confirmed').length,         color:'#16a34a', icon:CheckCircle },
    { label:'Pending',         val: mockHotelBookings.filter(h=>h.status==='pending').length,           color:'#d97706', icon:Clock },
    { label:'Revenue',         val:'₹1,43,500',                                                         color:'#8b5cf6', icon:TrendingUp },
  ],
  cabs: [
    { label:'Total Rides',     val: mockCabBookings.length,                                             color:'#3b82f6', icon:Car },
    { label:'Completed',       val: mockCabBookings.filter(c=>c.status==='completed').length,           color:'#16a34a', icon:CheckCircle },
    { label:'Ongoing',         val: mockCabBookings.filter(c=>c.status==='ongoing').length,             color:'#3b82f6', icon:Clock },
    { label:'Revenue',         val:'₹3,800',                                                            color:'#8b5cf6', icon:TrendingUp },
  ],
  payments: [
    { label:'Transactions',    val: mockTransactions.length,                                            color:'#3b82f6', icon:CreditCard },
    { label:'Successful',      val: mockTransactions.filter(t=>t.status==='success').length,            color:'#16a34a', icon:CheckCircle },
    { label:'Refunded',        val: mockTransactions.filter(t=>t.status==='refunded').length,           color:'#8b5cf6', icon:RefreshCw },
    { label:'Pending',         val: mockTransactions.filter(t=>t.status==='pending').length,            color:'#d97706', icon:AlertTriangle },
  ],
  packages: [
    { label:'Total Packages',  val: mockPackages.length,                                                color:'#3b82f6', icon:Package },
    { label:'Active',          val: mockPackages.filter(p=>p.status==='active').length,                 color:'#16a34a', icon:CheckCircle },
    { label:'Draft',           val: mockPackages.filter(p=>p.status==='draft').length,                  color:'#d97706', icon:Clock },
    { label:'Total Bookings',  val: mockPackages.reduce((s,p)=>s+(p.bookings||0),0),                    color:'#8b5cf6', icon:TrendingUp },
  ],
};

/* ── Chart data per tab ────────────────────────────────────── */
const CHART_DATA = {
  users: [
    { name:'Active',   value: mockUsers.filter(u=>u.status==='active').length,   color:'#22c55e' },
    { name:'Inactive', value: mockUsers.filter(u=>u.status==='inactive').length, color:'#94a3b8' },
    { name:'Blocked',  value: mockUsers.filter(u=>u.status==='blocked').length,  color:'#ef4444' },
  ],
  flights: [
    { name:'Confirmed', value: mockFlightBookings.filter(f=>f.status==='confirmed').length, color:'#22c55e' },
    { name:'Pending',   value: mockFlightBookings.filter(f=>f.status==='pending').length,   color:'#f59e0b' },
    { name:'Cancelled', value: mockFlightBookings.filter(f=>f.status==='cancelled').length, color:'#ef4444' },
    { name:'Refunded',  value: mockFlightBookings.filter(f=>f.status==='refunded').length,  color:'#8b5cf6' },
  ],
  hotels: [
    { name:'Confirmed', value: mockHotelBookings.filter(h=>h.status==='confirmed').length, color:'#22c55e' },
    { name:'Pending',   value: mockHotelBookings.filter(h=>h.status==='pending').length,   color:'#f59e0b' },
    { name:'Cancelled', value: mockHotelBookings.filter(h=>h.status==='cancelled').length, color:'#ef4444' },
  ],
  cabs: [
    { name:'Completed',  value: mockCabBookings.filter(c=>c.status==='completed').length,  color:'#22c55e' },
    { name:'Ongoing',    value: mockCabBookings.filter(c=>c.status==='ongoing').length,    color:'#3b82f6' },
    { name:'Scheduled',  value: mockCabBookings.filter(c=>c.status==='scheduled').length,  color:'#f59e0b' },
  ],
  payments: [
    { name:'Success',   value: mockTransactions.filter(t=>t.status==='success').length,   color:'#22c55e' },
    { name:'Refunded',  value: mockTransactions.filter(t=>t.status==='refunded').length,  color:'#8b5cf6' },
    { name:'Pending',   value: mockTransactions.filter(t=>t.status==='pending').length,   color:'#f59e0b' },
  ],
  packages: [
    { name:'Active', value: mockPackages.filter(p=>p.status==='active').length, color:'#22c55e' },
    { name:'Draft',  value: mockPackages.filter(p=>p.status==='draft').length,  color:'#94a3b8' },
  ],
};

/* ── Table columns config per tab ─────────────────────────── */
function getTableRows(tab) {
  switch(tab) {
    case 'users':    return mockUsers.map(u => ({ ID:u.id, Name:u.name, Email:u.email, Phone:u.phone, Status:u.status, Bookings:u.bookings, Spent:u.spent, Joined:u.joined }));
    case 'flights':  return mockFlightBookings.map(f => ({ ID:f.id, User:f.user, From:f.from, To:f.to, Airline:f.airline, PNR:f.pnr, Class:f.class, Amount:f.amount, Status:f.status, Date:f.date }));
    case 'hotels':   return mockHotelBookings.map(h => ({ ID:h.id, User:h.user, Hotel:h.hotel, City:h.city, Checkin:h.checkin, Checkout:h.checkout, Rooms:h.rooms, Amount:h.amount, Status:h.status }));
    case 'cabs':     return mockCabBookings.map(c => ({ ID:c.id, User:c.user, Driver:c.driver, Pickup:c.pickup, Drop:c.drop, Vehicle:c.vehicle, Amount:c.amount, Status:c.status, Date:c.date }));
    case 'payments': return mockTransactions.map(t => ({ ID:t.id, User:t.user, Type:t.type, Amount:t.amount, Method:t.method, Gateway:t.gateway, Status:t.status, Date:t.date }));
    case 'packages': return mockPackages.map(p => ({ ID:p.id, Name:p.name, Category:p.category, Duration:p.duration, Price:p.price, Bookings:p.bookings, Status:p.status }));
    default: return [];
  }
}

export default function Reports() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('users');
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const tabInfo = REPORT_TABS.find(t => t.id === tab);
  const allRows = getTableRows(tab);

  const rows = useMemo(() => {
    let r = allRows;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      r = r.filter(row => Object.values(row).some(v => String(v).toLowerCase().includes(q)));
    }
    if (sortCol) {
      r = [...r].sort((a, b) => {
        const av = String(a[sortCol] ?? '').toLowerCase();
        const bv = String(b[sortCol] ?? '').toLowerCase();
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return r;
  }, [search, sortCol, sortDir, allRows]);

  const columns = allRows.length ? Object.keys(allRows[0]) : [];

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:22, color:'var(--text-primary)', marginBottom:4 }}>
            <FileText size={20} style={{ display:'inline', marginRight:8, color:'var(--brand-500)' }}/>
            Reports Center
          </h2>
          <p style={{ fontSize:13, color:'var(--text-muted)' }}>Detailed data reports with filters, search and CSV export</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-secondary"
            onClick={() => downloadCSV(rows, `${tab}-report.csv`)}>
            <Download size={14}/> Export CSV
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/analytics')}>
            <TrendingUp size={14}/> View Analytics
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {REPORT_TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => { setTab(t.id); setSearch(''); setSortCol(null); }}
              style={{
                display:'flex', alignItems:'center', gap:7, padding:'8px 16px',
                borderRadius:10, border: active ? '1px solid var(--brand-500)' : '1px solid var(--border-default)',
                background: active ? 'var(--brand-500)' : 'var(--bg-card)',
                color: active ? '#fff' : 'var(--text-secondary)',
                fontWeight:600, fontSize:12.5, cursor:'pointer', transition:'all 0.15s',
              }}>
              <t.icon size={14}/>
              {t.label}
              <span style={{ fontSize:10, padding:'1px 6px', borderRadius:10,
                background: active ? 'rgba(255,255,255,0.25)' : 'var(--bg-hover)',
                color: active ? '#fff' : 'var(--text-muted)' }}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Summary KPI Row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        {(SUMMARY[tab] || []).map(s => (
          <div key={s.label} className="card" style={{ padding:'16px 18px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:`${s.color}18`, border:`1px solid ${s.color}30`,
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <s.icon size={18} style={{ color:s.color }}/>
            </div>
            <div>
              <div style={{ fontSize:20, fontWeight:800, fontFamily:'var(--font-heading)', color:'var(--text-primary)', lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Search Row */}
      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:16 }}>
        {/* Donut chart */}
        <div className="card" style={{ padding:'18px' }}>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginBottom:14 }}>Status Breakdown</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={CHART_DATA[tab]} cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={3} dataKey="value">
                {(CHART_DATA[tab]||[]).map((d,i) => <Cell key={i} fill={d.color}/>)}
              </Pie>
              <Tooltip formatter={(v,n) => [v, n]}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:8 }}>
            {(CHART_DATA[tab]||[]).map(d => (
              <div key={d.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:8,height:8,borderRadius:'50%',background:d.color,display:'inline-block' }}/>
                  <span style={{ color:'var(--text-secondary)' }}>{d.name}</span>
                </div>
                <span style={{ fontWeight:700, color:'var(--text-primary)' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">{tabInfo?.label} — Status Distribution</span>
            <span style={{ fontSize:12, color:'var(--text-muted)' }}>{rows.length} records</span>
          </div>
          <div style={{ padding:'8px 8px 8px' }}>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={CHART_DATA[tab]} margin={{ top:4, right:8, bottom:0, left:-10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false}/>
                <XAxis dataKey="name" tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} width={28}/>
                <Tooltip contentStyle={{ fontSize:12, borderRadius:8, border:'1px solid var(--border-default)', background:'var(--bg-card)' }}/>
                <Bar dataKey="value" name="Count" radius={[6,6,0,0]}>
                  {(CHART_DATA[tab]||[]).map((d,i) => <Cell key={i} fill={d.color}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Search + Table */}
      <div className="card">
        <div className="card-header">
          <div style={{ display:'flex', alignItems:'center', gap:8, flex:1 }}>
            <tabInfo.icon size={15} style={{ color:'var(--brand-500)' }}/>
            <span className="card-title">{tabInfo?.label} Data</span>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ position:'relative' }}>
              <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}/>
              <input
                type="text"
                placeholder={`Search ${tabInfo?.label?.toLowerCase()}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding:'6px 12px 6px 30px', fontSize:12.5, borderRadius:8,
                  border:'1px solid var(--border-default)', background:'var(--bg-input)',
                  color:'var(--text-primary)', outline:'none', width:220 }}
              />
            </div>
            <span style={{ fontSize:11.5, color:'var(--text-muted)', background:'var(--bg-hover)', padding:'4px 10px', borderRadius:6, border:'1px solid var(--border-default)' }}>
              <Filter size={11} style={{ display:'inline', marginRight:4 }}/>{rows.length} of {allRows.length}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={() => downloadCSV(rows, `${tab}-report.csv`)}>
              <Download size={12}/> CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border-default)' }}>
                {columns.map(col => (
                  <th key={col} onClick={() => handleSort(col)}
                    style={{ padding:'10px 14px', textAlign:'left', fontWeight:700, fontSize:11,
                      color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em',
                      whiteSpace:'nowrap', cursor:'pointer', userSelect:'none',
                      background:'var(--bg-hover)', borderBottom:'1px solid var(--border-default)' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                      {col}
                      {sortCol === col
                        ? (sortDir === 'asc' ? <ChevronUp size={11}/> : <ChevronDown size={11}/>)
                        : <ChevronDown size={11} style={{ opacity:0.3 }}/>}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={columns.length} style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)', fontSize:13 }}>
                  No records match your search.
                </td></tr>
              ) : rows.map((row, ri) => (
                <tr key={ri} style={{ borderBottom:'1px solid var(--border-default)', transition:'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  {columns.map(col => (
                    <td key={col} style={{ padding:'10px 14px', color:'var(--text-primary)', whiteSpace:'nowrap', maxWidth:180, overflow:'hidden', textOverflow:'ellipsis' }}>
                      {col.toLowerCase() === 'status'
                        ? <StatusPill status={row[col]}/>
                        : col === 'ID'
                          ? <span style={{ fontFamily:'monospace', fontSize:11, color:'var(--text-muted)', background:'var(--bg-hover)', padding:'2px 6px', borderRadius:4 }}>{row[col]}</span>
                          : String(row[col] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding:'10px 18px', borderTop:'1px solid var(--border-default)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:12, color:'var(--text-muted)' }}>
            Showing <strong>{rows.length}</strong> of <strong>{allRows.length}</strong> records
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => downloadCSV(rows, `${tab}-report.csv`)}>
            <Download size={12}/> Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
}
