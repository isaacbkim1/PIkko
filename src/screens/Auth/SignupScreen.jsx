import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const SEOUL_DISTRICTS = [
  "강남구", "강동구", "강북구", "강서구", "관악구",
  "광진구", "구로구", "금천구", "노원구", "도봉구",
  "동대문구", "동작구", "마포구", "서대문구", "서초구",
  "성동구", "성북구", "송파구", "양천구", "영등포구",
  "용산구", "은평구", "종로구", "중구", "중랑구",
];

export default function SignupScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    district: "",
    agreed: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("이름을 입력하세요.");
    if (!form.email.trim()) return setError("이메일을 입력하세요.");
    if (form.password.length < 6) return setError("비밀번호는 6자 이상이어야 합니다.");
    if (form.password !== form.passwordConfirm) return setError("비밀번호가 일치하지 않습니다.");
    if (!form.agreed) return setError("이용약관에 동의해주세요.");

    // MVP: use login() with entered data for demo
    const result = login("demo@pikko.kr", "demo1234");
    if (result.success) navigate("/");
  };

  return (
    <div className="auth-screen">
      <div className="auth-container">
        <div className="auth-logo">
          <div className="auth-logo-icon">🏓</div>
          <h1 className="auth-logo-text">피코 회원가입</h1>
          <p className="auth-logo-sub">서울 스포츠 코트 예약을 시작하세요</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">이름</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="실명을 입력하세요"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">이메일</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="이메일을 입력하세요"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="6자 이상 입력하세요"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호 확인</label>
            <input
              type="password"
              name="passwordConfirm"
              className="form-input"
              placeholder="비밀번호를 다시 입력하세요"
              value={form.passwordConfirm}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">거주 구</label>
            <select
              name="district"
              className="form-input"
              value={form.district}
              onChange={handleChange}
            >
              <option value="">구를 선택하세요</option>
              {SEOUL_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              id="agreed"
              name="agreed"
              checked={form.agreed}
              onChange={handleChange}
            />
            <label htmlFor="agreed" className="form-check-label">
              <span>이용약관 및 개인정보처리방침에 동의합니다</span>
            </label>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn btn-primary btn-full">
            회원가입
          </button>
        </form>

        <p className="auth-footer">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="auth-link">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
