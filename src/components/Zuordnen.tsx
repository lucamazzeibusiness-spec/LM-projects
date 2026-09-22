import { CheckCircle2, Timer, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatZeit } from '../lib/zeit'

export interface ZuordnenPaar {
  id: string
  begriff: string
  definition: string
}

interface ZuordnenProps {
  paare: ZuordnenPaar[]
  onAbschluss: (sekunden: number, fehler: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  const kopie = [...arr]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
  }
  return kopie
}

export default function Zuordnen({ paare, onAbschluss }: ZuordnenProps) {
  const [linksReihenfolge] = useState(() => shuffle(paare))
  const [rechtsReihenfolge] = useState(() => shuffle(paare))
  const [abgeglichen, setAbgeglichen] = useState<Set<string>>(new Set())
  const [ausgewaehltLinks, setAusgewaehltLinks] = useState<string | null>(null)
  const [ausgewaehltRechts, setAusgewaehltRechts] = useState<string | null>(null)
  const [fehlerFlash, setFehlerFlash] = useState(false)
  const [fehlerCount, setFehlerCount] = useState(0)
  const [sekunden, setSekunden] = useState(0)
  const [fertig, setFertig] = useState(false)

  useEffect(() => {
    if (fertig) return
    const intervall = setInterval(() => setSekunden((s) => s + 1), 1000)
    return () => clearInterval(intervall)
  }, [fertig])

  useEffect(() => {
    if (ausgewaehltLinks === null || ausgewaehltRechts === null) return

    if (ausgewaehltLinks === ausgewaehltRechts) {
      const id = ausgewaehltLinks
      setAusgewaehltLinks(null)
      setAusgewaehltRechts(null)
      setAbgeglichen((prev) => {
        const naechster = new Set(prev)
        naechster.add(id)
        if (naechster.size === paare.length) {
          setFertig(true)
        }
        return naechster
      })
    } else {
      setFehlerCount((f) => f + 1)
      setSekunden((s) => s + 3)
      setFehlerFlash(true)
      const timeout = setTimeout(() => {
        setFehlerFlash(false)
        setAusgewaehltLinks(null)
        setAusgewaehltRechts(null)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [ausgewaehltLinks, ausgewaehltRechts, paare.length])

  useEffect(() => {
    if (fertig) onAbschluss(sekunden, fehlerCount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fertig])

  const waehlen = (seite: 'links' | 'rechts', id: string) => {
    if (abgeglichen.has(id) || fehlerFlash) return
    if (seite === 'links') setAusgewaehltLinks((cur) => (cur === id ? null : id))
    else setAusgewaehltRechts((cur) => (cur === id ? null : id))
  }

  if (fertig) {
    return (
      <div className="rounded-xl border border-db-green/30 bg-db-green/5 p-6 text-center">
        <CheckCircle2 size={28} className="mx-auto text-db-green" />
        <p className="mt-2 text-lg font-semibold text-db-navy">Geschafft in {formatZeit(sekunden)}!</p>
        <p className="mt-1 text-sm text-db-navy-light">
          {fehlerCount === 0 ? 'Ohne Fehler – stark!' : `${fehlerCount} ${fehlerCount === 1 ? 'Fehler' : 'Fehler'} (je +3 Sek.)`}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-xl border border-db-gray-200 bg-db-surface px-4 py-2.5">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-db-navy">
          <Timer size={15} /> {formatZeit(sekunden)}
        </span>
        {fehlerCount > 0 && (
          <span className="flex items-center gap-1 text-xs font-medium text-db-red">
            <X size={13} /> {fehlerCount} {fehlerCount === 1 ? 'Fehler' : 'Fehler'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          {linksReihenfolge.map((p) => {
            const erledigt = abgeglichen.has(p.id)
            const ausgewaehlt = ausgewaehltLinks === p.id
            const falsch = fehlerFlash && ausgewaehlt
            return (
              <button
                key={p.id}
                onClick={() => waehlen('links', p.id)}
                disabled={erledigt}
                className={`line-clamp-3 w-full rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                  erledigt
                    ? 'border-db-green/20 bg-db-green/5 text-db-green/50 opacity-0'
                    : falsch
                      ? 'border-db-red bg-db-red/10 text-db-red-dark'
                      : ausgewaehlt
                        ? 'border-db-red bg-db-red/5 text-db-red-dark'
                        : 'border-db-gray-200 bg-db-surface text-db-navy hover:border-db-red/40'
                }`}
              >
                {p.begriff}
              </button>
            )
          })}
        </div>
        <div className="space-y-2">
          {rechtsReihenfolge.map((p) => {
            const erledigt = abgeglichen.has(p.id)
            const ausgewaehlt = ausgewaehltRechts === p.id
            const falsch = fehlerFlash && ausgewaehlt
            return (
              <button
                key={p.id}
                onClick={() => waehlen('rechts', p.id)}
                disabled={erledigt}
                className={`line-clamp-3 w-full rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                  erledigt
                    ? 'border-db-green/20 bg-db-green/5 text-db-green/50 opacity-0'
                    : falsch
                      ? 'border-db-red bg-db-red/10 text-db-red-dark'
                      : ausgewaehlt
                        ? 'border-db-red bg-db-red/5 text-db-red-dark'
                        : 'border-db-gray-200 bg-db-surface text-db-navy hover:border-db-red/40'
                }`}
              >
                {p.definition}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
