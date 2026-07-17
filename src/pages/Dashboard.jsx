import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Plane, Hotel, Car, Package, TrendingUp, Users,
  AlertTriangle, CheckCircle, Clock, ArrowUpRight
} from 'lucide-react';
import { KpiCard } from '../components/ui/index.jsx';
import { mockStats, revenueData, bookingTrendData, pieData, recentActivity, quickActions } from '../data/mockData.js';
import { useApp } from '../store/AppContext.jsx';
import { useNavigate } from 'react-router-dom';


const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ 
      background: 'var(--bg-card)', 
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid var(--border-strong)', 
      borderRadius: 10, 
      padding: '10px 14px', 
      fontSize: 12, 
      boxShadow: 'var(--shadow-lg)' 
    }}>
      <div style={{ fontWeight:700, marginBottom:6, color:'var(--text-primary)' }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ color:p.color, display:'flex', gap:8, alignItems:'center', marginTop: 4 }}>
          <span style={{ width:8,height:8,borderRadius:'50%',background:p.color,display:'inline-block' }}/>
          <span style={{ color:'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ fontWeight:700, color:'var(--text-primary)' }}>
            ₹{(p.value/1000).toFixed(0)}K
          </span>
        </div>
      ))}
    </div>
  );
};

const ACTIVITY_COLORS = {
  booking: 'var(--brand-500)',
  refund:  'var(--warning-500)',
  ticket:  'var(--danger-500)',
  driver:  'var(--success-500)',
  package: 'var(--accent-500)',
  alert:   'var(--danger-400)',
};

export default function Dashboard() {
  const { theme, addToast, adminName } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('revenue');

  const kpis = [
    { label: 'Total Revenue',    value: mockStats.revenue.value,     change: mockStats.revenue.change,     up: true,  icon: TrendingUp,  iconBg: '#2563eb' },
    { label: 'Total Bookings',   value: mockStats.bookings.value,    change: mockStats.bookings.change,    up: true,  icon: CheckCircle, iconBg: '#16a34a' },
    { label: 'Active Users',     value: mockStats.activeUsers.value, change: mockStats.activeUsers.change, up: true,  icon: Users,       iconBg: '#7c3aed' },
    { label: 'Failed Txns',      value: mockStats.failedTxns.value,  change: mockStats.failedTxns.change,  up: false, icon: AlertTriangle, iconBg: '#dc2626' },
  ];

  const isDark = theme === 'dark';

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(124, 58, 237, 0.25) 50%, rgba(13, 148, 136, 0.2) 100%)'
          : 'linear-gradient(135deg, #1e40af 0%, #6d28d9 50%, #0f766e 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: isDark
          ? '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
          : '0 20px 40px -15px rgba(30, 41, 59, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 70% 50%, rgba(255,255,255,.05) 0%, transparent 60%)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:11, fontWeight:600, color: isDark ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.7)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>
            Monday, July 14 2025
          </div>
          <h2 style={{ fontFamily:'var(--font-heading)', fontSize:28, fontWeight:800, color:'#fff', marginBottom:8, letterSpacing: '-0.02em' }}>
            Good morning, {adminName} 👋
          </h2>
          <p style={{ fontSize:13, color: isDark ? 'var(--text-secondary)' : 'rgba(255, 255, 255, 0.85)', maxWidth:480, lineHeight: 1.6 }}>
            Platform is running healthy. You have <strong style={{color:'#fff'}}>5 open tickets</strong> and <strong style={{color:'#fff'}}>3 pending refunds</strong> awaiting your review.
          </p>
          <div style={{ display:'flex', gap:10, marginTop:18 }}>
            <button className="btn" style={{
              background: isDark ? 'rgba(255,255,255,.12)' : '#ffffff',
              color: isDark ? '#fff' : 'var(--brand-600)',
              border: isDark ? '1px solid rgba(255,255,255,.15)' : 'none',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }} onClick={() => navigate('/support')}>
              View Tickets
            </button>
            <button className="btn" style={{
              background: isDark ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.15)',
              color: isDark ? 'rgba(255,255,255,.8)' : '#ffffff',
              border: isDark ? '1px solid rgba(255,255,255,.08)' : '1px solid rgba(255, 255, 255, 0.2)'
            }} onClick={() => navigate('/payments')}>
              Refund Queue
            </button>
          </div>
        </div>
        <div style={{ display:'flex', gap:14, position:'relative', zIndex:1 }}>
          {[
            { icon: Plane,   label: 'Flights',  val: '5,124', color: '#60a5fa' },
            { icon: Hotel,   label: 'Hotels',   val: '4,380', color: '#c084fc' },
            { icon: Car,     label: 'Cabs',     val: '2,891', color: '#4ade80' },
            { icon: Package, label: 'Packages', val: '452',   color: '#f472b6'   },
          ].map(s => (
            <div key={s.label} className="banner-stat-card" style={{ 
              background: isDark ? 'rgba(15, 23, 42, 0.35)' : 'rgba(255, 255, 255, 0.15)', 
              borderRadius: 14, 
              padding: '16px 14px', 
              textAlign: 'center', 
              border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(8px)', 
              minWidth: 92,
              boxShadow: isDark ? '0 8px 32px 0 rgba(0, 0, 0, 0.2)' : '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ 
                width: 32, height: 32, 
                borderRadius: 8, 
                background: isDark ? `${s.color}15` : 'rgba(255,255,255,0.2)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                margin: '0 auto 10px',
                border: isDark ? `1px solid ${s.color}25` : '1px solid rgba(255,255,255,0.3)'
              }}>
                <s.icon size={16} style={{ color: isDark ? s.color : '#fff' }} />
              </div>
              <div style={{ fontSize:18, fontWeight:800, color:'#fff', fontFamily:'var(--font-heading)', letterSpacing:'-0.02em' }}>{s.val}</div>
              <div style={{ fontSize:9, color: isDark ? 'rgba(255,255,255,.4)' : 'rgba(255,255,255,.75)', textTransform:'uppercase', letterSpacing:'.08em', marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title">Quick Actions</span>
        </div>
        <div style={{ padding: '16px 20px', display:'flex', gap:12, flexWrap:'wrap' }}>
          {quickActions.map(a => (
            <button
              key={a.label}
              className="btn btn-secondary"
              style={{ gap:8 }}
              onClick={() => { navigate(a.path); addToast(`Navigating to ${a.label}`, 'info'); }}
            >
              <span style={{ width:20,height:20, borderRadius:6, background:a.color+'22', display:'flex',alignItems:'center',justifyContent:'center' }}>
                <span style={{ width:10,height:10, borderRadius:'50%', background:a.color }}/>
              </span>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">Revenue Breakdown</span>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Last 7 months</div>
            </div>
            <div style={{ display:'flex', gap:4 }}>
              {['revenue','bookings'].map(t => (
                <button key={t} className={`tab-btn${activeTab===t?' active':''}`} style={{ padding:'4px 10px', margin:0, borderRadius:'var(--radius-sm)', fontSize:12 }} onClick={() => setActiveTab(t)}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding:'16px 8px 8px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top:4, right:8, bottom:0, left:0 }}>
                <defs>
                  <linearGradient id="gFlights" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gHotels" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gCabs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} width={48} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11, paddingTop:8 }} />
                <Area type="monotone" dataKey="flights"  name="Flights"  stroke="#3b82f6" fill="url(#gFlights)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="hotels"   name="Hotels"   stroke="#8b5cf6" fill="url(#gHotels)"  strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="cabs"     name="Cabs"     stroke="#22c55e" fill="url(#gCabs)"    strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie + Bar */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Booking Mix */}
          <div className="card" style={{ flex:1 }}>
            <div className="card-header">
              <span className="card-title">Booking Mix</span>
            </div>
            <div style={{ padding:'12px 8px', display:'flex', alignItems:'center', gap:16 }}>
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={52} paddingAngle={3} dataKey="value">
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                {pieData.map(d => (
                  <div key={d.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <span style={{ width:8,height:8,borderRadius:'50%',background:d.color,display:'inline-block' }}/>
                      <span style={{ color:'var(--text-secondary)' }}>{d.name}</span>
                    </div>
                    <span style={{ fontWeight:700, color:'var(--text-primary)' }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Bookings */}
          <div className="card" style={{ flex:1 }}>
            <div className="card-header">
              <span className="card-title">Daily Bookings</span>
              <span className="badge badge-success">This Week</span>
            </div>
            <div style={{ padding:'12px 8px 8px' }}>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={bookingTrendData} margin={{ top:0, right:4, bottom:0, left:0 }}>
                  <Bar dataKey="bookings" fill="#3b82f6" radius={[4,4,0,0]} />
                  <XAxis dataKey="day" tick={{ fontSize:10, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill:'var(--bg-hover)' }} contentStyle={{ fontSize:12, borderRadius:8, border:'1px solid var(--border-default)', background:'var(--bg-card)' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Activity</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/reports')}>View All <ArrowUpRight size={12}/></button>
          </div>
          <div style={{ padding:'4px 0' }}>
            {recentActivity.map((a, i) => (
              <div key={a.id} style={{
                display:'flex', alignItems:'flex-start', gap:12,
                padding:'12px 20px',
                borderBottom: i < recentActivity.length-1 ? '1px solid var(--border-default)' : 'none',
              }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background: ACTIVITY_COLORS[a.type], marginTop:5, flexShrink:0 }} />
                <div style={{ flex:1, fontSize:13, color:'var(--text-primary)', lineHeight:1.4 }}>{a.text}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)', whiteSpace:'nowrap', flexShrink:0 }}>
                  <Clock size={11} style={{ display:'inline', marginRight:3 }} />{a.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Status Summary */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Platform Health</span>
            <span className="badge badge-success">● All Systems Go</span>
          </div>
          <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:16 }}>
            {[
              { label:'Flight APIs', val:98, color:'#3b82f6' },
              { label:'Hotel APIs',  val:94, color:'#8b5cf6' },
              { label:'Cab System',  val:99, color:'#22c55e' },
              { label:'AI Services', val:87, color:'#f59e0b' },
              { label:'Payment GW',  val:100, color:'#10b981' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:6 }}>
                  <span style={{ color:'var(--text-secondary)', fontWeight:500 }}>{s.label}</span>
                  <span style={{ fontWeight:700, color: s.val >= 95 ? 'var(--success-600)' : s.val >= 85 ? 'var(--warning-600)' : 'var(--danger-600)' }}>
                    {s.val}%
                  </span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width:`${s.val}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding:'16px 20px', borderTop:'1px solid var(--border-default)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              { label:'Avg Response', val:'1.2s',   icon:'⚡' },
              { label:'Uptime',       val:'99.97%', icon:'✅' },
              { label:'Errors/hr',    val:'3',      icon:'🔴' },
              { label:'Active Sess.', val:'421',    icon:'👥' },
            ].map(m => (
              <div key={m.label} style={{ background:'var(--bg-hover)', borderRadius:8, padding:'10px 12px' }}>
                <div style={{ fontSize:18, marginBottom:4 }}>{m.icon}</div>
                <div style={{ fontSize:15, fontWeight:800, fontFamily:'var(--font-heading)', color:'var(--text-primary)' }}>{m.val}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
