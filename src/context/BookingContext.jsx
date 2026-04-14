// TODO: [Firebase] Replace mock data with Firestore collection query
// TODO: [Backend API] POST /api/bookings

import { createContext, useContext, useState, useEffect } from 'react'
import { mockBookings, generateBookingRef } from '../data/bookings'
import { useAuth } from './AuthContext'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`pikko_bookings_${user.id}`)
      if (stored) {
        try {
          setBookings(JSON.parse(stored))
        } catch {
          setBookings(mockBookings.filter(b => b.userId === user.id))
        }
      } else {
        setBookings(mockBookings.filter(b => b.userId === user.id))
      }
    } else {
      setBookings([])
    }
  }, [user])

  const saveBookings = (updated) => {
    if (user) {
      localStorage.setItem(`pikko_bookings_${user.id}`, JSON.stringify(updated))
    }
    setBookings(updated)
  }

  const createBooking = (bookingData) => {
    const newBooking = {
      id: 'b_' + Date.now(),
      userId: user?.id,
      ...bookingData,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      createdAt: new Date().toISOString(),
      ref: generateBookingRef()
    }
    const updated = [newBooking, ...bookings]
    saveBookings(updated)
    return newBooking
  }

  const cancelBooking = (bookingId) => {
    const updated = bookings.map(b =>
      b.id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b
    )
    saveBookings(updated)
  }

  const getUpcomingBookings = () => {
    const today = new Date().toISOString().split('T')[0]
    return bookings.filter(b =>
      b.date >= today && b.bookingStatus !== 'cancelled'
    ).sort((a, b) => a.date.localeCompare(b.date))
  }

  const getPastBookings = () => {
    const today = new Date().toISOString().split('T')[0]
    return bookings.filter(b =>
      b.date < today || b.bookingStatus === 'cancelled'
    ).sort((a, b) => b.date.localeCompare(a.date))
  }

  return (
    <BookingContext.Provider value={{
      bookings,
      createBooking,
      cancelBooking,
      getUpcomingBookings,
      getPastBookings
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
