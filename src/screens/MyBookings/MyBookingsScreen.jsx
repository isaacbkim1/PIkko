import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'
import Layout from '../../components/Layout/Layout'

function BookingCard({ booking, onCancel }) {
  const statusConfig = {
    confirmed: { label: '예약 확정', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    completed: { label: '이용 완료', color: '#6B7280', bg: '#F3F4F6' },
    cancelled: { label: '취소됨', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  }
  const sc = statusConfig[booking.bookingStatus] || statusConfig.confirmed

  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <span className="booking-card-name">{booking.facilityName}</span>
        <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100 }}>
          {sc.label}
        </span>
      </div>
      <div className="booking-card-meta">
        <span className="booking-card-meta-item">📅 {booking.date}</span>
        <span className="booking-card-meta-item">⏰ {booking.time}</span>
        <span className="booking-card-meta-item">👥 {booking.players}명</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
        <span className="booking-card-amount">{(booking.amount || 0).toLocaleString()}원</span>
        {booking.bookingStatus === 'confirmed' && (
          <button
            style={{ fontSize: 13, color: '#EF4444', background: 'none', border: '1px solid #EF4444', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}
            onClick={() => onCancel && onCancel(booking.id)}
          >
            예약 취소
          </button>
        )}
      </div>
    </div>
  )
}

export default function MyBookingsScreen() {
  const { user } = useAuth()
  const { getUpcomingBookings, getPastBookings, cancelBooking } = useBooking()
  const navigate = useNavigate()
  const [tab, setTab] = useState('upcoming')

  const upcoming = getUpcomingBookings()
  const past = getPastBookings()
  const current = tab === 'upcoming' ? upcoming : past

  return (
    <Layout title="내 예약">
      <div style={{ padding: '0 16px' }}>
        <div className="tab-bar">
          <button className={`tab-item${tab === 'upcoming' ? ' active' : ''}`} onClick={() => setTab('upcoming')}>
            예정된 예약 {upcoming.length > 0 && `(${upcoming.length})`}
          </button>
          <button className={`tab-item${tab === 'past' ? ' active' : ''}`} onClick={() => setTab('past')}>
            지난 예약 {past.length > 0 && `(${past.length})`}
          </button>
        </div>

        {current.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">{tab === 'upcoming' ? '📅' : '🏸'}</div>
            <div className="empty-state-title">
              {tab === 'upcoming' ? '예정된 예약이 없습니다' : '지난 예약이 없습니다'}
            </div>
            <div className="empty-state-sub">
              {tab === 'upcoming' ? '새로운 코트를 예약해보세요!' : '예약 후 이용 내역이 여기 표시됩니다'}
            </div>
            {tab === 'upcoming' && (
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/search')}>
                코트 찾기
              </button>
            )}
          </div>
        ) : (
          <div style={{ paddingBottom: 16 }}>
            {current.map(b => (
              <BookingCard key={b.id} booking={b} onCancel={cancelBooking} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
