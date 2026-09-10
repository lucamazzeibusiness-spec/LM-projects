import { CalendarCheck, Download, Loader2, Pencil, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { BerichtStatusBadge } from '../components/Badges'
import { useBerichtsheft } from '../hooks/useBerichtsheft'
import type { BerichtsheftEintrag, BerichtsheftKategorie } from '../data/mock'
import { heuteISO, heutigesDatumLabel, wochenLabel, wochenSchluessel } from '../lib/wochen'

const kategorien: BerichtsheftKategorie[] = ['Betrieblich', 'Berufsschule', 'Überbetrieblich']

function neuerTageseintrag(): BerichtsheftEintrag {
  return {
    id: `B-${Date.now()}`,
    datumISO: heuteISO(),
    datum: heutigesDatumLabel(),
    kategorie: 'Betrieblich',
    taetigkeiten: '',
    stunden: 8,
    status: 'Entwurf',
  }
}

interface Wochengruppe {
  schluessel: string
  label: string
  eintraege: BerichtsheftEintrag[]
}

export default function Berichtsheft() {
  const { eintraege, setEintraege } = useBerichtsheft()
  const [bearbeitung, setBearbeitung] = useState<BerichtsheftEintrag | null>(null)
  const [exportierendeWoche, setExportierendeWoche] = useState<string | null>(null)

  const heute = heuteISO()
  const heutigerEintrag = eintraege.find((e) => e.datumISO === heute)

  const wochen: Wochengruppe[] = useMemo(() => {
    const gruppen = new Map<string, BerichtsheftEintrag[]>()
    for (const e of eintraege) {
      const schluessel = wochenSchluessel(e.datumISO)
      const liste = gruppen.get(schluessel) ?? []
      liste.push(e)
      gruppen.set(schluessel, liste)
    }
    return [...gruppen.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([schluessel, liste]) => ({
        schluessel,
        label: wochenLabel(liste[0].datumISO),
        eintraege: liste.sort((a, b) => b.datumISO.localeCompare(a.datumISO)),
      }))
  }, [eintraege])

  const aktuelleWoche = wochen.find((w) => w.schluessel === wochenSchluessel(heute))
  const stundenDieseWoche = aktuelleWoche?.eintraege.reduce((sum, e) => sum + e.stunden, 0) ?? 0
  const offeneEntwuerfe = eintraege.filter((e) => e.status === 'Entwurf' && e.taetigkeiten.trim()).length

  const heuteBearbeiten = () => setBearbeitung(heutigerEintrag ?? neuerTageseintrag())

  const speichern = () => {
    if (!bearbeitung || !bearbeitung.taetigkeiten.trim()) return
    setEintraege((prev) => [bearbeitung, ...prev.filter((e) => e.id !== bearbeitung.id)])
    setBearbeitung(null)
  }

  const einreichen = (id: string) => {
    setEintraege((prev) =>
      prev.map((e) => (e.id === id && e.taetigkeiten.trim() ? { ...e, status: 'Eingereicht' } : e)),
    )
  }

  const wocheExportieren = async (gruppe: Wochengruppe) => {
    setExportierendeWoche(gruppe.schluessel)
    try {
      const { exportBerichtsheftPdf } = await import('../lib/exportBerichtsheft')
      exportBerichtsheftPdf(gruppe.eintraege, {
        titel: 'Wochenbericht',
        zeitraum: gruppe.label,
        dateiSuffix: gruppe.schluessel,
      })
    } finally {
      setExportierendeWoche(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-db-navy">Berichtsheft</h1>
        <p className="text-sm text-db-navy-light">
          Trag jeden Tag kurz ein, was du gemacht hast – am Ende der Woche fasst die App das automatisch zu deinem
          Wochenbericht zusammen.
        </p>
      </div>

      {!heutigerEintrag ? (
        <button
          onClick={heuteBearbeiten}
          className="flex w-full items-center justify-between rounded-xl border border-db-red/30 bg-db-red/5 px-4 py-3.5 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-db-red-dark">
            <CalendarCheck size={18} /> Heutigen Eintrag ausfüllen ({heutigesDatumLabel()})
          </span>
          <span className="rounded-full bg-db-red px-3 py-1.5 text-xs font-semibold text-white">Jetzt</span>
        </button>
      ) : (
        <button
          onClick={heuteBearbeiten}
          className="flex w-full items-center justify-between rounded-xl border border-db-green/30 bg-db-green/5 px-4 py-3.5 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-db-green">
            <CalendarCheck size={18} /> Heute schon erfasst ({heutigesDatumLabel()})
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-db-navy-light">
            <Pencil size={13} /> Bearbeiten
          </span>
        </button>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-db-gray-200 bg-white p-4">
          <p className="text-2xl font-semibold text-db-navy">{stundenDieseWoche} Std.</p>
          <p className="text-xs text-db-navy-light">Erfasst diese Woche</p>
        </div>
        <div className="rounded-xl border border-db-gray-200 bg-white p-4">
          <p className={`text-2xl font-semibold ${offeneEntwuerfe > 0 ? 'text-db-red' : 'text-db-green'}`}>
            {offeneEntwuerfe}
          </p>
          <p className="text-xs text-db-navy-light">Noch nicht eingereicht</p>
        </div>
      </div>

      {bearbeitung && (
        <div className="space-y-3 rounded-xl border border-db-red/30 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-db-navy">Eintrag · {bearbeitung.datum}</p>
            <button onClick={() => setBearbeitung(null)} className="text-db-navy-light hover:text-db-navy">
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {kategorien.map((k) => (
              <button
                key={k}
                onClick={() => setBearbeitung((d) => d && { ...d, kategorie: k })}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  bearbeitung.kategorie === k
                    ? 'border-db-navy bg-db-navy text-white'
                    : 'border-db-gray-200 bg-white text-db-navy-light'
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          <textarea
            value={bearbeitung.taetigkeiten}
            onChange={(e) => setBearbeitung((d) => d && { ...d, taetigkeiten: e.target.value })}
            rows={4}
            placeholder="Welche Tätigkeiten hast du heute ausgeführt oder welche Lerninhalte hattest du?"
            className="w-full rounded-lg border border-db-gray-200 px-3 py-2 text-sm text-db-navy outline-none focus:border-db-red"
          />

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-db-navy-light">Stunden</label>
            <input
              type="number"
              min={0}
              max={12}
              step={0.5}
              value={bearbeitung.stunden}
              onChange={(e) => setBearbeitung((d) => d && { ...d, stunden: Number(e.target.value) })}
              className="w-20 rounded-lg border border-db-gray-200 px-2 py-1.5 text-sm text-db-navy outline-none focus:border-db-red"
            />
          </div>

          <button
            onClick={speichern}
            className="w-full rounded-full bg-db-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-db-navy-light"
          >
            Speichern
          </button>
        </div>
      )}

      <div className="space-y-5">
        {wochen.map((gruppe) => {
          const vollstaendig = gruppe.eintraege.every((e) => e.taetigkeiten.trim())
          const stunden = gruppe.eintraege.reduce((sum, e) => sum + e.stunden, 0)
          return (
            <div key={gruppe.schluessel} className="space-y-2">
              <div className="flex items-center justify-between gap-3 px-1">
                <div>
                  <p className="text-sm font-semibold text-db-navy">Woche {gruppe.label}</p>
                  <p className="text-xs text-db-navy-light">
                    {gruppe.eintraege.length} Einträge · {stunden} Std. ·{' '}
                    <span className={vollstaendig ? 'text-db-green' : 'text-db-amber'}>
                      {vollstaendig ? 'vollständig' : 'in Bearbeitung'}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => wocheExportieren(gruppe)}
                  disabled={exportierendeWoche === gruppe.schluessel}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-db-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-db-navy hover:border-db-navy/30 disabled:opacity-60"
                >
                  {exportierendeWoche === gruppe.schluessel ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Download size={14} />
                  )}
                  Wochenbericht
                </button>
              </div>

              <div className="space-y-3">
                {gruppe.eintraege.map((e) => (
                  <div key={e.id} className="rounded-xl border border-db-gray-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-db-navy">{e.datum}</p>
                        <p className="text-xs text-db-navy-light">
                          {e.kategorie} · {e.stunden} Std.
                        </p>
                      </div>
                      <BerichtStatusBadge status={e.status} />
                    </div>
                    <p className="mt-2 text-sm text-db-navy">
                      {e.taetigkeiten || <span className="italic text-db-navy-light">Noch keine Angaben</span>}
                    </p>
                    {e.ausbilderKommentar && (
                      <p className="mt-2 rounded-lg bg-db-gray-50 p-2 text-xs text-db-navy-light">
                        <span className="font-semibold text-db-navy">Ausbilder:</span> {e.ausbilderKommentar}
                      </p>
                    )}
                    {e.status === 'Entwurf' && e.taetigkeiten.trim() && (
                      <button
                        onClick={() => einreichen(e.id)}
                        className="mt-3 rounded-full bg-db-red px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-db-red-dark"
                      >
                        Zur Freigabe einreichen
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
