import { ArrowRight, Check, RotateCcw, Target } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLernstand } from '../context/LernstandContext'
import { usePunkte } from '../context/PunkteContext'
import { lernkarten } from '../data/mock'
import { karteDesTagesWaehlen } from '../lib/lernstand'
import { heuteISO } from '../lib/wochen'

const SPEICHER_KEY = 'karteDesTages'

// Die Auswahl wird pro Tag festgehalten: Nach dem Beantworten ändert sich der Lernstand, eine
// neu berechnete Auswahl würde sonst mitten am Tag auf eine andere Karte springen.
function karteFuerHeute(waehlen: () => string): string {
  const heute = heuteISO()
  try {
    const gespeichert = JSON.parse(localStorage.getItem(SPEICHER_KEY) ?? 'null') as { datum: string; id: string } | null
    if (gespeichert?.datum === heute && lernkarten.some((k) => k.id === gespeichert.id)) return gespeichert.id
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
  const [aufgedeckt, setAufgedeckt] = useState(false)
  const karte = lernkarten.find((k) => k.id === id)
  if (!karte) return null

  const zuletzt = lernstand[karte.id]?.zuletzt
  const heuteErledigt = !!zuletzt && new Date(zuletzt).toDateString() === new Date().toDateString()
  const antwortSichtbar = aufgedeckt || heuteErledigt

  const bewerten = (richtig: boolean) => {
    ergebnisMerken(karte.id, richtig)
    if (richtig) punkteVergeben(`karte:${karte.id}`, 5, `Lernkarte gemeistert: ${karte.themenbereich}`)
  }

  return (
    <div className="rounded-xl border border-db-gray-200 bg-db-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-db-navy">
          <Target size={15} className="text-db-red" /> Karte des Tages
        </h2>
        <span className="rounded-full bg-db-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-db-navy-light">
          {karte.themenbereich} · {karte.pruefungsteil}
        </span>
      </div>
      <p className="mt-3 whitespace-pre-line text-sm font-medium text-db-navy">{karte.frage}</p>

      {antwortSichtbar ? (
        <p className="mt-3 whitespace-pre-line rounded-lg bg-db-gray-50 p-3 text-sm text-db-navy">{karte.antwort}</p>
      ) : (
        <button
          onClick={() => setAufgedeckt(true)}
          className="mt-3 w-full rounded-full border border-db-gray-200 px-4 py-2 text-sm font-semibold text-db-navy hover:border-db-navy/30"
        >
          Antwort zeigen
        </button>
      )}

      {heuteErledigt ? (
        <div className="mt-3 flex items-center justify-between gap-2 text-xs">
          <span className="flex items-center gap-1 font-medium text-db-green">
            <Check size={14} /> Für heute erledigt – morgen kommt die nächste
          </span>
          <Link to="/wissen" className="flex shrink-0 items-center gap-1 font-semibold text-db-red hover:underline">
            Weiter üben <ArrowRight size={13} />
          </Link>
        </div>
      ) : (
        aufgedeckt && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => bewerten(false)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-db-amber/40 bg-db-amber/5 px-3 py-2 text-sm font-semibold text-db-amber hover:bg-db-amber/10"
            >
              <RotateCcw size={14} /> Nochmal üben
            </button>
            <button
              onClick={() => bewerten(true)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-db-red px-3 py-2 text-sm font-semibold text-white hover:bg-db-red-dark"
            >
              <Check size={14} /> Wusste ich
            </button>
          </div>
        )
      )}
    </div>
  )
}
