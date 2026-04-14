import { useNavigate } from 'react-router-dom'
import './Header.css'

export default function Header({
  title,
  showBack = false,
  rightAction = null,
  transparent = false
}) {
  const navigate = useNavigate()

  return (
    <header className={`header ${transparent ? 'header-transparent' : ''}`}>
      <div className="header-left">
        {showBack && (
          <button className="header-back" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        {!showBack && (
          <div className="header-logo" onClick={() => navigate('/')}>
            <span className="header-logo-text">피코</span>
            <span className="header-logo-dot">●</span>
          </div>
        )}
      </div>
      {title && <h1 className="header-title">{title}</h1>}
      <div className="header-right">
        {rightAction}
      </div>
    </header>
  )
}
