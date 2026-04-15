/**
 * PhoneFrame
 *
 * On desktop (≥768px): wraps the app in a realistic phone mockup with a
 * feature sidebar on the right. The app runs inside an <iframe> that points
 * to /app so the full React SPA lives inside the phone.
 *
 * On mobile: renders children directly (no frame needed — user IS on a phone).
 */

import { useState, useEffect } from 'react'
import PikkoBall from '../UI/PikkoBall'
import './PhoneFrame.css'

const FEATURES = [
  {
    screen: '/search',
    label:  '코트 검색',
    tag:    'SEARCH',
    title:  'Find Courts',
    desc:   'Browse 8 Seoul pickleball courts with real-time availability, filters by district and price.',
    bullets: ['Kakao Map with clickable markers', 'District & price filters', 'Real-time slot availability'],
  },
  {
    screen: '/booking/f1',
    label:  '예약',
    tag:    'BOOKING',
    title:  'Book in 4 Steps',
    desc:   'Select date, time, players, and pay — all in under a minute.',
    bullets: ['Date & time picker', 'Player count selector', 'KakaoPay + demo payment'],
  },
  {
    screen: '/booking-confirm',
    label:  '입장권',
    tag:    'TICKET',
    title:  'QR Entry Ticket',
    desc:   'After payment, get a scannable QR code + barcode ticket for on-site check-in.',
    bullets: ['QR code with booking data', 'Barcode with reference number', 'Staff scan to verify'],
  },
  {
    screen: '/community',
    label:  '커뮤니티',
    tag:    'COMMUNITY',
    title:  'Join the Community',
    desc:   'Find local groups, sign up for clinics, and join pickleball events across Seoul.',
    bullets: ['Local groups by district', 'Coach-led programs', 'Upcoming tournaments'],
  },
  {
    screen: '/admin',
    label:  '관리자',
    tag:    'ADMIN',
    title:  'Operator Dashboard',
    desc:   'Real-time booking stats, facility status toggles, and revenue overview.',
    bullets: ['Daily revenue & bookings', 'Facility on/off toggle', 'Booking management'],
  },
]

// Live clock for the phone status bar
function Clock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`)
    }
    update()
    const t = setInterval(update, 10000)
    return () => clearInterval(t)
  }, [])
  return <span>{time}</span>
}

export default function PhoneFrame() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [iframeSrc,     setIframeSrc]     = useState('/login')

  const feature = FEATURES[activeFeature]

  const handleFeatureClick = (idx) => {
    setActiveFeature(idx)
    setIframeSrc(FEATURES[idx].screen)
  }

  return (
    <div className="pf-page">

      {/* ── Top nav ── */}
      <nav className="pf-nav">
        <div className="pf-nav-logo">
          <PikkoBall size={28} className="pf-nav-icon" />
          <span className="pf-nav-brand">Pikko</span>
        </div>
        <div className="pf-nav-links">
          <span className="pf-nav-tag">Seoul Pilot · 2025</span>
          <a href="/login" className="pf-nav-cta">Open App →</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="pf-hero">
        <div className="pf-hero-left">

          {/* Phone mockup */}
          <div className="pf-phone">
            {/* Phone shell */}
            <div className="pf-phone-shell">
              {/* Notch */}
              <div className="pf-notch">
                <div className="pf-notch-camera" />
              </div>
              {/* Status bar */}
              <div className="pf-status-bar">
                <Clock />
                <div className="pf-status-icons">
                  <span className="pf-signal">lll</span>
                  <span>WiFi</span>
                  <span className="pf-battery">■■</span>
                </div>
              </div>
              {/* App iframe */}
              <iframe
                key={iframeSrc}
                src={iframeSrc}
                className="pf-iframe"
                title="Pikko App"
                allow="fullscreen"
              />
              {/* Home indicator */}
              <div className="pf-home-bar" />
            </div>
          </div>

          {/* Feature nav pills below phone */}
          <div className="pf-feature-pills">
            {FEATURES.map((f, i) => (
              <button
                key={f.tag}
                className={`pf-pill ${activeFeature === i ? 'pf-pill--active' : ''}`}
                onClick={() => handleFeatureClick(i)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Right side info panel ── */}
        <div className="pf-info">
          {/* App identity */}
          <div className="pf-app-id">
            <div className="pf-app-avatar">
              <PikkoBall size={34} />
            </div>
            <div>
              <p className="pf-app-name">Pikko</p>
              <p className="pf-app-sub">Korea Public Sports Access Platform</p>
            </div>
          </div>

          {/* Feature detail */}
          <div className="pf-feature-card">
            <span className="pf-feature-tag">{feature.tag}</span>
            <h2 className="pf-feature-title">{feature.title}</h2>
            <p className="pf-feature-desc">{feature.desc}</p>
            <ul className="pf-feature-bullets">
              {feature.bullets.map((b) => (
                <li key={b}>
                  <span className="pf-bullet-check">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Demo credentials */}
          <div className="pf-demo-card">
            <p className="pf-demo-label">&#9654; Demo Login</p>
            <p className="pf-demo-cred"><strong>Email:</strong> demo@pikko.kr</p>
            <p className="pf-demo-cred"><strong>Password:</strong> demo1234</p>
            <p className="pf-demo-hint">&#8595; Tap inside the phone to interact</p>
          </div>

          {/* Stats */}
          <div className="pf-stats">
            <div className="pf-stat">
              <span className="pf-stat-value">8</span>
              <span className="pf-stat-label">Courts</span>
            </div>
            <div className="pf-stat">
              <span className="pf-stat-value">Seoul</span>
              <span className="pf-stat-label">Market</span>
            </div>
            <div className="pf-stat">
              <span className="pf-stat-value">MVP</span>
              <span className="pf-stat-label">Stage</span>
            </div>
          </div>

          <p className="pf-footer-note">Seoul Pilot Program · 2025</p>
        </div>
      </div>
    </div>
  )
}
