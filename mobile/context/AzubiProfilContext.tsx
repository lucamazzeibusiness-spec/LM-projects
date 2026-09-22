import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AzubiProfil } from '../data/mock'
import { cloudSchreiben } from '../lib/cloudSync'
import { ladeGespeichert, speichere } from '../lib/storage'

const STORAGE_KEY = 'azubi:profil'

interface AzubiProfilContextValue {
  profil: AzubiProfil | null
  geladen: boolean
  profilSpeichern: (profil: AzubiProfil) => void
  profilZuruecksetzen: () => void
}

const AzubiProfilContext = createContext<AzubiProfilContextValue | null>(null)

export function AzubiProfilProvider({ children }: { children: ReactNode }) {
  const [profil, setProfil] = useState<AzubiProfil | null>(null)
  const [geladen, setGeladen] = useState(false)

  useEffect(() => {
    ladeGespeichert<AzubiProfil | null>(STORAGE_KEY, null).then((p) => {
      setProfil(p)
      setGeladen(true)
    })
  }, [])

  const profilSpeichern = (p: AzubiProfil) => {
    setProfil(p)
    speichere(STORAGE_KEY, p)
    cloudSchreiben(STORAGE_KEY, p)
  }

  const profilZuruecksetzen = () => {
    setProfil(null)
    speichere(STORAGE_KEY, null)
  }

  return (
    <AzubiProfilContext.Provider value={{ profil, geladen, profilSpeichern, profilZuruecksetzen }}>
      {children}
    </AzubiProfilContext.Provider>
  )
}

export function useAzubiProfil() {
  const ctx = useContext(AzubiProfilContext)
  if (!ctx) throw new Error('useAzubiProfil muss innerhalb von <AzubiProfilProvider> verwendet werden')
  return ctx
}
