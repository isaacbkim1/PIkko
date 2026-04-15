/**
 * BookingConfirmScreen
 *
 * Handles two arrival paths:
 *   A) Demo payment  — arrives via React Router navigate() with location.state = { booking, facility }
 *   B) KakaoPay real — arrives via server redirect to /booking-confirm?orderId=...&tid=...&amount=...
 *      In this case we read the pending booking from localStorage (set before the redirect).
 */

import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useBooking } from '../../context/BookingContext'
import Header from '../../components/Layout/Header'
import Badge from '../../components/UI/Badge'
import './BookingConfirmScreen.css'

export default function BookingConfirmScreen() {
  const location       = useLocation()
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const { createBooking } = useBooking()

  const [booking,  setBooking]  = useState(null)
  const [facility, setFacility] = useState(null)
  const [visible,  setVisible]  = useState(false)
  const [payInfo,  setPayInfo]  = useState(null)

  useEffect(() => {
    // ── Path A: demo payment via React Router state ──────────────────────────
    if (location.state?.booking) {
      setBooking(location.state.booking)
      setFacility(location.state.facility)
      setTimeout(() => setVisible(true), 200)
      return
    }

    // ── Path B: KakaoPay redirect (query params) ─────────────────────────────
    const orderId = searchParams.get('orderId')
    const tid     = searchParams.get('tid')
    const amount  = searchParams.get('amount')
    const method  = searchParams.get('method')

    if (orderId) {
      const raw = localStorage.getItem('pikko_pending_booking')
      if (raw) {
        try {
          const pending = JSON.parse(raw)
          if (pending.orderId === orderId) {
            // Create the confirmed booking record
            const confirmed = createBooking({
              facilityId:       pending.facilityId,
              facilityName:     pending.facilityName,
              facilityDistrict: pending.facilityDistrict,
              facilityAddress:  pending.facilityAddress,
              date:             pending.date,
              time:             pending.time,
              players:          pending.players,
              amount:           Number(amount) || pending.amount,
              payMethod:        'kakaopay',
            })
            setBooking(confirmed)
            setFacility({
              name:     pending.facilityName,
              district: pending.facilityDistrict,
              address:  pending.facilityAddress,
            })
            setPayInfo({ tid, method })
            localStorage.removeItem('pikko_pending_booking')
          }
        } catch (e) {
          console.error('Failed to parse pending booking:', e)
        }
      }
      setTimeout(() => setVisible(true), 200)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // No booking data at all → redirect guard
  if (!booking && !searchParams.get('orderId')) {
    return (
      <div className="confirm-screen">
        <Header showBack={false} title="" />
        <div className="confirm-error">
          <span className="confirm-error-icon">📋</span>
          <p>예약 정보를 찾을 수 없습니다.</p>
          <button className="confirm-btn-primary" onClick={() => navigate('/')}>
            홈으로 가기
          </button>
        </div>
      </div>
    )
  }

  // Still resolving (KakaoPay path, brief moment)
  if (!booking) {
    return (
      <div className="confirm-screen">
        <Header showBack={false} title="" />
        <div className="confirm-loading">
          <div className="confirm-spinner" />
          <p>예약 확인 중...</p>
        </div>
      </div>
    )
  }

  const isKakaoPay = booking.payMethod === 'kakaopay' || payInfo?.tid

  return (
    <div className="confirm-screen">
      <Header showBack={false} title="" />

      <div className={`confirm-content ${visible ? 'confirm-content--visible' : ''}`}>

        {/* Success Circle */}
        <div className="confirm-success-circle" aria-hidden="true">
          <span className="confirm-check">✓</span>
        </div>

        <h1 className="confirm-title">예약이 완료되었습니다!</h1>
        <p className="confirm-sub">예약 확인서가 이메일로 발송됩니다</p>

        {/* Booking Reference */}
        <div className="confirm-ref-card">
          <span className="confirm-ref-label">예약 번호</span>
          <span className="confirm-ref-num">{booking.ref || booking.id}</span>
        </div>

        {/* Details */}
        <div className="confirm-details-card">
          <div className="confirm-detail-row">
            <span className="detail-label">시설</span>
            <span className="detail-value">{facility?.name || booking.facilityName}</span>
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
          {(facility?.address || booking.facilityAddress) && (
            <div className="confirm-detail-row">
              <span className="detail-label">위치</span>
              <span className="detail-value detail-value--address">
                {facility?.address || booking.facilityAddress}
              </span>
            </div>
          )}
          <div className="confirm-detail-divider" />
          <div className="confirm-detail-row">
            <span className="detail-label">결제 금액</span>
            <span className="detail-value detail-value--price">
              {(booking.amount ?? 0).toLocaleString()}원
            </span>
          </div>
          <div className="confirm-detail-row">
            <span className="detail-label">결제 상태</span>
            <Badge variant="success" size="sm">결제 완료</Badge>
          </div>
          <div className="confirm-detail-row">
            <span className="detail-label">결제 수단</span>
            {isKakaoPay ? (
              <span className="confirm-kakao-pay-badge">💬 카카오페이</span>
            ) : (
              <Badge variant="demo" size="sm">DEMO</Badge>
            )}
          </div>
          {payInfo?.tid && (
            <div className="confirm-detail-row">
              <span className="detail-label">거래 번호</span>
              <span className="detail-value detail-value--tid">{payInfo.tid}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="confirm-actions">
          <button className="confirm-btn-primary" onClick={() => navigate('/my-bookings')}>
            내 예약 보기
          </button>
          <button className="confirm-btn-secondary" onClick={() => navigate('/')}>
            홈으로
          </button>
        </div>

        <p className="confirm-tip">
          📍 {facility?.district || booking.facilityDistrict} · 코트에 10분 전에 도착해 주세요
        </p>
      </div>
    </div>
  )
}
