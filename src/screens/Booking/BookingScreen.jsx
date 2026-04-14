// TODO: [KakaoPay] POST /api/kakaopay/ready with order details
// TODO: [KakaoPay] POST /api/kakaopay/approve after redirect
// TODO: [Backend API] POST /api/bookings

import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Layout/Header'
import Badge from '../../components/UI/Badge'
import { getFacilityById } from '../../data/facilities'
import { useBooking } from '../../context/BookingContext'
import './BookingScreen.css'

const STEPS = ['날짜', '시간', '인원', '결제']

function getDaysInMonth(year, month) {
  const days = []
  const today = new Date()
  for (let d = new Date(year, month, 1); d.getMonth() === month; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d))
  }
  return days
}

export default function BookingScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { createBooking } = useBooking()
  const facility = getFacilityById(id)

  const today = new Date()
  const [step, setStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(location.state?.selectedTime || null)
  const [players, setPlayers] = useState(2)
  const [isProcessing, setIsProcessing] = useState(false)

  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const days = getDaysInMonth(currentYear, currentMonth)

  const formatDate = (d) => {
    if (!d) return ''
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const availableSlots = facility?.slots.filter(s => s.available) || []

  const handlePayment = async () => {
    setIsProcessing(true)
    // Demo payment simulation
    await new Promise(r => setTimeout(r, 1500))

    const booking = createBooking({
      facilityId: facility.id,
      facilityName: facility.name,
      facilityDistrict: facility.district,
      date: formatDate(selectedDate),
      time: selectedTime,
      players,
      amount: facility.price
    })

    navigate('/booking-confirm', { state: { booking, facility } })
  }

  if (!facility) {
    return (
      <div>
        <Header showBack title="예약" />
        <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>시설을 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="booking-screen">
      <Header showBack title="예약하기" />

      {/* Steps Progress */}
      <div className="booking-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`booking-step ${i === step ? 'step-active' : ''} ${i < step ? 'step-done' : ''}`}>
            <div className="step-dot">
              {i < step ? '✓' : i + 1}
            </div>
            <span className="step-label">{s}</span>
            {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'step-line-done' : ''}`} />}
          </div>
        ))}
      </div>

      {/* Facility Summary */}
      <div className="booking-facility-card">
        <div className="booking-facility-info">
          <h3>{facility.name}</h3>
          <p>{facility.district} · {facility.price.toLocaleString()}원/시간</p>
        </div>
      </div>

      <div className="booking-content">
        {/* Step 0: Date */}
        {step === 0 && (
          <div className="booking-step-content">
            <h2 className="step-title">날짜를 선택하세요</h2>
            <div className="calendar-header">
              <span className="calendar-month">{currentYear}년 {currentMonth + 1}월</span>
            </div>
            <div className="calendar-days-header">
              {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                <span key={d} className="cal-day-name">{d}</span>
              ))}
            </div>
            <div className="calendar-grid">
              {Array(days[0].getDay()).fill(null).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map(day => {
                const isPast = day < today && day.toDateString() !== today.toDateString()
                const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
                const isToday = day.toDateString() === today.toDateString()
                return (
                  <button
                    key={day.toISOString()}
                    className={`cal-day ${isSelected ? 'cal-day-selected' : ''} ${isPast ? 'cal-day-past' : ''} ${isToday ? 'cal-day-today' : ''}`}
                    disabled={isPast}
                    onClick={() => setSelectedDate(new Date(day))}
                  >
                    {day.getDate()}
                  </button>
                )
              })}
            </div>
            <button
              className="booking-next-btn"
              disabled={!selectedDate}
              onClick={() => setStep(1)}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 1: Time */}
        {step === 1 && (
          <div className="booking-step-content">
            <h2 className="step-title">시간을 선택하세요</h2>
            <p className="step-sub">{formatDate(selectedDate)}</p>
            <div className="time-slot-grid">
              {facility.slots.map(slot => (
                <button
                  key={slot.time}
                  className={`time-slot ${slot.available ? 'time-slot-available' : 'time-slot-unavailable'} ${selectedTime === slot.time ? 'time-slot-selected' : ''}`}
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  {slot.time}
                  <span className="slot-status">{slot.available ? '가능' : '마감'}</span>
                </button>
              ))}
            </div>
            <div className="booking-nav-btns">
              <button className="booking-back-btn" onClick={() => setStep(0)}>이전</button>
              <button className="booking-next-btn-sm" disabled={!selectedTime} onClick={() => setStep(2)}>다음</button>
            </div>
          </div>
        )}

        {/* Step 2: Players */}
        {step === 2 && (
          <div className="booking-step-content">
            <h2 className="step-title">참여 인원을 선택하세요</h2>
            <div className="players-selector">
              <button
                className="players-btn"
                onClick={() => setPlayers(p => Math.max(1, p - 1))}
                disabled={players <= 1}
              >−</button>
              <div className="players-count">
                <span className="players-num">{players}</span>
                <span className="players-unit">명</span>
              </div>
              <button
                className="players-btn"
                onClick={() => setPlayers(p => Math.min(8, p + 1))}
                disabled={players >= 8}
              >+</button>
            </div>
            <p className="players-hint">피클볼 코트는 최대 4명이 적합합니다</p>
            <div className="booking-nav-btns">
              <button className="booking-back-btn" onClick={() => setStep(1)}>이전</button>
              <button className="booking-next-btn-sm" onClick={() => setStep(3)}>다음</button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Payment */}
        {step === 3 && (
          <div className="booking-step-content">
            <h2 className="step-title">예약 확인 및 결제</h2>

            <div className="booking-summary-card">
              <div className="summary-row">
                <span>시설</span>
                <span>{facility.name}</span>
              </div>
              <div className="summary-row">
                <span>날짜</span>
                <span>{formatDate(selectedDate)}</span>
              </div>
              <div className="summary-row">
                <span>시간</span>
                <span>{selectedTime}</span>
              </div>
              <div className="summary-row">
                <span>인원</span>
                <span>{players}명</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>결제 금액</span>
                <span>{facility.price.toLocaleString()}원</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-section">
              <h3 className="payment-title">결제 수단</h3>
              <div className="payment-methods">
                <div className="payment-method payment-method-selected">
                  <span>💳</span>
                  <span>데모 결제</span>
                  <Badge variant="demo" size="sm">DEMO</Badge>
                </div>
                {/* TODO: [KakaoPay] POST /api/kakaopay/ready with order details
                    Then redirect user to kakao pay URL from response.next_redirect_mobile_url */}
                <div className="payment-method payment-method-disabled">
                  <span>💬</span>
                  <span>카카오페이</span>
                  <Badge variant="warning" size="sm">준비중</Badge>
                </div>
              </div>
            </div>

            <div className="booking-nav-btns">
              <button className="booking-back-btn" onClick={() => setStep(2)}>이전</button>
              <button
                className="payment-btn"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="payment-spinner" />
                    결제 중...
                  </>
                ) : (
                  `${facility.price.toLocaleString()}원 결제하기`
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
