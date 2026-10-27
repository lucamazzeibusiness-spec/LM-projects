import type { BerichtsheftEintrag } from '../data/mock'
import { hatEchtenInhalt } from './stichpunkte'
import { wochenSchluessel } from './wochen'

// Eine Woche gilt als unterschrieben, wenn der Ausbilder den Ausbildungsnachweis abgezeichnet hat
// (auf Papier oder per E-Mail). Intern heißt der Status "Freigegeben".
export type WochenStatus = 'leer' | 'Entwurf' | 'Eingereicht' | 'Unterschrieben'

export function wochenStatus(wocheEintraege: BerichtsheftEintrag[]): WochenStatus {
  const mitInhalt = wocheEintraege.filter((e) => hatEchtenInhalt(e.taetigkeiten))
  if (mitInhalt.length === 0) return 'leer'
  if (mitInhalt.some((e) => e.status === 'Entwurf')) return 'Entwurf'
  if (mitInhalt.every((e) => e.status === 'Freigegeben')) return 'Unterschrieben'
  return 'Eingereicht'
}

// Zählt alle Wochen mit Einträgen und wie viele davon schon unterschrieben sind.
export function unterschriebeneWochen(eintraege: BerichtsheftEintrag[]): { unterschrieben: number; gesamt: number } {
  const wochen = new Map<string, BerichtsheftEintrag[]>()
  for (const e of eintraege) {
    const w = wochenSchluessel(e.datumISO)
    wochen.set(w, [...(wochen.get(w) ?? []), e])
  }
  let unterschrieben = 0
  let gesamt = 0
  for (const liste of wochen.values()) {
    const status = wochenStatus(liste)
    if (status === 'leer') continue
    gesamt++
    if (status === 'Unterschrieben') unterschrieben++
  }
  return { unterschrieben, gesamt }
}
