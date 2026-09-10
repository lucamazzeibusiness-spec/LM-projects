import { schichtplan } from '../data/mock'

export default function Schichtplan() {
  const heuteIndex = 2 // Mittwoch als "heute" markiert, passend zum Mock-Datum

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-db-navy">Schichtplan</h1>
        <p className="text-sm text-db-navy-light">Diese Woche · Team Elektrik 2 / Mechatronik 1</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-db-gray-200 bg-white">
        <ul className="divide-y divide-db-gray-100">
          {schichtplan.map((s, i) => (
            <li
              key={s.tag}
              className={`flex items-center justify-between gap-3 px-4 py-3 ${
                i === heuteIndex ? 'bg-db-red/5' : ''
              }`}
            >
              <div className="w-20 shrink-0">
                <p className={`text-sm font-semibold ${i === heuteIndex ? 'text-db-red' : 'text-db-navy'}`}>
                  {s.tag}
                </p>
                <p className="text-xs text-db-navy-light">{s.datum}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-db-navy">{s.funktion}</p>
                <p className="text-xs text-db-navy-light">{s.team}</p>
              </div>
              <div className="shrink-0 text-right text-sm font-medium text-db-navy">
                {s.von !== '-' ? `${s.von} – ${s.bis}` : 'Frei'}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
