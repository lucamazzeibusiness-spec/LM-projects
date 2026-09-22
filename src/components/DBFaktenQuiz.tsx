import { Check, RotateCcw, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { dbFakten, type DBFakt, type DBFaktKategorie } from '../data/mock'
import { usePunkte } from '../context/PunkteContext'
import Flashcard from './Flashcard'

const kategorien: (DBFaktKategorie | 'Alle')[] = [
  'Alle',
  'Geschichte',
  'Unternehmen',
  'Fahrzeuge & Technik',
  'Netz & Strecken',
  'Rekorde & Zahlen',
]

function shuffle(fakten: DBFakt[]): DBFakt[] {
  const kopie = [...fakten]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
  }
  return kopie
}

export default function DBFaktenQuiz() {
  const [kategorieFilter, setKategorieFilter] = useState<DBFaktKategorie | 'Alle'>('Alle')
  const [deck, setDeck] = useState<DBFakt[]>([])
  const [flipped, setFlipped] = useState(false)
  const [gewusst, setGewusst] = useState(0)
  const [wiederholen, setWiederholen] = useState(0)
  const { punkteVergeben } = usePunkte()

  const gefiltert = () => dbFakten.filter((f) => kategorieFilter === 'Alle' || f.kategorie === kategorieFilter)

  const starten = () => {
    setDeck(shuffle(gefiltert()))
    setFlipped(false)
    setGewusst(0)
    setWiederholen(0)
  }

  useEffect(starten, [kategorieFilter])

  const aktuell = deck[0]
  const gesamt = gefiltert().length

  const kannIch = () => {
    if (aktuell) punkteVergeben(`karte:${aktuell.id}`, 5, `DB-Fakt gemeistert: ${aktuell.kategorie}`)
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
        {kategorien.map((k) => (
          <button
            key={k}
            onClick={() => setKategorieFilter(k)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              kategorieFilter === k
                ? 'border-db-red bg-db-red text-white'
                : 'border-db-gray-200 bg-db-surface text-db-navy-light hover:border-db-red/40'
            }`}
          >
            {k}
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
              {aktuell.kategorie}
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
            {gesamt === 0 ? 'Keine Fakten für diesen Filter.' : 'Runde geschafft!'}
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
