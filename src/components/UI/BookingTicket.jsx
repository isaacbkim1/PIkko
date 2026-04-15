/**
 * BookingTicket
 *
 * Renders a scannable QR code + barcode-style ticket for a confirmed booking.
 * The QR encodes a JSON payload with booking reference, facility, date, time.
 * Staff can scan with any QR reader to verify the booking on-site.
 *
 * Uses the `qrcode` npm package to generate the QR as a canvas data URL
 * entirely client-side — no server call needed.
 */

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import './BookingTicket.css'

// Generate a simple barcode-like visual from the booking ref string.
// Each character maps to a pattern of bars — purely decorative but realistic-looking.
function BarcodeStripes({ value }) {
  const bars = []
  const seed = value || 'PIKKO'
  for (let i = 0; i < 60; i++) {
    const charCode = seed.charCodeAt(i % seed.length) + i
    const wide = charCode % 3 === 0
    const tall = charCode % 5 === 0
    bars.push(
      <div
        key={i}
        className={`barcode-bar ${wide ? 'barcode-bar--wide' : ''} ${tall ? 'barcode-bar--tall' : ''}`}
      />
    )
  }
  return <div className="barcode-stripes">{bars}</div>
}

export default function BookingTicket({ booking, facility }) {
  const canvasRef = useRef(null)
  const [qrReady, setQrReady] = useState(false)

  const ref      = booking?.ref || booking?.id || 'PIKKO000'
  const facName  = facility?.name  || booking?.facilityName  || ''
  const facAddr  = facility?.address || booking?.facilityAddress || ''
  const district = facility?.district || booking?.facilityDistrict || ''

  // QR payload — staff scanning this see all booking details instantly
  const qrPayload = JSON.stringify({
    ref,
    facility: facName,
    date:     booking?.date,
    time:     booking?.time,
    players:  booking?.players,
    amount:   booking?.amount,
    paid:     true,
    app:      'Pikko',
  })

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, qrPayload, {
      width:           200,
      margin:          2,
      color: {
        dark:  '#1A1A2E',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then(() => setQrReady(true))
      .catch((err) => console.warn('[BookingTicket] QR error:', err))
  }, [qrPayload])

  return (
    <div className="ticket">
      {/* ── Ticket header ── */}
      <div className="ticket-header">
        <span className="ticket-logo">🏓 Pikko</span>
        <span className="ticket-badge">입장권</span>
      </div>

      {/* ── Facility info ── */}
      <div className="ticket-facility">
        <h2 className="ticket-facility-name">{facName}</h2>
        <p className="ticket-facility-addr">{facAddr || district}</p>
      </div>

      {/* ── Booking details ── */}
      <div className="ticket-details">
        <div className="ticket-detail-row">
          <span className="ticket-detail-label">날짜</span>
          <span className="ticket-detail-value">{booking?.date}</span>
        </div>
        <div className="ticket-detail-row">
          <span className="ticket-detail-label">시간</span>
          <span className="ticket-detail-value">{booking?.time}</span>
        </div>
        <div className="ticket-detail-row">
          <span className="ticket-detail-label">인원</span>
          <span className="ticket-detail-value">{booking?.players}명</span>
        </div>
        <div className="ticket-detail-row">
          <span className="ticket-detail-label">금액</span>
          <span className="ticket-detail-value ticket-amount">
            {(booking?.amount || 0).toLocaleString()}원
          </span>
        </div>
      </div>

      {/* ── Perforated divider ── */}
      <div className="ticket-perforation">
        <div className="ticket-perforation-circle ticket-perforation-circle--left" />
        <div className="ticket-perforation-line" />
        <div className="ticket-perforation-circle ticket-perforation-circle--right" />
      </div>

      {/* ── QR Code ── */}
      <div className="ticket-qr-section">
        <p className="ticket-qr-label">현장에서 QR 코드를 스캔해 주세요</p>
        <div className="ticket-qr-wrapper">
          {!qrReady && <div className="ticket-qr-skeleton" />}
          <canvas
            ref={canvasRef}
            className="ticket-qr-canvas"
            style={{ opacity: qrReady ? 1 : 0 }}
          />
        </div>

        {/* ── Barcode ── */}
        <div className="ticket-barcode">
          <BarcodeStripes value={ref} />
          <p className="ticket-barcode-num">{ref}</p>
        </div>

        <p className="ticket-scan-hint">
          ✓ 결제 완료 · 코트 입장 10분 전 스캔
        </p>
      </div>
    </div>
  )
}
