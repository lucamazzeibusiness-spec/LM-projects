import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { cloudSchreiben } from '../lib/cloudSync'
import { heuteISO } from '../lib/wochen'

export interface PunkteEreignis {
  id: string
  betrag: number
  grund: string
  datum: string
}

export interface PunkteStand {
  gesamt: number
  verlauf: PunkteEreignis[]
}

const STORAGE_KEY = 'punkte:stand'
const leererStand: PunkteStand = { gesamt: 0, verlauf: [] }
const MAX_VERLAUF = 200

function geladenerStand(): PunkteStand {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : leererStand
  } catch {
    return leererStand
  }
}

function tageZurueck(datumISO: string, anzahl: number): string {
  const d = new Date(`${datumISO}T00:00:00`)
  d.setDate(d.getDate() - anzahl)
  return d.toISOString().slice(0, 10)
}

export function berichtsheftStreak(verlauf: PunkteEreignis[]): number {
  const kreditierteTage = new Set(
    verlauf.filter((e) => e.id.startsWith('berichtsheft:')).map((e) => e.id.slice('berichtsheft:'.length)),
  )
  const heute = heuteISO()
  let start = kreditierteTage.has(heute) ? heute : tageZurueck(heute, 1)
  let streak = 0
  while (kreditierteTage.has(start)) {
    streak++
    start = tageZurueck(start, 1)
  }
  return streak
}

interface PunkteContextValue {
  stand: PunkteStand
  streak: number
  punkteVergeben: (id: string, betrag: number, grund: string) => boolean
}

const PunkteContext = createContext<PunkteContextValue | null>(null)

export function PunkteProvider({ children }: { children: ReactNode }) {
  const [stand, setStand] = useState<PunkteStand>(geladenerStand)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stand))
    cloudSchreiben(STORAGE_KEY, stand)
  }, [stand])

  const punkteVergeben = (id: string, betrag: number, grund: string) => {
    let vergeben = false
    setStand((s) => {
      if (s.verlauf.some((e) => e.id === id)) return s
      vergeben = true
      return {
        gesamt: s.gesamt + betrag,
        verlauf: [{ id, betrag, grund, datum: new Date().toISOString() }, ...s.verlauf].slice(0, MAX_VERLAUF),
      }
    })
    return vergeben
  }

  return (
    <PunkteContext.Provider value={{ stand, streak: berichtsheftStreak(stand.verlauf), punkteVergeben }}>
      {children}
    </PunkteContext.Provider>
  )
}

export function usePunkte() {
  const ctx = useContext(PunkteContext)
  if (!ctx) throw new Error('usePunkte muss innerhalb von <PunkteProvider> verwendet werden')
  return ctx
}
