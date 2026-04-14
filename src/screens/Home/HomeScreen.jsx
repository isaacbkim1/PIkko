import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/Layout/Layout'
import Header from '../../components/Layout/Header'
import KakaoMap from '../../components/Map/KakaoMap'
import Badge from '../../components/UI/Badge'
import { facilities } from '../../data/facilities'
import { events } from '../../data/events'
import './HomeScreen.css'

const sportCategories = [
  { id: 'pickleball', label: '피클볼', emoji: '🏓', active: true },
  { id: 'tennis', label: '테니스', emoji: '🎾', active: false },
  { id: 'badminton', label: '배드민턴', emoji: '🏸', active: false },
  { id: 'basketball', label: '농구', emoji: '🏀', active: false },
  { id: 'futsal', label: '풋살', emoji: '⚽', active: false }
]

const gradientColors = [
  'linear-gradient(135deg, #FF6B35, #F7931E)',
  'linear-gradient(135deg, #1A1A2E, #16213E)',
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #30cfd0, #667eea)'
]

function FacilityCard({ facility, index }) {
  const navigate = useNavigate()
  const gradient = gradientColors[index % gradientColors.length]

  return (
    <div className="facility-card" onClick={() => navigate(`/facility/${facility.id}`)}>
      <div className="facility-card-image" style={{ background: gradient }}>
        <div className="facility-card-sport-badge">피클볼</div>
        <div className="facility-card-rating">⭐ {facility.rating}</div>
      </div>
      <div className="facility-card-info">
        <h3 className="facility-card-name">{facility.name}</h3>
        <p className="facility-card-district">📍 {facility.district}</p>
        <div className="facility-card-price">
          <span className="price-amount">{facility.price.toLocaleString()}원</span>
          <span className="price-unit">/시간</span>
        </div>
        <div className="facility-card-slots">
          {facility.slots.filter(s => s.available).slice(0, 3).map(slot => (
            <span key={slot.time} className="slot-pill">{slot.time}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function EventCard({ event }) {
  const navigate = useNavigate()
  const typeLabels = { tournament: '대회', clinic: '클리닉', social: '소셜' }
  const spotsLeft = event.maxParticipants - event.participants

  return (
    <div className="event-card" onClick={() => navigate('/community')}>
      <div className="event-card-header">
        <Badge variant={event.type} size="sm">{typeLabels[event.type]}</Badge>
        <span className="event-card-fee">
          {event.fee === 0 ? '무료' : `${event.fee.toLocaleString()}원`}
        </span>
      </div>
      <h4 className="event-card-title">{event.title}</h4>
      <p className="event-card-location">📍 {event.location}</p>
      <div className="event-card-footer">
        <span className="event-card-date">📅 {event.date}</span>
        <span className={`event-card-spots ${spotsLeft <= 3 ? 'spots-low' : ''}`}>
          {spotsLeft > 0 ? `잔여 ${spotsLeft}석` : '마감'}
        </span>
      </div>
    </div>
  )
}

export default function HomeScreen() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedSport, setSelectedSport] = useState('pickleball')

  const upcomingEvents = events.slice(0, 3)

  const notificationBtn = (
    <button className="header-notification-btn" onClick={() => {}}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
    </button>
  )

  return (
    <Layout>
      <Header rightAction={notificationBtn} />
      <div className="home-screen">

        {/* Hero Banner */}
        <div className="hero-banner">
          <div className="hero-content">
            <p className="hero-greeting">안녕하세요, {user?.name?.split('')[0]}님 👋</p>
            <h1 className="hero-title">
              피코와 함께<br />
              <span className="hero-highlight">코트를 예약</span>하세요
            </h1>
            <p className="hero-sub">서울 전 지역 피클볼 코트를 한 번에</p>
            <button className="hero-cta" onClick={() => navigate('/search')}>
              코트 찾기 →
            </button>
          </div>
          <div className="hero-decoration">
            <div className="hero-ball">🏓</div>
          </div>
        </div>

        {/* Sport Categories */}
        <div className="section">
          <div className="sport-pills">
            {sportCategories.map(sport => (
              <button
                key={sport.id}
                className={`sport-pill ${selectedSport === sport.id ? 'sport-pill-active' : ''}`}
                onClick={() => setSelectedSport(sport.id)}
              >
                <span>{sport.emoji}</span>
                <span>{sport.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Nearby Facilities */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">내 주변 시설</h2>
            <button className="section-more" onClick={() => navigate('/search')}>전체보기</button>
          </div>
          <div className="facilities-scroll">
            {facilities.slice(0, 6).map((facility, idx) => (
              <FacilityCard key={facility.id} facility={facility} index={idx} />
            ))}
          </div>
        </div>

        {/* Kakao Map */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">지도로 찾기</h2>
          </div>
          <KakaoMap facilities={facilities} height={260} />
        </div>

        {/* Upcoming Events */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">다가오는 이벤트</h2>
            <button className="section-more" onClick={() => navigate('/community')}>전체보기</button>
          </div>
          <div className="events-list">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* Quick Booking CTA */}
        <div className="section">
          <div className="quick-booking-cta" onClick={() => navigate('/search')}>
            <div className="quick-cta-content">
              <h3>지금 바로 예약하기</h3>
              <p>오늘 이용 가능한 코트를 확인하세요</p>
            </div>
            <div className="quick-cta-arrow">→</div>
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>
    </Layout>
  )
}
