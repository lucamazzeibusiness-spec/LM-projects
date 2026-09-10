import { MapPin, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ersatzteile } from '../data/mock'

export default function Ersatzteile() {
  const [query, setQuery] = useState('')
  const [bestellt, setBestellt] = useState<Record<string, boolean>>({})

  const gefiltert = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ersatzteile
    return ersatzteile.filter(
      (e) => e.name.toLowerCase().includes(q) || e.nummer.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-db-navy">Ersatzteile</h1>
        <p className="text-sm text-db-navy-light">Lagerbestand am Standort Werk Rummelsburg</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-db-navy-light" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Teilename oder Teilenummer..."
          className="w-full rounded-lg border border-db-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-db-navy outline-none focus:border-db-red"
        />
      </div>

      <div className="space-y-3">
        {gefiltert.map((e) => {
          const knapp = e.bestand < e.mindestbestand
          return (
            <div key={e.id} className="rounded-xl border border-db-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-db-navy">{e.name}</p>
                  <p className="font-mono text-xs text-db-navy-light">{e.nummer}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    knapp ? 'bg-db-red/10 text-db-red' : 'bg-db-green/10 text-db-green'
                  }`}
                >
                  {e.bestand} {e.einheit}
                  {knapp ? ' · knapp' : ''}
                </span>
              </div>
              <p className="mt-2 flex items-center gap-1 text-xs text-db-navy-light">
                <MapPin size={12} /> {e.lagerort} · Kategorie: {e.kategorie}
              </p>
              <button
                onClick={() => setBestellt((b) => ({ ...b, [e.id]: true }))}
                disabled={bestellt[e.id]}
                className={`mt-3 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  bestellt[e.id]
                    ? 'bg-db-green/10 text-db-green'
                    : 'bg-db-navy text-white hover:bg-db-navy-light'
                }`}
              >
                {bestellt[e.id] ? 'Nachbestellung ausgelöst' : 'Nachbestellen'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
