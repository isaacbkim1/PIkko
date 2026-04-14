import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Header from '../../components/Layout/Header'
import Badge from '../../components/UI/Badge'
import { facilities, districts } from '../../data/facilities'
import './SearchScreen.css'

// TODO: [Backend API] GET /api/facilities?district=&sport=&priceMax=

const priceRanges = [
  { id: 'all', label: '전체 가격' },
  { id: 'low', label: '~2만원', max: 20000 },
  { id: 'mid', label: '2~2.5만원', min: 20000, max: 25000 },
  { id: 'high', label: '2.5만원~', min: 25000 }
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

function FacilityListCard({ facility, index }) {
  const navigate = useNavigate()
  const gradient = gradientColors[index % gradientColors.length]
  const availableSlots = facility.slots.filter(s => s.available).length

  return (
    <div className="search-facility-card" onClick={() => navigate(`/facility/${facility.id}`)}>
      <div className="search-card-image" style={{ background: gradient }}>
        <div className="search-card-rating">⭐ {facility.rating} ({facility.reviewCount})</div>
      </div>
      <div className="search-card-body">
        <div className="search-card-header">
          <h3 className="search-card-name">{facility.name}</h3>
          <span className="search-card-price">
            {facility.price.toLocaleString()}원<span>/h</span>
          </span>
        </div>
        <p className="search-card-address">📍 {facility.address}</p>
        <div className="search-card-meta">
          <Badge variant="primary" size="sm">피클볼</Badge>
          <span className="search-card-slots">
            {availableSlots > 0 ? `잔여 ${availableSlots}타임` : '마감'}
          </span>
        </div>
        <div className="search-card-amenities">
          {facility.amenities.slice(0, 3).map(a => (
            <span key={a} className="amenity-chip">{a}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('전체')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [sortBy, setSortBy] = useState('rating')

  const filtered = useMemo(() => {
    let result = [...facilities]

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.district.includes(q) ||
        f.address.includes(q)
      )
    }

    if (selectedDistrict && selectedDistrict !== '전체') {
      result = result.filter(f => f.district === selectedDistrict)
    }

    if (selectedPrice !== 'all') {
      const range = priceRanges.find(r => r.id === selectedPrice)
      if (range) {
        if (range.min) result = result.filter(f => f.price >= range.min)
        if (range.max) result = result.filter(f => f.price <= range.max)
      }
    }

    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'price_asc') return a.price - b.price
      if (sortBy === 'price_desc') return b.price - a.price
      return 0
    })

    return result
  }, [query, selectedDistrict, selectedPrice, sortBy])

  return (
    <Layout>
      <Header title="코트 검색" />
      <div className="search-screen">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="시설명, 지역으로 검색..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}>✕</button>
          )}
        </div>

        {/* District Filter */}
        <div className="filter-scroll-wrapper">
          <div className="filter-scroll">
            {districts.map(d => (
              <button
                key={d}
                className={`filter-chip ${selectedDistrict === d ? 'filter-chip-active' : ''}`}
                onClick={() => setSelectedDistrict(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="filter-scroll-wrapper">
          <div className="filter-scroll">
            {priceRanges.map(r => (
              <button
                key={r.id}
                className={`filter-chip ${selectedPrice === r.id ? 'filter-chip-active' : ''}`}
                onClick={() => setSelectedPrice(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="search-results-header">
          <span className="results-count">{filtered.length}개 시설</span>
          <div className="sort-wrapper">
            <select
              className="sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="rating">평점순</option>
              <option value="price_asc">가격 낮은순</option>
              <option value="price_desc">가격 높은순</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="search-results">
          {filtered.length === 0 ? (
            <div className="search-empty">
              <div className="search-empty-icon">🔍</div>
              <p>검색 결과가 없습니다</p>
              <span>다른 검색어나 필터를 사용해보세요</span>
            </div>
          ) : (
            filtered.map((facility, idx) => (
              <FacilityListCard key={facility.id} facility={facility} index={idx} />
            ))
          )}
        </div>

        <div style={{ height: 16 }} />
      </div>
    </Layout>
  )
}
