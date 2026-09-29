import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { berichtsheft as initialEintraege, type BerichtsheftEintrag } from '../data/mock'
import { cloudSchreiben } from '../lib/cloudSync'

const STORAGE_KEY = 'berichtsheft:eintraege'

function geladeneEintraege(): BerichtsheftEintrag[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : initialEintraege
  } catch {
    return initialEintraege
  }
}

interface BerichtsheftContextValue {
  eintraege: BerichtsheftEintrag[]
  setEintraege: Dispatch<SetStateAction<BerichtsheftEintrag[]>>
}

const BerichtsheftContext = createContext<BerichtsheftContextValue | null>(null)

export function BerichtsheftProvider({ children }: { children: ReactNode }) {
  const [eintraege, setEintraege] = useState<BerichtsheftEintrag[]>(geladeneEintraege)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eintraege))
    cloudSchreiben(STORAGE_KEY, eintraege)
  }, [eintraege])

  return (
    <BerichtsheftContext.Provider value={{ eintraege, setEintraege }}>{children}</BerichtsheftContext.Provider>
  )
}

export function useBerichtsheft() {
  const ctx = useContext(BerichtsheftContext)
  if (!ctx) throw new Error('useBerichtsheft muss innerhalb von <BerichtsheftProvider> verwendet werden')
  return ctx
}
