import { Check, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export interface LernmodusPaar {
  id: string
  begriff: string
  definition: string
}

interface LernmodusProps {
  paare: LernmodusPaar[]
  onKarteGemeistert: (id: string) => void
  onErsterVersuch?: (id: string, richtig: boolean) => void
  onAbschluss: (ersteVersucheRichtig: number, gesamt: number, fehler: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  const kopie = [...arr]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
  }
  return kopie
}

export default function Lernmodus({ paare, onKarteGemeistert, onErsterVersuch, onAbschluss }: LernmodusProps) {
  const [warteschlange, setWarteschlange] = useState(() => shuffle(paare))
  const [optionen, setOptionen] = useState<string[]>([])
  const [ausgewaehlt, setAusgewaehlt] = useState<string | null>(null)
  const [falscheKarten, setFalscheKarten] = useState<Set<string>>(new Set())
  const [ersteVersucheRichtig, setErsteVersucheRichtig] = useState(0)
  const [fehler, setFehler] = useState(0)

  const aktuell = warteschlange[0]

  useEffect(() => {
    if (!aktuell) return
    const andere = paare.filter((p) => p.id !== aktuell.id).map((p) => p.definition)
    const distraktoren = shuffle(andere).slice(0, 3)
    setOptionen(shuffle([aktuell.definition, ...distraktoren]))
    setAusgewaehlt(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktuell?.id])

  useEffect(() => {
    if (warteschlange.length === 0) onAbschluss(ersteVersucheRichtig, paare.length, fehler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warteschlange.length])

  const waehlen = (option: string) => {
    if (ausgewaehlt || !aktuell) return
    setAusgewaehlt(option)
    const ersterVersuch = !falscheKarten.has(aktuell.id)
    if (option === aktuell.definition) {
      if (ersterVersuch) {
        setErsteVersucheRichtig((r) => r + 1)
        onKarteGemeistert(aktuell.id)
        onErsterVersuch?.(aktuell.id, true)
      }
    } else {
      if (ersterVersuch) onErsterVersuch?.(aktuell.id, false)
      setFehler((f) => f + 1)
      setFalscheKarten((s) => new Set(s).add(aktuell.id))
    }
  }

  const weiter = () => {
    if (!aktuell) return
    const richtig = ausgewaehlt === aktuell.definition
    setWarteschlange((q) => {
      const [, ...rest] = q
      return richtig ? rest : [...rest, q[0]]
    })
  }

  if (!aktuell) {
    return (
      <div className="space-y-3 rounded-xl border border-db-green/30 bg-db-green/5 p-6 text-center">
        <Sparkles size={24} className="mx-auto text-db-green" />
        <p className="text-lg font-semibold text-db-navy">Runde gemeistert!</p>
        <p className="text-sm text-db-navy-light">
          {ersteVersucheRichtig} von {paare.length} im ersten Versuch richtig
          {fehler > 0 ? ` · ${fehler} Fehlversuche` : ''}
        </p>
      </div>
    )
  }

  const gemeistert = paare.length - warteschlange.length

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-db-gray-100">
          <div
            className="h-full rounded-full bg-db-red transition-all duration-300"
            style={{ width: `${(gemeistert / paare.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-db-navy-light">
          <span>
            {gemeistert} von {paare.length} gemeistert
          </span>
          {fehler > 0 && <span className="text-db-red">{fehler} Fehlversuche</span>}
        </div>
      </div>

      <div className="rounded-xl border border-db-gray-200 bg-db-surface p-5 text-center">
        <p className="text-base font-semibold text-db-navy">{aktuell.begriff}</p>
      </div>

      <div className="space-y-2">
        {optionen.map((option) => {
          const istRichtig = option === aktuell.definition
          const istAusgewaehlt = option === ausgewaehlt
          const zeigeFeedback = ausgewaehlt !== null
          return (
            <button
              key={option}
              onClick={() => waehlen(option)}
              disabled={zeigeFeedback}
              className={`flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                zeigeFeedback && istRichtig
                  ? 'border-db-green bg-db-green/10 text-db-navy'
                  : zeigeFeedback && istAusgewaehlt
                    ? 'border-db-red bg-db-red/10 text-db-navy'
                    : 'border-db-gray-200 text-db-navy hover:border-db-navy/30'
              }`}
            >
              {option}
              {zeigeFeedback && istRichtig && <Check size={16} className="shrink-0 text-db-green" />}
              {zeigeFeedback && istAusgewaehlt && !istRichtig && <X size={16} className="shrink-0 text-db-red" />}
            </button>
          )
        })}
      </div>

      {ausgewaehlt !== null && (
        <button
          onClick={weiter}
          className="flex w-full items-center justify-center gap-1.5 rounded-full bg-db-red px-4 py-3 text-sm font-semibold text-white hover:bg-db-red-dark"
        >
          Weiter
        </button>
      )}
    </div>
  )
}
