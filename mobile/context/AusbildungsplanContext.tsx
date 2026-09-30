import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { ausbildungsplanVorlage, type Ausbildungsblock } from '../data/mock'
import { cloudSchreiben } from '../lib/cloudSync'
import { ladeGespeichert, speichere } from '../lib/storage'

const STORAGE_KEY = 'ausbildungsplan:vorlage'

export type Wochenvorlage = (Ausbildungsblock | null)[]

interface AusbildungsplanContextValue {
  vorlage: Wochenvorlage
  tagSetzen: (index: number, eintrag: Ausbildungsblock | null) => void
}

const AusbildungsplanContext = createContext<AusbildungsplanContextValue | null>(null)

export function AusbildungsplanProvider({ children }: { children: ReactNode }) {
  const [vorlage, setVorlage] = useState<Wochenvorlage>(ausbildungsplanVorlage)
  const [geladen, setGeladen] = useState(false)

  useEffect(() => {
    ladeGespeichert<Wochenvorlage>(STORAGE_KEY, ausbildungsplanVorlage).then((v) => {
      setVorlage(v)
      setGeladen(true)
    })
  }, [])

  useEffect(() => {
    if (geladen) {
      speichere(STORAGE_KEY, vorlage)
      cloudSchreiben(STORAGE_KEY, vorlage)
    }
  }, [vorlage, geladen])

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
