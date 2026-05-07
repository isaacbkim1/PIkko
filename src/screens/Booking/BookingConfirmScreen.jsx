/**
 * BookingConfirmScreen
 *
 * Handles two arrival paths:
 *   A) Demo payment  — arrives via React Router navigate() with location.state = { booking, facility }
 *   B) KakaoPay real — arrives via server redirect to /booking-confirm?orderId=...&tid=...&amount=...
 *      In this case we read the pending booking from localStorage (set before the redirect).
 *
 * After confirming, shows a scannable QR + barcode ticket the user can present at the facility.
 */

import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useBooking } from '../../context/BookingContext'
import Header from '../../components/Layout/Header'
import Badge from '../../components/UI/Badge'
import BookingTicket from '../../components/UI/BookingTicket'
import { sendBookingConfirmation, requestNotificationPermission } from '../../firebase/messaging'
import { useAuth } from '../../context/AuthContext.jsx'
import './BookingConfirmScreen.css'

export default function BookingConfirmScreen() {
  const location       = useLocation()
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const { createBooking } = useBooking()

  const { userId } = useAuth()
  const [booking,     setBooking]     = useState(null)
  const [facility,    setFacility]    = useState(null)
  const [visible,     setVisible]     = useState(false)
  const [payInfo,     setPayInfo]     = useState(null)
  const [showTicket,  setShowTicket]  = useState(false)

  useEffect(() => {
    // ── Path A: demo payment via React Router state ──────────────────────────
    if (location.state?.booking) {
      setBooking(location.state.booking)
      setFacility(location.state.facility)
      setTimeout(() => setVisible(true), 200)
      // Send push notification
      const b = location.state.booking
      const f = location.state.facility
      requestNotificationPermission(userId).then(() => {
        sendBookingConfirmation({
          facilityName: f?.name || b?.facilityName || '시설',
          date: b?.date || '',
          time: b?.time || '',
          bookingId: b?.id || Date.now().toString(),
        })
      })
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

  // Guard: no booking and no orderId query param
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

  // Still resolving KakaoPay redirect
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

  const isKakaoPay = booking.payMethod === 'kakaopay' || !!payInfo?.tid

  return (
    <div className="confirm-screen">
      <Header showBack={false} title="" />

      <div className={`confirm-content ${visible ? 'confirm-content--visible' : ''}`}>

        {/* ── Success circle ── */}
        <div className="confirm-success-circle" aria-hidden="true">
          <span className="confirm-check">✓</span>
        </div>

        <h1 className="confirm-title">예약이 완료되었습니다!</h1>
        <p className="confirm-sub">예약 확인서가 이메일로 발송됩니다</p>

        {/* ── Booking reference ── */}
        <div className="confirm-ref-card">
          <span className="confirm-ref-label">예약 번호</span>
          <span className="confirm-ref-num">{booking.ref || booking.id}</span>
        </div>

        {/* ── Details card ── */}
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

        {/* ── QR / Barcode Ticket ── */}
        <div className="confirm-ticket-section">
          <button
            className="confirm-ticket-toggle"
            onClick={() => setShowTicket((v) => !v)}
          >
            {showTicket ? '🎫 입장권 닫기' : '🎫 QR 입장권 보기'}
          </button>

          {showTicket && (
            <div className="confirm-ticket-wrapper">
              <BookingTicket
                booking={{ ...booking, ref: booking.ref || booking.id }}
                facility={facility || {
                  name:     booking.facilityName,
                  district: booking.facilityDistrict,
                  address:  booking.facilityAddress,
                }}
              />
              <p className="confirm-ticket-hint">
                📱 현장 스탭에게 QR코드를 보여주세요
              </p>
            </div>
          )}
        </div>

        {/* ── Actions ── */}
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
