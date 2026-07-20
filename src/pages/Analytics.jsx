import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Users, DollarSign, Plane, Hotel, Car, Package,
  ArrowUpRight, ArrowDownRight, BarChart2, Globe, Target
} from 'lucide-react';
import { pieData } from '../data/mockData.js';
import { useNavigate } from 'react-router-dom';

/* ── Extra data ─────────────────────────── */
const monthlyData = [
  { month:'Jan', revenue:980000,  users:320, flights:420000, hotels:310000, cabs:180000, packages:90000,  refunds:42 },
  { month:'Feb', revenue:905000,  users:280, flights:380000, hotels:290000, cabs:160000, packages:75000,  refunds:31 },
  { month:'Mar', revenue:1220000, users:420, flights:510000, hotels:380000, cabs:210000, packages:120000, refunds:58 },
  { month:'Apr', revenue:1185000, users:390, flights:490000, hotels:360000, cabs:195000, packages:140000, refunds:49 },
  { month:'May', revenue:1385000, users:510, flights:560000, hotels:420000, cabs:240000, packages:165000, refunds:37 },
  { month:'Jun', revenue:1570000, users:620, flights:620000, hotels:480000, cabs:280000, packages:190000, refunds:44 },
  { month:'Jul', revenue:1770000, users:740, flights:710000, hotels:530000, cabs:310000, packages:220000, refunds:29 },
];

const conversionData = [
  { day:'Mon', searches:1840, bookings:312, conv:16.9 },
  { day:'Tue', searches:2100, bookings:398, conv:19.0 },
  { day:'Wed', searches:1750, bookings:287, conv:16.4 },
  { day:'Thu', searches:2340, bookings:451, conv:19.3 },
  { day:'Fri', searches:2890, bookings:587, conv:20.3 },
  { day:'Sat', searches:3120, bookings:672, conv:21.5 },
  { day:'Sun', searches:2640, bookings:543, conv:20.6 },
];

const radarData = [
  { cat:'Flights',  score:88 },
  { cat:'Hotels',   score:74 },
  { cat:'Cabs',     score:92 },
  { cat:'Packages', score:61 },
  { cat:'Support',  score:79 },
  { cat:'Payments', score:95 },
];

const topRoutes = [
  { route:'DEL → BOM', bookings:843, revenue:'₹7.1L', growth:'+18%' },
  { route:'COK → DXB', bookings:612, revenue:'₹17.4L', growth:'+31%' },
  { route:'BOM → GOI', bookings:554, revenue:'₹3.9L', growth:'+12%' },
  { route:'DEL → LHR', bookings:389, revenue:'₹55.3L', growth:'+22%' },
  { route:'HYD → SIN', bookings:341, revenue:'₹10.8L', growth:'+9%' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-strong)', borderRadius:10, padding:'10px 14px', fontSize:12, boxShadow:'var(--shadow-lg)' }}>
      <div style={{ fontWeight:700, marginBottom:6, color:'var(--text-primary)' }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ display:'flex', gap:8, alignItems:'center', marginTop:3 }}>
          <span style={{ width:8,height:8,borderRadius:'50%',background:p.color,display:'inline-block' }}/>
          <span style={{ color:'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ fontWeight:700, color:'var(--text-primary)' }}>
            {typeof p.value === 'number' && p.value > 10000 ? `₹${(p.value/1000).toFixed(0)}K` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const KPI = ({ label, val, change, up, icon: Icon, color, sub }) => (
  <div className="card" style={{ padding:'20px', cursor:'default', transition:'transform 0.15s' }}
    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
    onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
      <div style={{ width:42, height:42, borderRadius:12, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon size={20} style={{ color }}/>
      </div>
      <span style={{ fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:20,
        background: up ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
        color: up ? '#16a34a' : '#dc2626', display:'flex', alignItems:'center', gap:3 }}>
        {up ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}{change}
      </span>
    </div>
    <div style={{ fontSize:26, fontWeight:800, fontFamily:'var(--font-heading)', color:'var(--text-primary)', letterSpacing:'-0.02em' }}>{val}</div>
    <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>{label}</div>
    {sub && <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:2 }}>{sub}</div>}
  </div>
);

export default function Analytics() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('7M');
  const [chartType, setChartType] = useState('area');

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:22, color:'var(--text-primary)', marginBottom:4 }}>
            <BarChart2 size={20} style={{ display:'inline', marginRight:8, color:'var(--brand-500)' }}/>
            Analytics &amp; Reports
          </h2>
          <p style={{ fontSize:13, color:'var(--text-muted)' }}>Business intelligence, booking trends and growth metrics</p>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ display:'flex', background:'var(--bg-hover)', borderRadius:8, border:'1px solid var(--border-default)', overflow:'hidden' }}>
            {['7M','30D','90D'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding:'6px 14px', fontSize:12, fontWeight:600, border:'none', cursor:'pointer',
                background: period===p ? 'var(--brand-500)' : 'transparent',
                color: period===p ? '#fff' : 'var(--text-muted)',
                transition:'all 0.15s'
              }}>{p}</button>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/reports')}>
            Export <ArrowUpRight size={13}/>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        <KPI label="Total Revenue" val="₹1.77Cr" change="+14.2%" up icon={DollarSign} color="#2563eb" sub="This month"/>
        <KPI label="New Users"     val="740"    change="+19.1%" up icon={Users}       color="#7c3aed" sub="vs 621 last month"/>
        <KPI label="Booking Rate"  val="20.3%"  change="+2.1%"  up icon={Target}      color="#16a34a" sub="Search to booking"/>
        <KPI label="Avg Order Val" val="₹4,820" change="+7.4%"  up icon={TrendingUp}  color="#d97706" sub="Per transaction"/>
      </div>

      {/* Revenue vs Category chart */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="card-title">Revenue by Service Category</span>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Monthly breakdown: Flights · Hotels · Cabs · Packages</div>
          </div>
          <div style={{ display:'flex', gap:4 }}>
            {['area','bar'].map(t => (
              <button key={t} className={`tab-btn${chartType===t?' active':''}`}
                style={{ padding:'4px 12px', margin:0, fontSize:11, textTransform:'capitalize' }}
                onClick={() => setChartType(t)}>
                {t==='area' ? '📈 Area' : '📊 Bar'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding:'16px 8px 8px' }}>
          <ResponsiveContainer width="100%" height={240}>
            {chartType === 'area' ? (
              <AreaChart data={monthlyData} margin={{ top:4,right:8,bottom:0,left:0 }}>
                <defs>
                  {[['gF','#3b82f6'],['gH','#8b5cf6'],['gC','#22c55e'],['gP','#f59e0b']].map(([id,c]) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={c} stopOpacity={0.35}/>
                      <stop offset="95%" stopColor={c} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false}/>
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v/1000}K`} width={52}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11, paddingTop:8 }}/>
                <Area type="monotone" dataKey="flights"  name="Flights"  stroke="#3b82f6" fill="url(#gF)" strokeWidth={2} dot={false}/>
                <Area type="monotone" dataKey="hotels"   name="Hotels"   stroke="#8b5cf6" fill="url(#gH)" strokeWidth={2} dot={false}/>
                <Area type="monotone" dataKey="cabs"     name="Cabs"     stroke="#22c55e" fill="url(#gC)" strokeWidth={2} dot={false}/>
                <Area type="monotone" dataKey="packages" name="Packages" stroke="#f59e0b" fill="url(#gP)" strokeWidth={2} dot={false}/>
              </AreaChart>
            ) : (
              <BarChart data={monthlyData} margin={{ top:4,right:8,bottom:0,left:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false}/>
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v/1000}K`} width={52}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11, paddingTop:8 }}/>
                <Bar dataKey="flights"  name="Flights"  fill="#3b82f6" radius={[3,3,0,0]} stackId="a"/>
                <Bar dataKey="hotels"   name="Hotels"   fill="#8b5cf6" radius={[3,3,0,0]} stackId="a"/>
                <Bar dataKey="cabs"     name="Cabs"     fill="#22c55e" radius={[3,3,0,0]} stackId="a"/>
                <Bar dataKey="packages" name="Packages" fill="#f59e0b" radius={[3,3,0,0]} stackId="a"/>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Conversion + Booking Mix + Radar */}
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 0.8fr 0.8fr', gap:18 }}>

        {/* Conversion Rate Line Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">Search → Booking Conversion</span>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Daily searches vs confirmed bookings this week</div>
            </div>
            <span className="badge badge-success">+2.1% vs last week</span>
          </div>
          <div style={{ padding:'8px 8px 8px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={conversionData} margin={{ top:4,right:8,bottom:0,left:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false}/>
                <XAxis dataKey="day" tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false}/>
                <YAxis yAxisId="left"  tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} width={40}/>
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} width={36}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11 }}/>
                <Line yAxisId="left"  type="monotone" dataKey="searches" name="Searches" stroke="#94a3b8" strokeWidth={1.5} dot={false} strokeDasharray="4 2"/>
                <Line yAxisId="left"  type="monotone" dataKey="bookings" name="Bookings" stroke="#3b82f6" strokeWidth={2.5} dot={{ r:4, fill:'#3b82f6' }}/>
                <Line yAxisId="right" type="monotone" dataKey="conv"     name="Conv. %" stroke="#22c55e" strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Mix Pie */}
        <div className="card">
          <div className="card-header"><span className="card-title">Booking Mix</span></div>
          <div style={{ padding:'12px 8px', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={36} outerRadius={62} paddingAngle={3} dataKey="value">
                  {pieData.map((d,i) => <Cell key={i} fill={d.color}/>)}
                </Pie>
                <Tooltip formatter={v=>`${v}%`}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:6 }}>
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

        {/* Radar: Service Performance */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Service Health Score</span>
          </div>
          <div style={{ padding:'8px 4px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border-default)"/>
                <PolarAngleAxis dataKey="cat" tick={{ fontSize:11, fill:'var(--text-muted)' }}/>
                <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2}/>
                <Tooltip formatter={v=>`${v}/100`}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: User Growth + Refunds Bar + Top Routes */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:18 }}>

        {/* User Growth */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">User Growth</span>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>New signups per month</div>
            </div>
            <span className="badge badge-info">7-month trend</span>
          </div>
          <div style={{ padding:'12px 8px 8px' }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyData} margin={{ top:4,right:4,bottom:0,left:-16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false}/>
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} width={40}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="users" name="New Users" fill="#8b5cf6" radius={[5,5,0,0]}>
                  {monthlyData.map((_, i) => (
                    <Cell key={i} fill={i === monthlyData.length-1 ? '#6366f1' : '#8b5cf640'}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Refunds Trend */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">Refunds &amp; Disputes</span>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Monthly refund count</div>
            </div>
            <span className="badge badge-warning">Monitor</span>
          </div>
          <div style={{ padding:'12px 8px 8px' }}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={monthlyData} margin={{ top:4,right:4,bottom:0,left:-16 }}>
                <defs>
                  <linearGradient id="gRef" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false}/>
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} width={28}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area type="monotone" dataKey="refunds" name="Refunds" stroke="#ef4444" fill="url(#gRef)" strokeWidth={2} dot={{ r:3, fill:'#ef4444' }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Routes Table */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Globe size={14} style={{ display:'inline', marginRight:6, color:'var(--brand-500)' }}/>
              Top Flight Routes
            </span>
            <button className="btn btn-ghost btn-sm" onClick={()=>navigate('/flights')}>View All <ArrowUpRight size={12}/></button>
          </div>
          <div style={{ padding:'4px 0' }}>
            {topRoutes.map((r,i) => (
              <div key={r.route} style={{
                display:'flex', alignItems:'center', gap:10, padding:'11px 18px',
                borderBottom: i < topRoutes.length-1 ? '1px solid var(--border-default)' : 'none',
              }}>
                <div style={{ width:24, height:24, borderRadius:6, background:'var(--bg-hover)', border:'1px solid var(--border-default)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'var(--text-muted)', flexShrink:0 }}>
                  {i+1}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', display:'flex', alignItems:'center', gap:5 }}>
                    <Plane size={11} style={{ color:'#3b82f6' }}/> {r.route}
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>{r.bookings} bookings</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)' }}>{r.revenue}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:'#16a34a' }}>{r.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Insight Strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        {[
          { icon:Plane,   label:'Flight Revenue Share', val:'40.1%', color:'#3b82f6', note:'Highest contributor', path:'/flights' },
          { icon:Hotel,   label:'Hotel Fill Rate',       val:'74%',   color:'#8b5cf6', note:'Room occupancy',     path:'/hotels' },
          { icon:Car,     label:'Cab Completion Rate',   val:'96.2%', color:'#22c55e', note:'Rides fulfilled',    path:'/cabs' },
          { icon:Package, label:'Package Conversion',    val:'12.4%', color:'#f59e0b', note:'Views to bookings',  path:'/packages' },
        ].map(s => (
          <div key={s.label} className="card"
            style={{ padding:'16px 18px', display:'flex', gap:12, alignItems:'center', cursor:'pointer', transition:'transform 0.15s' }}
            onClick={() => navigate(s.path)}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ width:40, height:40, borderRadius:10, background:`${s.color}15`, border:`1px solid ${s.color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <s.icon size={18} style={{ color:s.color }}/>
            </div>
            <div>
              <div style={{ fontSize:20, fontWeight:800, fontFamily:'var(--font-heading)', color:'var(--text-primary)', lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:11.5, fontWeight:600, color:'var(--text-secondary)', marginTop:2 }}>{s.label}</div>
              <div style={{ fontSize:10.5, color:'var(--text-muted)' }}>{s.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
