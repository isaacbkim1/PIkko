// TODO: [Kakao Login] Replace mock auth with Kakao OAuth SDK
// TODO: [Firebase] Replace localStorage with Firestore user document

import { createContext, useContext, useState, useEffect } from 'react'

const demoUser = {
  id: 'u1',
  name: '김민준',
  email: 'demo@pikko.kr',
  password: 'demo1234',
  district: '강남구',
  role: 'admin',
  avatar: null,
  sports: ['pickleball'],
  bookingCount: 12,
  joinDate: '2025-09-01'
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('pikko_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('pikko_user')
      }
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    if (email === demoUser.email && password === demoUser.password) {
      const { password: _, ...userWithoutPassword } = demoUser
      setUser(userWithoutPassword)
      localStorage.setItem('pikko_user', JSON.stringify(userWithoutPassword))
      return { success: true }
    }
    return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
  }

  const signup = (name, email, password, district) => {
    const newUser = {
      id: 'u_' + Date.now(),
      name,
      email,
      district: district || '서울',
      role: 'user',
      avatar: null,
      sports: ['pickleball'],
      bookingCount: 0,
      joinDate: new Date().toISOString().split('T')[0]
    }
    setUser(newUser)
    localStorage.setItem('pikko_user', JSON.stringify(newUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('pikko_user')
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('pikko_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
