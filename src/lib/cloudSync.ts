import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

// Alle App-Daten eines Nutzers liegen in einem einzigen Dokument users/{uid},
// ein Feld pro localStorage-Schlüssel. So bleibt die Cloud-Struktur 1:1 zu dem,
// was ohnehin schon lokal gespeichert wird.

export function cloudSchreiben(schluessel: string, wert: unknown): void {
  const uid = auth.currentUser?.uid
  if (!uid) return
  setDoc(doc(db, 'users', uid), { [schluessel]: wert }, { merge: true }).catch(() => {
    // Bestbemüht: lokale Daten bleiben die verlässliche Quelle auf diesem Gerät.
  })
}

export async function cloudAllesLesen(uid: string): Promise<Record<string, unknown> | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? snap.data() : null
  } catch {
    return null
  }
}
