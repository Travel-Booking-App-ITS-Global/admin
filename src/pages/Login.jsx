import { useState } from 'react';
import { Eye, EyeOff, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { addToast, toggleTheme, theme } = useApp();
  const [email, setEmail] = useState('admin@itsglobal.in');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter both email and password.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    if (password === 'admin123') {
      addToast('Welcome back, Super Admin!', 'success');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Try password: admin123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-app)',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Left — Branding Panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #030712 0%, #0f172a 50%, #080711 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background orbs with animated gradients */}
        <div style={{ position:'absolute', top:'-100px', right:'-100px', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,.2) 0%, transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-100px', left:'-100px', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,.18) 0%, transparent 70%)', filter:'blur(70px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:'40%', left:'30%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(6,182,212,.12) 0%, transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }}/>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative' }}>
          <div style={{ 
            width:44, height:44, 
            background:'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', 
            borderRadius:12, 
            display:'flex', alignItems:'center', justifyContent: 'center', 
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
            color: '#fff'
          }}>
            <Compass size={22} className="logo-compass" />
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-heading)', fontSize:22, fontWeight:900, color:'#fff', letterSpacing: '-0.02em' }}>ITS Global</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,.45)', textTransform:'uppercase', letterSpacing:'.08em', marginTop:2 }}>Admin Panel</div>
          </div>
        </div>

        {/* Center Content */}
        <div style={{ position:'relative' }}>
          <div style={{ fontSize:46, fontFamily:'var(--font-heading)', fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:22, letterSpacing: '-0.03em' }}>
            Your travel platform,<br />
            <span style={{ background:'linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #00f2fe 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              fully in control.
            </span>
          </div>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.55)', lineHeight:1.7, maxWidth:420 }}>
            Manage flights, hotels, cabs, packages, AI itineraries and chat — all from one powerful admin dashboard built for enterprise scale.
          </p>

          {/* Feature Pills */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:32 }}>
            {[
              { text: 'Flights', icon: '✈', color: '#60a5fa' },
              { text: 'Hotels', icon: '🏨', color: '#c084fc' },
              { text: 'Cabs', icon: '🚖', color: '#4ade80' },
              { text: 'Packages', icon: '📦', color: '#f472b6' },
              { text: 'AI Chat', icon: '🤖', color: '#38bdf8' },
              { text: 'Itineraries', icon: '🗺', color: '#fb923c' },
            ].map(f => (
              <span key={f.text} style={{ 
                fontSize: 12, 
                fontWeight: 600, 
                padding: '6px 14px', 
                borderRadius: 'var(--radius-full)', 
                background: 'rgba(255,255,255,.04)', 
                color: 'rgba(255,255,255,.85)', 
                border: '1px solid rgba(255,255,255,.08)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}>
                <span style={{ color: f.color }}>{f.icon}</span> {f.text}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:40, position:'relative' }}>
          {[
            { val:'₹48L+',  label:'Monthly Revenue', color: '#60a5fa' },
            { val:'12K+',   label:'Bookings / Month', color: '#c084fc' },
            { val:'99.97%', label:'Uptime SLA', color: '#4ade80' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize:26, fontWeight:900, fontFamily:'var(--font-heading)', color:'#fff', letterSpacing: '-0.02em', background: `linear-gradient(135deg, #fff 0%, ${s.color} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.val}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', marginTop:4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Login Form */}
      <div style={{
        width: 500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 60px',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderLeft: '1px solid var(--border-default)',
        position: 'relative',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.25)',
      }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{ position:'absolute', top:20, right:20, width:36, height:36, borderRadius:'var(--radius-md)', background:'var(--bg-hover)', border:'1px solid var(--border-default)', cursor:'pointer', fontSize:16 }}
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div style={{ marginBottom:40 }}>
          <h1 style={{ fontFamily:'var(--font-heading)', fontSize:28, fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>
            Sign in to Admin
          </h1>
          <p style={{ fontSize:14, color:'var(--text-muted)' }}>
            Enter your admin credentials to access the panel
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@itsglobal.in"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <label className="form-label" style={{ margin:0 }}>Password</label>
              <a href="#" style={{ fontSize:12, color:'var(--brand-600)', fontWeight:500 }}>Forgot password?</a>
            </div>
            <div style={{ position:'relative' }}>
              <input
                id="login-password"
                className="form-input"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                style={{ paddingRight:40 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', cursor:'pointer', background:'none', border:'none', display:'flex', alignItems:'center' }}
              >
                {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background:'var(--danger-50)', border:'1px solid var(--danger-400)', borderRadius:'var(--radius-md)', padding:'10px 14px', fontSize:13, color:'var(--danger-600)' }}>
              ⚠ {error}
            </div>
          )}

          <button
            id="login-submit"
            className="btn btn-primary btn-lg"
            type="submit"
            disabled={loading}
            style={{ width:'100%', justifyContent:'center', marginTop:4, fontSize:15 }}
          >
            {loading ? (
              <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ width:16, height:16, borderRadius:'50%', border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', animation:'spin 0.7s linear infinite', display:'inline-block' }}/>
                Signing in…
              </span>
            ) : 'Sign In'}
          </button>

          <div style={{ textAlign:'center', fontSize:12, color:'var(--text-muted)', marginTop:4 }}>
            Demo credentials: <strong style={{ color:'var(--text-primary)' }}>admin123</strong>
          </div>
        </form>

        <div style={{ marginTop:40, paddingTop:20, borderTop:'1px solid var(--border-default)', fontSize:12, color:'var(--text-muted)', textAlign:'center' }}>
          © 2025 ITS Global Travel Technologies. All rights reserved.
        </div>
      </div>
    </div>
  );
}
