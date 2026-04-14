import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/Layout/Layout'
import KakaoMap from '../../components/Map/KakaoMap'
import Badge from '../../components/UI/Badge'
import { facilities } from '../../data/facilities'
import { events } from '../../data/events'
import './HomeScreen.css'

// ── Data ─────────────────────────────────────────────────────────────────────

const SPORT_CATEGORIES = [
  { id: 'pickleball', label: '피클볼', emoji: '🏓' },
  { id: 'tennis',     label: '테니스', emoji: '🎾' },
  { id: 'badminton',  label: '배드민턴', emoji: '🏸' },
  { id: 'basketball', label: '농구',  emoji: '🏀' },
  { id: 'futsal',     label: '풋살',  emoji: '⚽' },
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

// ── Sub-components ────────────────────────────────────────────────────────────

function FacilityCard({ facility, index }) {
  const navigate = useNavigate()
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length]

  return (
    <div
      className="home-facility-card"
      onClick={() => navigate(`/facility/${facility.id}`)}
    >
      <div className="home-facility-img" style={{ background: gradient }}>
        <span className="home-facility-sport-badge">피클볼</span>
        <span className="home-facility-rating">⭐ {facility.rating}</span>
      </div>
      <div className="home-facility-body">
        <h3 className="home-facility-name">{facility.name}</h3>
        <p className="home-facility-district">📍 {facility.district}</p>
        <div className="home-facility-price">
          <span className="home-price-value">{facility.price.toLocaleString()}원</span>
          <span className="home-price-unit">/시간</span>
        </div>
        <div className="home-facility-slots">
          {facility.slots
            .filter((s) => s.available)
            .slice(0, 3)
            .map((s) => (
              <span key={s.time} className="home-slot-pill">{s.time}</span>
            ))}
        </div>
      </div>
    </div>
  )
}

function EventCard({ event }) {
  const navigate = useNavigate()
  const TYPE_LABELS = { tournament: '대회', clinic: '클리닉', social: '소셜' }
  const spotsLeft = event.maxParticipants - event.participants

  return (
    <div className="home-event-card" onClick={() => navigate('/community')}>
      <div className="home-event-header">
        <Badge variant={event.type} size="sm">{TYPE_LABELS[event.type]}</Badge>
        <span className="home-event-fee">
          {event.fee === 0 ? '무료' : `${event.fee.toLocaleString()}원`}
        </span>
      </div>
      <h4 className="home-event-title">{event.title}</h4>
      <p className="home-event-location">📍 {event.location}</p>
      <div className="home-event-footer">
        <span className="home-event-date">📅 {event.date}</span>
        <span className={`home-event-spots ${spotsLeft <= 3 ? 'spots-low' : ''}`}>
          {spotsLeft > 0 ? `잔여 ${spotsLeft}석` : '마감'}
        </span>
      </div>
    </div>
  )
}

// ── NotificationButton — passed as rightAction to Layout ─────────────────────

function NotificationButton() {
  return (
    <button className="notif-btn" aria-label="알림">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    </button>
  )
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedSport, setSelectedSport] = useState('pickleball')

  const upcomingEvents = events.slice(0, 3)

  return (
    /*
     * Layout renders the sticky Header and fixed BottomNav.
     * We pass rightAction so the notification button appears in the Header.
     * We do NOT render a separate <Header> inside this component — that
     * would produce a double header.
     */
    <Layout rightAction={<NotificationButton />}>
      <div className="home-screen">

        {/* ── Hero Banner ── */}
        <div className="home-hero">
          <div className="home-hero-content">
            <p className="home-hero-greeting">
              안녕하세요, {user?.name?.split('')[0] ?? '게스트'}님 👋
            </p>
            <h1 className="home-hero-title">
              피코와 함께<br />
              <span className="home-hero-highlight">코트를 예약</span>하세요
            </h1>
            <p className="home-hero-sub">서울 전 지역 피클볼 코트를 한 번에</p>
            <button className="home-hero-cta" onClick={() => navigate('/search')}>
              코트 찾기 →
            </button>
          </div>
          <div className="home-hero-deco" aria-hidden="true">
            🏓
          </div>
        </div>

        {/* ── Sport Categories ── */}
        <div className="home-section">
          <div className="home-sport-pills">
            {SPORT_CATEGORIES.map((sport) => (
              <button
                key={sport.id}
                className={`home-sport-pill ${selectedSport === sport.id ? 'home-sport-pill--active' : ''}`}
                onClick={() => setSelectedSport(sport.id)}
              >
                <span>{sport.emoji}</span>
                <span>{sport.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Nearby Facilities ── */}
        <div className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title">내 주변 시설</h2>
            <button className="home-section-more" onClick={() => navigate('/search')}>
              전체보기
            </button>
          </div>
          <div className="home-facilities-scroll">
            {facilities.slice(0, 6).map((facility, idx) => (
              <FacilityCard key={facility.id} facility={facility} index={idx} />
            ))}
          </div>
        </div>

        {/* ── Kakao Map ── */}
        <div className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title">지도로 찾기</h2>
          </div>
          <KakaoMap facilities={facilities} height={260} />
        </div>

        {/* ── Upcoming Events ── */}
        <div className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title">다가오는 이벤트</h2>
            <button className="home-section-more" onClick={() => navigate('/community')}>
              전체보기
            </button>
          </div>
          <div className="home-events-list">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* ── Quick Booking CTA ── */}
        <div className="home-section">
          <div className="home-quick-cta" onClick={() => navigate('/search')}>
            <div className="home-quick-cta-text">
              <h3>지금 바로 예약하기</h3>
              <p>오늘 이용 가능한 코트를 확인하세요</p>
            </div>
            <span className="home-quick-cta-arrow" aria-hidden="true">→</span>
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>
    </Layout>
  )
}
