// TODO: [Kakao Map] Replace KAKAO_JS_KEY_PLACEHOLDER in index.html with your real key.
// Get it at: https://developers.kakao.com → My Applications → App Keys → JavaScript Key
// Also register your domain under: Platform → Web → Site Domain

import { useEffect, useRef, useState } from 'react'
import { facilities as allFacilities } from '../../data/facilities'
import './KakaoMap.css'

/**
 * KakaoMap component.
 *
 * Renders a Kakao Map with a marker for each facility.
 * Clicking a marker opens an InfoWindow with the facility name, price,
 * and a link to the facility detail page.
 *
 * If the Kakao SDK fails to load (wrong key, domain not registered,
 * or network error), the component shows a graceful fallback list.
 *
 * Props:
 *   facilities  – array of facility objects (defaults to all facilities)
 *   height      – CSS height for the map container (default: 260)
 *   onFacilityClick – optional callback when a marker is clicked
 */
export default function KakaoMap({
  facilities = allFacilities,
  height = 260,
  onFacilityClick,
}) {
  const mapRef = useRef(null)
  const [mapState, setMapState] = useState('loading') // 'loading' | 'ready' | 'error'

  useEffect(() => {
    // If the onerror handler already fired before React mounted, bail immediately.
    if (window.__kakaoMapFailed) {
      setMapState('error')
      return
    }

    let cancelled = false

    const initMap = () => {
      if (cancelled) return

      // SDK not available at all
      if (!window.kakao || !window.kakao.maps) {
        setMapState('error')
        return
      }

      // kakao.maps.load() queues the callback until the SDK is fully ready.
      window.kakao.maps.load(() => {
        if (cancelled) return
        try {
          const container = mapRef.current
          if (!container) return

          const center = new window.kakao.maps.LatLng(37.5326, 127.0246)
          const map = new window.kakao.maps.Map(container, { center, level: 8 })

          // Keep track of the open InfoWindow so we can close the previous one.
          let openInfoWindow = null

          facilities.forEach((facility) => {
            const position = new window.kakao.maps.LatLng(facility.lat, facility.lng)
            const marker = new window.kakao.maps.Marker({ map, position, title: facility.name })

            // Use a plain anchor href — Kakao InfoWindow content is raw HTML,
            // not managed by React, so we cannot use navigate() here.
            const infoContent = `
              <div style="
                padding: 10px 14px;
                font-size: 13px;
                font-family: 'Noto Sans KR', sans-serif;
                min-width: 150px;
                line-height: 1.5;
              ">
                <strong style="display:block; margin-bottom: 2px; color: #1A1A2E;">
                  ${facility.name}
                </strong>
                <span style="color: #888; display: block; margin-bottom: 6px;">
                  ${facility.price.toLocaleString()}원/시간 &nbsp;⭐ ${facility.rating}
                </span>
                <a
                  href="/facility/${facility.id}"
                  style="color: #FF6B35; font-weight: 700; text-decoration: none;"
                >
                  예약하기 →
                </a>
              </div>`

            const infoWindow = new window.kakao.maps.InfoWindow({ content: infoContent })

            window.kakao.maps.event.addListener(marker, 'click', () => {
              if (openInfoWindow) openInfoWindow.close()
              infoWindow.open(map, marker)
              openInfoWindow = infoWindow
              if (onFacilityClick) onFacilityClick(facility)
            })
          })

          setMapState('ready')
        } catch (err) {
          console.warn('[KakaoMap] Initialization error:', err)
          setMapState('error')
        }
      })
    }

    // The SDK script may already be loaded (window.kakao exists) or still loading.
    // We poll briefly then give up — this handles the async SDK load race.
    if (window.kakao && window.kakao.maps) {
      initMap()
    } else {
      // SDK is still loading. Try after a short delay.
      const timer = setTimeout(() => {
        if (!cancelled) initMap()
      }, 1500)
      return () => {
        cancelled = true
        clearTimeout(timer)
      }
    }

    return () => {
      cancelled = true
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // Deliberately omitting facilities/onFacilityClick from deps — map is
  // initialized once; markers reflect the initial prop value.

  // ── Fallback UI ─────────────────────────────────────────────────────────────
  if (mapState === 'error') {
    return (
      <div className="kakao-fallback" style={{ height }}>
        <div className="kakao-fallback-inner">
          <span className="kakao-fallback-icon">🗺️</span>
          <p className="kakao-fallback-title">지도를 불러올 수 없습니다</p>
          <p className="kakao-fallback-sub">
            index.html에서 Kakao Map API 키를 설정해주세요
          </p>
          <div className="kakao-fallback-list">
            {facilities.slice(0, 4).map((f) => (
              <a
                key={f.id}
                href={`/facility/${f.id}`}
                className="kakao-fallback-item"
              >
                <span>📍 {f.name}</span>
                <span className="kakao-fallback-price">
                  {f.price.toLocaleString()}원
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Map container ────────────────────────────────────────────────────────────
  return (
    <div className="kakao-map-wrapper" style={{ height }}>
      {/* Loading skeleton shown until the map is ready */}
      {mapState === 'loading' && (
        <div className="kakao-map-loading" style={{ height }}>
          <div className="kakao-spinner" />
          <span>지도 불러오는 중...</span>
        </div>
      )}
      {/* The actual map div — always in the DOM so the SDK can attach to it */}
      <div
        ref={mapRef}
        className="kakao-map-canvas"
        style={{ opacity: mapState === 'ready' ? 1 : 0 }}
      />
    </div>
  )
}
