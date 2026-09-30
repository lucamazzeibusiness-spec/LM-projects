import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { ausbildungsplanVorlage, type Ausbildungsblock } from '../data/mock'
import { cloudSchreiben } from '../lib/cloudSync'

const STORAGE_KEY = 'ausbildungsplan:vorlage'

export type Wochenvorlage = (Ausbildungsblock | null)[]

function geladeneVorlage(): Wochenvorlage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : ausbildungsplanVorlage
  } catch {
    return ausbildungsplanVorlage
  }
}

interface AusbildungsplanContextValue {
  vorlage: Wochenvorlage
  tagSetzen: (index: number, eintrag: Ausbildungsblock | null) => void
}

const AusbildungsplanContext = createContext<AusbildungsplanContextValue | null>(null)

export function AusbildungsplanProvider({ children }: { children: ReactNode }) {
  const [vorlage, setVorlage] = useState<Wochenvorlage>(geladeneVorlage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vorlage))
    cloudSchreiben(STORAGE_KEY, vorlage)
  }, [vorlage])

  const tagSetzen = (index: number, eintrag: Ausbildungsblock | null) => {
    setVorlage((v) => v.map((e, i) => (i === index ? eintrag : e)))
  }

  return (
    <AusbildungsplanContext.Provider value={{ vorlage, tagSetzen }}>{children}</AusbildungsplanContext.Provider>
  )
}

export function useAusbildungsplan() {
  const ctx = useContext(AusbildungsplanContext)
  if (!ctx) throw new Error('useAusbildungsplan muss innerhalb von <AusbildungsplanProvider> verwendet werden')
  return ctx
}
