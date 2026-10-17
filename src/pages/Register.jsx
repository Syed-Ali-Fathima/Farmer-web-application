import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';

const INITIAL = {
  fullName: '',
  phone: '',
  email: '',
  village: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const { t, lang } = useLang();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.fullName.trim()) return 'Full name is required.';
    if (!/^\d{10}$/.test(form.phone)) return 'Enter a valid 10-digit phone number.';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address.';
    if (!form.village.trim()) return 'Village / City is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationErr = validate();
    if (validationErr) {
      setError(validationErr);
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      await register(data);
      setSuccess('Account created! Redirecting…');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const PasswordToggle = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: 'absolute', right: 12, top: '50%',
        transform: 'translateY(-50%)',
        background: 'none', border: 'none',
        cursor: 'pointer', color: '#6b7280',
        padding: 2, display: 'flex', alignItems: 'center',
      }}
      aria-label={show ? 'Hide' : 'Show'}
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

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
        <div style={{ fontSize: 52, marginBottom: 8 }}>🌱</div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#14532d', margin: 0 }}>
          Create Your Account
        </h1>
        <p style={{ color: '#4b5563', marginTop: 6, fontSize: '0.95rem' }}>
          Join millions of farmers on Kisan Seva
        </p>
      </div>

      {/* Card */}
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 480,
          borderRadius: 18,
          boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
          background: '#fff',
          padding: '36px 32px',
        }}
      >
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 18, borderRadius: 10 }}>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" style={{ marginBottom: 18, borderRadius: 10 }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Full Name · पूरा नाम <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              className="input"
              type="text"
              placeholder="Ramesh Kumar"
              value={form.fullName}
              onChange={handleChange}
              style={{ borderRadius: 10 }}
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone Number · फोन नंबर <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              id="phone"
              name="phone"
              className="input"
              type="tel"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              style={{ borderRadius: 10 }}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.78rem' }}>(optional)</span>
            </label>
            <input
              id="email"
              name="email"
              className="input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              style={{ borderRadius: 10 }}
            />
          </div>

          {/* Village / City */}
          <div className="form-group">
            <label className="form-label" htmlFor="village">
              Village / City · गांव / शहर <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              id="village"
              name="village"
              className="input"
              type="text"
              placeholder="e.g. Rampur, Uttar Pradesh"
              value={form.village}
              onChange={handleChange}
              style={{ borderRadius: 10 }}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password · पासवर्ड <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                className="input"
                type={showPass ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                style={{ paddingRight: 44, borderRadius: 10 }}
              />
              <PasswordToggle show={showPass} onToggle={() => setShowPass((v) => !v)} />
            </div>
            {form.password.length > 0 && (
              <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                {['Weak', 'Fair', 'Strong'].map((lvl, i) => {
                  const strength = form.password.length < 6 ? 0 : form.password.length < 10 ? 1 : 2;
                  const colors = ['#dc2626', '#d97706', '#16a34a'];
                  return (
                    <div key={lvl} style={{
                      flex: 1, height: 4, borderRadius: 4,
                      background: i <= strength ? colors[strength] : '#e5e7eb',
                      transition: 'background 0.2s',
                    }} />
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password · पासवर्ड दोहराएं <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                className="input"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                style={{
                  paddingRight: 44,
                  borderRadius: 10,
                  borderColor: form.confirmPassword
                    ? form.confirmPassword === form.password ? '#16a34a' : '#dc2626'
                    : undefined,
                }}
              />
              <PasswordToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
            </div>
            {form.confirmPassword && form.confirmPassword !== form.password && (
              <p style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: 4 }}>
                Passwords do not match
              </p>
            )}
            {form.confirmPassword && form.confirmPassword === form.password && (
              <p style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: 4 }}>
                ✓ Passwords match
              </p>
            )}
          </div>

          {/* Terms note */}
          <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 20, lineHeight: 1.5 }}>
            By registering you agree to our{' '}
            <Link to="/terms" style={{ color: '#16a34a', textDecoration: 'none' }}>Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" style={{ color: '#16a34a', textDecoration: 'none' }}>Privacy Policy</Link>.
          </p>

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
                Creating account…
              </>
            ) : (
              <>
                <UserPlus size={18} /> Register · पंजीकरण करें
              </>
            )}
          </button>
        </form>

        {/* Login link */}
        <p style={{ textAlign: 'center', marginTop: 22, color: '#6b7280', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>
            Login · लॉग इन
          </Link>
        </p>
      </div>
    </div>
  );
}
