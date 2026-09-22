import { Check, RotateCcw, Shuffle, Sparkles, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { dbFakten, type DBFakt, type DBFaktKategorie } from '../data/mock'
import { usePunkte } from '../context/PunkteContext'
import { useZuordnenBestzeiten } from '../context/ZuordnenContext'
import { formatZeit } from '../lib/zeit'
import Flashcard from './Flashcard'
import Zuordnen from './Zuordnen'

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
  const [modus, setModus] = useState<'karten' | 'zuordnen'>('karten')
  const [deck, setDeck] = useState<DBFakt[]>([])
  const [flipped, setFlipped] = useState(false)
  const [gewusst, setGewusst] = useState(0)
  const [wiederholen, setWiederholen] = useState(0)
  const [zuordnenRunde, setZuordnenRunde] = useState(0)
  const [zuordnenErgebnis, setZuordnenErgebnis] = useState<{ sekunden: number; fehler: number; neuerBest: boolean } | null>(null)
  const { punkteVergeben } = usePunkte()
  const { bestFuer, bestSetzenWennBesser } = useZuordnenBestzeiten()

  const gefiltert = () => dbFakten.filter((f) => kategorieFilter === 'Alle' || f.kategorie === kategorieFilter)

  const starten = () => {
    setDeck(shuffle(gefiltert()))
    setFlipped(false)
    setGewusst(0)
    setWiederholen(0)
  }

  useEffect(starten, [kategorieFilter])
  useEffect(() => setZuordnenErgebnis(null), [kategorieFilter])

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

  const zuordnenSchluessel = `dbfakten:${kategorieFilter}`
  const zuordnenPaare = useMemo(
    () => shuffle(gefiltert()).slice(0, 6).map((f) => ({ id: f.id, begriff: f.frage, definition: f.antwort })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kategorieFilter, zuordnenRunde],
  )
  const zuordnenBest = bestFuer(zuordnenSchluessel)

  const zuordnenAbschluss = (sekunden: number, fehler: number) => {
    const neuerBest = bestSetzenWennBesser(zuordnenSchluessel, sekunden)
    if (neuerBest) {
      const punkte = Math.max(10, 40 - Math.round(sekunden / 2) - fehler * 2)
      punkteVergeben(`zuordnen-best:${zuordnenSchluessel}:${Date.now()}`, punkte, `Neue Bestzeit Zuordnen: ${formatZeit(sekunden)}`)
    }
    setZuordnenErgebnis({ sekunden, fehler, neuerBest })
  }

  const neueZuordnenRunde = () => {
    setZuordnenErgebnis(null)
    setZuordnenRunde((r) => r + 1)
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

      <div className="flex gap-1 rounded-full bg-db-gray-100 p-1">
        <button
          onClick={() => setModus('karten')}
          className={`flex-1 rounded-full py-1.5 text-xs font-semibold ${
            modus === 'karten' ? 'bg-db-surface text-db-navy shadow-sm' : 'text-db-navy-light'
          }`}
        >
          Karteikarten
        </button>
        <button
          onClick={() => setModus('zuordnen')}
          className={`flex-1 rounded-full py-1.5 text-xs font-semibold ${
            modus === 'zuordnen' ? 'bg-db-surface text-db-navy shadow-sm' : 'text-db-navy-light'
          }`}
        >
          Zuordnen
        </button>
      </div>

      {modus === 'karten' && gesamt > 0 && (
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

      {modus === 'zuordnen' ? (
        zuordnenPaare.length < 4 ? (
          <div className="rounded-xl border border-db-gray-200 bg-db-surface p-6 text-center">
            <p className="text-sm text-db-navy-light">Zu wenige Fakten für diesen Filter (mind. 4 nötig).</p>
          </div>
        ) : zuordnenErgebnis ? (
          <div className="space-y-3 rounded-xl border border-db-green/30 bg-db-green/5 p-6 text-center">
            <Sparkles size={24} className="mx-auto text-db-green" />
            <p className="text-lg font-semibold text-db-navy">Geschafft in {formatZeit(zuordnenErgebnis.sekunden)}!</p>
            <p className="text-sm text-db-navy-light">
              {zuordnenErgebnis.fehler === 0 ? 'Ohne Fehler – stark!' : `${zuordnenErgebnis.fehler} Fehler (je +3 Sek.)`}
            </p>
            {zuordnenErgebnis.neuerBest ? (
              <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-db-amber">
                <Trophy size={15} /> Neue Bestzeit für diesen Filter!
              </p>
            ) : (
              zuordnenBest !== null && <p className="text-xs text-db-navy-light">Bestzeit: {formatZeit(zuordnenBest)}</p>
            )}
            <button
              onClick={neueZuordnenRunde}
              className="mx-auto flex items-center gap-1.5 rounded-full bg-db-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-db-red-dark"
            >
              <Shuffle size={15} /> Neue Runde
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {zuordnenBest !== null && (
              <p className="flex items-center gap-1.5 text-xs text-db-navy-light">
                <Trophy size={13} className="text-db-amber" /> Bestzeit für diesen Filter: {formatZeit(zuordnenBest)}
              </p>
            )}
            <Zuordnen key={zuordnenRunde} paare={zuordnenPaare} onAbschluss={zuordnenAbschluss} />
          </div>
        )
      ) : aktuell ? (
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
