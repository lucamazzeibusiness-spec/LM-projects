// Persönliche App-Daten (samt __t-Zeitstempeln). Geräte-Einstellungen wie das Farbschema und der
// Foto-Cache der Fahrzeuge sind nicht personenbezogen und bleiben erhalten.
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
export function lokaleDatenNutzerZuordnen(uid: string) {
  try {
    const bisher = localStorage.getItem(NUTZER_KEY)
    if (bisher && bisher !== uid) {
      const zuLoeschen: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const schluessel = localStorage.key(i)
        if (schluessel && PERSOENLICHE_PRAEFIXE.some((p) => schluessel.startsWith(p))) zuLoeschen.push(schluessel)
      }
      zuLoeschen.forEach((schluessel) => localStorage.removeItem(schluessel))
    }
    localStorage.setItem(NUTZER_KEY, uid)
  } catch {
    // localStorage blockiert – dann gibt es auch keine fremden lokalen Daten.
  }
}
