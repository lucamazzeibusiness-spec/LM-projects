import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { cloudSchreiben } from '../lib/cloudSync'
import { ladeGespeichert, speichere } from '../lib/storage'

export type Bestzeiten = Record<string, number>

const STORAGE_KEY = 'zuordnen:bestzeiten'
const leereBestzeiten: Bestzeiten = {}

interface ZuordnenContextValue {
  bestzeiten: Bestzeiten
  bestFuer: (schluessel: string) => number | null
  bestSetzenWennBesser: (schluessel: string, sekunden: number) => boolean
}

const ZuordnenContext = createContext<ZuordnenContextValue | null>(null)

export function ZuordnenProvider({ children }: { children: ReactNode }) {
  const [bestzeiten, setBestzeiten] = useState<Bestzeiten>(leereBestzeiten)
  const [geladen, setGeladen] = useState(false)

  useEffect(() => {
    ladeGespeichert<Bestzeiten>(STORAGE_KEY, leereBestzeiten).then((b) => {
      setBestzeiten(b)
      setGeladen(true)
    })
  }, [])

  useEffect(() => {
    if (geladen) {
      speichere(STORAGE_KEY, bestzeiten)
      cloudSchreiben(STORAGE_KEY, bestzeiten)
    }
  }, [bestzeiten, geladen])

  const bestFuer = (schluessel: string) => bestzeiten[schluessel] ?? null

  const bestSetzenWennBesser = (schluessel: string, sekunden: number) => {
    let verbessert = false
    setBestzeiten((b) => {
      const bisher = b[schluessel]
      if (bisher !== undefined && bisher <= sekunden) return b
      verbessert = true
      return { ...b, [schluessel]: sekunden }
    })
    return verbessert
  }

  return (
    <ZuordnenContext.Provider value={{ bestzeiten, bestFuer, bestSetzenWennBesser }}>{children}</ZuordnenContext.Provider>
  )
}

export function useZuordnenBestzeiten() {
  const ctx = useContext(ZuordnenContext)
  if (!ctx) throw new Error('useZuordnenBestzeiten muss innerhalb von <ZuordnenProvider> verwendet werden')
  return ctx
}
