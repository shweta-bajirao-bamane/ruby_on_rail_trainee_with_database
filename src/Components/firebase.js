import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKEG2sbgEgfEj9DAxoqowM86NWMPLMJek",
  authDomain: "store-app-1226a.firebaseapp.com",
  projectId: "store-app-1226a",
  storageBucket: "store-app-1226a.firebasestorage.app",
  messagingSenderId: "1031806134734",
  appId: "1:1031806134734:web:6b099087f4d7c33dc5239f",
  measurementId: "G-CRSZRDFCGW"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
