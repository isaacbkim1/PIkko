import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useBooking } from '../../context/BookingContext'
import Layout from '../../components/Layout/Layout'
import './ProfileScreen.css'

// TODO: [DUPR] Fetch and display DUPR skill rating from https://www.dupr.com/api
// TODO: [Kakao] Sync profile avatar and name from Kakao account on Kakao Login integration
// TODO: [Firebase] Replace localStorage with Firestore user document

const SPORT_LABELS = {
  pickleball: '🏓 피클볼',
  tennis:     '🎾 테니스',
  badminton:  '🏸 배드민턴',
  basketball: '🏀 농구',
  futsal:     '⚽ 풋살',
}

const STATUS_CONFIG = {
  confirmed: { label: '예약 확정', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  completed: { label: '완료',     color: '#6B7280', bg: '#F3F4F6' },
  cancelled: { label: '취소됨',   color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
}

export default function ProfileScreen() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { bookings } = useBooking()

  const recentBookings = bookings.slice(0, 2)
  const initials = user?.name?.charAt(0) ?? 'U'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SETTINGS = [
    { icon: '🔔', label: '알림 설정' },
    { icon: '💳', label: '결제 수단' },
    { icon: '🔒', label: '개인정보 보호' },
  ]

  return (
    <Layout title="프로필">
      <div className="profile-screen">

        {/* ── Profile Card ── */}
        <div className="profile-hero-card">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <h2 className="profile-name">{user?.name ?? '사용자'}</h2>
            {user?.district && (
              <span className="profile-district-badge">{user.district}</span>
            )}
          </div>
          <button className="profile-edit-btn">수정</button>
        </div>

        {/* ── Stats ── */}
        <div className="profile-stats-card">
          <div className="profile-stat-item">
            <span className="profile-stat-value">{bookings.length}</span>
            <span className="profile-stat-label">총 예약</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat-item">
            <span className="profile-stat-value">{user?.sports?.length ?? 1}</span>
            <span className="profile-stat-label">스포츠</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat-item">
            <span className="profile-stat-value">
              {user?.joinDate ? new Date(user.joinDate).getFullYear() : 2024}년~
            </span>
            <span className="profile-stat-label">가입일</span>
          </div>
        </div>

        {/* ── Sports Interests ── */}
        <div className="profile-section">
          <h3 className="profile-section-title">관심 스포츠</h3>
          <div className="profile-sports-tags">
            {(user?.sports ?? ['pickleball']).map((s) => (
              <span key={s} className="profile-sport-tag">
                {SPORT_LABELS[s] ?? s}
              </span>
            ))}
            <span className="profile-sport-tag profile-sport-tag--add">+ 추가</span>
          </div>
        </div>

        {/* ── Recent Bookings ── */}
        <div className="profile-section">
          <div className="profile-section-header">
            <h3 className="profile-section-title">최근 예약</h3>
            <button
              className="profile-view-all"
              onClick={() => navigate('/my-bookings')}
            >
              전체보기 →
            </button>
          </div>
          {recentBookings.length === 0 ? (
            <p className="profile-empty-text">아직 예약 내역이 없습니다</p>
          ) : (
            recentBookings.map((b) => {
              const sc = STATUS_CONFIG[b.bookingStatus] ?? STATUS_CONFIG.confirmed
              return (
                <div key={b.id} className="profile-booking-row">
                  <div className="profile-booking-info">
                    <p className="profile-booking-name">{b.facilityName}</p>
                    <p className="profile-booking-meta">
                      {b.date} · {b.time} · {b.players}인
                    </p>
                  </div>
                  <span
                    className="profile-booking-badge"
                    style={{ background: sc.bg, color: sc.color }}
                  >
                    {sc.label}
                  </span>
                </div>
              )
            })
          )}
        </div>

        {/* ── Admin Link ── */}
        {(user?.role === 'admin' || user?.role === 'operator') && (
          <button
            className="profile-admin-btn"
            onClick={() => navigate('/admin')}
          >
            🛠 관리자 대시보드
          </button>
        )}

        {/* ── Settings ── */}
        <div className="profile-section">
          <h3 className="profile-section-title">설정</h3>
          <div className="profile-settings-list">
            {SETTINGS.map((item) => (
              <button key={item.label} className="profile-settings-item">
                <span className="settings-item-left">
                  <span className="settings-item-icon">{item.icon}</span>
                  <span className="settings-item-label">{item.label}</span>
                </span>
                <span className="settings-chevron">›</span>
              </button>
            ))}
            <button
              className="profile-settings-item profile-settings-item--danger"
              onClick={handleLogout}
            >
              <span className="settings-item-left">
                <span className="settings-item-icon">🚪</span>
                <span className="settings-item-label">로그아웃</span>
              </span>
              <span className="settings-chevron">›</span>
            </button>
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>
    </Layout>
  )
}
