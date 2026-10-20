import { useEffect, useState } from 'react'
import { fahrzeugFotosLaden, type FahrzeugFotos } from './fahrzeugFotos'

const CACHE_KEY = 'fahrzeuge:fotos'
const GUELTIG_MS = 14 * 24 * 60 * 60 * 1000

interface Cache {
  zeit: number
  fotos: FahrzeugFotos
}

function ausCache(): FahrzeugFotos | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cache = JSON.parse(raw) as Cache
    return Date.now() - cache.zeit < GUELTIG_MS ? cache.fotos : null
  } catch {
    return null
  }
}

// Fotos werden nur auf diesem Gerät zwischengespeichert (nicht in der Cloud) – sie lassen sich
// jederzeit neu laden. Ohne Internet bleibt die App einfach bei der Ansicht ohne Fotos.
export function useFahrzeugFotos(): { fotos: FahrzeugFotos; laedt: boolean } {
  const [fotos, setFotos] = useState<FahrzeugFotos>(() => ausCache() ?? {})
  const [laedt, setLaedt] = useState(() => ausCache() === null)

  useEffect(() => {
    if (ausCache()) return
    let abgebrochen = false
    fahrzeugFotosLaden()
      .then((neu) => {
        if (abgebrochen) return
        setFotos(neu)
        if (Object.keys(neu).length > 0) {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ zeit: Date.now(), fotos: neu } satisfies Cache))
          } catch {
            // Speicher voll/blockiert – dann eben beim nächsten Mal neu laden.
          }
        }
      })
      .catch(() => {})
      .finally(() => !abgebrochen && setLaedt(false))
    return () => {
      abgebrochen = true
    }
  }, [])

  return { fotos, laedt }
}
