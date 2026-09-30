import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { auth } from '../lib/firebase'
import { cloudAllesLesen } from '../lib/cloudSync'

// Überschreibt lokale Daten nur, wenn die Cloud-Version nachweislich neuer ist (per
// schluessel__t-Zeitstempel, geschrieben von cloudSchreiben) – sonst würde ein noch nicht
// abgeschlossener Cloud-Schreibvorgang aus einer vorigen Sitzung frisch gespeicherte lokale
// Daten beim nächsten Login wieder löschen. Ohne lokalen Wert (neues Gerät) wird immer
// übernommen, auch ohne Zeitstempel.
async function cloudInLocalHydrieren(uid: string) {
  const daten = await cloudAllesLesen(uid)
  if (!daten) return
  const datenSchluessel = Object.keys(daten).filter((k) => !k.endsWith('__t'))
  for (const schluessel of datenSchluessel) {
    const wert = daten[schluessel]
    if (wert === undefined) continue

    const cloudZeitRoh = daten[`${schluessel}__t`]
    const cloudZeit = typeof cloudZeitRoh === 'number' ? cloudZeitRoh : 0

    if (localStorage.getItem(schluessel) !== null) {
      const lokaleZeit = Number(localStorage.getItem(`${schluessel}__t`) ?? 0)
      if (cloudZeit <= lokaleZeit) continue
    }

    try {
      localStorage.setItem(schluessel, JSON.stringify(wert))
      localStorage.setItem(`${schluessel}__t`, String(cloudZeit))
    } catch {
      // localStorage evtl. voll oder blockiert – lokale Defaults bleiben bestehen.
    }
  }
}

interface AuthContextValue {
  user: User | null
  bereit: boolean
  registrieren: (name: string, email: string, passwort: string) => Promise<void>
  anmelden: (email: string, passwort: string) => Promise<void>
  abmelden: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [bereit, setBereit] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        await cloudInLocalHydrieren(u.uid)
      }
      setUser(u)
      setBereit(true)
    })
    return unsub
  }, [])

  const registrieren = async (name: string, email: string, passwort: string) => {
    const { user: neuerUser } = await createUserWithEmailAndPassword(auth, email, passwort)
    if (name.trim()) await updateProfile(neuerUser, { displayName: name.trim() })
  }

  const anmelden = async (email: string, passwort: string) => {
    await signInWithEmailAndPassword(auth, email, passwort)
  }

  const abmelden = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, bereit, registrieren, anmelden, abmelden }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth muss innerhalb von <AuthProvider> verwendet werden')
  return ctx
}
