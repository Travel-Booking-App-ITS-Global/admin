import { useState, useEffect } from 'react';
import { Eye, EyeOff, Compass, Lock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../store/AppContext.jsx';
import { authService } from '../services/api.js';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast, toggleTheme, theme } = useApp();

  const tokenParam = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const isValidLink = Boolean(tokenParam && emailParam);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(email, tokenParam, newPassword);
      setSuccess(true);
      addToast('Password has been reset successfully!', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
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
        {/* Background orbs */}
        <div style={{ position:'absolute', top:'-100px', right:'-100px', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,.2) 0%, transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-100px', left:'-100px', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,.18) 0%, transparent 70%)', filter:'blur(70px)', pointerEvents:'none' }}/>

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
            <div style={{ fontSize:10, color:'rgba(255,255,255,.45)', textTransform:'uppercase', letterSpacing:'.08em', marginTop:2 }}>Security Portal</div>
          </div>
        </div>

        {/* Center Content */}
        <div style={{ position:'relative' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 8, 
            padding: '6px 14px', borderRadius: 'var(--radius-full)', 
            background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#60a5fa', fontSize: 13, fontWeight: 600, marginBottom: 20
          }}>
            <ShieldCheck size={16} /> Enterprise Security Protocol
          </div>
          <div style={{ fontSize:42, fontFamily:'var(--font-heading)', fontWeight:900, color:'#fff', lineHeight:1.15, marginBottom:20, letterSpacing: '-0.03em' }}>
            Set a new secure<br />
            <span style={{ background:'linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #00f2fe 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              admin password.
            </span>
          </div>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.55)', lineHeight:1.7, maxWidth:440 }}>
            Ensure your new password contains at least 6 characters, combining letters, numbers, and special symbols for maximum platform protection.
          </p>
        </div>

        {/* Footer info */}
        <div style={{ fontSize:12, color:'rgba(255,255,255,.4)' }}>
          Session Token Authenticated &bull; High-grade cryptographic verification
        </div>
      </div>

      {/* Right — Form Panel */}
      <div style={{
        width: 520,
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

        {!isValidLink ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ 
              width: 56, height: 56, borderRadius: '50%', 
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', color: '#ef4444'
            }}>
              <AlertTriangle size={28} />
            </div>
            <h2 style={{ fontFamily:'var(--font-heading)', fontSize:22, fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>
              Invalid or Missing Reset Token
            </h2>
            <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.6, marginBottom:24 }}>
              The password reset link appears incomplete or has expired. Please request a new link from the login page.
            </p>
            <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
              Back to Login
            </Link>
          </div>
        ) : success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ 
              width: 64, height: 64, borderRadius: '50%', 
              background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px', color: '#22c55e'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontFamily:'var(--font-heading)', fontSize:24, fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>
              Password Changed Successfully!
            </h2>
            <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.6, marginBottom:28 }}>
              Your admin credentials have been updated securely. Redirecting you to the sign in page...
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              Sign In Now <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom:32 }}>
              <h1 style={{ fontFamily:'var(--font-heading)', fontSize:28, fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>
                Reset Admin Password
              </h1>
              <p style={{ fontSize:14, color:'var(--text-muted)' }}>
                Please create a new password for your administrator account.
              </p>
            </div>

            <form onSubmit={handleReset} style={{ display:'flex', flexDirection:'column', gap:18 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="reset-email">Admin Email (Verified)</label>
                <input
                  id="reset-email"
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  readOnly
                  style={{ opacity: 0.85, cursor: 'not-allowed', background: 'var(--bg-hover)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reset-new-password">New Password</label>
                <div style={{ position:'relative' }}>
                  <input
                    id="reset-new-password"
                    className="form-input"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    style={{ paddingRight:40 }}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', cursor:'pointer', background:'none', border:'none', display:'flex', alignItems:'center' }}
                  >
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reset-confirm-password">Confirm New Password</label>
                <div style={{ position:'relative' }}>
                  <input
                    id="reset-confirm-password"
                    className="form-input"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    style={{ paddingRight:40 }}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', cursor:'pointer', background:'none', border:'none', display:'flex', alignItems:'center' }}
                  >
                    {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ background:'rgba(239, 68, 68, 0.1)', border:'1px solid rgba(239, 68, 68, 0.3)', borderRadius:'var(--radius-md)', padding:'10px 14px', fontSize:13, color:'#ef4444' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                id="reset-submit"
                className="btn btn-primary btn-lg"
                type="submit"
                disabled={loading}
                style={{ width:'100%', justifyContent:'center', marginTop:6, fontSize:15 }}
              >
                {loading ? (
                  <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:16, height:16, borderRadius:'50%', border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', animation:'spin 0.7s linear infinite', display:'inline-block' }}/>
                    Updating Password…
                  </span>
                ) : (
                  <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <Lock size={16} /> Update Password
                  </span>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <Link to="/login" style={{ fontSize: 13, color: 'var(--brand-600)', textDecoration: 'none', fontWeight: 500 }}>
                  Back to Sign In
                </Link>
              </div>
            </form>
          </div>
        )}

        <div style={{ marginTop:40, paddingTop:20, borderTop:'1px solid var(--border-default)', fontSize:12, color:'var(--text-muted)', textAlign:'center' }}>
          © 2026 ITS Global Travel Technologies. All rights reserved.
        </div>
      </div>
    </div>
  );
}
