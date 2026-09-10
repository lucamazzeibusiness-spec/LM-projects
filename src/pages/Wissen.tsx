import { AlertCircle, MapPin, Search, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { GewerkBadge } from '../components/Badges'
import { ersatzteile, fehlerfaelle, type Gewerk } from '../data/mock'

const gewerke: (Gewerk | 'Alle')[] = ['Alle', 'Elektrik', 'Mechanik', 'Mechatronik']
type Tab = 'fehlerdiagnose' | 'ersatzteile'

const schwierigkeitStyle: Record<string, string> = {
  Grundlagen: 'bg-db-green/10 text-db-green',
  Fortgeschritten: 'bg-db-amber/10 text-db-amber',
}

export default function Wissen() {
  const [tab, setTab] = useState<Tab>('fehlerdiagnose')
  const [query, setQuery] = useState('')
  const [gewerk, setGewerk] = useState<Gewerk | 'Alle'>('Alle')

  const fehler = useMemo(() => {
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

  const teile = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ersatzteile.filter((e) => {
      const matchesGewerk = gewerk === 'Alle' || e.kategorie === gewerk
      const matchesQuery = q === '' || e.name.toLowerCase().includes(q) || e.nummer.toLowerCase().includes(q)
      return matchesGewerk && matchesQuery
    })
  }, [query, gewerk])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-db-navy">Wissen</h1>
        <p className="text-sm text-db-navy-light">Nachschlagen und verstehen – nicht nur auswendig lernen</p>
      </div>

      <div className="flex gap-1 rounded-full bg-db-gray-100 p-1">
        <button
          onClick={() => setTab('fehlerdiagnose')}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            tab === 'fehlerdiagnose' ? 'bg-white text-db-navy shadow-sm' : 'text-db-navy-light'
          }`}
        >
          Fehlerdiagnose
        </button>
        <button
          onClick={() => setTab('ersatzteile')}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            tab === 'ersatzteile' ? 'bg-white text-db-navy shadow-sm' : 'text-db-navy-light'
          }`}
        >
          Ersatzteile-Lexikon
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-db-navy-light" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tab === 'fehlerdiagnose' ? 'z. B. E-4471, Türsteuerung, BR 412...' : 'Teilename oder Teilenummer...'}
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

      {tab === 'fehlerdiagnose' ? (
        <div className="space-y-3">
          {fehler.map((f) => (
            <div key={f.id} className="rounded-xl border border-db-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-db-red" />
                  <div>
                    <p className="text-xs font-mono font-medium text-db-navy-light">{f.code}</p>
                    <p className="text-sm font-semibold text-db-navy">{f.titel}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <GewerkBadge gewerk={f.gewerk} />
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${schwierigkeitStyle[f.schwierigkeit]}`}>
                    {f.schwierigkeit}
                  </span>
                </div>
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
              <p className="mt-3 rounded-lg border border-db-red/20 bg-db-red/5 p-2.5 text-xs text-db-red-dark">
                💡 {f.merksatz}
              </p>
            </div>
          ))}
          {fehler.length === 0 && (
            <p className="rounded-xl border border-dashed border-db-gray-200 p-6 text-center text-sm text-db-navy-light">
              Keine Treffer. Suchbegriff oder Filter anpassen.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {teile.map((e) => {
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
                <p className="mt-2 text-sm text-db-navy">{e.funktion}</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-db-navy-light">
                  <MapPin size={12} /> {e.lagerort} · Kategorie: {e.kategorie}
                </p>
              </div>
            )
          })}
          {teile.length === 0 && (
            <p className="rounded-xl border border-dashed border-db-gray-200 p-6 text-center text-sm text-db-navy-light">
              Keine Treffer. Suchbegriff oder Filter anpassen.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
