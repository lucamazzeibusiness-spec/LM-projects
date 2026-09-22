import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { cloudSchreiben } from '../lib/cloudSync'

export type Bestzeiten = Record<string, number>

const STORAGE_KEY = 'zuordnen:bestzeiten'

function geladeneBestzeiten(): Bestzeiten {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

interface ZuordnenContextValue {
  bestzeiten: Bestzeiten
  bestFuer: (schluessel: string) => number | null
  bestSetzenWennBesser: (schluessel: string, sekunden: number) => boolean
}

const ZuordnenContext = createContext<ZuordnenContextValue | null>(null)

export function ZuordnenProvider({ children }: { children: ReactNode }) {
  const [bestzeiten, setBestzeiten] = useState<Bestzeiten>(geladeneBestzeiten)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bestzeiten))
    cloudSchreiben(STORAGE_KEY, bestzeiten)
  }, [bestzeiten])

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
