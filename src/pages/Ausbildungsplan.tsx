import { ausbildungsplan, naechstePruefung, type AusbildungsblockTyp } from '../data/mock'

const typStyle: Record<AusbildungsblockTyp, string> = {
  Betrieb: 'bg-blue-50 text-blue-700',
  Berufsschule: 'bg-purple-50 text-purple-700',
  Überbetrieblich: 'bg-orange-50 text-orange-700',
}

export default function Ausbildungsplan() {
  const heuteIndex = 2

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
    </div>
  )
}
