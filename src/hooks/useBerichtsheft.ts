import { useEffect, useState } from 'react'
import { berichtsheft as initialEintraege, type BerichtsheftEintrag } from '../data/mock'

const STORAGE_KEY = 'berichtsheft:eintraege'

function geladeneEintraege(): BerichtsheftEintrag[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : initialEintraege
  } catch {
    return initialEintraege
  }
}

export function useBerichtsheft() {
  const [eintraege, setEintraege] = useState<BerichtsheftEintrag[]>(geladeneEintraege)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eintraege))
  }, [eintraege])

  return { eintraege, setEintraege }
}
