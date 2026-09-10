import { AlertCircle, Search, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { GewerkBadge } from '../components/Badges'
import { fehlerfaelle, type Gewerk } from '../data/mock'

const gewerke: (Gewerk | 'Alle')[] = ['Alle', 'Elektrik', 'Mechanik', 'Mechatronik']

export default function Fehlerdiagnose() {
  const [query, setQuery] = useState('')
  const [gewerk, setGewerk] = useState<Gewerk | 'Alle'>('Alle')

  const ergebnisse = useMemo(() => {
    const q = query.trim().toLowerCase()
    return fehlerfaelle.filter((f) => {
      const matchesGewerk = gewerk === 'Alle' || f.gewerk === gewerk
      const matchesQuery =
        q === '' ||
        f.code.toLowerCase().includes(q) ||
        f.titel.toLowerCase().includes(q) ||
        f.baureihe.toLowerCase().includes(q) ||
        f.symptome.some((s) => s.toLowerCase().includes(q))
      return matchesGewerk && matchesQuery
    })
  }, [query, gewerk])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-db-navy">Fehlerdiagnose</h1>
        <p className="text-sm text-db-navy-light">Fehlercode, Symptom oder Baureihe eingeben</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-db-navy-light" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="z. B. E-4471, Türsteuerung, BR 412..."
          className="w-full rounded-lg border border-db-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-db-navy outline-none focus:border-db-red"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {gewerke.map((g) => (
          <button
            key={g}
            onClick={() => setGewerk(g)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              gewerk === g
                ? 'border-db-red bg-db-red text-white'
                : 'border-db-gray-200 bg-white text-db-navy-light hover:border-db-red/40'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {ergebnisse.map((f) => (
          <div key={f.id} className="rounded-xl border border-db-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-db-red" />
                <div>
                  <p className="text-xs font-mono font-medium text-db-navy-light">{f.code}</p>
                  <p className="text-sm font-semibold text-db-navy">{f.titel}</p>
                </div>
              </div>
              <GewerkBadge gewerk={f.gewerk} />
            </div>
            <p className="mt-1 text-xs text-db-navy-light">{f.baureihe} · {f.haeufigkeit}</p>

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
                <Wrench size={13} /> Lösungsschritte
              </p>
              <ol className="list-decimal space-y-1 pl-4 text-sm text-db-navy">
                {f.loesung.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
        {ergebnisse.length === 0 && (
          <p className="rounded-xl border border-dashed border-db-gray-200 p-6 text-center text-sm text-db-navy-light">
            Keine Treffer. Suchbegriff oder Filter anpassen.
          </p>
        )}
      </div>
    </div>
  )
}
