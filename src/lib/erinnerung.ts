const AKTIV_KEY = 'erinnerung:aktiv'
const LETZTE_KEY = 'erinnerung:letzteAnzeige'

export function erinnerungWirdUnterstuetzt(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function erinnerungIstAktiv(): boolean {
  return erinnerungWirdUnterstuetzt() && localStorage.getItem(AKTIV_KEY) === '1' && Notification.permission === 'granted'
}

export async function erinnerungAktivieren(): Promise<boolean> {
  if (!erinnerungWirdUnterstuetzt()) return false
  const ergebnis = await Notification.requestPermission()
  if (ergebnis === 'granted') {
    localStorage.setItem(AKTIV_KEY, '1')
    return true
  }
  return false
}

export function erinnerungDeaktivieren() {
  localStorage.removeItem(AKTIV_KEY)
}

// Zeigt höchstens einmal pro Tag eine lokale Browser-Benachrichtigung.
// Funktioniert nur, solange die App im Browser offen/geöffnet wird – kein echter
// Server-Push, da diese App ohne Backend läuft.
export function heuteErinnern(nachricht: string) {
  if (!erinnerungIstAktiv()) return
  const heute = new Date().toDateString()
  if (localStorage.getItem(LETZTE_KEY) === heute) return
  try {
    new Notification('DB Azubi', { body: nachricht })
    localStorage.setItem(LETZTE_KEY, heute)
  } catch {
    // Manche Browser/Kontexte (z. B. Vorschau-Sandbox) erlauben new Notification() nicht.
  }
}
