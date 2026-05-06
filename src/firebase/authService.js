import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signupWithEmail = async (email, password, name) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, 'users', cred.user.uid), {
    name, email, role: 'user', createdAt: serverTimestamp(),
  });
  return cred;
};

export const logout = () => signOut(auth);

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const onAuthChange = (cb) => onAuthStateChanged(auth, cb);

export const friendlyError = (code) => {
  const map = {
    'auth/user-not-found':       '등록되지 않은 이메일입니다',
    'auth/wrong-password':       '비밀번호가 올바르지 않습니다',
    'auth/invalid-credential':   '이메일 또는 비밀번호를 확인해주세요',
    'auth/email-already-in-use': '이미 사용 중인 이메일입니다',
    'auth/weak-password':        '비밀번호는 6자 이상이어야 합니다',
    'auth/invalid-email':        '올바른 이메일 형식이 아닙니다',
    'auth/too-many-requests':    '잠시 후 다시 시도해주세요',
  };
  return map[code] || '오류가 발생했습니다. 다시 시도해주세요';
};
