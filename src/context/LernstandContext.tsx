import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { cloudSchreiben } from '../lib/cloudSync'

// Pro Lernkarte wird gemerkt, wie der letzte Versuch ausging. "Schwach" ist eine Karte, deren
// letzter Versuch falsch war (Karteikarten: "Nochmal üben", Lernen: falsche Antwort) – sobald
// sie einmal richtig beantwortet wird, fällt sie wieder aus dem Schwächen-Stapel heraus.
export interface KartenStand {
  richtig: number
  falsch: number
  letztesErgebnis: 'richtig' | 'falsch'
  zuletzt: string
}

export type Lernstand = Record<string, KartenStand>

const STORAGE_KEY = 'lernkarten:lernstand'

function geladenerLernstand(): Lernstand {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

interface LernstandContextValue {
  lernstand: Lernstand
  istSchwach: (id: string) => boolean
  ergebnisMerken: (id: string, richtig: boolean) => void
}

const LernstandContext = createContext<LernstandContextValue | null>(null)

export function LernstandProvider({ children }: { children: ReactNode }) {
  const [lernstand, setLernstand] = useState<Lernstand>(geladenerLernstand)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lernstand))
    cloudSchreiben(STORAGE_KEY, lernstand)
  }, [lernstand])

  const istSchwach = (id: string) => lernstand[id]?.letztesErgebnis === 'falsch'

  const ergebnisMerken = (id: string, richtig: boolean) => {
    setLernstand((l) => {
      const bisher = l[id] ?? { richtig: 0, falsch: 0 }
      return {
        ...l,
        [id]: {
          richtig: bisher.richtig + (richtig ? 1 : 0),
          falsch: bisher.falsch + (richtig ? 0 : 1),
          letztesErgebnis: richtig ? 'richtig' : 'falsch',
          zuletzt: new Date().toISOString(),
        },
      }
    })
  }

  return (
    <LernstandContext.Provider value={{ lernstand, istSchwach, ergebnisMerken }}>{children}</LernstandContext.Provider>
  )
}

export function useLernstand() {
  const ctx = useContext(LernstandContext)
  if (!ctx) throw new Error('useLernstand muss innerhalb von <LernstandProvider> verwendet werden')
  return ctx
}
