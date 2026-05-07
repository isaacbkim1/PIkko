import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { featuredFacilities } from '../../data/featuredFacilities.js';
import './FeaturedCourts.css';

// ── Badge helpers ─────────────────────────────────────────────────────────────
function AccessBadge({ type }) {
  return (
    <span className={`fc-badge fc-badge-access fc-badge-${type.toLowerCase()}`}>
      {type === 'Public' ? '공공' : '프라이빗'}
    </span>
  );
}

function LocationBadge({ type }) {
  return (
    <span className={`fc-badge fc-badge-location fc-badge-${type.toLowerCase()}`}>
      {type === 'Indoor' ? '실내' : '야외'}
    </span>
  );
}

// ── Individual Card ───────────────────────────────────────────────────────────
function FeaturedCard({ facility, isHighlighted, onSelect }) {
  const navigate = useNavigate();
  const [imgFailed, setImgFailed] = useState(false);

  const handleReserve = (e) => {
    e.stopPropagation();
    navigate(`/booking/${facility.id}`);
  };

  const handleJoinGame = (e) => {
    e.stopPropagation();
    // TODO: [GameMatch] Navigate to join-game / game creation flow
    navigate('/community');
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/facility/${facility.id}`);
  };

  return (
    <div
      className={`fc-card ${isHighlighted ? 'fc-card--highlighted' : ''}`}
      onClick={() => onSelect(facility.id)}
    >
      {/* ── Photo ── */}
      <div className="fc-photo-wrap">
        {!imgFailed ? (
          <img
            src={facility.image}
            alt={facility.koreanName}
            className="fc-photo"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="fc-photo-fallback" style={{ background: facility.gradientFallback }}>
            <span className="fc-photo-fallback-name">{facility.koreanName}</span>
          </div>
        )}
        <div className="fc-photo-gradient" />

        {/* Badges over photo */}
        <div className="fc-photo-badges">
          <LocationBadge type={facility.indoorOutdoor} />
          <AccessBadge type={facility.accessType} />
        </div>

        {/* Rating */}
        <div className="fc-rating">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFB800">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>{facility.rating}</span>
          <span className="fc-rating-count">({facility.reviewCount})</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="fc-body">
        <div className="fc-name-row">
          <div>
            <h3 className="fc-name">{facility.koreanName}</h3>
            <p className="fc-district">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {facility.district}
            </p>
          </div>
          <div className="fc-price-block">
            <span className="fc-price">{facility.priceLabel}</span>
          </div>
        </div>

        {/* Availability */}
        <div className="fc-availability">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span>{facility.availability}</span>
        </div>

        {/* Time slots */}
        {facility.slots.length > 0 && (
          <div className="fc-slots">
            {facility.slots.slice(0, 4).map(t => (
              <span key={t} className="fc-slot">{t}</span>
            ))}
            {facility.slots.length > 4 && (
              <span className="fc-slot fc-slot-more">+{facility.slots.length - 4}</span>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="fc-tags">
          {facility.tags.map(tag => (
            <span key={tag} className="fc-tag">{tag}</span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="fc-cta-row">
          <button className="fc-btn fc-btn-outline" onClick={handleViewDetails}>
            상세보기
          </button>
          <button className="fc-btn fc-btn-join" onClick={handleJoinGame}>
            게임 참여
          </button>
          <button className="fc-btn fc-btn-reserve" onClick={handleReserve}>
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function FeaturedCourts({ onPinSelect, highlightedId }) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id === selectedId ? null : id);
    onPinSelect?.(id);
  };

  return (
    <section className="fc-section">
      <div className="fc-section-header">
        <div>
          <h2 className="fc-section-title">추천 피클볼 코트</h2>
          <p className="fc-section-sub">서울 · 경기 엄선 5개소</p>
        </div>
        <button className="fc-see-all" onClick={() => navigate('/search')}>
          전체보기
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <div className="fc-scroll">
        {featuredFacilities.map(f => (
          <FeaturedCard
            key={f.id}
            facility={f}
            isHighlighted={highlightedId === f.id || selectedId === f.id}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </section>
  );
}
