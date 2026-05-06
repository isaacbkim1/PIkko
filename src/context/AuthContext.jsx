import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, loginWithEmail, signupWithEmail, logout, getUserProfile } from '../firebase/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const p = await getUserProfile(firebaseUser.uid);
          setProfile(p);
        } catch { setProfile(null); }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    await loginWithEmail(email, password);
  };

  const signup = async (email, password, name) => {
    await signupWithEmail(email, password, name);
  };

  const signOut = async () => {
    await logout();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    isLoggedIn:  !!user,
    userName:    profile?.name || user?.displayName || user?.email?.split('@')[0] || '사용자',
    userEmail:   user?.email || '',
    userId:      user?.uid || '',
    isAdmin:     profile?.role === 'admin',
    login,
    signup,
    logout: signOut,
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#1A1A2E', flexDirection: 'column', gap: 16,
      }}>
        <div style={{
          width: 56, height: 56, background: '#FF6B35', borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, color: '#fff',
        }}>P</div>
        <div style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>Pikko</div>
        <div style={{
          width: 32, height: 32, border: '3px solid rgba(255,107,53,0.3)',
          borderTopColor: '#FF6B35', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
