import { useState, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Badge from '../../components/UI/Badge'
import KakaoMap from '../../components/Map/KakaoMap'
import { facilities, districts } from '../../data/facilities'
import './SearchScreen.css'

// TODO: [Backend API] GET /api/facilities?district=&sport=&priceMax= to replace mock data

const PRICE_RANGES = [
  { id: 'all',  label: '전체 가격' },
  { id: 'low',  label: '~2만원',     max: 20000 },
  { id: 'mid',  label: '2~2.5만원',  min: 20000, max: 25000 },
  { id: 'high', label: '2.5만원~',   min: 25000 },
]

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #FF6B35, #F7931E)',
  'linear-gradient(135deg, #1A1A2E, #16213E)',
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #30cfd0, #667eea)',
]

// ── View toggle ───────────────────────────────────────────────────────────────

const VIEWS = ['list', 'map']

// ── Facility Card ─────────────────────────────────────────────────────────────

function FacilityCard({ facility, index, isHighlighted, cardRef, onCardClick }) {
  const navigate   = useNavigate()
  const gradient   = CARD_GRADIENTS[index % CARD_GRADIENTS.length]
  const available  = facility.slots.filter((s) => s.available).length

  return (
    <div
      ref={cardRef}
      className={`search-card ${isHighlighted ? 'search-card--highlighted' : ''}`}
      onClick={() => {
        onCardClick(facility)
        navigate(`/facility/${facility.id}`)
      }}
    >
      <div className="search-card-img" style={{ background: gradient }}>
        <span className="search-card-rating">⭐ {facility.rating} ({facility.reviewCount})</span>
      </div>
      <div className="search-card-body">
        <div className="search-card-top">
          <h3 className="search-card-name">{facility.name}</h3>
          <span className="search-card-price">
            {facility.price.toLocaleString()}원<span className="search-card-price-unit">/h</span>
          </span>
        </div>
        <p className="search-card-address">📍 {facility.address}</p>
        <div className="search-card-meta">
          <Badge variant="primary" size="sm">피클볼</Badge>
          <span className={`search-card-slots ${available === 0 ? 'slots-none' : ''}`}>
            {available > 0 ? `잔여 ${available}타임` : '마감'}
          </span>
        </div>
        <div className="search-card-amenities">
          {facility.amenities.slice(0, 3).map((a) => (
            <span key={a} className="amenity-chip">{a}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Map popup card (shown when a marker is clicked) ───────────────────────────

function MapPopupCard({ facility, onClose }) {
  const navigate  = useNavigate()
  const available = facility.slots.filter((s) => s.available).length

  return (
    <div className="map-popup-card">
      <button className="map-popup-close" onClick={onClose} aria-label="닫기">✕</button>
      <div className="map-popup-header">
        <div>
          <h3 className="map-popup-name">{facility.name}</h3>
          <p className="map-popup-district">📍 {facility.district}</p>
        </div>
        <span className="map-popup-rating">⭐ {facility.rating}</span>
      </div>
      <div className="map-popup-meta">
        <span className="map-popup-price">{facility.price.toLocaleString()}원/h</span>
        <span className={`map-popup-slots ${available === 0 ? 'slots-none' : ''}`}>
          {available > 0 ? `잔여 ${available}타임` : '마감'}
        </span>
      </div>
      <div className="map-popup-amenities">
        {facility.amenities.slice(0, 3).map((a) => (
          <span key={a} className="amenity-chip">{a}</span>
        ))}
      </div>
      <button
        className="map-popup-book-btn"
        onClick={() => navigate(`/facility/${facility.id}`)}
      >
        예약하기 →
      </button>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const [query,            setQuery]            = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('전체')
  const [selectedPrice,    setSelectedPrice]    = useState('all')
  const [sortBy,           setSortBy]           = useState('rating')
  const [view,             setView]             = useState('list') // 'list' | 'map'
  const [activeFacility,   setActiveFacility]   = useState(null)  // highlighted on map click

  // Refs for each card so we can scroll to it when a marker is clicked
  const cardRefs = useRef({})

  const filtered = useMemo(() => {
    let result = [...facilities]

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.district.includes(q) ||
          f.address.includes(q),
      )
    }

    if (selectedDistrict && selectedDistrict !== '전체') {
      result = result.filter((f) => f.district === selectedDistrict)
    }

    if (selectedPrice !== 'all') {
      const range = PRICE_RANGES.find((r) => r.id === selectedPrice)
      if (range) {
        if (range.min !== undefined) result = result.filter((f) => f.price >= range.min)
        if (range.max !== undefined) result = result.filter((f) => f.price <= range.max)
      }
    }

    result.sort((a, b) => {
      if (sortBy === 'rating')     return b.rating - a.rating
      if (sortBy === 'price_asc')  return a.price  - b.price
      if (sortBy === 'price_desc') return b.price  - a.price
      return 0
    })

    return result
  }, [query, selectedDistrict, selectedPrice, sortBy])

  // Called when a map marker is clicked — show popup, switch to list, scroll to card
  const handleMarkerClick = useCallback((facility) => {
    setActiveFacility(facility)
  }, [])

  // Called when user taps a card — highlight it on the map
  const handleCardClick = useCallback((facility) => {
    setActiveFacility(facility)
  }, [])

  // Switch to list view and scroll to the card for this facility
  const handlePopupGoToList = useCallback((facility) => {
    setView('list')
    setActiveFacility(facility)
    setTimeout(() => {
      const ref = cardRefs.current[facility.id]
      if (ref) ref.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }, [])

  return (
    <Layout title="코트 검색">
      <div className="search-screen">

        {/* ── Search Input ── */}
        <div className="search-input-wrapper">
          <span className="search-icon-lef" aria-hidden="true">🔍</span>
          <input
            type="text"
            className="search-text-input"
            placeholder="시설명, 지역으로 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear-btn" onClick={() => setQuery('')} aria-label="검색어 지우기">
              ✕
            </button>
          )}
        </div>

        {/* ── District Filter ── */}
        <div className="filter-row">
          {districts.map((d) => (
            <button
              key={d}
              className={`filter-chip ${selectedDistrict === d ? 'filter-chip--active' : ''}`}
              onClick={() => setSelectedDistrict(d)}
            >
              {d}
            </button>
          ))}
        </div>

        {/* ── Price + Sort + View Toggle ── */}
        <div className="search-controls-row">
          <div className="filter-row filter-row--inline">
            {PRICE_RANGES.map((r) => (
              <button
                key={r.id}
                className={`filter-chip ${selectedPrice === r.id ? 'filter-chip--active' : ''}`}
                onClick={() => setSelectedPrice(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results bar ── */}
        <div className="search-results-bar">
          <span className="search-results-count">총 {filtered.length}개의 시설</span>
          <div className="search-bar-right">
            {view === 'list' && (
              <select
                className="search-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">평점순</option>
                <option value="price_asc">가격 낮은순</option>
                <option value="price_desc">가격 높은순</option>
              </select>
            )}
            {/* View toggle */}
            <div className="search-view-toggle">
              <button
                className={`view-toggle-btn ${view === 'list' ? 'view-toggle-btn--active' : ''}`}
                onClick={() => setView('list')}
                aria-label="목록 보기"
              >
                ☰
              </button>
              <button
                className={`view-toggle-btn ${view === 'map' ? 'view-toggle-btn--active' : ''}`}
                onClick={() => setView('map')}
                aria-label="지도 보기"
              >
                🗺
              </button>
            </div>
          </div>
        </div>

        {/* ── Map view ── */}
        {view === 'map' && (
          <div className="search-map-section">
            <KakaoMap
              facilities={filtered}
              height={400}
              onFacilityClick={handleMarkerClick}
            />

            {/* Popup card when marker is tapped */}
            {activeFacility && (
              <MapPopupCard
                facility={activeFacility}
                onClose={() => setActiveFacility(null)}
              />
            )}

            {/* Horizontal scrollable facility strip below the map */}
            <div className="search-map-strip">
              {filtered.map((f) => {
                const available = f.slots.filter((s) => s.available).length
                const isActive  = activeFacility?.id === f.id
                return (
                  <button
                    key={f.id}
                    className={`search-map-strip-card ${isActive ? 'search-map-strip-card--active' : ''}`}
                    onClick={() => handleMarkerClick(f)}
                  >
                    <p className="strip-card-name">{f.name}</p>
                    <p className="strip-card-district">{f.district}</p>
                    <p className="strip-card-price">{f.price.toLocaleString()}원</p>
                    <span className={`strip-card-slots ${available === 0 ? 'slots-none' : ''}`}>
                      {available > 0 ? `잔여 ${available}타임` : '마감'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── List view ── */}
        {view === 'list' && (
          filtered.length === 0 ? (
            <div className="search-empty">
              <span className="search-empty-icon">🔍</span>
              <p className="search-empty-title">검색 결과가 없습니다</p>
              <p className="search-empty-sub">다른 검색어나 필터를 사용해보세요</p>
            </div>
          ) : (
            <div className="search-results">
              {filtered.map((facility, idx) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  index={idx}
                  isHighlighted={activeFacility?.id === facility.id}
                  cardRef={(el) => { cardRefs.current[facility.id] = el }}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          )
        )}

        <div style={{ height: 16 }} />
      </div>
    </Layout>
  )
}
