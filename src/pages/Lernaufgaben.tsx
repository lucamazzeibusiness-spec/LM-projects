import { MapPin, Target } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GewerkBadge, PrioBadge, StatusBadge } from '../components/Badges'
import { lernaufgaben, type Gewerk, type LernaufgabeStatus } from '../data/mock'

const gewerke: (Gewerk | 'Alle')[] = ['Alle', 'Elektrik', 'Mechanik', 'Mechatronik']
const stati: (LernaufgabeStatus | 'Alle')[] = ['Alle', 'Offen', 'In Arbeit', 'Erledigt']

export default function Lernaufgaben() {
  const [gewerk, setGewerk] = useState<Gewerk | 'Alle'>('Alle')
  const [status, setStatus] = useState<LernaufgabeStatus | 'Alle'>('Alle')

  const gefiltert = useMemo(
    () =>
      lernaufgaben.filter(
        (a) => (gewerk === 'Alle' || a.gewerk === gewerk) && (status === 'Alle' || a.status === status),
      ),
    [gewerk, status],
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-db-navy">Lernaufgaben</h1>
        <p className="text-sm text-db-navy-light">Von deinem Ausbilder zugewiesen, mit Lernziel</p>
      </div>

      <div className="space-y-2">
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
        <div className="flex flex-wrap gap-2">
          {stati.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                status === s
                  ? 'border-db-navy bg-db-navy text-white'
                  : 'border-db-gray-200 bg-white text-db-navy-light hover:border-db-navy/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {gefiltert.map((a) => (
          <Link
            key={a.id}
            to={`/lernaufgaben/${a.id}`}
            className="block rounded-xl border border-db-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-db-navy-light">{a.id}</p>
                <p className="text-sm font-semibold text-db-navy">{a.titel}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-db-navy-light">
              <MapPin size={12} />
              {a.anlage} {a.baureihe ? `(${a.baureihe})` : ''} · {a.ort}
            </p>
            <p className="mt-2 flex items-start gap-1.5 text-xs text-db-navy">
              <Target size={13} className="mt-0.5 shrink-0 text-db-red" />
              {a.lernziel}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <GewerkBadge gewerk={a.gewerk} />
              <PrioBadge prioritaet={a.prioritaet} />
              <span className="text-xs text-db-navy-light">Fällig: {a.faelligkeit}</span>
            </div>
          </Link>
        ))}
        {gefiltert.length === 0 && (
          <p className="rounded-xl border border-dashed border-db-gray-200 p-6 text-center text-sm text-db-navy-light">
            Keine Lernaufgaben für diese Filter.
          </p>
        )}
      </div>
    </div>
  )
}
