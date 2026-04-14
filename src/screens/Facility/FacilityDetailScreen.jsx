import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/Layout/Header'
import Badge from '../../components/UI/Badge'
import { getFacilityById } from '../../data/facilities'
import './FacilityDetailScreen.css'

// TODO: [Firebase] Replace getFacilityById() with Firestore document fetch
// TODO: [Backend API] GET /api/facilities/:id

// One gradient per facility id keeps colors consistent across page reloads.
const GRADIENTS = {
  f1: 'linear-gradient(135deg, #FF6B35, #F7931E)',
  f2: 'linear-gradient(135deg, #1A1A2E, #16213E)',
  f3: 'linear-gradient(135deg, #667eea, #764ba2)',
  f4: 'linear-gradient(135deg, #f093fb, #f5576c)',
  f5: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  f6: 'linear-gradient(135deg, #43e97b, #38f9d7)',
  f7: 'linear-gradient(135deg, #fa709a, #fee140)',
  f8: 'linear-gradient(135deg, #30cfd0, #667eea)',
}
const DEFAULT_GRADIENT = 'linear-gradient(135deg, #FF6B35, #1A1A2E)'

// Share button placed in the Header's rightAction slot.
function ShareButton() {
  return (
    <button className="facility-share-btn" aria-label="공유">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    </button>
  )
}

export default function FacilityDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const facility = getFacilityById(id)
  const [selectedSlot, setSelectedSlot] = useState(null)

  // ── 404 guard ──────────────────────────────────────────────────────────────
  if (!facility) {
    return (
      <div className="facility-detail-screen">
        <Header showBack title="시설 정보" />
        <div className="facility-not-found">
          <span className="facility-not-found-icon">🏟</span>
          <p>시설을 찾을 수 없습니다.</p>
          <button
            className="facility-not-found-btn"
            onClick={() => navigate('/search')}
          >
            검색으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const gradient = GRADIENTS[id] ?? DEFAULT_GRADIENT
  const availableSlots = facility.slots.filter((s) => s.available)

  const handleBooking = () => {
    if (!selectedSlot) return
    navigate(`/booking/${facility.id}`, {
      state: { facilityId: facility.id, selectedTime: selectedSlot },
    })
  }

  return (
    /*
     * FacilityDetailScreen does NOT use <Layout> because we want full-bleed
     * hero image and no bottom nav during the detail view.
     * We render <Header> directly here — this is the one screen where that
     * is intentional and correct.
     */
    <div className="facility-detail-screen">
      {/* Floating transparent header over the hero image */}
      <div className="facility-header-overlay">
        <Header showBack transparent rightAction={<ShareButton />} />
      </div>

      {/* ── Hero ── */}
      <div className="facility-hero" style={{ background: gradient }}>
        <div className="facility-hero-body">
          <span className="facility-hero-sport">🏓 피클볼</span>
          <h1 className="facility-hero-name">{facility.name}</h1>
          <div className="facility-hero-meta">
            <span className="facility-hero-district">📍 {facility.district}</span>
            <span className="facility-hero-rating">
              ⭐ {facility.rating} ({facility.reviewCount})
            </span>
          </div>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="facility-body">

        {/* Quick info strip */}
        <div className="facility-quick-strip">
          <div className="facility-price-block">
            <span className="facility-price-label">시간당 요금</span>
            <span className="facility-price-value">
              {facility.price.toLocaleString()}원
            </span>
          </div>
          <div className="facility-stats-row">
            <div className="facility-stat">
              <span className="facility-stat-num">{availableSlots.length}</span>
              <span className="facility-stat-label">잔여타임</span>
            </div>
            <div className="facility-stat-divider" />
            <div className="facility-stat">
              <span className="facility-stat-num">{facility.reviewCount}</span>
              <span className="facility-stat-label">리뷰</span>
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
            {facility.amenities.map((a) => (
              <span key={a} className="facility-amenity-badge">✓ {a}</span>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="facility-section">
          <h3 className="facility-section-title">예약 가능 시간</h3>
          <div className="facility-slot-grid">
            {facility.slots.map((slot) => (
              <button
                key={slot.time}
                className={[
                  'facility-slot-btn',
                  slot.available ? 'slot--available' : 'slot--unavailable',
                  selectedSlot === slot.time ? 'slot--selected' : '',
                ].join(' ')}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot.time)}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        {/* Spacer so sticky CTA doesn't overlap last content */}
        <div style={{ height: 90 }} />
      </div>

      {/* ── Sticky bottom CTA ── */}
      <div className="facility-cta-bar">
        <div className="facility-cta-info">
          {selectedSlot ? (
            <>
              <span className="facility-cta-time">{selectedSlot} 선택됨</span>
              <span className="facility-cta-price">
                {facility.price.toLocaleString()}원
              </span>
            </>
          ) : (
            <span className="facility-cta-hint">시간을 선택해주세요</span>
          )}
        </div>
        <button
          className={`facility-cta-btn ${selectedSlot ? 'cta-btn--active' : 'cta-btn--disabled'}`}
          onClick={handleBooking}
          disabled={!selectedSlot}
        >
          예약하기
        </button>
      </div>
    </div>
  )
}
