import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { facilities as allFacilities } from '../../data/facilities'
import './KakaoMap.css'

/**
 * KakaoMap
 *
 * Uses autoload=false in the SDK script tag, so kakao.maps.load() is called
 * manually via the onload callback in index.html which sets window.__kakaoMapReady=true.
 * This component polls for that flag, then initializes the map.
 */
export default function KakaoMap({
  facilities = allFacilities,
  height = 260,
  onFacilityClick,
}) {
  const mapRef    = useRef(null)
  const navigate  = useNavigate()
  const [mapState, setMapState] = useState('loading') // 'loading' | 'ready' | 'error'

  // Handle clicks on InfoWindow "예약하기" buttons (rendered as raw HTML by Kakao)
  useEffect(() => {
    const handleInfoClick = (e) => {
      const btn = e.target.closest('[data-pikko-facility]')
      if (btn) {
        const id = btn.getAttribute('data-pikko-facility')
        navigate(`/facility/${id}`)
      }
    }
    document.addEventListener('click', handleInfoClick)
    return () => document.removeEventListener('click', handleInfoClick)
  }, [navigate])

  useEffect(() => {
    let cancelled  = false
    let pollTimer  = null
    let giveUpTimer = null
    let attempts   = 0
    const MAX_ATTEMPTS = 40   // 40 × 200ms = 8 seconds max wait

    const initMap = () => {
      if (cancelled) return
      try {
        const container = mapRef.current
        if (!container) { setMapState('error'); return }

        const center = new window.kakao.maps.LatLng(37.5326, 127.0246)
        const map    = new window.kakao.maps.Map(container, { center, level: 8 })
        let openInfoWindow = null

        facilities.forEach((facility) => {
          const position = new window.kakao.maps.LatLng(facility.lat, facility.lng)
          const marker   = new window.kakao.maps.Marker({ map, position, title: facility.name })

          // Build InfoWindow — button uses a data-id so we can intercept
          // the click via a document-level listener and avoid full-page nav.
          const infoContent = `
            <div style="
              padding:12px 14px;
              font-size:13px;
              font-family:'Noto Sans KR',sans-serif;
              min-width:160px;
              line-height:1.5;
            ">
              <strong style="display:block;margin-bottom:2px;color:#1A1A2E;font-size:14px;">
                ${facility.name}
              </strong>
              <span style="color:#888;display:block;margin-bottom:8px;">
                ${facility.price.toLocaleString()}원/시간 &nbsp;⭐ ${facility.rating}
              </span>
              <button
                data-pikko-facility="${facility.id}"
                style="
                  background:#FF6B35;
                  color:#fff;
                  border:none;
                  border-radius:8px;
                  padding:7px 16px;
                  font-size:13px;
                  font-weight:700;
                  cursor:pointer;
                  font-family:'Noto Sans KR',sans-serif;
                  width:100%;
                "
              >예약하기 →</button>
            </div>`

          const infoWindow = new window.kakao.maps.InfoWindow({ content: infoContent })
          window.kakao.maps.event.addListener(marker, 'click', () => {
            if (openInfoWindow) openInfoWindow.close()
            infoWindow.open(map, marker)
            openInfoWindow = infoWindow
            if (onFacilityClick) onFacilityClick(facility)
          })
        })

        if (!cancelled) setMapState('ready')
      } catch (err) {
        console.warn('[KakaoMap] init error:', err)
        if (!cancelled) setMapState('error')
      }
    }

    const poll = () => {
      if (cancelled) return

      // SDK failed to load (script onerror fired)
      if (window.__kakaoMapFailed) {
        setMapState('error')
        return
      }

      // SDK ready flag set by onload callback in index.html
      if (window.__kakaoMapReady && window.kakao && window.kakao.maps) {
        initMap()
        return
      }

      // Also handle case where SDK was loaded WITHOUT autoload=false (legacy)
      if (window.kakao && window.kakao.maps && typeof window.kakao.maps.Map === 'function') {
        initMap()
        return
      }

      attempts++
      if (attempts >= MAX_ATTEMPTS) {
        console.warn('[KakaoMap] timed out waiting for SDK')
        setMapState('error')
        return
      }

      pollTimer = setTimeout(poll, 200)
    }

    poll()

    return () => {
      cancelled = true
      clearTimeout(pollTimer)
      clearTimeout(giveUpTimer)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fallback ────────────────────────────────────────────────────────────────
  if (mapState === 'error') {
    return (
      <div className="kakao-fallback" style={{ height }}>
        <div className="kakao-fallback-inner">
          <span className="kakao-fallback-icon">🗺️</span>
          <p className="kakao-fallback-title">지도를 불러올 수 없습니다</p>
          <p className="kakao-fallback-sub">
            Kakao 개발자 콘솔에서 도메인을 등록해주세요
          </p>
          <div className="kakao-fallback-list">
            {facilities.slice(0, 4).map((f) => (
              <a key={f.id} href={`/facility/${f.id}`} className="kakao-fallback-item">
                <span>📍 {f.name}</span>
                <span className="kakao-fallback-price">{f.price.toLocaleString()}원</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Map ─────────────────────────────────────────────────────────────────────
  return (
    <div className="kakao-map-wrapper" style={{ height }}>
      {mapState === 'loading' && (
        <div className="kakao-map-loading" style={{ height }}>
          <div className="kakao-spinner" />
          <span>지도 불러오는 중...</span>
        </div>
      )}
      <div
        ref={mapRef}
        className="kakao-map-canvas"
        style={{ opacity: mapState === 'ready' ? 1 : 0 }}
      />
    </div>
  )
}
