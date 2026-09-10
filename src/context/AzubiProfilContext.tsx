import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AzubiProfil } from '../data/mock'

const STORAGE_KEY = 'azubi:profil'

function geladenesProfil(): AzubiProfil | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

interface AzubiProfilContextValue {
  profil: AzubiProfil | null
  profilSpeichern: (profil: AzubiProfil) => void
  profilZuruecksetzen: () => void
}

const AzubiProfilContext = createContext<AzubiProfilContextValue | null>(null)

export function AzubiProfilProvider({ children }: { children: ReactNode }) {
  const [profil, setProfil] = useState<AzubiProfil | null>(geladenesProfil)

  useEffect(() => {
    if (profil) localStorage.setItem(STORAGE_KEY, JSON.stringify(profil))
  }, [profil])

  const profilZuruecksetzen = () => {
    localStorage.removeItem(STORAGE_KEY)
    setProfil(null)
  }

  return (
    <AzubiProfilContext.Provider value={{ profil, profilSpeichern: setProfil, profilZuruecksetzen }}>
      {children}
    </AzubiProfilContext.Provider>
  )
}

export function useAzubiProfil() {
  const ctx = useContext(AzubiProfilContext)
  if (!ctx) throw new Error('useAzubiProfil muss innerhalb von <AzubiProfilProvider> verwendet werden')
  return ctx
}
