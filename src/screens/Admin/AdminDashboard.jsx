import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { facilities } from '../../data/facilities'
import Layout from '../../components/Layout/Layout'
import Badge from '../../components/UI/Badge'
import './AdminDashboard.css'

// TODO: [Backend API] GET /api/admin/stats        — real-time metrics
// TODO: [Backend API] GET /api/admin/bookings     — booking management
// TODO: [Backend API] PATCH /api/admin/facilities/:id/status — facility toggle
// TODO: [Operator] Add settlement automation, payout history, facility-level P&L

// ── Mock Data ──────────────────────────────────────────────────────────────────

const STATS = [
  { label: '오늘 예약', value: '12건',     icon: '📅', color: '#FF6B35' },
  { label: '총 매출',   value: '₩480,000', icon: '💰', color: '#10B981' },
  { label: '활성 시설', value: '8개',      icon: '🏟', color: '#3B82F6' },
  { label: '신규 회원', value: '3명',      icon: '👥', color: '#8B5CF6' },
]

const RECENT_BOOKINGS = [
  { id: 'RB001', facility: '강남 피클볼 아레나', user: 'JungHyun Heo', time: '09:00', amount: 50000, status: 'confirmed' },
  { id: 'RB002', facility: '마포 스포츠센터',    user: '이지영', time: '11:00', amount: 30000, status: 'confirmed' },
  { id: 'RB003', facility: '송파 올림픽장',      user: '박성호', time: '14:00', amount: 45000, status: 'completed' },
  { id: 'RB004', facility: '서초 한강 클럽',     user: '최나영', time: '16:00', amount: 28000, status: 'cancelled' },
  { id: 'RB005', facility: '용산 피클볼 아레나', user: '정현우', time: '19:00', amount: 50000, status: 'confirmed' },
]

const STATUS_META = {
  confirmed: { label: '확정', variant: 'success' },
  completed: { label: '완료', variant: 'default'  },
  cancelled: { label: '취소', variant: 'danger'   },
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Track facility active/inactive toggle state (demo only).
  const [facilityStatus, setFacilityStatus] = useState(
    () => Object.fromEntries(facilities.map((f) => [f.id, true]))
  )

  const toggleFacility = (id) =>
    setFacilityStatus((prev) => ({ ...prev, [id]: !prev[id] }))

  // ── Access guard ────────────────────────────────────────────────────────────
  if (user?.role !== 'admin' && user?.role !== 'operator') {
    return (
      <Layout title="관리자" showBack onBack={() => navigate('/profile')}>
        <div className="admin-access-denied">
          <span className="admin-denied-icon">🔒</span>
          <h2 className="admin-denied-title">접근 권한 없음</h2>
          <p className="admin-denied-sub">관리자 또는 운영자만 접근할 수 있습니다.</p>
          <button className="admin-denied-btn" onClick={() => navigate('/')}>
            홈으로
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      title="관리자 대시보드"
      showBack
      onBack={() => navigate('/profile')}
    >
      <div className="admin-screen">

        {/* ── Header Strip ── */}
        <div className="admin-header-strip">
          <span className="admin-role-badge">
            {user.role === 'admin' ? '🛠 관리자' : '🏟 운영자'}
          </span>
          <span className="admin-date-label">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric', month: 'long', day: 'numeric',
            })} 기준
          </span>
        </div>

        {/* ── Stats Grid ── */}
        <div className="admin-stats-grid">
          {STATS.map((s) => (
            <div key={s.label} className="admin-stat-card">
              <span className="admin-stat-icon">{s.icon}</span>
              <span className="admin-stat-value" style={{ color: s.color }}>
                {s.value}
              </span>
              <span className="admin-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Recent Bookings ── */}
        <div className="admin-section">
          <h3 className="admin-section-title">최근 예약 현황</h3>
          <div className="admin-bookings-list">
            <div className="admin-booking-header">
              <span>시설</span>
              <span>회원</span>
              <span>시간</span>
              <span>금액</span>
              <span>상태</span>
            </div>
            {RECENT_BOOKINGS.map((b) => {
              const sm = STATUS_META[b.status] ?? STATUS_META.completed
              return (
                <div key={b.id} className="admin-booking-row">
                  <span className="admin-booking-facility" title={b.facility}>
                    {b.facility.replace('피클볼', '').replace('스포츠센터', '센터').trim()}
                  </span>
                  <span className="admin-booking-user">{b.user}</span>
                  <span className="admin-booking-time">{b.time}</span>
                  <span className="admin-booking-amount">
                    {b.amount.toLocaleString()}
                  </span>
                  <span className="admin-booking-status">
                    <Badge variant={sm.variant} size="sm">{sm.label}</Badge>
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Facility Status ── */}
        <div className="admin-section">
          <h3 className="admin-section-title">시설 운영 현황</h3>
          <div className="admin-facility-list">
            {facilities.slice(0, 6).map((f) => {
              const active = facilityStatus[f.id]
              return (
                <div key={f.id} className="admin-facility-row">
                  <div className="admin-facility-info">
                    <p className="admin-facility-name">{f.name}</p>
                    <p className="admin-facility-district">{f.district}</p>
                  </div>
                  <div className="admin-toggle-wrapper">
                    {/* Accessible toggle using a <label> + hidden checkbox */}
                    <label className="admin-toggle" aria-label={`${f.name} 운영 상태`}>
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleFacility(f.id)}
                      />
                      <span className="admin-toggle-slider" />
                    </label>
                    <span
                      className={`admin-toggle-label ${active ? 'admin-toggle-label--on' : 'admin-toggle-label--off'}`}
                    >
                      {active ? '운영중' : '중단'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>
    </Layout>
  )
}
