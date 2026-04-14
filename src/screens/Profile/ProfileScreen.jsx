import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useBooking } from "../../context/BookingContext.jsx";
import Layout from "../../components/Layout/Layout.jsx";
import "./ProfileScreen.css";

// TODO: [DUPR] Fetch and display DUPR skill rating from https://www.dupr.com
// TODO: [Kakao] Sync profile with Kakao account on Kakao Login integration

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { bookings } = useBooking();
  const navigate = useNavigate();

  const userBookings = bookings.filter((b) => b.userId === user?.id);
  const recentBookings = userBookings.slice(0, 2);

  const initials = user?.name
    ? user.name.charAt(0)
    : "U";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const statusColor = {
    confirmed: "#10B981",
    completed: "#6B7280",
    cancelled: "#EF4444",
  };

  const statusLabel = {
    confirmed: "예약 확정",
    completed: "완료",
    cancelled: "취소됨",
  };

  return (
    <Layout title="프로필">
      <div className="profile-screen">
        {/* Avatar + Name */}
        <div className="profile-header-card">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-name-block">
            <h2 className="profile-name">{user?.name || "사용자"}</h2>
            <span className="profile-district-badge">{user?.district || "서울"}</span>
          </div>
          <button className="profile-edit-btn">수정</button>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{userBookings.length}</span>
            <span className="stat-label">총 예약</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">{user?.sports?.length || 1}</span>
            <span className="stat-label">스포츠</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">
              {user?.joinDate ? new Date(user.joinDate).getFullYear() : 2024}년~
            </span>
            <span className="stat-label">가입일</span>
          </div>
        </div>

        {/* Sports Interests */}
        <div className="profile-section">
          <h3 className="section-title">관심 스포츠</h3>
          <div className="sports-tags">
            {(user?.sports || ["pickleball"]).map((s) => (
              <span key={s} className="sport-tag">
                {s === "pickleball" ? "🏓 피클볼" : s}
              </span>
            ))}
            <span className="sport-tag sport-tag-add">+ 추가</span>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="profile-section">
          <div className="section-header-row">
            <h3 className="section-title">최근 예약</h3>
            <button className="view-all-btn" onClick={() => navigate("/my-bookings")}>
              전체보기 →
            </button>
          </div>
          {recentBookings.length === 0 ? (
            <div className="empty-small">아직 예약 내역이 없습니다</div>
          ) : (
            recentBookings.map((b) => (
              <div key={b.id} className="mini-booking-card">
                <div>
                  <p className="mini-booking-name">{b.facilityName}</p>
                  <p className="mini-booking-date">{b.date} · {b.time} · {b.players}인</p>
                </div>
                <span
                  className="mini-status-badge"
                  style={{ background: statusColor[b.bookingStatus] + "20", color: statusColor[b.bookingStatus] }}
                >
                  {statusLabel[b.bookingStatus]}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Admin link */}
        {(user?.role === "admin" || user?.role === "operator") && (
          <div className="profile-section">
            <button className="admin-link-btn" onClick={() => navigate("/admin")}>
              🛠 관리자 대시보드
            </button>
          </div>
        )}

        {/* Settings */}
        <div className="profile-section">
          <h3 className="section-title">설정</h3>
          <div className="settings-list">
            {["🔔 알림 설정", "💳 결제 수단", "🔒 개인정보 보호"].map((item) => (
              <button key={item} className="settings-item">
                <span>{item}</span>
                <span className="chevron">›</span>
              </button>
            ))}
            <button className="settings-item logout-item" onClick={handleLogout}>
              <span>🚪 로그아웃</span>
              <span className="chevron">›</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
