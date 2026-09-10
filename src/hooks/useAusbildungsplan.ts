import { useEffect, useState } from 'react'
import { ausbildungsplanVorlage, type Ausbildungsblock } from '../data/mock'

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

export function useAusbildungsplan() {
  const [vorlage, setVorlage] = useState<Wochenvorlage>(geladeneVorlage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vorlage))
  }, [vorlage])

  const tagSetzen = (index: number, eintrag: Ausbildungsblock | null) => {
    setVorlage((v) => v.map((e, i) => (i === index ? eintrag : e)))
  }

  return { vorlage, tagSetzen }
}
