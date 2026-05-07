import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, loginWithEmail, signupWithEmail, logout, getUserProfile } from '../firebase/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout — never stay on loading screen forever
    const timeout = setTimeout(() => setLoading(false), 5000);

    const unsub = onAuthChange(async (firebaseUser) => {
      clearTimeout(timeout);
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const p = await getUserProfile(firebaseUser.uid);
          setProfile(p);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => { unsub(); clearTimeout(timeout); };
  }, []);

  const login = async (email, password) => {
    const cred = await loginWithEmail(email, password);
    return cred;
  };

  const signup = async (email, password, name) => {
    await signupWithEmail(email, password, name);
  };

  const signOut = async () => {
    await logout();
    setUser(null);
    setProfile(null);
  };

  // Kakao OAuth login
  const loginWithKakao = () => {
    return new Promise((resolve, reject) => {
      if (!window.Kakao || !window.Kakao.isInitialized()) {
        reject(new Error('Kakao SDK not loaded'));
        return;
      }
      window.Kakao.Auth.login({
        success: async (authObj) => {
          try {
            // Get Kakao user info
            window.Kakao.API.request({
              url: '/v2/user/me',
              success: async (res) => {
                const kakaoId    = res.id;
                const kakaoEmail = res.kakao_account?.email || `kakao_${kakaoId}@pikko.kr`;
                const kakaoName  = res.kakao_account?.profile?.nickname || '카카오 사용자';

                // TODO: [KakaoPay/Production] Use Firebase custom token from backend
                // For now, sign in with derived email + kakaoId as password
                try {
                  const cred = await loginWithEmail(kakaoEmail, `kakao_${kakaoId}`);
                  resolve(cred);
                } catch {
                  // First time — create account
                  try {
                    await signupWithEmail(kakaoEmail, `kakao_${kakaoId}`, kakaoName);
                    resolve(true);
                  } catch (e) {
                    reject(e);
                  }
                }
              },
              fail: reject,
            });
          } catch (e) {
            reject(e);
          }
        },
        fail: reject,
      });
    });
  };

  const value = {
    user,
    profile,
    loading,
    isLoggedIn:  !!user,
    userName:    profile?.name || user?.displayName || user?.email?.split('@')[0] || '사용자',
    userEmail:   user?.email || '',
    userId:      user?.uid   || '',
    isAdmin:     profile?.role === 'admin',
    login,
    signup,
    loginWithKakao,
    logout: signOut,
  };

  if (loading) {
    return (
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'center',
        height:'100vh', background:'#1A1A2E', flexDirection:'column', gap:16,
      }}>
        <div style={{
          width:56, height:56, background:'#FF6B35', borderRadius:14,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:28, fontWeight:800, color:'#fff',
        }}>P</div>
        <div style={{ color:'#fff', fontSize:24, fontWeight:800 }}>Pikko</div>
        <div style={{
          width:32, height:32,
          border:'3px solid rgba(255,107,53,0.3)', borderTopColor:'#FF6B35',
          borderRadius:'50%', animation:'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
