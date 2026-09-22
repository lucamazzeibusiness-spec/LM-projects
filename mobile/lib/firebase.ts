import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeApp } from 'firebase/app'
import { initializeAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// getReactNativePersistence existiert zur Laufzeit (Metro löst über die
// "react-native"-exports-Bedingung korrekt auf), ist aber in den Typings
// von firebase/auth für diese SDK-Version nicht deklariert.
// @ts-expect-error – siehe Kommentar oben
import { getReactNativePersistence } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAZhSMc3NZ3AGo9Um8WTpIwm0V7YrJ3PYc',
  authDomain: 'db-azubi-assistant.firebaseapp.com',
  projectId: 'db-azubi-assistant',
  storageBucket: 'db-azubi-assistant.firebasestorage.app',
  messagingSenderId: '970023080206',
  appId: '1:970023080206:web:4f55dfcf9cb16c3195c75f',
}

const app = initializeApp(firebaseConfig)

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})
export const db = getFirestore(app)
