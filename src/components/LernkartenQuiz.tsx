import { Check, RotateCcw, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { lernkarten, type Lernkarte, type Pruefungsphase, type Themenbereich } from '../data/mock'
import { usePunkte } from '../context/PunkteContext'
import Flashcard from './Flashcard'

const themenbereiche: (Themenbereich | 'Alle')[] = [
  'Alle',
  'Mathematik',
  'Elektrotechnik',
  'Sicherheit',
  'Metalltechnik',
  'Steuerungstechnik',
  'Wirtschaft & Soziales',
  'Ausbildung',
]

const pruefungsteile: (Pruefungsphase | 'Alle')[] = ['Alle', 'AP1', 'AP2']

const schwierigkeitStyle: Record<string, string> = {
  Grundlagen: 'bg-db-green/10 text-db-green',
  Fortgeschritten: 'bg-db-amber/10 text-db-amber',
}

function shuffle(karten: Lernkarte[]): Lernkarte[] {
  const kopie = [...karten]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
  }
  return kopie
}

export default function LernkartenQuiz() {
  const [themaFilter, setThemaFilter] = useState<Themenbereich | 'Alle'>('Alle')
  const [teilFilter, setTeilFilter] = useState<Pruefungsphase | 'Alle'>('Alle')
  const [deck, setDeck] = useState<Lernkarte[]>([])
  const [flipped, setFlipped] = useState(false)
  const [gewusst, setGewusst] = useState(0)
  const [wiederholen, setWiederholen] = useState(0)
  const { punkteVergeben } = usePunkte()

  const gefiltert = () =>
    lernkarten.filter(
      (k) =>
        (themaFilter === 'Alle' || k.themenbereich === themaFilter) &&
        (teilFilter === 'Alle' || k.pruefungsteil === teilFilter),
    )

  const starten = () => {
    setDeck(shuffle(gefiltert()))
    setFlipped(false)
    setGewusst(0)
    setWiederholen(0)
  }

  useEffect(starten, [themaFilter, teilFilter])

  const aktuell = deck[0]
  const gesamt = gefiltert().length

  const kannIch = () => {
    if (aktuell) punkteVergeben(`karte:${aktuell.id}`, 5, `Lernkarte gemeistert: ${aktuell.themenbereich}`)
    setDeck((d) => d.slice(1))
    setGewusst((g) => g + 1)
    setFlipped(false)
  }

  const nochUeben = () => {
    setDeck((d) => [...d.slice(1), d[0]])
    setWiederholen((w) => w + 1)
    setFlipped(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {themenbereiche.map((t) => (
          <button
            key={t}
            onClick={() => setThemaFilter(t)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              themaFilter === t
                ? 'border-db-red bg-db-red text-white'
                : 'border-db-gray-200 bg-db-surface text-db-navy-light hover:border-db-red/40'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex gap-1 rounded-full bg-db-gray-100 p-1">
        {pruefungsteile.map((t) => (
          <button
            key={t}
            onClick={() => setTeilFilter(t)}
            className={`flex-1 rounded-full py-1.5 text-xs font-semibold ${
              teilFilter === t ? 'bg-db-surface text-db-navy shadow-sm' : 'text-db-navy-light'
            }`}
          >
            {t === 'Alle' ? 'Alle Prüfungsteile' : t}
          </button>
        ))}
      </div>

      {gesamt > 0 && (
        <div className="space-y-1.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-db-gray-100">
            <div
              className="h-full rounded-full bg-db-red transition-all duration-300"
              style={{ width: `${((gesamt - deck.length) / gesamt) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-db-navy-light">
            <span>
              Karte {Math.min(gesamt - deck.length + 1, gesamt)} von {gesamt}
            </span>
            <span className="flex items-center gap-3">
              <span className="text-db-green">✓ {gewusst}</span>
              <span className="text-db-amber">↻ {wiederholen}</span>
            </span>
          </div>
        </div>
      )}

      {aktuell ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-db-gray-100 px-2.5 py-1 text-xs font-medium text-db-navy-light">
              {aktuell.themenbereich}
            </span>
            <span className="rounded-full bg-db-navy/5 px-2.5 py-1 text-xs font-medium text-db-navy">
              {aktuell.pruefungsteil}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${schwierigkeitStyle[aktuell.schwierigkeit]}`}>
              {aktuell.schwierigkeit}
            </span>
          </div>

          <Flashcard key={aktuell.id} front={aktuell.frage} back={aktuell.antwort} onFlipChange={setFlipped} />

          {flipped && (
            <div className="flex gap-2">
              <button
                onClick={nochUeben}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-db-amber/40 bg-db-amber/5 px-4 py-3 text-sm font-semibold text-db-amber hover:bg-db-amber/10"
              >
                <RotateCcw size={15} /> Nochmal üben
              </button>
              <button
                onClick={kannIch}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-db-red px-4 py-3 text-sm font-semibold text-white hover:bg-db-red-dark"
              >
                <Check size={15} /> Kann ich
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-db-gray-200 bg-db-surface p-6 text-center">
          <Sparkles size={24} className="mx-auto text-db-red" />
          <p className="mt-2 text-sm font-semibold text-db-navy">
            {gesamt === 0 ? 'Keine Karten für diesen Filter.' : 'Runde geschafft!'}
          </p>
          {gesamt > 0 && (
            <p className="mt-1 text-xs text-db-navy-light">
              {gewusst} direkt gewusst · {wiederholen}× wiederholt
            </p>
          )}
          {gesamt > 0 && (
            <button
              onClick={starten}
              className="mt-4 rounded-full bg-db-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-db-red-dark"
            >
              Nochmal von vorn
            </button>
          )}
        </div>
      )}
    </div>
  )
}
