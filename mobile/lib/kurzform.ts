// Zuordnen (Zuordnungsspiel) und Lernen (Multiple Choice) brauchen kurze, überschaubare Texte –
// manche Prüfungsfragen sind aber selbst mehrteilige Auswahlfragen mit eingebetteten
// Antwortoptionen (bis zu mehreren hundert Zeichen), die als Kärtchen/Option unlesbar lang wären.
// Für diese beiden Modi werden solche Einträge deshalb aus dem Kartenpool ausgefiltert; in den
// Karteikarten (volle Breite, keine Layout-Zwänge) bleiben sie unverändert erhalten.
const MAX_FRAGE_LAENGE = 150
const MAX_ANTWORT_LAENGE = 250

export function eignetSichFuerKurzform(frage: string, antwort: string): boolean {
  return frage.length <= MAX_FRAGE_LAENGE && antwort.length <= MAX_ANTWORT_LAENGE
}
