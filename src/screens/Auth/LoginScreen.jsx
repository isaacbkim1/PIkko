import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { friendlyError } from '../../firebase/authService';
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
    <div className="auth-screen">

      {/* ── Full navy background ── */}
      <div className="auth-bg">

        {/* App icon */}
        <div className="auth-icon-wrap">
          <img src="/pickleparklogo.png" alt="Pikko" className="auth-icon-img" />
        </div>

        {/* App name */}
        <h1 className="auth-app-name">Pikko</h1>
        <p className="auth-app-sub">Korea Public Sports Access Platform</p>

        {/* White card */}
        <div className="auth-card">

          <h2 className="auth-card-title">Sign in to your account</h2>

          {/* Role toggle */}
          <div className="auth-role-toggle">
            <button
              type="button"
              className={`auth-role-btn ${role === 'citizen' ? 'active' : ''}`}
              onClick={() => { setRole('citizen'); setEmail(''); setPassword(''); }}
            >
              <svg className="auth-role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              Citizen
            </button>
            <button
              type="button"
              className={`auth-role-btn ${role === 'operator' ? 'active' : ''}`}
              onClick={() => { setRole('operator'); setEmail(''); setPassword(''); }}
            >
              <svg className="auth-role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Operator
            </button>
          </div>

          <form onSubmit={handleLogin} className="auth-form">

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-field">
              <label className="auth-label">EMAIL</label>
              <input
                className="auth-input"
                type="email"
                placeholder={role === 'citizen' ? 'junghyun@pikko.kr' : 'operator@pikko.kr'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">PASSWORD</label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading
                ? <span className="auth-btn-loading"><span className="auth-spinner" /> 로그인 중...</span>
                : 'Sign In'}
            </button>

            <button type="button" className="auth-demo-fill" onClick={fillDemo}>
              데모 계정 자동 입력
            </button>

            <p className="auth-switch">
              계정이 없으신가요?{' '}
              <Link to="/signup" className="auth-switch-link">회원가입</Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
