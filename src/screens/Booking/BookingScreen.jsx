/**
 * BookingScreen — 4-step booking flow with real KakaoPay integration.
 *
 * Payment flow:
 *   Step 3 (결제) → user taps "카카오페이로 결제" →
 *     POST /api/kakaopay/ready  → { next_redirect_mobile_url }
 *     window.location.href = next_redirect_mobile_url   (Kakao payment page)
 *     [User approves on Kakao]
 *     Kakao redirects → GET /api/kakaopay/success?orderId=...&pg_token=...
 *     Server calls /approve, then redirects → /booking-confirm?orderId=...&tid=...&amount=...
 *
 * Demo payment (fallback):
 *   Skips KakaoPay entirely — simulates processing delay then creates booking.
 */

import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Layout/Header'
import Badge from '../../components/UI/Badge'
import { getFacilityById } from '../../data/facilities'
import { useBooking } from '../../context/BookingContext'
import './BookingScreen.css'

const STEPS = ['날짜', '시간', '인원', '결제']

function getBookableDays() {
  const days  = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }
  return days
}

function toDateString(d) {
  if (!d) return ''
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

// ── Step 1: Date ──────────────────────────────────────────────────────────────
function StepDate({ days, selectedDate, onSelect, onNext }) {
  return (
    <div className="booking-step-content">
      <h2 className="booking-step-title">날짜를 선택하세요</h2>
      <div className="booking-date-chips">
        {days.map((day) => {
          const isSelected = selectedDate?.toDateString() === day.toDateString()
          const isToday    = day.toDateString() === new Date().toDateString()
          return (
            <button
              key={day.toISOString()}
              className={`booking-date-chip ${isSelected ? 'booking-date-chip--selected' : ''}`}
              onClick={() => onSelect(new Date(day))}
            >
              <span className="booking-date-day">{DAY_NAMES[day.getDay()]}</span>
              <span className="booking-date-num">{day.getDate()}</span>
              {isToday && <span className="booking-date-today-dot" />}
            </button>
          )
        })}
      </div>
      <button className="booking-next-btn" disabled={!selectedDate} onClick={onNext}>
        다음
      </button>
    </div>
  )
}

// ── Step 2: Time ──────────────────────────────────────────────────────────────
function StepTime({ slots, selectedDate, selectedTime, onSelect, onBack, onNext }) {
  return (
    <div className="booking-step-content">
      <h2 className="booking-step-title">시간을 선택하세요</h2>
      <p className="booking-step-sub">{toDateString(selectedDate)}</p>
      <div className="booking-time-grid">
        {slots.map((slot) => (
          <button
            key={slot.time}
            className={[
              'booking-time-btn',
              slot.available ? 'time-btn--available' : 'time-btn--unavailable',
              selectedTime === slot.time ? 'time-btn--selected' : '',
            ].join(' ')}
            disabled={!slot.available}
            onClick={() => onSelect(slot.time)}
          >
            <span className="booking-time-label">{slot.time}</span>
            <span className="booking-time-status">{slot.available ? '가능' : '마감'}</span>
          </button>
        ))}
      </div>
      <div className="booking-nav-row">
        <button className="booking-back-btn" onClick={onBack}>이전</button>
        <button className="booking-next-btn-sm" disabled={!selectedTime} onClick={onNext}>다음</button>
      </div>
    </div>
  )
}

// ── Step 3: Players ───────────────────────────────────────────────────────────
function StepPlayers({ players, price, onDecrement, onIncrement, onBack, onNext }) {
  return (
    <div className="booking-step-content">
      <h2 className="booking-step-title">참여 인원을 선택하세요</h2>
      <div className="booking-players-selector">
        <button className="players-btn" onClick={onDecrement} disabled={players <= 1}>−</button>
        <div className="players-display">
          <span className="players-num">{players}</span>
          <span className="players-unit">명</span>
        </div>
        <button className="players-btn" onClick={onIncrement} disabled={players >= 8}>+</button>
      </div>
      <p className="players-hint">피클볼 코트는 최대 4명이 적합합니다</p>
      <p className="players-total">
        예상 금액: <strong>{price.toLocaleString()}원</strong>
      </p>
      <div className="booking-nav-row">
        <button className="booking-back-btn" onClick={onBack}>이전</button>
        <button className="booking-next-btn-sm" onClick={onNext}>다음</button>
      </div>
    </div>
  )
}

// ── Step 4: Payment ───────────────────────────────────────────────────────────
function StepPayment({ facility, selectedDate, selectedTime, players, orderId,
                        isProcessing, payMethod, onSelectMethod, onBack, onPay }) {
  return (
    <div className="booking-step-content">
      <h2 className="booking-step-title">예약 확인 및 결제</h2>

      {/* Summary */}
      <div className="booking-summary-card">
        <div className="summary-row">
          <span className="summary-label">시설</span>
          <span className="summary-value">{facility.name}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">날짜</span>
          <span className="summary-value">{toDateString(selectedDate)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">시간</span>
          <span className="summary-value">{selectedTime}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">인원</span>
          <span className="summary-value">{players}명</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-row summary-row--total">
          <span className="summary-label">결제 금액</span>
          <span className="summary-value summary-total">{facility.price.toLocaleString()}원</span>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="payment-section">
        <h3 className="payment-section-title">결제 수단 선택</h3>

        {/* KakaoPay */}
        <button
          className={`payment-option ${payMethod === 'kakaopay' ? 'payment-option--selected' : ''}`}
          onClick={() => onSelectMethod('kakaopay')}
        >
          <span className="payment-option-icon">💬</span>
          <div className="payment-option-text">
            <span className="payment-option-label">카카오페이</span>
            <span className="payment-option-sub">카카오 간편결제</span>
          </div>
          {payMethod === 'kakaopay' && <span className="payment-check">✓</span>}
        </button>

        {/* Demo */}
        <button
          className={`payment-option ${payMethod === 'demo' ? 'payment-option--selected' : ''}`}
          onClick={() => onSelectMethod('demo')}
        >
          <span className="payment-option-icon">💳</span>
          <div className="payment-option-text">
            <span className="payment-option-label">데모 결제</span>
            <span className="payment-option-sub">테스트용 — 실제 결제 없음</span>
          </div>
          <Badge variant="demo" size="sm">DEMO</Badge>
          {payMethod === 'demo' && <span className="payment-check">✓</span>}
        </button>
      </div>

      {payMethod === 'kakaopay' && (
        <p className="payment-kakaopay-notice">
          ⚠️ 카카오 테스트 결제 모드 (실제 금액 청구 없음)
        </p>
      )}

      <div className="booking-nav-row">
        <button className="booking-back-btn" onClick={onBack} disabled={isProcessing}>이전</button>
        <button
          className={`booking-pay-btn ${payMethod === 'kakaopay' ? 'booking-pay-btn--kakao' : ''}`}
          onClick={onPay}
          disabled={isProcessing || !payMethod}
        >
          {isProcessing ? (
            <span className="pay-spinner-row"><span className="pay-spinner" />처리 중...</span>
          ) : payMethod === 'kakaopay' ? (
            '카카오페이로 결제'
          ) : (
            `${facility.price.toLocaleString()}원 결제하기`
          )}
        </button>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BookingScreen() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const location     = useLocation()
  const { createBooking } = useBooking()

  const facility = getFacilityById(id)

  const [step,         setStep]         = useState(0)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(location.state?.selectedTime ?? null)
  const [players,      setPlayers]      = useState(2)
  const [payMethod,    setPayMethod]    = useState('kakaopay')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error,        setError]        = useState(null)

  const days = getBookableDays()

  // Stable orderId for this booking session
  const [orderId] = useState(() =>
    `PIKKO-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
  )

  if (!facility) {
    return (
      <div>
        <Header showBack title="예약" />
        <div className="booking-not-found">시설을 찾을 수 없습니다.</div>
      </div>
    )
  }

  // ── Payment handler ─────────────────────────────────────────────────────────
  const handlePay = async () => {
    setError(null)
    setIsProcessing(true)

    // ── KakaoPay real payment ─────────────────────────────────────────────────
    if (payMethod === 'kakaopay') {
      try {
        const res = await fetch('/api/kakaopay/ready', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            userId:   'u1',          // TODO: [Auth] use real user ID from AuthContext
            itemName: `${facility.name} 코트 예약 ${toDateString(selectedDate)} ${selectedTime}`,
            amount:   facility.price,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || '카카오페이 요청에 실패했습니다')
        }

        // Save partial booking to localStorage so BookingConfirmScreen can display it
        // after Kakao redirects back. The server-side /success handler does the real confirm.
        const pending = {
          orderId,
          facilityId:       facility.id,
          facilityName:     facility.name,
          facilityDistrict: facility.district,
          facilityAddress:  facility.address,
          date:             toDateString(selectedDate),
          time:             selectedTime,
          players,
          amount:           facility.price,
          payMethod:        'kakaopay',
        }
        localStorage.setItem('pikko_pending_booking', JSON.stringify(pending))

        // Redirect to KakaoPay — works on both mobile and desktop
        const isMobile = /iPhone|Android/i.test(navigator.userAgent)
        window.location.href = isMobile
          ? data.next_redirect_mobile_url
          : data.next_redirect_pc_url

      } catch (err) {
        console.error('[KakaoPay]', err)
        setError(err.message || '결제 요청 중 오류가 발생했습니다. 다시 시도해 주세요.')
        setIsProcessing(false)
      }
      return
    }

    // ── Demo payment ──────────────────────────────────────────────────────────
    await new Promise((r) => setTimeout(r, 1400))
    const booking = createBooking({
      facilityId:       facility.id,
      facilityName:     facility.name,
      facilityDistrict: facility.district,
      facilityAddress:  facility.address,
      date:             toDateString(selectedDate),
      time:             selectedTime,
      players,
      amount:           facility.price,
      payMethod:        'demo',
    })
    navigate('/booking-confirm', { state: { booking, facility } })
  }

  return (
    <div className="booking-screen">
      <Header showBack title="예약하기" />

      {/* Step Indicator */}
      <div className="booking-steps">
        {STEPS.map((label, i) => (
          <div key={label} className="booking-step-item">
            <div className={[
              'booking-step-dot',
              i === step ? 'step-dot--active' : '',
              i <  step ? 'step-dot--done'   : '',
            ].join(' ')}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`booking-step-label ${i === step ? 'step-label--active' : ''}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`booking-step-line ${i < step ? 'step-line--done' : ''}`} />
            )}
          </div>
        ))}
      </div>

      {/* Facility Strip */}
      <div className="booking-facility-strip">
        <div>
          <p className="booking-facility-name">{facility.name}</p>
          <p className="booking-facility-meta">
            {facility.district} · {facility.price.toLocaleString()}원/시간
          </p>
        </div>
        <Badge variant="primary" size="sm">피클볼</Badge>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="booking-error-banner">
          ⚠️ {error}
        </div>
      )}

      {/* Step Content */}
      <div className="booking-content">
        {step === 0 && (
          <StepDate
            days={days}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <StepTime
            slots={facility.slots}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelect={setSelectedTime}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepPlayers
            players={players}
            price={facility.price}
            onDecrement={() => setPlayers((p) => Math.max(1, p - 1))}
            onIncrement={() => setPlayers((p) => Math.min(8, p + 1))}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <StepPayment
            facility={facility}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            players={players}
            orderId={orderId}
            isProcessing={isProcessing}
            payMethod={payMethod}
            onSelectMethod={setPayMethod}
            onBack={() => setStep(2)}
            onPay={handlePay}
          />
        )}
      </div>
    </div>
  )
}
