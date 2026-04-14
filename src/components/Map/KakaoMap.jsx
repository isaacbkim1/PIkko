// TODO: [Kakao Map] Replace KAKAO_JS_KEY_PLACEHOLDER in index.html with your real Kakao JavaScript App Key
// Get your key at: https://developers.kakao.com/ → My Applications → App Keys → JavaScript Key

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { facilities as allFacilities } from '../../data/facilities'
import './KakaoMap.css'

export default function KakaoMap({ facilities = allFacilities, height = 260, onFacilityClick }) {
  const mapRef = useRef(null)
  const navigate = useNavigate()
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    if (window.__kakaoMapLoadFailed) {
      setMapError(true)
      return
    }

    const initMap = () => {
      try {
        if (!window.kakao || !window.kakao.maps) {
          setMapError(true)
          return
        }
        window.kakao.maps.load(() => {
          try {
            if (!mapRef.current) return
            const center = new window.kakao.maps.LatLng(37.5326, 127.0246)
            const map = new window.kakao.maps.Map(mapRef.current, { center, level: 8 })
            setMapReady(true)

            facilities.forEach(facility => {
              const position = new window.kakao.maps.LatLng(facility.lat, facility.lng)
              const marker = new window.kakao.maps.Marker({ map, position, title: facility.name })
              const infoContent = `<div style="padding:8px 12px;font-size:13px;font-family:'Noto Sans KR',sans-serif;min-width:140px;">
                <strong style="display:block;margin-bottom:4px;">${facility.name}</strong>
                <span style="color:#666;display:block;margin-bottom:6px;">${facility.price.toLocaleString()}원/시간 ⭐${facility.rating}</span>
                <a href="/facility/${facility.id}" style="color:#FF6B35;font-weight:600;text-decoration:none;">예약하기 →</a>
              </div>`
              const infoWindow = new window.kakao.maps.InfoWindow({ content: infoContent })
              window.kakao.maps.event.addListener(marker, 'click', () => {
                infoWindow.open(map, marker)
                if (onFacilityClick) onFacilityClick(facility)
              })
            })
          } catch (err) {
            console.warn('Kakao Map init error:', err)
            setMapError(true)
          }
        })
      } catch (err) {
        console.warn('Kakao SDK error:', err)
        setMapError(true)
      }
    }

    if (window.kakao && window.kakao.maps) {
      initMap()
    } else {
      const timer = setTimeout(initMap, 1200)
      return () => clearTimeout(timer)
    }
  }, [facilities, onFacilityClick])

  if (mapError) {
    return (
      <div className="kakao-fallback" style={{ height }}>
        <div className="kakao-fallback-icon">🗺️</div>
        <p className="kakao-fallback-title">지도를 불러올 수 없습니다</p>
        <p className="kakao-fallback-sub">Kakao Maps API 키를 설정해주세요</p>
        <div className="kakao-fallback-list">
          {facilities.slice(0, 4).map(f => (
            <div key={f.id} className="kakao-fallback-item" onClick={() => navigate(`/facility/${f.id}`)}>
              <span>📍 {f.name}</span>
              <span className="kakao-fallback-rating">⭐{f.rating}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="kakao-map-wrapper" style={{ height }}>
      {!mapReady && (
        <div className="kakao-map-placeholder" style={{ height }}>
          <div className="kakao-map-spinner" />
          <span>지도 로딩 중...</span>
        </div>
      )}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
