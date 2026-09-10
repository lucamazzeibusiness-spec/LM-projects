import { ExternalLink, Pencil, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useAusbildungsplan } from '../hooks/useAusbildungsplan'
import { aktuelleWochentage, heutigerWochentagIndex } from '../lib/wochen'
import {
  azubiProfil,
  curricula,
  naechstePruefung,
  type Ausbildungsblock,
  type AusbildungsblockTyp,
  type LernfeldStatus,
} from '../data/mock'

const typStyle: Record<AusbildungsblockTyp, string> = {
  Betrieb: 'bg-blue-50 text-blue-700',
  Berufsschule: 'bg-purple-50 text-purple-700',
  'DB Training': 'bg-orange-50 text-orange-700',
}

const typen: AusbildungsblockTyp[] = ['Betrieb', 'Berufsschule', 'DB Training']

const lernfeldStyle: Record<LernfeldStatus, string> = {
  Abgeschlossen: 'bg-db-green/10 text-db-green',
  Aktuell: 'bg-db-red/10 text-db-red',
  Geplant: 'bg-db-gray-100 text-db-navy-light',
}

interface Entwurf {
  typ: AusbildungsblockTyp | 'Frei'
  thema: string
  ort: string
}

function entwurfAus(eintrag: Ausbildungsblock | null): Entwurf {
  return eintrag ? { ...eintrag } : { typ: 'Betrieb', thema: '', ort: '' }
}

export default function Ausbildungsplan() {
  const { vorlage, tagSetzen } = useAusbildungsplan()
  const wochentage = aktuelleWochentage()
  const heuteIndex = heutigerWochentagIndex()
  const curriculum = curricula.find((c) => c.beruf === azubiProfil.ausbildungsberuf)

  const [bearbeitungsIndex, setBearbeitungsIndex] = useState<number | null>(null)
  const [entwurf, setEntwurf] = useState<Entwurf>({ typ: 'Betrieb', thema: '', ort: '' })

  const bearbeiten = (index: number) => {
    setEntwurf(entwurfAus(vorlage[index]))
    setBearbeitungsIndex(index)
  }

  const speichern = () => {
    if (bearbeitungsIndex === null) return
    if (entwurf.typ === 'Frei') {
      tagSetzen(bearbeitungsIndex, null)
    } else {
      tagSetzen(bearbeitungsIndex, { typ: entwurf.typ, thema: entwurf.thema, ort: entwurf.ort })
    }
    setBearbeitungsIndex(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-db-navy">Ausbildungsplan</h1>
        <p className="text-sm text-db-navy-light">
          Dein eigener Rhythmus · trag hier ein, wann Betrieb, Berufsschule oder DB Training ist
        </p>
      </div>

      <div className="rounded-xl border border-db-navy/10 bg-db-navy p-4 text-white">
        <p className="text-xs font-medium text-white/60">Nächster Prüfungstermin</p>
        <p className="mt-1 text-lg font-semibold">{naechstePruefung.titel}</p>
        <p className="text-sm text-white/70">
          {naechstePruefung.datum} · noch {naechstePruefung.tageVerbleibend} Tage
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-db-gray-200 bg-white">
        <ul className="divide-y divide-db-gray-100">
          {wochentage.map(({ tag, datum }, i) => {
            const eintrag = vorlage[i]
            const wirdBearbeitet = bearbeitungsIndex === i

            return (
              <li key={tag} className={i === heuteIndex ? 'bg-db-red/5' : ''}>
                {wirdBearbeitet ? (
                  <div className="space-y-2.5 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${i === heuteIndex ? 'text-db-red' : 'text-db-navy'}`}>
                        {tag}, {datum}
                      </p>
                      <button onClick={() => setBearbeitungsIndex(null)} className="text-db-navy-light hover:text-db-navy">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[...typen, 'Frei' as const].map((t) => (
                        <button
                          key={t}
                          onClick={() => setEntwurf((d) => ({ ...d, typ: t }))}
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                            entwurf.typ === t
                              ? 'border-db-navy bg-db-navy text-white'
                              : 'border-db-gray-200 bg-white text-db-navy-light'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    {entwurf.typ !== 'Frei' && (
                      <>
                        <input
                          value={entwurf.thema}
                          onChange={(e) => setEntwurf((d) => ({ ...d, thema: e.target.value }))}
                          placeholder="z. B. Fahrzeuginstandhaltung – Elektrik / Lernfeld 6"
                          className="w-full rounded-lg border border-db-gray-200 px-3 py-2 text-sm text-db-navy outline-none focus:border-db-red"
                        />
                        <input
                          value={entwurf.ort}
                          onChange={(e) => setEntwurf((d) => ({ ...d, ort: e.target.value }))}
                          placeholder="Ort, z. B. Werk Rummelsburg"
                          className="w-full rounded-lg border border-db-gray-200 px-3 py-2 text-sm text-db-navy outline-none focus:border-db-red"
                        />
                      </>
                    )}
                    <button
                      onClick={speichern}
                      className="w-full rounded-full bg-db-red px-4 py-2 text-sm font-semibold text-white hover:bg-db-red-dark"
                    >
                      Speichern
                    </button>
                  </div>
                ) : (
                  <button onClick={() => bearbeiten(i)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
                    <div className="w-20 shrink-0">
                      <p className={`text-sm font-semibold ${i === heuteIndex ? 'text-db-red' : 'text-db-navy'}`}>
                        {tag}
                      </p>
                      <p className="text-xs text-db-navy-light">{datum}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      {eintrag ? (
                        <>
                          <p className="truncate text-sm text-db-navy">{eintrag.thema || eintrag.typ}</p>
                          {eintrag.ort && <p className="text-xs text-db-navy-light">{eintrag.ort}</p>}
                        </>
                      ) : (
                        <p className="text-sm text-db-navy-light italic">Frei / kein Eintrag</p>
                      )}
                    </div>
                    {eintrag ? (
                      <span
                        className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${typStyle[eintrag.typ]}`}
                      >
                        <Pencil size={11} /> {eintrag.typ}
                      </span>
                    ) : (
                      <span className="flex shrink-0 items-center gap-1 rounded-full border border-dashed border-db-gray-200 px-2.5 py-1 text-xs font-medium text-db-navy-light">
                        <Plus size={11} /> Eintragen
                      </span>
                    )}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {curriculum && (
        <>
          <div className="rounded-xl border border-db-gray-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-db-navy">Lernfelder · {curriculum.beruf}</h2>
            <p className="mt-1 text-xs text-db-navy-light">
              Rahmenlehrplan der Berufsschule – zeigt, wo du im Vergleich zum Lehrplan stehst.
            </p>
            <ul className="mt-3 space-y-2">
              {curriculum.lernfelder.map((lf) => (
                <li
                  key={lf.nummer}
                  className="flex items-center justify-between gap-3 rounded-lg border border-db-gray-200 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm text-db-navy">
                      <span className="font-mono text-xs text-db-navy-light">LF{lf.nummer}</span> {lf.titel}
                    </p>
                    <p className="text-xs text-db-navy-light">
                      {lf.ausbildungsjahr}. Ausbildungsjahr · {lf.stunden} Std.
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${lernfeldStyle[lf.status]}`}
                  >
                    {lf.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-db-gray-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-db-navy">Abschlussprüfung (gestreckt)</h2>
            <div className="mt-3 space-y-3">
              {[curriculum.teil1, curriculum.teil2].map((teil) => (
                <div key={teil.bezeichnung} className="rounded-lg bg-db-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-db-navy">{teil.bezeichnung}</p>
                    <span className="text-xs font-semibold text-db-red">{teil.gewichtungGesamt}</span>
                  </div>
                  <p className="text-xs text-db-navy-light">{teil.zeitpunkt}</p>
                  <ul className="mt-2 space-y-1">
                    {teil.bereiche.map((b) => (
                      <li key={b.name} className="flex items-center justify-between text-xs text-db-navy">
                        <span>{b.name}</span>
                        <span className="text-db-navy-light">
                          {b.gewichtung}
                          {b.dauer ? ` · ${b.dauer}` : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-xs text-db-navy-light">
              <ExternalLink size={12} className="mt-0.5 shrink-0" />
              Quelle: {curriculum.quelle}. Öffentlich zugängliche IHK-/KMK-Angaben – die verbindliche Fassung gilt
              laut deinem Ausbildungsvertrag und deiner IHK.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
