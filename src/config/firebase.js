import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDIgJAokmMwgmFNDhSJFDWhuzJftKv6FeE",
  authDomain: "leitecontrol-79f56.firebaseapp.com",
  projectId: "leitecontrol-79f56",
  storageBucket: "leitecontrol-79f56.appspot.com",
  messagingSenderId: "32758664763",
  appId: "1:32758664763:web:1b0422f5cd845e879d61e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export const db = getFirestore(app);

