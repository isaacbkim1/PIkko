import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../../context/BookingContext'
import Layout from '../../components/Layout/Layout'
import './MyBookingsScreen.css'

// TODO: [Backend API] GET /api/bookings?userId= to fetch bookings from server

const STATUS_CONFIG = {
  confirmed: { label: '예약 확정', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  completed: { label: '이용 완료', color: '#6B7280', bg: '#F3F4F6' },
  cancelled: { label: '취소됨',   color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
}

function BookingCard({ booking, onCancel }) {
  const sc = STATUS_CONFIG[booking.bookingStatus] ?? STATUS_CONFIG.confirmed

  return (
    <div className="mybooking-card">
      <div className="mybooking-card-top">
        <span className="mybooking-facility-name">{booking.facilityName}</span>
        <span
          className="mybooking-status-badge"
          style={{ background: sc.bg, color: sc.color }}
        >
          {sc.label}
        </span>
      </div>

      <div className="mybooking-meta">
        <span className="mybooking-meta-item">📅 {booking.date}</span>
        <span className="mybooking-meta-item">⏰ {booking.time}</span>
        <span className="mybooking-meta-item">👥 {booking.players}명</span>
      </div>

      <div className="mybooking-card-bottom">
        <span className="mybooking-amount">
          {(booking.amount ?? 0).toLocaleString()}원
        </span>
        {booking.bookingStatus === 'confirmed' && (
          <button
            className="mybooking-cancel-btn"
            onClick={() => onCancel(booking.id)}
          >
            예약 취소
          </button>
        )}
      </div>
    </div>
  )
}

export default function MyBookingsScreen() {
  const navigate = useNavigate()
  const { getUpcomingBookings, getPastBookings, cancelBooking } = useBooking()
  const [tab, setTab] = useState('upcoming')

  const upcoming = getUpcomingBookings()
  const past     = getPastBookings()
  const current  = tab === 'upcoming' ? upcoming : past

  return (
    <Layout title="내 예약">
      <div className="mybooking-screen">

        {/* ── Tabs ── */}
        <div className="mybooking-tabs">
          <button
            className={`mybooking-tab ${tab === 'upcoming' ? 'mybooking-tab--active' : ''}`}
            onClick={() => setTab('upcoming')}
          >
            예정된 예약{upcoming.length > 0 ? ` (${upcoming.length})` : ''}
          </button>
          <button
            className={`mybooking-tab ${tab === 'past' ? 'mybooking-tab--active' : ''}`}
            onClick={() => setTab('past')}
          >
            지난 예약{past.length > 0 ? ` (${past.length})` : ''}
          </button>
        </div>

        {/* ── List ── */}
        {current.length === 0 ? (
          <div className="mybooking-empty">
            <span className="mybooking-empty-icon">
              {tab === 'upcoming' ? '📅' : '🏸'}
            </span>
            <p className="mybooking-empty-title">
              {tab === 'upcoming' ? '예정된 예약이 없습니다' : '지난 예약이 없습니다'}
            </p>
            <p className="mybooking-empty-sub">
              {tab === 'upcoming'
                ? '새로운 코트를 예약해보세요!'
                : '예약 후 이용 내역이 여기에 표시됩니다'}
            </p>
            {tab === 'upcoming' && (
              <button
                className="mybooking-search-btn"
                onClick={() => navigate('/search')}
              >
                코트 찾기
              </button>
            )}
          </div>
        ) : (
          <div className="mybooking-list">
            {current.map((b) => (
              <BookingCard key={b.id} booking={b} onCancel={cancelBooking} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
