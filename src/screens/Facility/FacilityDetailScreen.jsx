import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/Layout/Header'
import Badge from '../../components/UI/Badge'
import { getFacilityById } from '../../data/facilities'
import './FacilityDetailScreen.css'

// TODO: [Firebase] Replace mock data with Firestore collection query

const gradientColors = {
  f1: 'linear-gradient(135deg, #FF6B35, #F7931E)',
  f2: 'linear-gradient(135deg, #1A1A2E, #16213E)',
  f3: 'linear-gradient(135deg, #667eea, #764ba2)',
  f4: 'linear-gradient(135deg, #f093fb, #f5576c)',
  f5: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  f6: 'linear-gradient(135deg, #43e97b, #38f9d7)',
  f7: 'linear-gradient(135deg, #fa709a, #fee140)',
  f8: 'linear-gradient(135deg, #30cfd0, #667eea)'
}

export default function FacilityDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const facility = getFacilityById(id)
  const [selectedSlot, setSelectedSlot] = useState(null)

  if (!facility) {
    return (
      <div className="facility-not-found">
        <Header showBack title="시설 정보" />
        <div className="not-found-content">
          <p>시설을 찾을 수 없습니다.</p>
          <button onClick={() => navigate('/search')} className="back-to-search">검색으로 돌아가기</button>
        </div>
      </div>
    )
  }

  const gradient = gradientColors[id] || 'linear-gradient(135deg, #FF6B35, #F7931E)'
  const availableSlots = facility.slots.filter(s => s.available)

  const handleBooking = () => {
    if (!selectedSlot) return
    navigate(`/booking/${facility.id}`, { state: { facilityId: facility.id, selectedTime: selectedSlot } })
  }

  const shareBtn = (
    <button className="facility-share-btn" onClick={() => {}}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    </button>
  )

  return (
    <div className="facility-detail-screen">
      <div className="facility-header-overlay">
        <Header showBack rightAction={shareBtn} transparent />
      </div>

      {/* Hero Image */}
      <div className="facility-hero" style={{ background: gradient }}>
        <div className="facility-hero-content">
          <span className="facility-hero-sport">🏓 피클볼</span>
          <h1 className="facility-hero-name">{facility.name}</h1>
          <div className="facility-hero-meta">
            <span className="facility-hero-district">📍 {facility.district}</span>
            <span className="facility-hero-rating">⭐ {facility.rating} ({facility.reviewCount})</span>
          </div>
        </div>
      </div>

      <div className="facility-detail-body">
        {/* Price & Quick Info */}
        <div className="facility-quick-info">
          <div className="facility-price-block">
            <span className="facility-price-label">시간당 요금</span>
            <span className="facility-price-value">{facility.price.toLocaleString()}원</span>
          </div>
          <div className="facility-stats">
            <div className="facility-stat">
              <span className="stat-num">{availableSlots.length}</span>
              <span className="stat-label">잔여타임</span>
            </div>
            <div className="facility-stat">
              <span className="stat-num">{facility.reviewCount}</span>
              <span className="stat-label">리뷰</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="facility-section">
          <h3 className="facility-section-title">위치</h3>
          <p className="facility-address">{facility.address}</p>
        </div>

        {/* Description */}
        <div className="facility-section">
          <h3 className="facility-section-title">시설 소개</h3>
          <p className="facility-description">{facility.description}</p>
        </div>

        {/* Amenities */}
        <div className="facility-section">
          <h3 className="facility-section-title">편의시설</h3>
          <div className="facility-amenities">
            {facility.amenities.map(a => (
              <span key={a} className="amenity-badge">✓ {a}</span>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="facility-section">
          <h3 className="facility-section-title">예약 가능 시간</h3>
          <div className="slot-grid">
            {facility.slots.map(slot => (
              <button
                key={slot.time}
                className={`slot-btn ${slot.available ? 'slot-available' : 'slot-unavailable'} ${selectedSlot === slot.time ? 'slot-selected' : ''}`}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot.time)}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="facility-bottom-cta">
        <div className="facility-cta-info">
          {selectedSlot ? (
            <>
              <span className="cta-selected-time">{selectedSlot} 선택됨</span>
              <span className="cta-price">{facility.price.toLocaleString()}원</span>
            </>
          ) : (
            <span className="cta-hint">시간을 선택해주세요</span>
          )}
        </div>
        <button
          className={`cta-btn ${selectedSlot ? 'cta-btn-active' : 'cta-btn-disabled'}`}
          onClick={handleBooking}
          disabled={!selectedSlot}
        >
          예약하기
        </button>
      </div>
    </div>
  )
}
