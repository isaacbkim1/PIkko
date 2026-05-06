import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config — hardcoded for reliability
// TODO: move back to env vars when Vercel env injection is confirmed working
const firebaseConfig = {
  apiKey:            'AIzaSyDYN2TtRinA_435MdH9IhU0HUEhB85mtn0',
  authDomain:        'pikko-app.firebaseapp.com',
  projectId:         'pikko-app',
  storageBucket:     'pikko-app.firebasestorage.app',
  messagingSenderId: '256520655407',
  appId:             '1:256520655407:web:42a747529e513bb0996cda',
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
