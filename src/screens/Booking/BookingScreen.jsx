// TODO: [KakaoPay] Implement real payment by:
//   1. POST /api/kakaopay/ready  → { tid, next_redirect_mobile_url }
//   2. Redirect user to next_redirect_mobile_url (Kakao payment page)
//   3. On return, POST /api/kakaopay/approve  → { payment_method_type, amount }
//   4. Store confirmed booking server-side
// TODO: [Backend API] POST /api/bookings — persist confirmed booking

import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Layout/Header'
import Badge from '../../components/UI/Badge'
import { getFacilityById } from '../../data/facilities'
import { useBooking } from '../../context/BookingContext'
import './BookingScreen.css'

const STEPS = ['날짜', '시간', '인원', '결제']

// Returns an array of Date objects for the current month starting from today.
function getBookableDays() {
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(today.getFullYear(), today.getMonth() + 2, 0) // end of next month
  for (let d = new Date(today); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d))
  }
  return days.slice(0, 30) // show 30 days max
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

// ── Step components ───────────────────────────────────────────────────────────

function StepDate({ days, selectedDate, onSelect, onNext }) {
  return (
    <div className="booking-step-content">
      <h2 className="booking-step-title">날짜를 선택하세요</h2>
      <div className="booking-date-chips">
        {days.map((day) => {
          const isSelected =
            selectedDate && day.toDateString() === selectedDate.toDateString()
          const isToday = day.toDateString() === new Date().toDateString()
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
      <button
        className="booking-next-btn"
        disabled={!selectedDate}
        onClick={onNext}
      >
        다음
      </button>
    </div>
  )
}

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
            <span className="booking-time-status">
              {slot.available ? '가능' : '마감'}
            </span>
          </button>
        ))}
      </div>
      <div className="booking-nav-row">
        <button className="booking-back-btn" onClick={onBack}>이전</button>
        <button
          className="booking-next-btn-sm"
          disabled={!selectedTime}
          onClick={onNext}
        >
          다음
        </button>
      </div>
    </div>
  )
}

function StepPlayers({ players, price, onDecrement, onIncrement, onBack, onNext }) {
  return (
    <div className="booking-step-content">
      <h2 className="booking-step-title">참여 인원을 선택하세요</h2>
      <div className="booking-players-selector">
        <button
          className="players-btn"
          onClick={onDecrement}
          disabled={players <= 1}
        >
          −
        </button>
        <div className="players-display">
          <span className="players-num">{players}</span>
          <span className="players-unit">명</span>
        </div>
        <button
          className="players-btn"
          onClick={onIncrement}
          disabled={players >= 8}
        >
          +
        </button>
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

function StepPayment({ facility, selectedDate, selectedTime, players, isProcessing, onBack, onPay }) {
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
          <span className="summary-value summary-total">
            {facility.price.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="payment-section">
        <h3 className="payment-section-title">결제 수단</h3>

        {/* Demo Payment — active for MVP */}
        <div className="payment-option payment-option--selected">
          <span className="payment-option-icon">💳</span>
          <span className="payment-option-label">데모 결제</span>
          <Badge variant="demo" size="sm">DEMO</Badge>
        </div>

        {/*
          TODO: [KakaoPay] Uncomment and wire up when integrating real payment.
          On click:
            const res = await fetch('/api/kakaopay/ready', {
              method: 'POST',
              body: JSON.stringify({ amount: facility.price, orderId: bookingId, itemName: facility.name })
            })
            const { next_redirect_mobile_url } = await res.json()
            window.location.href = next_redirect_mobile_url
        */}
        <div className="payment-option payment-option--disabled">
          <span className="payment-option-icon">💬</span>
          <span className="payment-option-label">카카오페이</span>
          <Badge variant="warning" size="sm">준비중</Badge>
        </div>
      </div>

      <div className="booking-nav-row">
        <button className="booking-back-btn" onClick={onBack} disabled={isProcessing}>
          이전
        </button>
        <button
          className="booking-pay-btn"
          onClick={onPay}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="pay-spinner-row">
              <span className="pay-spinner" />
              결제 중...
            </span>
          ) : (
            `${facility.price.toLocaleString()}원 결제하기`
          )}
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BookingScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { createBooking } = useBooking()

  const facility = getFacilityById(id)

  const [step,          setStep]          = useState(0)
  const [selectedDate,  setSelectedDate]  = useState(null)
  const [selectedTime,  setSelectedTime]  = useState(location.state?.selectedTime ?? null)
  const [players,       setPlayers]       = useState(2)
  const [isProcessing,  setIsProcessing]  = useState(false)

  const days = getBookableDays()

  // ── 404 guard ──────────────────────────────────────────────────────────────
  if (!facility) {
    return (
      <div>
        <Header showBack title="예약" />
        <div className="booking-not-found">시설을 찾을 수 없습니다.</div>
      </div>
    )
  }

  const handlePay = async () => {
    setIsProcessing(true)
    // Demo payment: simulate a short processing delay then create booking.
    await new Promise((r) => setTimeout(r, 1400))
    const booking = createBooking({
      facilityId:       facility.id,
      facilityName:     facility.name,
      facilityDistrict: facility.district,
      date:             toDateString(selectedDate),
      time:             selectedTime,
      players,
      amount:           facility.price,
    })
    navigate('/booking-confirm', { state: { booking, facility } })
  }

  return (
    <div className="booking-screen">
      <Header showBack title="예약하기" />

      {/* ── Step Indicator ── */}
      <div className="booking-steps">
        {STEPS.map((label, i) => (
          <div key={label} className="booking-step-item">
            <div
              className={[
                'booking-step-dot',
                i === step ? 'step-dot--active' : '',
                i < step  ? 'step-dot--done'   : '',
              ].join(' ')}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span
              className={`booking-step-label ${i === step ? 'step-label--active' : ''}`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`booking-step-line ${i < step ? 'step-line--done' : ''}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Facility Strip ── */}
      <div className="booking-facility-strip">
        <div>
          <p className="booking-facility-name">{facility.name}</p>
          <p className="booking-facility-meta">
            {facility.district} · {facility.price.toLocaleString()}원/시간
          </p>
        </div>
        <Badge variant="primary" size="sm">피클볼</Badge>
      </div>

      {/* ── Step Content ── */}
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
            isProcessing={isProcessing}
            onBack={() => setStep(2)}
            onPay={handlePay}
          />
        )}
      </div>
    </div>
  )
}
