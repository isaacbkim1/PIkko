/**
 * Pikko API Server — Express backend for KakaoPay integration
 *
 * KakaoPay API: kapi.kakao.com/v1/payment (old stable endpoint, uses Admin Key)
 *
 * Endpoints:
 *   POST /api/kakaopay/ready    — initiate payment, get redirect URL
 *   GET  /api/kakaopay/success  — Kakao redirects here after user approves
 *   GET  /api/kakaopay/cancel   — Kakao redirects here on cancel
 *   GET  /api/kakaopay/fail     — Kakao redirects here on failure
 *   GET  /api/health            — health check
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app  = express()
const PORT = process.env.PORT || 3001

// KakaoPay v1 API requires Admin Key with "KakaoAK" scheme
const KAKAOPAY_AUTH    = `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`
const KAKAOPAY_CID     = process.env.KAKAOPAY_CID  || 'TC0ONETIME'
const APP_DOMAIN       = process.env.APP_DOMAIN     || 'https://wjetwtwj.gensparkclaw.com'
const KAKAOPAY_API     = 'https://kapi.kakao.com/v1/payment'

// In-memory TID store: orderId → { tid, amount, itemName, userId }
// TODO: [Production] Replace with Redis or database store
const tidStore = new Map()

app.use(cors({ origin: APP_DOMAIN }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Health ────────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'pikko-api', ts: new Date().toISOString() })
})

// ── KakaoPay /ready ───────────────────────────────────────────────────────────
// Frontend calls this → gets redirect URLs → user sent to Kakao payment page.

app.post('/api/kakaopay/ready', async (req, res) => {
  const { orderId, userId, itemName, amount } = req.body

  if (!orderId || !userId || !itemName || !amount) {
    return res.status(400).json({
      error: 'Missing required fields: orderId, userId, itemName, amount',
    })
  }

  const params = new URLSearchParams({
    cid:              KAKAOPAY_CID,
    partner_order_id: orderId,
    partner_user_id:  userId,
    item_name:        itemName,
    quantity:         '1',
    total_amount:     String(amount),
    vat_amount:       String(Math.round(amount / 11)),
    tax_free_amount:  '0',
    approval_url: `${APP_DOMAIN}/api/kakaopay/success?orderId=${encodeURIComponent(orderId)}`,
    cancel_url:   `${APP_DOMAIN}/api/kakaopay/cancel?orderId=${encodeURIComponent(orderId)}`,
    fail_url:     `${APP_DOMAIN}/api/kakaopay/fail?orderId=${encodeURIComponent(orderId)}`,
  })

  try {
    const response = await fetch(`${KAKAOPAY_API}/ready`, {
      method:  'POST',
      headers: {
        Authorization:  KAKAOPAY_AUTH,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: params.toString(),
    })

    const data = await response.json()

    if (!response.ok || data.code < 0) {
      console.error('[KakaoPay /ready] error:', data)
      return res.status(response.ok ? 400 : response.status).json({
        error:  data.msg || 'KakaoPay ready failed',
        detail: data,
      })
    }

    // Persist TID for approve step
    tidStore.set(orderId, { tid: data.tid, amount, itemName, userId })
    console.log(`[KakaoPay] ready OK — orderId=${orderId} tid=${data.tid}`)

    res.json({
      tid:                      data.tid,
      next_redirect_mobile_url: data.next_redirect_mobile_url,
      next_redirect_pc_url:     data.next_redirect_pc_url,
      created_at:               data.created_at,
    })
  } catch (err) {
    console.error('[KakaoPay /ready] error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ── KakaoPay /success — Kakao redirects here after user approves ──────────────

app.get('/api/kakaopay/success', async (req, res) => {
  const { orderId, pg_token } = req.query

  if (!orderId || !pg_token) {
    return res.redirect(`${APP_DOMAIN}/booking-error?reason=missing_params`)
  }

  const stored = tidStore.get(orderId)
  if (!stored) {
    return res.redirect(`${APP_DOMAIN}/booking-error?reason=session_expired`)
  }

  const params = new URLSearchParams({
    cid:              KAKAOPAY_CID,
    tid:              stored.tid,
    partner_order_id: orderId,
    partner_user_id:  stored.userId,
    pg_token,
  })

  try {
    const response = await fetch(`${KAKAOPAY_API}/approve`, {
      method:  'POST',
      headers: {
        Authorization:  KAKAOPAY_AUTH,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: params.toString(),
    })

    const data = await response.json()

    if (!response.ok || data.code < 0) {
      console.error('[KakaoPay /approve] error:', data)
      return res.redirect(
        `${APP_DOMAIN}/booking-error?reason=approve_failed&msg=${encodeURIComponent(data.msg || '')}`
      )
    }

    tidStore.delete(orderId)
    console.log(`[KakaoPay] approve OK — orderId=${orderId} method=${data.payment_method_type}`)

    // Redirect to SPA with payment metadata as query params
    const confirmParams = new URLSearchParams({
      orderId,
      tid:    stored.tid,
      method: data.payment_method_type || 'MONEY',
      amount: stored.amount,
    })
    res.redirect(`${APP_DOMAIN}/booking-confirm?${confirmParams}`)

  } catch (err) {
    console.error('[KakaoPay /approve] error:', err)
    res.redirect(`${APP_DOMAIN}/booking-error?reason=server_error`)
  }
})

// ── Cancel & Fail ─────────────────────────────────────────────────────────────

app.get('/api/kakaopay/cancel', (req, res) => {
  tidStore.delete(req.query.orderId)
  res.redirect(`${APP_DOMAIN}/?payment=cancelled`)
})

app.get('/api/kakaopay/fail', (req, res) => {
  tidStore.delete(req.query.orderId)
  res.redirect(`${APP_DOMAIN}/?payment=failed`)
})

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, '127.0.0.1', () => {
  console.log(`[Pikko API] http://127.0.0.1:${PORT}`)
  console.log(`[KakaoPay]  CID=${KAKAOPAY_CID} | domain=${APP_DOMAIN}`)
})
