import { useState } from 'react';
import { Eye, EyeOff, Compass, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../store/AppContext.jsx';
import { authService } from '../services/api.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast, toggleTheme, theme, loginAdmin } = useApp();
  const [email, setEmail] = useState('admin@itsglobal.in');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password mode
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('admin@itsglobal.in');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      loginAdmin(data.user, data.tokens);
      addToast(`Welcome back, ${data.user?.name || 'Admin'}!`, 'success');
      const target = location.state?.from?.pathname || '/dashboard';
      navigate(target, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotEmail) {
      setForgotError('Please enter your admin email.');
      return;
    }
    setForgotLoading(true);
    try {
      await authService.forgotPassword(forgotEmail);
      setForgotSuccess(true);
      addToast('Password reset link sent to your email!', 'success');
    } catch (err) {
      setForgotError(err.message || 'Failed to send reset link.');
    } finally {
      setForgotLoading(false);
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
            Manage flights, hotels, cabs, packages, AI itineraries and chat — all connected to high-performance NestJS REST API with JWT authentication.
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

      {/* Right — Login / Forgot Password Form */}
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

        {!forgotMode ? (
          <div>
            <div style={{ marginBottom:36 }}>
              <h1 style={{ fontFamily:'var(--font-heading)', fontSize:28, fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>
                Sign in to Admin
              </h1>
              <p style={{ fontSize:14, color:'var(--text-muted)' }}>
                Enter your admin credentials to access the management portal
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:18 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@itsglobal.in"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <label className="form-label" htmlFor="login-password" style={{ margin:0 }}>Password</label>
                  <button
                    type="button"
                    onClick={() => { setForgotMode(true); setForgotSuccess(false); setForgotError(''); }}
                    style={{ fontSize:12, color:'var(--brand-600)', fontWeight:500, background:'none', border:'none', cursor:'pointer', padding:0 }}
                  >
                    Forgot password?
                  </button>
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
                    required
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
                <div style={{ background:'rgba(239, 68, 68, 0.1)', border:'1px solid rgba(239, 68, 68, 0.3)', borderRadius:'var(--radius-md)', padding:'10px 14px', fontSize:13, color:'#ef4444' }}>
                  ⚠️ {error}
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
            </form>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setForgotMode(false)}
              style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'var(--text-muted)', background:'none', border:'none', cursor:'pointer', padding:0, marginBottom:20 }}
            >
              <ArrowLeft size={16} /> Back to Sign In
            </button>

            <div style={{ marginBottom:28 }}>
              <h1 style={{ fontFamily:'var(--font-heading)', fontSize:26, fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>
                Reset Password
              </h1>
              <p style={{ fontSize:14, color:'var(--text-muted)' }}>
                Enter your admin email address to receive password reset instructions.
              </p>
            </div>

            {forgotSuccess ? (
              <div style={{ background:'rgba(34, 197, 94, 0.1)', border:'1px solid rgba(34, 197, 94, 0.3)', borderRadius:'var(--radius-md)', padding:'16px', textAlign:'center' }}>
                <CheckCircle size={36} color="#22c55e" style={{ margin:'0 auto 10px' }} />
                <div style={{ fontWeight:700, color:'var(--text-primary)', marginBottom:4 }}>Check your inbox</div>
                <div style={{ fontSize:13, color:'var(--text-muted)' }}>
                  We have sent reset instructions to <strong>{forgotEmail}</strong>.
                </div>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setForgotMode(false)}
                  style={{ marginTop:16, width:'100%', justifyContent:'center' }}
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="forgot-email">Admin Email Address</label>
                  <input
                    id="forgot-email"
                    className="form-input"
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="admin@itsglobal.in"
                    required
                  />
                </div>

                {forgotError && (
                  <div style={{ background:'rgba(239, 68, 68, 0.1)', border:'1px solid rgba(239, 68, 68, 0.3)', borderRadius:'var(--radius-md)', padding:'10px 14px', fontSize:13, color:'#ef4444' }}>
                    ⚠️ {forgotError}
                  </div>
                )}

                <button
                  className="btn btn-primary btn-lg"
                  type="submit"
                  disabled={forgotLoading}
                  style={{ width:'100%', justifyContent:'center', fontSize:15 }}
                >
                  {forgotLoading ? 'Sending link…' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
        )}

        <div style={{ marginTop:40, paddingTop:20, borderTop:'1px solid var(--border-default)', fontSize:12, color:'var(--text-muted)', textAlign:'center' }}>
          © 2026 ITS Global Travel Technologies. All rights reserved.
        </div>
      </div>
    </div>
  );
}
