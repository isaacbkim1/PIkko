import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "로그인에 실패했습니다.");
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@pikko.kr");
    setPassword("demo1234");
    const result = login("demo@pikko.kr", "demo1234");
    if (result.success) navigate("/");
  };

  return (
    <div className="auth-screen">
      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🏓</div>
          <h1 className="auth-logo-text">Pikko</h1>
          <p className="auth-logo-sub">스포츠 코트 예약 플랫폼</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">이메일</label>
            <input
              type="email"
              className="form-input"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input
              type="password"
              className="form-input"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="auth-divider">
          <span>또는</span>
        </div>

        {/* Demo Login */}
        <button className="btn btn-demo btn-full" onClick={handleDemoLogin}>
          🎮 데모 계정으로 로그인
        </button>

        {/* TODO: [Kakao Login] Replace mock auth with Kakao OAuth SDK login flow */}
        <button className="btn btn-kakao btn-full" disabled style={{ opacity: 0.5 }}>
          <span className="kakao-icon">💬</span>
          카카오로 로그인 (준비 중)
        </button>

        <p className="auth-footer">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="auth-link">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
