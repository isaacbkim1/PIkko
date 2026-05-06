import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { friendlyError } from '../../firebase/authService';
import PikkoBall from '../../components/UI/PikkoBall.jsx';
import './LoginScreen.css';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())              return setError('이름을 입력해주세요');
    if (form.password.length < 6)       return setError('비밀번호는 6자 이상이어야 합니다');
    if (form.password !== form.confirm) return setError('비밀번호가 일치하지 않습니다');
    setLoading(true);
    try {
      await signup(form.email, form.password, form.name);
      navigate('/');
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-top">
        <div className="login-app-icon">
          <PikkoBall size={56} />
        </div>
        <h1 className="login-app-name">Pikko</h1>
        <p className="login-app-tagline">Korea Public Sports Access Platform</p>
      </div>

      <div className="login-card">
        <h2 className="login-card-heading">Create your account</h2>

        <form onSubmit={handleSubmit} className="login-form">

          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label className="login-label">NAME</label>
            <input className="login-input" type="text" name="name"
              placeholder="홍길동" value={form.name} onChange={handleChange} required />
          </div>

          <div className="login-field">
            <label className="login-label">EMAIL</label>
            <input className="login-input" type="email" name="email"
              placeholder="example@email.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="login-field">
            <label className="login-label">PASSWORD</label>
            <input className="login-input" type="password" name="password"
              placeholder="6자 이상 입력하세요" value={form.password} onChange={handleChange} required />
          </div>

          <div className="login-field">
            <label className="login-label">CONFIRM PASSWORD</label>
            <input className="login-input" type="password" name="confirm"
              placeholder="비밀번호를 다시 입력하세요" value={form.confirm} onChange={handleChange} required />
          </div>

          <button className="login-submit-btn" type="submit" disabled={loading}>
            {loading
              ? <span className="login-btn-loading"><span className="login-spinner" /> 처리 중...</span>
              : 'Sign Up'}
          </button>

          <p className="login-switch">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="login-switch-link">로그인</Link>
          </p>

        </form>
      </div>
    </div>
  );
}
