import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Info } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { t, lang } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!emailOrPhone.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(emailOrPhone.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, pass) => {
    setEmailOrPhone(email);
    setPassword(pass);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🚜</div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#14532d', margin: 0 }}>
          Welcome Back
        </h1>
        <p style={{ color: '#4b5563', marginTop: 6, fontSize: '0.95rem' }}>
          Sign in to your Kisan Seva account
        </p>
      </div>

      {/* Card */}
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 18,
          boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
          background: '#fff',
          padding: '36px 32px',
        }}
      >
        {/* Error alert */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20, borderRadius: 10 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email / Phone */}
          <div className="form-group">
            <label className="form-label" htmlFor="emailOrPhone">
              Email or Phone Number · ईमेल या फोन
            </label>
            <input
              id="emailOrPhone"
              className="input"
              type="text"
              placeholder="farmer@kisanseva.in or 9876543210"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              autoComplete="username"
              style={{ borderRadius: 10 }}
            />
          </div>

          {/* Password */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label" htmlFor="password">
              Password · पासवर्ड
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                className="input"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: 44, borderRadius: 10 }}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: '#6b7280', padding: 2,
                  display: 'flex', alignItems: 'center',
                }}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 20 }}>
            <Link
              to="/forgot-password"
              style={{ fontSize: '0.82rem', color: '#16a34a', textDecoration: 'none', fontWeight: 500 }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Signing in…
              </>
            ) : (
              <>
                <LogIn size={18} /> Login · लॉग इन
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div
          style={{
            marginTop: 24,
            background: '#f0fdf4',
            border: '1.5px solid #bbf7d0',
            borderRadius: 12,
            padding: '14px 16px',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#15803d', fontWeight: 700, fontSize: '0.82rem', marginBottom: 10,
          }}>
            <Info size={14} /> Demo Credentials · डेमो क्रेडेंशियल
          </div>
          {[
            { label: 'Farmer', email: 'farmer@kisanseva.in', pass: 'farmer123' },
            { label: 'Admin', email: 'admin@kisanseva.in', pass: 'admin123' },
          ].map((d) => (
            <div
              key={d.label}
              onClick={() => fillDemo(d.email, d.pass)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#fff', border: '1px solid #d1fae5',
                borderRadius: 8, padding: '8px 12px', marginBottom: 6,
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div>
                <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600 }}>
                  {d.label}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#374151' }}>{d.email}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>🔑 {d.pass}</div>
              </div>
              <span style={{
                fontSize: '0.7rem', color: '#16a34a', fontWeight: 600,
                background: '#dcfce7', borderRadius: 6, padding: '2px 8px',
              }}>
                Use
              </span>
            </div>
          ))}
        </div>

        {/* Register link */}
        <p style={{ textAlign: 'center', marginTop: 22, color: '#6b7280', fontSize: '0.9rem' }}>
          New to Kisan Seva?{' '}
          <Link to="/register" style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>
            Create Account · पंजीकरण करें
          </Link>
        </p>
      </div>
    </div>
  );
}
