import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { friendlyError } from '../../firebase/authService';
import PikkoBall from '../../components/UI/PikkoBall.jsx';
import './LoginScreen.css';

export default function LoginScreen() {
  const navigate           = useNavigate();
  const { login, loginWithKakao } = useAuth();
  const [role,     setRole]     = useState('citizen');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [kakaoLoading, setKakaoLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('이메일과 비밀번호를 입력해주세요');
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err.code, err.message);
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    setError('');
    setKakaoLoading(true);
    try {
      await loginWithKakao();
      navigate('/');
    } catch (err) {
      console.error('Kakao login error:', err);
      setError('카카오 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setKakaoLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail(role === 'citizen' ? 'demo@pikko.kr' : 'operator@pikko.kr');
    setPassword('demo1234');
    setError('');
  };

  const kakaoReady = typeof window !== 'undefined' &&
    window.Kakao && window.Kakao.isInitialized?.();

  return (
    <div className="login-screen">

      {/* ── Navy top ── */}
      <div className="login-top">
        <div className="login-app-icon">
          <PikkoBall size={56} />
        </div>
        <h1 className="login-app-name">Pikko</h1>
        <p className="login-app-tagline">Korea Public Sports Access Platform</p>
      </div>

      {/* ── White card ── */}
      <div className="login-card">
        <h2 className="login-card-heading">Sign in to your account</h2>

        {/* Role toggle */}
        <div className="login-role-row">
          <button type="button"
            className={`login-role-btn ${role === 'citizen' ? 'active' : ''}`}
            onClick={() => { setRole('citizen'); setEmail(''); setPassword(''); setError(''); }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <circle cx="9" cy="10" r="1" fill="currentColor"/>
              <circle cx="15" cy="10" r="1" fill="currentColor"/>
            </svg>
            Citizen
          </button>
          <button type="button"
            className={`login-role-btn ${role === 'operator' ? 'active' : ''}`}
            onClick={() => { setRole('operator'); setEmail(''); setPassword(''); setError(''); }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Operator
          </button>
        </div>

        {/* ── Kakao login button ── */}
        <button
          type="button"
          className="login-kakao-btn"
          onClick={handleKakaoLogin}
          disabled={kakaoLoading}
        >
          {kakaoLoading ? (
            <span className="login-btn-loading"><span className="login-spinner" /> 카카오 연결 중...</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#3C1E1E">
                <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.7 1.68 5.1 4.2 6.6l-1.08 3.96 4.44-2.94c.72.12 1.56.18 2.4.18 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/>
              </svg>
              카카오로 시작하기
            </>
          )}
        </button>

        <div className="login-divider"><span>또는 이메일로 로그인</span></div>

        {/* ── Email form ── */}
        <form onSubmit={handleLogin} className="login-form">

          {error && (
            <div className="login-error">
              {error}
              <div style={{fontSize:11, marginTop:4, opacity:0.7}}>
                문제가 지속되면 새 계정을 만들어보세요
              </div>
            </div>
          )}

          <div className="login-field">
            <label className="login-label">EMAIL</label>
            <input
              className="login-input"
              type="email"
              placeholder={role === 'citizen' ? 'demo@pikko.kr' : 'operator@pikko.kr'}
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
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
              onChange={e => { setPassword(e.target.value); setError(''); }}
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
            데모 계정 자동 입력 (demo@pikko.kr / demo1234)
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
