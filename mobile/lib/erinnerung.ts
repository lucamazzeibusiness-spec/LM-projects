import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { ladeGespeichert, speichere } from './storage'

const AKTIV_KEY = 'erinnerung:aktiv'
const KANAL = 'berichtsheft-erinnerung'
// Uhrzeit der Erinnerung – nach Feierabend, solange der Tag noch frisch im Kopf ist.
const STUNDE = 16
const MINUTE = 30

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
  await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {})
}

// Plant die Erinnerungen neu: an jedem übergebenen Tag (Ausbildungstage ohne Eintrag) um 16:30.
// Es sind lokale Benachrichtigungen (kein Server-Push, die App läuft ohne Backend) – sie kommen
// auch bei geschlossener App. Wird ein Eintrag gespeichert, plant die Startseite ohne diesen Tag neu.
// Läuft nacheinander ab: Zwei gleichzeitige Durchläufe könnten sich sonst überholen und
// Erinnerungen doppelt einplanen.
let warteschlange: Promise<void> = Promise.resolve()

export function erinnerungenPlanen(tageOhneEintrag: string[]): Promise<void> {
  warteschlange = warteschlange.then(() => neuPlanen(tageOhneEintrag))
  return warteschlange
}

async function neuPlanen(tageOhneEintrag: string[]): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync()
    if (!(await erinnerungIstAktiv())) return
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(KANAL, {
        name: 'Berichtsheft-Erinnerung',
        importance: Notifications.AndroidImportance.DEFAULT,
      })
    }
    const jetzt = Date.now()
    for (const datumISO of tageOhneEintrag) {
      const zeitpunkt = new Date(`${datumISO}T00:00:00`)
      zeitpunkt.setHours(STUNDE, MINUTE, 0, 0)
      if (zeitpunkt.getTime() <= jetzt) continue
      await Notifications.scheduleNotificationAsync({
        content: { title: 'DB Azubi', body: 'Dein Berichtsheft-Eintrag für heute fehlt noch.' },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: zeitpunkt, channelId: KANAL },
      })
    }
  } catch {
    // Erinnerungen sind ein Best-Effort-Feature, ein Fehlschlag hier ist unkritisch.
  }
}
