import { usePunkte } from '../context/PunkteContext'
import { rangFuer } from '../lib/rang'

export default function RangKarte({ kompakt = false }: { kompakt?: boolean }) {
  const { stand, streak } = usePunkte()
  const { aktuell, naechster, fortschritt, punkteBisNaechster } = rangFuer(stand.gesamt)

  return (
    <div className={`rounded-xl border border-db-gray-200 bg-db-surface ${kompakt ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center gap-3">
        <span className={kompakt ? 'text-2xl' : 'text-3xl'}>{aktuell.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className={`font-semibold text-db-navy ${kompakt ? 'text-sm' : 'text-base'}`}>{aktuell.name}</p>
            <p className="shrink-0 text-xs font-medium text-db-navy-light">{stand.gesamt} Punkte</p>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-db-gray-100">
            <div
              className="h-full rounded-full bg-db-red transition-all duration-300"
              style={{ width: `${fortschritt * 100}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-db-navy-light">
            {naechster ? `Noch ${punkteBisNaechster} Punkte bis ${naechster.name} ${naechster.icon}` : 'Höchster Rang erreicht 🎉'}
          </p>
        </div>
      </div>
      {streak > 0 && !kompakt && (
        <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-db-amber/10 px-2.5 py-1.5 text-xs font-medium text-db-amber">
          🔥 {streak} {streak === 1 ? 'Tag' : 'Tage'} in Folge Berichtsheft geführt
        </p>
      )}
    </div>
  )
}
