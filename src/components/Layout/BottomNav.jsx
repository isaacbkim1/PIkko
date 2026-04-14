import { NavLink } from 'react-router-dom'
import './BottomNav.css'

const navItems = [
  {
    path: '/',
    label: '홈',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#FF6B35' : 'none'} stroke={active ? '#FF6B35' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    path: '/search',
    label: '검색',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#FF6B35' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    )
  },
  {
    path: '/my-bookings',
    label: '예약',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'rgba(255,107,53,0.15)' : 'none'} stroke={active ? '#FF6B35' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    )
  },
  {
    path: '/community',
    label: '커뮤니티',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'rgba(255,107,53,0.15)' : 'none'} stroke={active ? '#FF6B35' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    )
  },
  {
    path: '/profile',
    label: '프로필',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'rgba(255,107,53,0.15)' : 'none'} stroke={active ? '#FF6B35' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  }
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav-icon">{item.icon(isActive)}</span>
              <span className="bottom-nav-label">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
