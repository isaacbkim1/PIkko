import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../../components/Layout/Header'
import Badge from '../../components/UI/Badge'
import './BookingConfirmScreen.css'

export default function BookingConfirmScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const { booking, facility } = location.state || {}
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300)
    return () => clearTimeout(timer)
  }, [])

  if (!booking || !facility) {
    return (
      <div>
        <Header showBack title="예약 확인" />
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
          <p>예약 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/')}
            style={{ marginTop: 16, background: '#FF6B35', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}
          >
            홈으로 가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="confirm-screen">
      <Header showBack={false} title="" />

      <div className={`confirm-content ${showContent ? 'confirm-visible' : ''}`}>
        {/* Success Animation */}
        <div className="confirm-success-circle">
          <div className="confirm-checkmark">✓</div>
        </div>

        <h1 className="confirm-title">예약이 완료되었습니다!</h1>
        <p className="confirm-sub">예약 확인서가 이메일로 발송됩니다</p>

        {/* Booking Reference */}
        <div className="confirm-ref-card">
          <span className="confirm-ref-label">예약 번호</span>
          <span className="confirm-ref-num">{booking.ref || booking.id}</span>
        </div>

        {/* Booking Details */}
        <div className="confirm-details-card">
          <div className="confirm-detail-row">
            <span className="detail-label">시설</span>
            <span className="detail-value">{facility.name}</span>
          </div>
          <div className="confirm-detail-row">
            <span className="detail-label">날짜</span>
            <span className="detail-value">{booking.date}</span>
          </div>
          <div className="confirm-detail-row">
            <span className="detail-label">시간</span>
            <span className="detail-value">{booking.time}</span>
          </div>
          <div className="confirm-detail-row">
            <span className="detail-label">인원</span>
            <span className="detail-value">{booking.players}명</span>
          </div>
          <div className="confirm-detail-row">
            <span className="detail-label">주소</span>
            <span className="detail-value detail-address">{facility.address}</span>
          </div>
          <div className="confirm-divider" />
          <div className="confirm-detail-row">
            <span className="detail-label">결제 금액</span>
            <span className="detail-value detail-price">{booking.amount.toLocaleString()}원</span>
          </div>
          <div className="confirm-detail-row">
            <span className="detail-label">결제 상태</span>
            <Badge variant="success" size="sm">결제 완료</Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirm-actions">
          <button
            className="confirm-btn-primary"
            onClick={() => navigate('/my-bookings')}
          >
            내 예약 보기
          </button>
          <button
            className="confirm-btn-secondary"
            onClick={() => navigate('/')}
          >
            홈으로
          </button>
        </div>

        {/* Sharing / More */}
        <p className="confirm-tip">
          📍 {facility.district} · 코트에 10분 전에 도착해 주세요
        </p>
      </div>
    </div>
  )
}
