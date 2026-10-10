import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { cloudSchreiben } from '../lib/cloudSync'
import { ladeGespeichert, speichere } from '../lib/storage'

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
const leererLernstand: Lernstand = {}

interface LernstandContextValue {
  lernstand: Lernstand
  istSchwach: (id: string) => boolean
  ergebnisMerken: (id: string, richtig: boolean) => void
}

const LernstandContext = createContext<LernstandContextValue | null>(null)

export function LernstandProvider({ children }: { children: ReactNode }) {
  const [lernstand, setLernstand] = useState<Lernstand>(leererLernstand)
  const [geladen, setGeladen] = useState(false)

  useEffect(() => {
    ladeGespeichert<Lernstand>(STORAGE_KEY, leererLernstand).then((l) => {
      setLernstand(l)
      setGeladen(true)
    })
  }, [])

  useEffect(() => {
    if (geladen) {
      speichere(STORAGE_KEY, lernstand)
      cloudSchreiben(STORAGE_KEY, lernstand)
    }
  }, [lernstand, geladen])

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
