import { useNavigate } from 'react-router-dom'
import './Header.css'

/**
 * Shared header component.
 * Used directly by Layout. Do NOT render this component manually inside
 * a screen that already uses <Layout> — it will create a double header.
 */
export default function Header({
  title,
  showBack = false,
  onBack,
  rightAction = null,
  transparent = false,
}) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <header className={`header ${transparent ? 'header-transparent' : ''}`}>
      <div className="header-left">
        {showBack ? (
          <button className="header-back" onClick={handleBack} aria-label="뒤로가기">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : (
          <div className="header-logo" onClick={() => navigate('/')}>
            <span className="header-logo-text">피코</span>
            <span className="header-logo-dot">●</span>
          </div>
        )}
      </div>

      {title && <h1 className="header-title">{title}</h1>}

      <div className="header-right">{rightAction}</div>
    </header>
  )
}
