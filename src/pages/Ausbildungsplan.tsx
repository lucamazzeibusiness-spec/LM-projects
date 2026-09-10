import { ExternalLink } from 'lucide-react'
import {
  ausbildungsplan,
  azubiProfil,
  curricula,
  naechstePruefung,
  type AusbildungsblockTyp,
  type LernfeldStatus,
} from '../data/mock'

const typStyle: Record<AusbildungsblockTyp, string> = {
  Betrieb: 'bg-blue-50 text-blue-700',
  Berufsschule: 'bg-purple-50 text-purple-700',
  Überbetrieblich: 'bg-orange-50 text-orange-700',
}

const lernfeldStyle: Record<LernfeldStatus, string> = {
  Abgeschlossen: 'bg-db-green/10 text-db-green',
  Aktuell: 'bg-db-red/10 text-db-red',
  Geplant: 'bg-db-gray-100 text-db-navy-light',
}

export default function Ausbildungsplan() {
  const heuteIndex = 2
  const curriculum = curricula.find((c) => c.beruf === azubiProfil.ausbildungsberuf)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-db-navy">Ausbildungsplan</h1>
        <p className="text-sm text-db-navy-light">Diese Woche · Betrieb, Berufsschule und überbetriebliche Ausbildung</p>
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
          {ausbildungsplan.map((b, i) => (
            <li
              key={b.tag}
              className={`flex items-center justify-between gap-3 px-4 py-3 ${
                i === heuteIndex ? 'bg-db-red/5' : ''
              }`}
            >
              <div className="w-20 shrink-0">
                <p className={`text-sm font-semibold ${i === heuteIndex ? 'text-db-red' : 'text-db-navy'}`}>
                  {b.tag}
                </p>
                <p className="text-xs text-db-navy-light">{b.datum}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-db-navy">{b.thema}</p>
                <p className="text-xs text-db-navy-light">{b.ort}</p>
              </div>
              {b.thema !== 'Frei' && (
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${typStyle[b.typ]}`}>
                  {b.typ}
                </span>
              )}
            </li>
          ))}
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
