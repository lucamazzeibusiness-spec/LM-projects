import { useEffect, useState } from 'react'
import { berichtsheft as initialEintraege, type BerichtsheftEintrag } from '../data/mock'
import { ladeGespeichert, speichere } from '../lib/storage'

const STORAGE_KEY = 'berichtsheft:eintraege'

export function useBerichtsheft() {
  const [eintraege, setEintraege] = useState<BerichtsheftEintrag[]>(initialEintraege)
  const [geladen, setGeladen] = useState(false)

  useEffect(() => {
    ladeGespeichert<BerichtsheftEintrag[]>(STORAGE_KEY, initialEintraege).then((e) => {
      setEintraege(e)
      setGeladen(true)
    })
  }, [])

  useEffect(() => {
    if (geladen) speichere(STORAGE_KEY, eintraege)
  }, [eintraege, geladen])

  return { eintraege, setEintraege }
}
