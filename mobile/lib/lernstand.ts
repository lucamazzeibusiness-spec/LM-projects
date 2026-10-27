import type { Lernstand } from '../context/LernstandContext'
import { lernkarten, type Lernkarte, type Themenbereich } from '../data/mock'
import { eignetSichFuerKurzform } from './kurzform'

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

// Die Karte des Tages ist eine Multiple-Choice-Frage – dafür taugen nur Karten mit kurzen Texten.
export const karteDesTagesGeeignet = (k: Lernkarte) => eignetSichFuerKurzform(k.frage, k.antwort)
const tagesKarten = lernkarten.filter(karteDesTagesGeeignet)

// Karte des Tages: bevorzugt eine schwache Karte, sonst eine noch nie geübte, sonst irgendeine –
// innerhalb der Gruppe fest pro Datum, damit am selben Tag dieselbe Karte kommt.
export function karteDesTagesWaehlen(datumISO: string, lernstand: Lernstand): Lernkarte {
  const schwach = tagesKarten.filter((k) => lernstand[k.id]?.letztesErgebnis === 'falsch')
  const neu = tagesKarten.filter((k) => !lernstand[k.id])
  const pool = schwach.length > 0 ? schwach : neu.length > 0 ? neu : tagesKarten
  return pool[zahlAus(datumISO) % pool.length]
}

// Vier Antwortmöglichkeiten, fest pro Datum gemischt (sonst springen sie beim Neuladen herum).
// Falsche Optionen bevorzugt aus demselben Themenbereich, damit die richtige nicht am Thema auffällt.
export function antwortOptionen(karte: Lernkarte, datumISO: string): string[] {
  let zustand = zahlAus(`${datumISO}:${karte.id}`) || 1
  const zufall = () => {
    zustand = (zustand * 1664525 + 1013904223) >>> 0
    return zustand / 2 ** 32
  }
  const mischen = <T>(liste: T[]): T[] => {
    const kopie = [...liste]
    for (let i = kopie.length - 1; i > 0; i--) {
      const j = Math.floor(zufall() * (i + 1))
      ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
    }
    return kopie
  }
  const andere = tagesKarten.filter((k) => k.id !== karte.id && k.antwort !== karte.antwort)
  const gleichesThema = mischen(andere.filter((k) => k.themenbereich === karte.themenbereich))
  const rest = mischen(andere.filter((k) => k.themenbereich !== karte.themenbereich))
  const falsche = [...new Set([...gleichesThema, ...rest].map((k) => k.antwort))].slice(0, 3)
  return mischen([karte.antwort, ...falsche])
}
