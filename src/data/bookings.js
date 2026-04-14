// TODO: [Firebase] Replace mock data with Firestore collection query
// TODO: [Backend API] POST /api/bookings

export const mockBookings = [
  {
    id: 'b1',
    userId: 'u1',
    facilityId: 'f1',
    facilityName: '강남 피클볼 아레나',
    facilityDistrict: '강남구',
    date: '2026-04-20',
    time: '10:00',
    players: 4,
    amount: 25000,
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    createdAt: '2026-04-14T09:00:00Z'
  },
  {
    id: 'b2',
    userId: 'u1',
    facilityId: 'f3',
    facilityName: '송파 올림픽 피클볼장',
    facilityDistrict: '송파구',
    date: '2026-04-22',
    time: '14:00',
    players: 2,
    amount: 22000,
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    createdAt: '2026-04-13T15:30:00Z'
  },
  {
    id: 'b3',
    userId: 'u1',
    facilityId: 'f2',
    facilityName: '마포 스포츠센터 피클볼',
    facilityDistrict: '마포구',
    date: '2026-03-15',
    time: '09:00',
    players: 4,
    amount: 20000,
    paymentStatus: 'paid',
    bookingStatus: 'completed',
    createdAt: '2026-03-10T11:00:00Z'
  },
  {
    id: 'b4',
    userId: 'u1',
    facilityId: 'f4',
    facilityName: '서초 한강 피클볼 클럽',
    facilityDistrict: '서초구',
    date: '2026-03-05',
    time: '16:00',
    players: 2,
    amount: 28000,
    paymentStatus: 'paid',
    bookingStatus: 'completed',
    createdAt: '2026-03-01T08:00:00Z'
  },
  {
    id: 'b5',
    userId: 'u1',
    facilityId: 'f5',
    facilityName: '용산 e스포츠 & 피클볼',
    facilityDistrict: '용산구',
    date: '2026-02-20',
    time: '19:00',
    players: 4,
    amount: 23000,
    paymentStatus: 'paid',
    bookingStatus: 'completed',
    createdAt: '2026-02-15T12:00:00Z'
  },
  {
    id: 'b6',
    userId: 'u1',
    facilityId: 'f1',
    facilityName: '강남 피클볼 아레나',
    facilityDistrict: '강남구',
    date: '2026-02-10',
    time: '11:00',
    players: 2,
    amount: 25000,
    paymentStatus: 'paid',
    bookingStatus: 'cancelled',
    createdAt: '2026-02-05T10:00:00Z'
  }
]

export const generateBookingRef = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let ref = 'PK'
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return ref
}
