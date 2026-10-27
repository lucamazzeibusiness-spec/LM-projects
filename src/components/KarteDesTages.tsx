import { ArrowRight, Check, Target, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLernstand } from '../context/LernstandContext'
import { usePunkte } from '../context/PunkteContext'
import { lernkarten } from '../data/mock'
import { antwortOptionen, karteDesTagesGeeignet, karteDesTagesWaehlen } from '../lib/lernstand'
import { heuteISO } from '../lib/wochen'

const SPEICHER_KEY = 'karteDesTages'

// Die Auswahl wird pro Tag festgehalten: Nach dem Beantworten ändert sich der Lernstand, eine
// neu berechnete Auswahl würde sonst mitten am Tag auf eine andere Karte springen.
function karteFuerHeute(waehlen: () => string): string {
  const heute = heuteISO()
  try {
    const gespeichert = JSON.parse(localStorage.getItem(SPEICHER_KEY) ?? 'null') as { datum: string; id: string } | null
    const karte = lernkarten.find((k) => k.id === gespeichert?.id)
    if (gespeichert?.datum === heute && karte && karteDesTagesGeeignet(karte)) return gespeichert.id
  } catch {
    // Ungültiger Eintrag – neu wählen.
  }
  const id = waehlen()
  try {
    localStorage.setItem(SPEICHER_KEY, JSON.stringify({ datum: heute, id }))
  } catch {
    // Nicht speicherbar – dann wird beim nächsten Öffnen neu (aber gleich) gewählt.
  }
  return id
}

export default function KarteDesTages() {
  const { lernstand, ergebnisMerken } = useLernstand()
  const { punkteVergeben } = usePunkte()
  const [id] = useState(() => karteFuerHeute(() => karteDesTagesWaehlen(heuteISO(), lernstand).id))
  const [gewaehlt, setGewaehlt] = useState<string | null>(null)
  const karte = lernkarten.find((k) => k.id === id)
  const optionen = useMemo(() => (karte ? antwortOptionen(karte, heuteISO()) : []), [karte])
  if (!karte) return null

  const stand = lernstand[karte.id]
  const heuteErledigt = !!stand?.zuletzt && new Date(stand.zuletzt).toDateString() === new Date().toDateString()
  const beantwortet = gewaehlt !== null || heuteErledigt
  const richtig = gewaehlt !== null ? gewaehlt === karte.antwort : stand?.letztesErgebnis === 'richtig'

  const antworten = (option: string) => {
    if (beantwortet) return
    setGewaehlt(option)
    const treffer = option === karte.antwort
    ergebnisMerken(karte.id, treffer)
    if (treffer) punkteVergeben(`karte:${karte.id}`, 5, `Frage des Tages: ${karte.themenbereich}`)
  }

  const optionStil = (option: string) => {
    if (!beantwortet) return 'border-db-gray-200 text-db-navy hover:border-db-navy/30'
    if (option === karte.antwort) return 'border-db-green/50 bg-db-green/5 text-db-navy'
    if (option === gewaehlt) return 'border-db-red/50 bg-db-red/5 text-db-navy'
    return 'border-db-gray-200 text-db-navy-light opacity-60'
  }

  return (
    <div className="rounded-xl border border-db-gray-200 bg-db-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-db-navy">
          <Target size={15} className="text-db-red" /> Frage des Tages
        </h2>
        <span className="rounded-full bg-db-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-db-navy-light">
          {karte.themenbereich} · {karte.pruefungsteil}
        </span>
      </div>
      <p className="mt-3 whitespace-pre-line text-sm font-medium text-db-navy">{karte.frage}</p>

      <div className="mt-3 space-y-2">
        {optionen.map((option) => (
          <button
            key={option}
            onClick={() => antworten(option)}
            disabled={beantwortet}
            className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${optionStil(option)}`}
          >
            <span className="flex-1 whitespace-pre-line">{option}</span>
            {beantwortet && option === karte.antwort && <Check size={16} className="mt-0.5 shrink-0 text-db-green" />}
            {beantwortet && option === gewaehlt && option !== karte.antwort && (
              <X size={16} className="mt-0.5 shrink-0 text-db-red" />
            )}
          </button>
        ))}
      </div>

      {beantwortet && (
        <div className="mt-3 flex items-center justify-between gap-2 text-xs">
          <span className={`font-medium ${richtig ? 'text-db-green' : 'text-db-amber'}`}>
            {richtig ? 'Richtig! Morgen kommt die nächste Frage.' : 'Nicht ganz – die Frage kommt bald wieder.'}
          </span>
          <Link to="/wissen" className="flex shrink-0 items-center gap-1 font-semibold text-db-red hover:underline">
            Weiter üben <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  )
}
