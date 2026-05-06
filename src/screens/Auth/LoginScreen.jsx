import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { friendlyError } from '../../firebase/authService';
import PikkoBall from '../../components/UI/PikkoBall.jsx';
import './LoginScreen.css';

export default function LoginScreen() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [role,     setRole]     = useState('citizen');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail(role === 'citizen' ? 'demo@pikko.kr' : 'operator@pikko.kr');
    setPassword('demo1234');
  };

  return (
    <div className="login-screen">

      {/* ── Top: navy area with icon + title ── */}
      <div className="login-top">
        {/* App icon — rounded square with dark bg */}
        <div className="login-app-icon">
          <PikkoBall size={56} />
        </div>

        <h1 className="login-app-name">Pikko</h1>
        <p className="login-app-tagline">Korea Public Sports Access Platform</p>
      </div>

      {/* ── White card ── */}
      <div className="login-card">
        <h2 className="login-card-heading">Sign in to your account</h2>

        {/* Citizen / Operator toggle */}
        <div className="login-role-row">
          <button
            type="button"
            className={`login-role-btn ${role === 'citizen' ? 'active' : ''}`}
            onClick={() => { setRole('citizen'); setEmail(''); setPassword(''); }}
          >
            {/* Smiley face icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <circle cx="9" cy="10" r="1" fill="currentColor"/>
              <circle cx="15" cy="10" r="1" fill="currentColor"/>
            </svg>
            Citizen
          </button>

          <button
            type="button"
            className={`login-role-btn ${role === 'operator' ? 'active' : ''}`}
            onClick={() => { setRole('operator'); setEmail(''); setPassword(''); }}
          >
            {/* Gear icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Operator
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">

          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label className="login-label">EMAIL</label>
            <input
              className="login-input"
              type="email"
              placeholder={role === 'citizen' ? 'junghyun@pikko.kr' : 'operator@pikko.kr'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label">PASSWORD</label>
            <input
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="login-submit-btn" type="submit" disabled={loading}>
            {loading
              ? <span className="login-btn-loading"><span className="login-spinner" /> 로그인 중...</span>
              : 'Sign In'}
          </button>

          <button type="button" className="login-demo-btn" onClick={fillDemo}>
            데모 계정 자동 입력
          </button>

          <p className="login-switch">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="login-switch-link">회원가입</Link>
          </p>

        </form>
      </div>
    </div>
  );
}
