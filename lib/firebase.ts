import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD6O383IvIadN7uLUE1o6c9WXPHm1mPLNo",
  authDomain: "fir-playground-2f3b7.firebaseapp.com",
  projectId: "fir-playground-2f3b7",
  storageBucket: "fir-playground-2f3b7.appspot.com", 
  messagingSenderId: "254462113909",
  appId: "1:254462113909:web:ccd39c86760b93e35c203c",
  measurementId: "G-EMRK26TEV4"
}


let app: any
let auth: any
let db: any

export function initializeFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  }
  return { app, auth, db }
}

export function getFirebaseAuth() {
  if (!auth) initializeFirebase()
  return auth
}

export function getFirebaseDb() {
  if (!db) initializeFirebase()
  return db
}

export { app, auth, db }
