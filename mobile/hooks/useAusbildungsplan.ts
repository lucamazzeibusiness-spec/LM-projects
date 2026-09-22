import { useEffect, useState } from 'react'
import { ausbildungsplanVorlage, type Ausbildungsblock } from '../data/mock'
import { cloudSchreiben } from '../lib/cloudSync'
import { ladeGespeichert, speichere } from '../lib/storage'

const STORAGE_KEY = 'ausbildungsplan:vorlage'

export type Wochenvorlage = (Ausbildungsblock | null)[]

export function useAusbildungsplan() {
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

  return { vorlage, tagSetzen }
}
