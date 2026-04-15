/**
 * PikkoBall — SVG pickleball logo icon
 *
 * Pickleball paddle (rectangular with handle) + perforated ball + motion lines.
 * Inspired by the Pickleball park style: dynamic, sporty, orange+navy color scheme.
 *
 * Props:
 *   size   — px width/height (default 40)
 *   className — additional class
 */
export default function PikkoBall({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Pikko pickleball logo"
    >
      {/* ── Paddle body ─────────────────────────────────────────────────── */}
      {/* Paddle head — rounded rectangle, tilted ~30° */}
      <g transform="rotate(-35, 50, 50)">
        {/* Paddle face */}
        <rect x="34" y="10" width="32" height="38" rx="8" fill="#1A1A2E" />
        {/* Paddle grip lines on face */}
        <line x1="40" y1="18" x2="60" y2="18" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <line x1="40" y1="24" x2="60" y2="24" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <line x1="40" y1="30" x2="60" y2="30" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <line x1="40" y1="36" x2="60" y2="36" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        {/* Paddle edge highlight */}
        <rect x="34" y="10" width="32" height="38" rx="8" stroke="#FF6B35" strokeWidth="2" fill="none"/>
        {/* Handle */}
        <rect x="44" y="48" width="12" height="30" rx="5" fill="#1A1A2E"/>
        <rect x="44" y="48" width="12" height="30" rx="5" stroke="#FF6B35" strokeWidth="1.5" fill="none"/>
        {/* Handle grip wrap */}
        <line x1="44" y1="56" x2="56" y2="56" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <line x1="44" y1="62" x2="56" y2="62" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <line x1="44" y1="68" x2="56" y2="68" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      </g>

      {/* ── Motion lines (speed) ─────────────────────────────────────────── */}
      <line x1="6"  y1="28" x2="28" y2="28" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
      <line x1="10" y1="38" x2="26" y2="38" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="14" y1="48" x2="24" y2="48" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>

      {/* ── Pickleball ───────────────────────────────────────────────────── */}
      {/* Ball glow */}
      <circle cx="72" cy="30" r="22" fill="#FF6B35" opacity="0.15"/>
      {/* Ball body */}
      <circle cx="72" cy="30" r="18" fill="#FF6B35"/>
      {/* Ball shine */}
      <circle cx="66" cy="24" r="5" fill="white" opacity="0.25"/>
      {/* Perforation holes — pickleball has ~26 holes, show ~12 arranged in pattern */}
      <circle cx="72" cy="30" r="2.2" fill="#1A1A2E" opacity="0.7"/>
      <circle cx="64" cy="26" r="2"   fill="#1A1A2E" opacity="0.7"/>
      <circle cx="80" cy="26" r="2"   fill="#1A1A2E" opacity="0.7"/>
      <circle cx="64" cy="34" r="2"   fill="#1A1A2E" opacity="0.7"/>
      <circle cx="80" cy="34" r="2"   fill="#1A1A2E" opacity="0.7"/>
      <circle cx="68" cy="20" r="1.8" fill="#1A1A2E" opacity="0.7"/>
      <circle cx="76" cy="20" r="1.8" fill="#1A1A2E" opacity="0.7"/>
      <circle cx="68" cy="40" r="1.8" fill="#1A1A2E" opacity="0.7"/>
      <circle cx="76" cy="40" r="1.8" fill="#1A1A2E" opacity="0.7"/>
      <circle cx="60" cy="30" r="1.8" fill="#1A1A2E" opacity="0.6"/>
      <circle cx="84" cy="30" r="1.8" fill="#1A1A2E" opacity="0.6"/>
      <circle cx="72" cy="14" r="1.5" fill="#1A1A2E" opacity="0.5"/>
    </svg>
  )
}
