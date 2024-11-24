
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDmgA2XUqDERTPlq7xeHUTEkYW-Bpba0T0",
  authDomain: "hospital-app-dev.firebaseapp.com",
  projectId: "hospital-app-dev",
  storageBucket: "hospital-app-dev.appspot.com",
  messagingSenderId: "71407410723",
  appId: "1:71407410723:web:9cde84ee5e1ad54e22db96",
  measurementId: "G-JD8C82V0EN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);