import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAf8Yt3eZnwwnka8DgY5-odzMuGiZiKW8c",
  authDomain: "hoophoop-e1422.firebaseapp.com",
  projectId: "hoophoop-e1422",
  storageBucket: "hoophoop-e1422.firebasestorage.app",
  messagingSenderId: "1006543231381",
  appId: "1:1006543231381:web:3b6a0d9fad120878387e9c",
  measurementId: "G-N1B3QP4YRG",
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

// Initialize Firebase services
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

export { app, db, storage, auth }
