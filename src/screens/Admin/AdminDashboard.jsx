import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useBooking } from "../../context/BookingContext.jsx";
import { facilities } from "../../data/facilities.js";
import Layout from "../../components/Layout/Layout.jsx";
import "./AdminDashboard.css";

// TODO: [Backend API] GET /api/admin/stats for real-time dashboard metrics
// TODO: [Backend API] GET /api/admin/bookings for booking management
// TODO: [Operator] Add settlement automation, payout history, operator-specific facility management
// TODO: [Backend API] POST /api/admin/facilities/:id/toggle for facility status management

const stats = [
  { label: "오늘 예약", value: "12건", icon: "📅", color: "#FF6B35" },
  { label: "총 매출", value: "₩480,000", icon: "💰", color: "#10B981" },
  { label: "활성 시설", value: "8개", icon: "🏟", color: "#3B82F6" },
  { label: "신규 회원", value: "3명", icon: "👥", color: "#8B5CF6" },
];

const recentBookings = [
  { id: "b001", facility: "강남 피클볼 센터", user: "김민준", time: "09:00", amount: 60000, status: "confirmed" },
  { id: "b002", facility: "마포 스포츠 파크", user: "이지영", time: "11:00", amount: 30000, status: "confirmed" },
  { id: "b003", facility: "송파 실내 피클볼장", user: "박성호", time: "14:00", amount: 45000, status: "completed" },
  { id: "b004", facility: "서초 퍼스트 피클볼", user: "최나영", time: "16:00", amount: 50000, status: "cancelled" },
  { id: "b005", facility: "용산 피클볼 아레나", user: "정현우", time: "19:00", amount: 75000, status: "confirmed" },
];

const statusColor = {
  confirmed: { bg: "#F0FDF4", text: "#10B981", label: "확정" },
  completed: { bg: "#F9FAFB", text: "#6B7280", label: "완료" },
  cancelled: { bg: "#FFF1F2", text: "#EF4444", label: "취소" },
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [facilityStatus, setFacilityStatus] = useState(
    Object.fromEntries(facilities.map((f) => [f.id, true]))
  );

  if (user?.role !== "admin" && user?.role !== "operator") {
    return (
      <Layout title="관리자" showBack onBack={() => navigate("/profile")}>
        <div className="admin-denied">
          <p className="denied-icon">🔒</p>
          <h2>접근 권한 없음</h2>
          <p>관리자 또는 운영자만 접근할 수 있습니다.</p>
          <button onClick={() => navigate("/")} className="denied-btn">홈으로</button>
        </div>
      </Layout>
    );
  }

  const toggleFacility = (id) => {
    setFacilityStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Layout title="관리자 대시보드" showBack onBack={() => navigate("/profile")}>
      <div className="admin-screen">
        {/* Header badge */}
        <div className="admin-header">
          <span className="admin-role-badge">
            {user.role === "admin" ? "🛠 관리자" : "🏟 운영자"}
          </span>
          <p className="admin-subtitle">2025년 4월 14일 기준</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <span className="stat-card-icon">{stat.icon}</span>
              <span className="stat-card-value" style={{ color: stat.color }}>
                {stat.value}
              </span>
              <span className="stat-card-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="admin-section">
          <h3 className="admin-section-title">최근 예약 현황</h3>
          <div className="bookings-table">
            <div className="table-header">
              <span>시설</span>
              <span>회원</span>
              <span>시간</span>
              <span>금액</span>
              <span>상태</span>
            </div>
            {recentBookings.map((b) => {
              const s = statusColor[b.status];
              return (
                <div key={b.id} className="table-row">
                  <span className="table-facility">{b.facility.replace("피클볼 ", "").replace(" 피클볼", "")}</span>
                  <span className="table-user">{b.user}</span>
                  <span className="table-time">{b.time}</span>
                  <span className="table-amount">{b.amount.toLocaleString()}</span>
                  <span className="table-status" style={{ background: s.bg, color: s.text }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Facility Status */}
        <div className="admin-section">
          <h3 className="admin-section-title">시설 운영 현황</h3>
          <div className="facility-list">
            {facilities.slice(0, 5).map((f) => (
              <div key={f.id} className="facility-status-row">
                <div className="facility-status-info">
                  <p className="facility-status-name">{f.name}</p>
                  <p className="facility-status-district">{f.district}</p>
                </div>
                <div className="toggle-wrapper">
                  <button
                    className={`toggle-btn ${facilityStatus[f.id] ? "on" : "off"}`}
                    onClick={() => toggleFacility(f.id)}
                  >
                    <span className="toggle-thumb" />
                  </button>
                  <span className={`toggle-label ${facilityStatus[f.id] ? "on" : "off"}`}>
                    {facilityStatus[f.id] ? "운영중" : "중단"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
