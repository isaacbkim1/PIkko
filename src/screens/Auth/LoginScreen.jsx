import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { friendlyError } from '../../firebase/authService';
import './LoginScreen.css';

export default function LoginScreen() {
  const navigate  = useNavigate();
  const { login } = useAuth();
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

  return (
    <div className="auth-screen">

      {/* ── Hero Header ── */}
      <div className="auth-hero">
        <div className="auth-hero-bg" />
        <div className="auth-hero-content">
          <img
            src="/pickleparklogo.png"
            alt="Pikko"
            className="auth-hero-logo"
          />
          <p className="auth-hero-tagline">서울 스포츠 코트 예약 플랫폼</p>
        </div>
      </div>

      {/* ── Card Form ── */}
      <div className="auth-card">
        <h2 className="auth-card-title">로그인</h2>
        <p className="auth-card-sub">계정에 로그인하여 코트를 예약하세요</p>

        <form onSubmit={handleLogin} className="auth-form">

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label className="auth-label">이메일</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input className="auth-input" type="email" placeholder="example@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="email" required />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">비밀번호</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input className="auth-input" type="password" placeholder="비밀번호를 입력하세요"
                value={password} onChange={e => setPassword(e.target.value)}
                autoComplete="current-password" required />
            </div>
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading
              ? <span className="auth-btn-loading"><span className="auth-spinner" /> 로그인 중...</span>
              : '로그인'}
          </button>

          <div className="auth-divider"><span>또는</span></div>

          <button type="button" className="auth-btn-kakao" disabled>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#3C1E1E">
              <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.7 1.68 5.1 4.2 6.6l-1.08 3.96 4.44-2.94c.72.12 1.56.18 2.4.18 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/>
            </svg>
            카카오 로그인 (준비 중)
          </button>

          <div className="auth-demo-box">
            <p className="auth-demo-title">데모 계정</p>
            <p className="auth-demo-info">demo@pikko.kr · demo1234</p>
            <button type="button" className="auth-demo-fill"
              onClick={() => { setEmail('demo@pikko.kr'); setPassword('demo1234'); }}>
              자동 입력
            </button>
          </div>

          <p className="auth-switch">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="auth-switch-link">회원가입</Link>
          </p>

        </form>
      </div>

    </div>
  );
}
