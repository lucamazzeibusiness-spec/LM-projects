import type { Lernstand } from '../context/LernstandContext'
import { lernkarten, type Lernkarte, type Themenbereich } from '../data/mock'

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

function zahlAus(text: string): number {
  let h = 0
  for (const zeichen of text) h = (h * 31 + zeichen.charCodeAt(0)) >>> 0
  return h
}

// Karte des Tages: bevorzugt eine schwache Karte, sonst eine noch nie geübte, sonst irgendeine –
// innerhalb der Gruppe fest pro Datum, damit am selben Tag dieselbe Karte kommt.
export function karteDesTagesWaehlen(datumISO: string, lernstand: Lernstand): Lernkarte {
  const schwach = lernkarten.filter((k) => lernstand[k.id]?.letztesErgebnis === 'falsch')
  const neu = lernkarten.filter((k) => !lernstand[k.id])
  const pool = schwach.length > 0 ? schwach : neu.length > 0 ? neu : lernkarten
  return pool[zahlAus(datumISO) % pool.length]
}
