import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { berichtsheft as initialEintraege, type BerichtsheftEintrag } from '../data/mock'
import { cloudSchreiben } from '../lib/cloudSync'
import { ladeGespeichert, speichere } from '../lib/storage'

const STORAGE_KEY = 'berichtsheft:eintraege'

interface BerichtsheftContextValue {
  eintraege: BerichtsheftEintrag[]
  setEintraege: Dispatch<SetStateAction<BerichtsheftEintrag[]>>
}

const BerichtsheftContext = createContext<BerichtsheftContextValue | null>(null)

export function BerichtsheftProvider({ children }: { children: ReactNode }) {
  const [eintraege, setEintraege] = useState<BerichtsheftEintrag[]>(initialEintraege)
  const [geladen, setGeladen] = useState(false)

  useEffect(() => {
    ladeGespeichert<BerichtsheftEintrag[]>(STORAGE_KEY, initialEintraege).then((e) => {
      setEintraege(e)
      setGeladen(true)
    })
  }, [])

  useEffect(() => {
    if (geladen) {
      speichere(STORAGE_KEY, eintraege)
      cloudSchreiben(STORAGE_KEY, eintraege)
    }
  }, [eintraege, geladen])

  return (
    <BerichtsheftContext.Provider value={{ eintraege, setEintraege }}>{children}</BerichtsheftContext.Provider>
  )
}

export function useBerichtsheft() {
  const ctx = useContext(BerichtsheftContext)
  if (!ctx) throw new Error('useBerichtsheft muss innerhalb von <BerichtsheftProvider> verwendet werden')
  return ctx
}
