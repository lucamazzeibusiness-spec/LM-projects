import { Check, Clock, GraduationCap, RotateCcw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Lernkarte } from '../data/mock'
import { formatZeit } from '../lib/zeit'

const FRAGEN_PRO_PRUEFUNG = 15
// Wie bei der IHK: bestanden ab 50 Prozent.
const BESTEHENSGRENZE = 50

interface Frage {
  karte: Lernkarte
  optionen: string[]
}

interface ProbepruefungProps {
  // Bereits gefilterte, für Multiple Choice geeignete Karten.
  pool: Lernkarte[]
  onKarteBeantwortet: (id: string, richtig: boolean) => void
  onAbgeschlossen: (richtig: number, gesamt: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  const kopie = [...arr]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
  }
  return kopie
}

// Falsche Antwortoptionen bevorzugt aus demselben Themenbereich – sonst wäre die richtige
// Antwort oft schon am Thema zu erkennen.
function fragenErstellen(pool: Lernkarte[]): Frage[] {
  return shuffle(pool)
    .slice(0, FRAGEN_PRO_PRUEFUNG)
    .map((karte) => {
      const andere = pool.filter((k) => k.id !== karte.id && k.antwort !== karte.antwort)
      const gleichesThema = shuffle(andere.filter((k) => k.themenbereich === karte.themenbereich))
      const rest = shuffle(andere.filter((k) => k.themenbereich !== karte.themenbereich))
      const distraktoren = [...gleichesThema, ...rest].slice(0, 3).map((k) => k.antwort)
      return { karte, optionen: shuffle([karte.antwort, ...distraktoren]) }
    })
}

export default function Probepruefung({ pool, onKarteBeantwortet, onAbgeschlossen }: ProbepruefungProps) {
  const [fragen, setFragen] = useState<Frage[] | null>(null)
  const [antworten, setAntworten] = useState<string[]>([])
  const [auswahl, setAuswahl] = useState<string | null>(null)
  const [start, setStart] = useState(0)
  const [jetzt, setJetzt] = useState(0)
  const [dauer, setDauer] = useState<number | null>(null)

  const laeuft = fragen !== null && dauer === null

  useEffect(() => {
    if (!laeuft) return
    const t = setInterval(() => setJetzt(Date.now()), 1000)
    return () => clearInterval(t)
  }, [laeuft])

  const starten = () => {
    setFragen(fragenErstellen(pool))
    setAntworten([])
    setAuswahl(null)
    setDauer(null)
    const t = Date.now()
    setStart(t)
    setJetzt(t)
  }

  if (pool.length < 4) {
    return (
      <div className="rounded-xl border border-db-gray-200 bg-db-surface p-6 text-center">
        <p className="text-sm text-db-navy-light">Zu wenige Karten für diesen Filter (mind. 4 nötig).</p>
      </div>
    )
  }

  if (!fragen) {
    const anzahl = Math.min(FRAGEN_PRO_PRUEFUNG, pool.length)
    return (
      <div className="space-y-3 rounded-xl border border-db-gray-200 bg-db-surface p-6 text-center">
        <GraduationCap size={28} className="mx-auto text-db-red" />
        <p className="text-lg font-semibold text-db-navy">Probeprüfung</p>
        <p className="text-sm text-db-navy-light">
          {anzahl} Fragen aus deinem aktuellen Filter, Multiple Choice, mit Zeitmessung. Erst am Ende siehst du, was
          richtig war. Bestanden ab {BESTEHENSGRENZE} %.
        </p>
        <button
          onClick={starten}
          className="mx-auto rounded-full bg-db-red px-6 py-2.5 text-sm font-semibold text-white hover:bg-db-red-dark"
        >
          Prüfung starten
        </button>
      </div>
    )
  }

  if (dauer !== null) {
    const ergebnisse = fragen.map((f, i) => ({ frage: f, antwort: antworten[i], richtig: antworten[i] === f.karte.antwort }))
    const richtig = ergebnisse.filter((e) => e.richtig).length
    const prozent = Math.round((richtig / fragen.length) * 100)
    const bestanden = prozent >= BESTEHENSGRENZE
    const themen = [...new Set(fragen.map((f) => f.karte.themenbereich))].map((thema) => {
      const liste = ergebnisse.filter((e) => e.frage.karte.themenbereich === thema)
      return { thema, richtig: liste.filter((e) => e.richtig).length, gesamt: liste.length }
    })
    const falsch = ergebnisse.filter((e) => !e.richtig)

    return (
      <div className="space-y-3">
        <div
          className={`space-y-1 rounded-xl border p-5 text-center ${
            bestanden ? 'border-db-green/30 bg-db-green/5' : 'border-db-red/30 bg-db-red/5'
          }`}
        >
          <p className={`text-3xl font-bold ${bestanden ? 'text-db-green' : 'text-db-red'}`}>{prozent} %</p>
          <p className="text-sm font-semibold text-db-navy">{bestanden ? 'Bestanden' : 'Nicht bestanden'}</p>
          <p className="text-xs text-db-navy-light">
            {richtig} von {fragen.length} richtig · {formatZeit(dauer)}
          </p>
        </div>

        <div className="rounded-xl border border-db-gray-200 bg-db-surface p-4">
          <p className="text-xs font-semibold text-db-navy-light">Nach Themenbereich</p>
          <div className="mt-2 space-y-1.5">
            {themen.map((t) => (
              <div key={t.thema} className="flex items-center justify-between text-sm">
                <span className="text-db-navy">{t.thema}</span>
                <span className={t.richtig === t.gesamt ? 'text-db-green' : 'text-db-navy-light'}>
                  {t.richtig}/{t.gesamt}
                </span>
              </div>
            ))}
          </div>
        </div>

        {falsch.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-db-navy-light">Das solltest du wiederholen</p>
            {falsch.map((e) => (
              <div key={e.frage.karte.id} className="rounded-xl border border-db-gray-200 bg-db-surface p-4">
                <p className="whitespace-pre-line text-sm font-medium text-db-navy">{e.frage.karte.frage}</p>
                <p className="mt-2 flex items-start gap-1.5 text-xs text-db-red">
                  <X size={13} className="mt-0.5 shrink-0" /> {e.antwort}
                </p>
                <p className="mt-1 flex items-start gap-1.5 text-xs text-db-green">
                  <Check size={13} className="mt-0.5 shrink-0" /> {e.frage.karte.antwort}
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={starten}
          className="mx-auto flex items-center gap-1.5 rounded-full bg-db-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-db-red-dark"
        >
          <RotateCcw size={15} /> Neue Probeprüfung
        </button>
      </div>
    )
  }

  const index = antworten.length
  const frage = fragen[index]

  const weiter = () => {
    if (auswahl === null) return
    const neu = [...antworten, auswahl]
    onKarteBeantwortet(frage.karte.id, auswahl === frage.karte.antwort)
    setAntworten(neu)
    setAuswahl(null)
    if (neu.length === fragen.length) {
      const sekunden = Math.round((Date.now() - start) / 1000)
      setDauer(sekunden)
      onAbgeschlossen(
        neu.filter((a, i) => a === fragen[i].karte.antwort).length,
        fragen.length,
      )
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-db-gray-100">
          <div
            className="h-full rounded-full bg-db-red transition-all duration-300"
            style={{ width: `${(index / fragen.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-db-navy-light">
          <span>
            Frage {index + 1} von {fragen.length}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {formatZeit(Math.max(0, Math.round((jetzt - start) / 1000)))}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-db-gray-200 bg-db-surface p-5">
        <p className="text-xs font-medium text-db-navy-light">{frage.karte.themenbereich}</p>
        <p className="mt-1 whitespace-pre-line text-base font-semibold text-db-navy">{frage.karte.frage}</p>
      </div>

      <div className="space-y-2">
        {frage.optionen.map((option) => (
          <button
            key={option}
            onClick={() => setAuswahl(option)}
            className={`w-full rounded-lg border px-4 py-3 text-left text-sm text-db-navy transition-colors ${
              auswahl === option ? 'border-db-red bg-db-red/5' : 'border-db-gray-200 hover:border-db-navy/30'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={weiter}
        disabled={auswahl === null}
        className="w-full rounded-full bg-db-red px-4 py-3 text-sm font-semibold text-white hover:bg-db-red-dark disabled:opacity-40"
      >
        {index + 1 === fragen.length ? 'Prüfung abgeben' : 'Weiter'}
      </button>
    </div>
  )
}
