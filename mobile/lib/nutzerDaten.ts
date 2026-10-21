import AsyncStorage from '@react-native-async-storage/async-storage'
import { ladeGespeichert, speichere } from './storage'

// Persönliche App-Daten (samt __t-Zeitstempeln). Geräte-Einstellungen wie das Farbschema, der
// Foto-Cache der Fahrzeuge und die Firebase-Anmeldedaten bleiben erhalten.
const PERSOENLICHE_PRAEFIXE = [
  'azubi:',
  'berichtsheft:',
  'ausbildungsplan:',
  'lernaufgabe:',
  'punkte:',
  'zuordnen:',
  'lernkarten:',
  'karteDesTages',
  'erinnerung:',
]
const NUTZER_KEY = 'app:nutzer'

// Meldet sich auf diesem Gerät jemand anderes an als zuletzt, werden die lokal gespeicherten
// Daten der vorigen Person entfernt – sonst sähe die neue Person sie und die App würde sie sogar
// in deren Cloud-Konto hochladen. Dieselbe Person behält ihre (evtl. noch nicht synchronisierten)
// lokalen Daten.
export async function lokaleDatenNutzerZuordnen(uid: string) {
  try {
    const bisher = await ladeGespeichert<string | null>(NUTZER_KEY, null)
    if (bisher && bisher !== uid) {
      const alle = await AsyncStorage.getAllKeys()
      const zuLoeschen = alle.filter((schluessel) => PERSOENLICHE_PRAEFIXE.some((p) => schluessel.startsWith(p)))
      if (zuLoeschen.length > 0) await AsyncStorage.removeMany(zuLoeschen)
    }
    await speichere(NUTZER_KEY, uid)
  } catch {
    // Speicher nicht verfügbar – dann gibt es auch keine fremden lokalen Daten.
  }
}
