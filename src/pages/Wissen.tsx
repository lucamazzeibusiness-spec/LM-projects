import { AlertCircle, AlertTriangle, Brain, Search, Star, TrainFront, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { GewerkBadge } from '../components/Badges'
import BaureihenQuiz from '../components/BaureihenQuiz'
import DBFaktenQuiz from '../components/DBFaktenQuiz'
import LernkartenQuiz from '../components/LernkartenQuiz'
import RangKarte from '../components/RangKarte'
import { useAzubiProfil } from '../context/AzubiProfilContext'
import {
  bauteile,
  baureihen,
  baureihenText,
  fahrzeugarten,
  fehlerfaelle,
  passtZuBaureihen,
} from '../data/fahrzeuge'
import type { Gewerk } from '../data/mock'

const gewerke: (Gewerk | 'Alle')[] = ['Alle', 'Elektrik', 'Mechanik', 'Mechatronik']
type Tab = 'fehlerdiagnose' | 'bauteile' | 'fahrzeuge' | 'dbfakten' | 'pruefung'

const tabs: [Tab, string][] = [
  ['fehlerdiagnose', 'Fehlerdiagnose'],
  ['bauteile', 'Bauteil-Lexikon'],
  ['fahrzeuge', 'Fahrzeuge'],
  ['dbfakten', 'DB-Fakten'],
  ['pruefung', 'Prüfungstraining'],
]

const schwierigkeitStyle: Record<string, string> = {
  Grundlagen: 'bg-db-green/10 text-db-green',
  Fortgeschritten: 'bg-db-amber/10 text-db-amber',
}

// 'meine' = die im Profil markierten Baureihen, 'alle' = kein Filter, sonst eine Baureihen-ID.
type BaureihenAuswahl = 'meine' | 'alle' | string

export default function Wissen() {
  const { profil, profilSpeichern } = useAzubiProfil()
  const meineBaureihen = profil?.baureihen ?? []
  const [tab, setTab] = useState<Tab>('fehlerdiagnose')
  const [query, setQuery] = useState('')
  const [gewerk, setGewerk] = useState<Gewerk | 'Alle'>('Alle')
  const [quizOffen, setQuizOffen] = useState(false)
  const [auswahl, setAuswahl] = useState<BaureihenAuswahl>(() => (meineBaureihen.length > 0 ? 'meine' : 'alle'))

  const gespeicherteBaureihen = profil?.baureihen
  const baureihenFilter = useMemo<string[] | null>(() => {
    if (auswahl === 'alle') return null
    if (auswahl === 'meine') return gespeicherteBaureihen && gespeicherteBaureihen.length > 0 ? gespeicherteBaureihen : null
    return [auswahl]
  }, [auswahl, gespeicherteBaureihen])

  const fehler = useMemo(() => {
    const q = query.trim().toLowerCase()
    return fehlerfaelle.filter((f) => {
      const matchesGewerk = gewerk === 'Alle' || f.gewerk === gewerk
      const matchesQuery =
        q === '' ||
        f.titel.toLowerCase().includes(q) ||
        f.ursache.toLowerCase().includes(q) ||
        baureihenText(f.baureihen, 99).toLowerCase().includes(q) ||
        f.symptome.some((s) => s.toLowerCase().includes(q))
      return matchesGewerk && matchesQuery && passtZuBaureihen(f.baureihen, baureihenFilter)
    })
  }, [query, gewerk, baureihenFilter])

  const teile = useMemo(() => {
    const q = query.trim().toLowerCase()
    return bauteile.filter((b) => {
      const matchesGewerk = gewerk === 'Alle' || b.kategorie === gewerk
      const matchesQuery = q === '' || b.name.toLowerCase().includes(q) || b.funktion.toLowerCase().includes(q)
      return matchesGewerk && matchesQuery && passtZuBaureihen(b.baureihen, baureihenFilter)
    })
  }, [query, gewerk, baureihenFilter])

  const fahrzeuge = useMemo(() => {
    const q = query.trim().toLowerCase()
    return baureihen.filter(
      (b) =>
        q === '' ||
        b.name.toLowerCase().includes(q) ||
        (b.spitzname ?? '').toLowerCase().includes(q) ||
        b.einsatz.toLowerCase().includes(q) ||
        b.hersteller.toLowerCase().includes(q),
    )
  }, [query])

  const meineUmschalten = (id: string) => {
    if (!profil) return
    const neu = meineBaureihen.includes(id) ? meineBaureihen.filter((x) => x !== id) : [...meineBaureihen, id]
    profilSpeichern({ ...profil, baureihen: neu })
    if (meineBaureihen.length === 0 && neu.length > 0) setAuswahl('meine')
    if (auswahl === 'meine' && neu.length === 0) setAuswahl('alle')
  }

  const fehlerfaelleZeigen = (id: string) => {
    setAuswahl(id)
    setGewerk('Alle')
    setQuery('')
    setTab('fehlerdiagnose')
  }

  const mitFilter = tab === 'fehlerdiagnose' || tab === 'bauteile'

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-db-navy">Wissen</h1>
        <p className="text-sm text-db-navy-light">Nachschlagen und verstehen – nicht nur auswendig lernen</p>
      </div>

      <RangKarte kompakt />

      <div className="flex gap-1 overflow-x-auto rounded-full bg-db-gray-100 p-1">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold ${
              tab === id ? 'bg-db-surface text-db-navy shadow-sm' : 'text-db-navy-light'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'pruefung' && <LernkartenQuiz />}
      {tab === 'dbfakten' && <DBFaktenQuiz />}

      {(mitFilter || (tab === 'fahrzeuge' && !quizOffen)) && (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-db-navy-light" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              tab === 'fehlerdiagnose'
                ? 'z. B. Stromabnehmer, Tür, PZB, BR 412...'
                : tab === 'bauteile'
                  ? 'z. B. Radsatz, Hauptschalter, Bremse...'
                  : 'z. B. 193, Vectron, ICE 4, S-Bahn...'
            }
            className="w-full rounded-lg border border-db-gray-200 bg-db-surface py-2.5 pl-9 pr-3 text-sm text-db-navy outline-none focus:border-db-red"
          />
        </div>
      )}

      {mitFilter && (
        <>
          <select
            value={auswahl}
            onChange={(e) => setAuswahl(e.target.value)}
            className="w-full rounded-lg border border-db-gray-200 bg-db-surface px-3 py-2.5 text-sm text-db-navy outline-none focus:border-db-red"
          >
            {meineBaureihen.length > 0 && <option value="meine">Meine Baureihen ({meineBaureihen.length})</option>}
            <option value="alle">Alle Baureihen</option>
            {fahrzeugarten.map((art) => (
              <optgroup key={art} label={art}>
                {baureihen
                  .filter((b) => b.art === art)
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                      {b.spitzname ? ` – ${b.spitzname}` : ''}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          {meineBaureihen.length === 0 && (
            <p className="text-xs text-db-navy-light">
              Tipp: Markier im Tab <span className="font-semibold">Fahrzeuge</span> mit ☆ die Baureihen, an denen du
              arbeitest – dann zeigt die App dir zuerst die passenden Fälle und Bauteile.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {gewerke.map((g) => (
              <button
                key={g}
                onClick={() => setGewerk(g)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  gewerk === g
                    ? 'border-db-red bg-db-red text-white'
                    : 'border-db-gray-200 bg-db-surface text-db-navy-light hover:border-db-red/40'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </>
      )}

      {mitFilter && (
        <p className="text-[11px] text-db-navy-light">
          Lernbeispiele zum Verstehen – maßgeblich sind immer die Instandhaltungsunterlagen und Vorgaben deines Werks.
        </p>
      )}

      {tab === 'fehlerdiagnose' && (
        <div className="space-y-3">
          {fehler.map((f) => (
            <div key={f.id} className="rounded-xl border border-db-gray-200 bg-db-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-db-red" />
                  <p className="text-sm font-semibold text-db-navy">{f.titel}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <GewerkBadge gewerk={f.gewerk} />
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${schwierigkeitStyle[f.schwierigkeit]}`}>
                    {f.schwierigkeit}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-db-navy-light">
                {baureihenText(f.baureihen)} · {f.haeufigkeit}
              </p>

              <div className="mt-3">
                <p className="text-xs font-medium text-db-navy-light">Symptome</p>
                <p className="text-sm text-db-navy">{f.symptome.join(' · ')}</p>
              </div>
              <div className="mt-2">
                <p className="text-xs font-medium text-db-navy-light">Wahrscheinliche Ursache</p>
                <p className="text-sm text-db-navy">{f.ursache}</p>
              </div>
              <div className="mt-3 rounded-lg bg-db-gray-50 p-3">
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-db-navy-light">
                  <Wrench size={13} /> Vorgehen
                </p>
                <ol className="list-decimal space-y-1 pl-4 text-sm text-db-navy">
                  {f.loesung.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
              <p className="mt-3 rounded-lg border border-db-red/20 bg-db-red/5 p-2.5 text-xs text-db-red-dark">💡 {f.merksatz}</p>
            </div>
          ))}
          {fehler.length === 0 && (
            <p className="rounded-xl border border-dashed border-db-gray-200 p-6 text-center text-sm text-db-navy-light">
              Keine Treffer. Suchbegriff, Baureihe oder Filter anpassen.
            </p>
          )}
        </div>
      )}

      {tab === 'bauteile' && (
        <div className="space-y-3">
          {teile.map((b) => (
            <div key={b.id} className="rounded-xl border border-db-gray-200 bg-db-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-db-navy">{b.name}</p>
                <GewerkBadge gewerk={b.kategorie} />
              </div>
              <p className="mt-1 text-xs text-db-navy-light">{baureihenText(b.baureihen)}</p>
              <p className="mt-2 text-sm text-db-navy">{b.funktion}</p>
              <div className="mt-3 rounded-lg bg-db-gray-50 p-3">
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-db-navy-light">
                  <Wrench size={13} /> Typische Prüfungen
                </p>
                <ul className="list-disc space-y-1 pl-4 text-sm text-db-navy">
                  {b.pruefung.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              {b.sicherheit && (
                <p className="mt-3 flex items-start gap-1.5 rounded-lg border border-db-amber/30 bg-db-amber/5 p-2.5 text-xs text-db-navy">
                  <AlertTriangle size={13} className="mt-0.5 shrink-0 text-db-amber" /> {b.sicherheit}
                </p>
              )}
            </div>
          ))}
          {teile.length === 0 && (
            <p className="rounded-xl border border-dashed border-db-gray-200 p-6 text-center text-sm text-db-navy-light">
              Keine Treffer. Suchbegriff, Baureihe oder Filter anpassen.
            </p>
          )}
        </div>
      )}

      {tab === 'fahrzeuge' && quizOffen && <BaureihenQuiz onSchliessen={() => setQuizOffen(false)} />}

      {tab === 'fahrzeuge' && !quizOffen && (
        <div className="space-y-5">
          <button
            onClick={() => setQuizOffen(true)}
            className="flex w-full items-center justify-between rounded-xl border border-db-red/30 bg-db-red/5 px-4 py-3 text-left"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-db-red-dark">
              <Brain size={16} /> Baureihen-Quiz: Erkennst du die Fahrzeuge?
            </span>
            <span className="rounded-full bg-db-red px-3 py-1.5 text-xs font-semibold text-white">Start</span>
          </button>
          <p className="text-xs text-db-navy-light">
            Echte Baureihen der Deutschen Bahn. Markier mit ☆ die, an denen du arbeitest – Fehlerdiagnose und
            Bauteil-Lexikon zeigen dir dann zuerst die passenden Einträge.
          </p>
          {fahrzeugarten.map((art) => {
            const liste = fahrzeuge.filter((b) => b.art === art)
            if (liste.length === 0) return null
            return (
              <div key={art} className="space-y-2">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-db-navy-light">{art}</h2>
                {liste.map((b) => {
                  const meine = meineBaureihen.includes(b.id)
                  const anzahlFaelle = fehlerfaelle.filter((f) => f.baureihen.includes(b.id)).length
                  return (
                    <div key={b.id} className="rounded-xl border border-db-gray-200 bg-db-surface p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <TrainFront size={16} className="mt-0.5 shrink-0 text-db-red" />
                          <div>
                            <p className="text-sm font-semibold text-db-navy">
                              {b.name}
                              {b.spitzname && <span className="font-normal text-db-navy-light"> · {b.spitzname}</span>}
                            </p>
                            <p className="text-xs text-db-navy-light">{b.einsatz}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => meineUmschalten(b.id)}
                          aria-label={meine ? 'Aus meinen Baureihen entfernen' : 'Zu meinen Baureihen hinzufügen'}
                          className={`shrink-0 rounded-full p-1.5 ${meine ? 'text-db-amber' : 'text-db-navy-light hover:text-db-amber'}`}
                        >
                          <Star size={18} fill={meine ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        <span className="text-db-navy-light">Höchstgeschwindigkeit</span>
                        <span className="text-db-navy">{b.vmax} km/h</span>
                        {b.leistung && (
                          <>
                            <span className="text-db-navy-light">Leistung</span>
                            <span className="text-db-navy">{b.leistung}</span>
                          </>
                        )}
                        <span className="text-db-navy-light">Gebaut</span>
                        <span className="text-db-navy">{b.baujahre}</span>
                        <span className="text-db-navy-light">Hersteller</span>
                        <span className="text-db-navy">{b.hersteller}</span>
                      </div>
                      {b.hinweis && <p className="mt-2 text-xs text-db-navy">{b.hinweis}</p>}
                      {anzahlFaelle > 0 && (
                        <button
                          onClick={() => fehlerfaelleZeigen(b.id)}
                          className="mt-3 text-xs font-semibold text-db-red hover:underline"
                        >
                          {anzahlFaelle} typische Fehlerfälle ansehen →
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
          {fahrzeuge.length === 0 && (
            <p className="rounded-xl border border-dashed border-db-gray-200 p-6 text-center text-sm text-db-navy-light">
              Keine Baureihe gefunden.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
