import { Lock } from 'lucide-react'
import RangKarte from '../components/RangKarte'
import { usePunkte } from '../context/PunkteContext'
import { raenge, rangFuer } from '../lib/rang'

function relativeZeit(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minuten = Math.floor(diffMs / 60000)
  if (minuten < 1) return 'gerade eben'
  if (minuten < 60) return `vor ${minuten} Min.`
  const stunden = Math.floor(minuten / 60)
  if (stunden < 24) return `vor ${stunden} Std.`
  const tage = Math.floor(stunden / 24)
  return `vor ${tage} ${tage === 1 ? 'Tag' : 'Tagen'}`
}

export default function Fortschritt() {
  const { stand } = usePunkte()
  const { aktuell } = rangFuer(stand.gesamt)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-db-navy">Fortschritt</h1>
        <p className="text-sm text-db-navy-light">Punkte sammeln fürs Lernen und für dein Berichtsheft</p>
      </div>

      <RangKarte />

      <div className="rounded-xl border border-db-gray-200 bg-db-surface p-4">
        <h2 className="text-sm font-semibold text-db-navy">Ränge</h2>
        <div className="mt-3 space-y-1.5">
          {raenge.map((r) => (
            <div
              key={r.name}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                r.name === aktuell.name ? 'bg-db-red/5 font-semibold text-db-red-dark' : 'text-db-navy-light'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{r.icon}</span> {r.name}
              </span>
              <span className="text-xs">ab {r.minPunkte} P.</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-db-gray-200 bg-db-surface p-4 text-center">
        <Lock size={20} className="mx-auto text-db-navy-light" />
        <p className="mt-2 text-sm font-semibold text-db-navy">Shop kommt bald</p>
        <p className="mt-1 text-xs text-db-navy-light">
          Hier kannst du deine Punkte bald gegen etwas eintauschen – sammel schon mal fleißig.
        </p>
      </div>

      <div className="rounded-xl border border-db-gray-200 bg-db-surface p-4">
        <h2 className="text-sm font-semibold text-db-navy">Verlauf</h2>
        {stand.verlauf.length === 0 ? (
          <p className="mt-2 text-sm text-db-navy-light">Noch keine Punkte gesammelt – leg los im Wissen-Tab oder mit dem Berichtsheft.</p>
        ) : (
          <ul className="mt-3 divide-y divide-db-gray-100">
            {stand.verlauf.slice(0, 30).map((e) => (
              <li key={e.id + e.datum} className="flex items-center justify-between gap-3 py-2 text-sm">
                <div className="min-w-0">
                  <p className="truncate text-db-navy">{e.grund}</p>
                  <p className="text-xs text-db-navy-light">{relativeZeit(e.datum)}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-db-green">+{e.betrag}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
