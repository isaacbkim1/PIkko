import './Card.css'

export default function Card({ children, className = '', onClick, padding = 'md' }) {
  return (
    <div
      className={`card card-pad-${padding} ${onClick ? 'card-clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
