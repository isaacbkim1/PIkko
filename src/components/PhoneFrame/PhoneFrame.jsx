import { useState, useEffect, useRef } from 'react'
import PikkoBall from '../UI/PikkoBall'
import './PhoneFrame.css'

const FEATURES = [
  {
    screen:  '/login',
    label:   '로그인',
    tag:     'AUTH',
    title:   'Secure Login',
    desc:    'Citizen or Operator sign-in. Kakao OAuth coming soon.',
    bullets: ['Citizen & Operator roles', 'Kakao Login (coming soon)', 'Demo credentials included'],
  },
  {
    screen:  '/search',
    label:   '코트 검색',
    tag:     'SEARCH',
    title:   'Find Courts',
    desc:    'Browse Seoul pickleball courts with live slot availability.',
    bullets: ['Kakao Map + markers', 'District & price filters', 'Live availability'],
  },
  {
    screen:  '/booking/f1',
    label:   '예약',
    tag:     'BOOKING',
    title:   'Book in 4 Steps',
    desc:    'Date, time, players, payment — done in under a minute.',
    bullets: ['Date & time picker', 'Player count selector', 'KakaoPay / demo pay'],
  },
  {
    screen:  '/booking-confirm',
    label:   '입장권',
    tag:     'TICKET',
    title:   'QR Entry Ticket',
    desc:    'Scannable QR + barcode generated instantly after payment.',
    bullets: ['QR with booking data', 'Barcode reference', 'Staff scan to verify'],
  },
  {
    screen:  '/admin',
    label:   '관리자',
    tag:     'ADMIN',
    title:   'Operator Dashboard',
    desc:    'Live booking stats, facility controls, and revenue.',
    bullets: ['Daily revenue & bookings', 'Facility on/off toggle', 'Full booking list'],
  },
]

function Clock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      const n = new Date()
      setTime(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`)
    }
    update()
    const t = setInterval(update, 10000)
    return () => clearInterval(t)
  }, [])
  return <span>{time}</span>
}

export default function PhoneFrame() {
  const [active, setActive]       = useState(0)
  const [iframeSrc, setIframeSrc] = useState('/login')
  const [phoneH, setPhoneH]       = useState(520)
  const colRef = useRef(null)

  // Override mobile body constraints
  useEffect(() => {
    document.body.classList.add('pf-mode')
    return () => document.body.classList.remove('pf-mode')
  }, [])

  useEffect(() => {
    const measure = () => {
      if (!colRef.current) return
      // col height - top pad(16) - pills(29) - gap(14) - bottom pad(24) - safety(8)
      const h = colRef.current.clientHeight - 16 - 29 - 14 - 24 - 8
      setPhoneH(Math.max(h, 260))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const pick = (i) => { setActive(i); setIframeSrc(FEATURES[i].screen) }
  const f = FEATURES[active]

  return (
    <div className="pf-page">

      {/* Nav */}
      <nav className="pf-nav">
        <div className="pf-nav-logo">
          <PikkoBall size={26} className="pf-nav-icon" />
          <span className="pf-nav-brand">Pikko</span>
        </div>
        <div className="pf-nav-links">
          <span className="pf-nav-tag">Seoul Pilot · 2025</span>
          <a href="/login" className="pf-nav-cta">Open App →</a>
        </div>
      </nav>

      {/* Main content: fills remaining height */}
      <div className="pf-body">

        {/* Phone column */}
        <div className="pf-col-phone" ref={colRef}>

          {/* Pills ABOVE the phone */}
          <div className="pf-feature-pills">
            {FEATURES.map((feat, i) => (
              <button
                key={feat.tag}
                className={`pf-pill ${active === i ? 'pf-pill--active' : ''}`}
                onClick={() => pick(i)}
              >
                {feat.label}
              </button>
            ))}
          </div>

          <div className="pf-phone">
            <div className="pf-phone-shell" style={{ height: phoneH, width: Math.round(phoneH * 0.46) }}>
              <div className="pf-notch"><div className="pf-notch-camera" /></div>
              <div className="pf-status-bar">
                <Clock />
                <div className="pf-status-icons">
                  <span className="pf-signal">lll</span>
                  <span>WiFi</span>
                  <span className="pf-battery">▪▪</span>
                </div>
              </div>
              <iframe
                key={iframeSrc}
                src={iframeSrc}
                className="pf-iframe"
                title="Pikko App"
              />
              <div className="pf-home-bar" />
            </div>
          </div>


        </div>

        {/* Info column */}
        <div className="pf-col-info">

          <div className="pf-app-id">
            <div className="pf-app-avatar"><PikkoBall size={32} /></div>
            <div>
              <p className="pf-app-name">Pikko</p>
              <p className="pf-app-sub">Korea Public Sports Platform</p>
            </div>
          </div>

          <div className="pf-feature-card">
            <span className="pf-feature-tag">{f.tag}</span>
            <h2 className="pf-feature-title">{f.title}</h2>
            <p className="pf-feature-desc">{f.desc}</p>
            <ul className="pf-feature-bullets">
              {f.bullets.map(b => (
                <li key={b}>
                  <span className="pf-bullet-check">&#10003;</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="pf-demo-card">
            <p className="pf-demo-label">&#9654; Demo Login</p>
            <p className="pf-demo-cred"><strong>Email:</strong> demo@pikko.kr</p>
            <p className="pf-demo-cred"><strong>PW:</strong> demo1234</p>
            <p className="pf-demo-hint">Tap inside the phone to interact</p>
          </div>

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

        </div>
      </div>
    </div>
  )
}
