import type { Lernstand } from '../context/LernstandContext'
import { lernkarten, type Themenbereich } from '../data/mock'

export interface ThemenFortschritt {
  thema: Themenbereich
  gesamt: number
  sicher: number
  schwach: number
}

// "Sicher" = letzter Versuch richtig, "schwach" = letzter Versuch falsch; der Rest wurde noch nie
// geübt. Reihenfolge der Themen wie in den Lernkarten-Daten.
export function fortschrittProThema(lernstand: Lernstand): ThemenFortschritt[] {
  const proThema = new Map<Themenbereich, ThemenFortschritt>()
  for (const karte of lernkarten) {
    const eintrag = proThema.get(karte.themenbereich) ?? { thema: karte.themenbereich, gesamt: 0, sicher: 0, schwach: 0 }
    eintrag.gesamt++
    const stand = lernstand[karte.id]
    if (stand?.letztesErgebnis === 'richtig') eintrag.sicher++
    else if (stand?.letztesErgebnis === 'falsch') eintrag.schwach++
    proThema.set(karte.themenbereich, eintrag)
  }
  return [...proThema.values()]
}
