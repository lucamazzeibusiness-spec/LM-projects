import * as Notifications from 'expo-notifications'
import { ladeGespeichert, speichere } from './storage'

const AKTIV_KEY = 'erinnerung:aktiv'
const LETZTE_KEY = 'erinnerung:letzteAnzeige'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export async function erinnerungIstAktiv(): Promise<boolean> {
  const aktiv = await ladeGespeichert<boolean>(AKTIV_KEY, false)
  if (!aktiv) return false
  const { status } = await Notifications.getPermissionsAsync()
  return status === 'granted'
}

export async function erinnerungAktivieren(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync()
  if (status === 'granted') {
    await speichere(AKTIV_KEY, true)
    return true
  }
  return false
}

export async function erinnerungDeaktivieren(): Promise<void> {
  await speichere(AKTIV_KEY, false)
}

// Zeigt höchstens einmal pro Tag eine lokale Benachrichtigung (kein Server-Push,
// da diese App ohne Backend läuft – funktioniert nur solange die App installiert ist).
export async function heuteErinnern(nachricht: string): Promise<void> {
  if (!(await erinnerungIstAktiv())) return
  const heute = new Date().toDateString()
  const letzte = await ladeGespeichert<string | null>(LETZTE_KEY, null)
  if (letzte === heute) return
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'DB Azubi', body: nachricht },
      trigger: null,
    })
    await speichere(LETZTE_KEY, heute)
  } catch {
    // Erinnerungen sind ein Best-Effort-Feature, ein Fehlschlag hier ist unkritisch.
  }
}
