import { useEffect, useState } from 'react'
import { fahrzeugFotosLaden, type FahrzeugFotos } from './fahrzeugFotos'
import { ladeGespeichert, speichere } from './storage'

const CACHE_KEY = 'fahrzeuge:fotos'
const GUELTIG_MS = 14 * 24 * 60 * 60 * 1000

interface Cache {
  zeit: number
  fotos: FahrzeugFotos
}

// Fotos werden nur auf diesem Gerät zwischengespeichert (nicht in der Cloud) – sie lassen sich
// jederzeit neu laden. Ohne Internet bleibt die App einfach bei der Ansicht ohne Fotos.
export function useFahrzeugFotos(): { fotos: FahrzeugFotos; laedt: boolean } {
  const [fotos, setFotos] = useState<FahrzeugFotos>({})
  const [laedt, setLaedt] = useState(true)

  useEffect(() => {
    let abgebrochen = false
    ;(async () => {
      const cache = await ladeGespeichert<Cache | null>(CACHE_KEY, null)
      if (cache && Date.now() - cache.zeit < GUELTIG_MS) {
        if (!abgebrochen) setFotos(cache.fotos)
        return
      }
      try {
        const neu = await fahrzeugFotosLaden()
        if (abgebrochen) return
        setFotos(neu)
        if (Object.keys(neu).length > 0) await speichere(CACHE_KEY, { zeit: Date.now(), fotos: neu } satisfies Cache)
      } catch {
        // Offline o. Ä. – dann ohne Fotos.
      }
    })().finally(() => !abgebrochen && setLaedt(false))
    return () => {
      abgebrochen = true
    }
  }, [])

  return { fotos, laedt }
}
