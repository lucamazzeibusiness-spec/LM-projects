import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAZhSMc3NZ3AGo9Um8WTpIwm0V7YrJ3PYc',
  authDomain: 'db-azubi-assistant.firebaseapp.com',
  projectId: 'db-azubi-assistant',
  storageBucket: 'db-azubi-assistant.firebasestorage.app',
  messagingSenderId: '970023080206',
  appId: '1:970023080206:web:4f55dfcf9cb16c3195c75f',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
