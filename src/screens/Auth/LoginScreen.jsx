import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import PikkoBall from "../../components/UI/PikkoBall";
import "./LoginScreen.css";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [role,     setRole]     = useState("citizen"); // citizen | operator

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = login(email, password);
    setLoading(false);
    if (result.success) navigate("/");
    else setError(result.error || "로그인에 실패했습니다.");
  };

  const handleDemoLogin = () => {
    const result = login("demo@pikko.kr", "demo1234");
    if (result.success) navigate("/");
  };

  return (
    <div className="login-screen">

      {/* ── Logo area ── */}
      <div className="login-logo-area">
        <div className="login-logo-icon">
          <PikkoBall size={52} />
        </div>
        <h1 className="login-logo-text">Pikko</h1>
        <p className="login-logo-sub">Korea Public Sports Access Platform</p>
      </div>

      {/* ── Card ── */}
      <div className="login-card">
        <h2 className="login-card-title">Sign in to your account</h2>

        {/* Role selector */}
        <div className="login-role-tabs">
          <button
            className={`login-role-tab ${role === 'citizen' ? 'login-role-tab--active' : ''}`}
            onClick={() => setRole('citizen')}
          >
            <span className="role-tab-icon">&#9786;</span>
            Citizen
          </button>
          <button
            className={`login-role-tab ${role === 'operator' ? 'login-role-tab--active' : ''}`}
            onClick={() => setRole('operator')}
          >
            <span className="role-tab-icon">&#9881;</span>
            Operator
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label className="login-label">EMAIL</label>
            <input
              type="email"
              className="login-input"
              placeholder={role === 'citizen' ? 'junghyun@pikko.kr' : 'operator@pikko.kr'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-field">
            <label className="login-label">PASSWORD</label>
            <input
              type="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "→ Sign In"}
          </button>
        </form>

        <p className="login-or">or continue with</p>

        {/* KakaoPay button */}
        <div className="login-kakao-wrapper">
          <button className="login-btn-kakao" disabled>
            &#9993; Continue with Kakao
          </button>
          <span className="login-coming-soon">COMING SOON</span>
        </div>
      </div>

      {/* ── Quick demo links ── */}
      <p className="login-demo-hint">
        Quick demo login:{" "}
        <button className="login-demo-link" onClick={handleDemoLogin}>
          Citizen
        </button>
        {" · "}
        <button className="login-demo-link" onClick={handleDemoLogin}>
          Operator
        </button>
        {" "}— tap to fill credentials
      </p>
    </div>
  );
}
