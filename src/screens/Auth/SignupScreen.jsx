import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import './LoginScreen.css';

export default function SignupScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.name.trim())            return '이름을 입력해주세요';
    if (!form.email.trim())           return '이메일을 입력해주세요';
    if (form.password.length < 6)     return '비밀번호는 6자 이상이어야 합니다';
    if (form.password !== form.confirm) return '비밀번호가 일치하지 않습니다';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.name });
      await setDoc(doc(db, 'users', cred.user.uid), {
        name:      form.name,
        email:     form.email,
        role:      'user',
        createdAt: serverTimestamp(),
      });
      navigate('/');
    } catch (e) {
      const msgs = {
        'auth/email-already-in-use': '이미 사용 중인 이메일입니다',
        'auth/invalid-email':        '올바른 이메일 형식이 아닙니다',
        'auth/weak-password':        '비밀번호는 6자 이상이어야 합니다',
      };
      setError(msgs[e.code] || '회원가입에 실패했습니다. 다시 시도해주세요');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      {/* Hero */}
      <div className="auth-hero">
        <div className="auth-hero-bg" />
        <div className="auth-hero-content">
          <img src="/pickleparklogo.png" alt="Pikko" className="auth-hero-logo" />
          <p className="auth-hero-tagline">서울 스포츠 코트 예약 플랫폼</p>
        </div>
      </div>

      {/* Card */}
      <div className="auth-card">
        <h2 className="auth-card-title">회원가입</h2>
        <p className="auth-card-sub">Pikko와 함께 코트를 예약하세요</p>
        <form onSubmit={handleSubmit} className="auth-form">

          {error && <div className="auth-error">{error}</div>}

          {/* Name */}
          <div className="auth-field">
            <label className="auth-label">이름</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                className="auth-input"
                type="text"
                name="name"
                placeholder="홍길동"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">이메일</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                className="auth-input"
                type="email"
                name="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label">비밀번호</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="6자 이상 입력하세요"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label className="auth-label">비밀번호 확인</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                className="auth-input"
                type="password"
                name="confirm"
                placeholder="비밀번호를 다시 입력하세요"
                value={form.confirm}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {/* Terms */}
          <p className="auth-terms">
            가입 시 Pikko의 <span className="auth-link-text">이용약관</span> 및{' '}
            <span className="auth-link-text">개인정보처리방침</span>에 동의하는 것으로 간주됩니다.
          </p>

          {/* Submit */}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="auth-btn-loading">
                <span className="auth-spinner" /> 처리 중...
              </span>
            ) : '회원가입'}
          </button>

          {/* Divider */}
          <div className="auth-divider"><span>또는</span></div>

          {/* Kakao */}
          <button type="button" className="auth-btn-kakao" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#3C1E1E">
              <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.7 1.68 5.1 4.2 6.6l-1.08 3.96 4.44-2.94c.72.12 1.56.18 2.4.18 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/>
            </svg>
            카카오 로그인 (준비 중)
          </button>

          {/* Login link */}
          <p className="auth-switch">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="auth-switch-link">로그인</Link>
          </p>
        </form>
        </form>
      </div>
    </div>
  );
}
