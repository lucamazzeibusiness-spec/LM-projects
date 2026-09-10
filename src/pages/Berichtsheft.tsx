import { Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BerichtStatusBadge } from '../components/Badges'
import { berichtsheft as initialEintraege, type BerichtsheftEintrag, type BerichtsheftKategorie } from '../data/mock'

const STORAGE_KEY = 'berichtsheft:eintraege'
const kategorien: BerichtsheftKategorie[] = ['Betrieblich', 'Berufsschule', 'Überbetrieblich']

function useEintraege() {
  const [eintraege, setEintraege] = useState<BerichtsheftEintrag[]>(initialEintraege)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setEintraege(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eintraege))
  }, [eintraege])

  return { eintraege, setEintraege }
}

function leererEntwurf(): BerichtsheftEintrag {
  return {
    id: `B-${Date.now()}`,
    datum: new Date().toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit' }),
    kategorie: 'Betrieblich',
    taetigkeiten: '',
    stunden: 8,
    status: 'Entwurf',
  }
}

export default function Berichtsheft() {
  const { eintraege, setEintraege } = useEintraege()
  const [neu, setNeu] = useState<BerichtsheftEintrag | null>(null)

  const wocheStunden = eintraege.reduce((sum, e) => sum + e.stunden, 0)
  const offeneEntwuerfe = eintraege.filter((e) => e.status === 'Entwurf').length

  const speichern = () => {
    if (!neu || !neu.taetigkeiten.trim()) return
    setEintraege((prev) => [neu, ...prev.filter((e) => e.id !== neu.id)])
    setNeu(null)
  }

  const einreichen = (id: string) => {
    setEintraege((prev) =>
      prev.map((e) => (e.id === id && e.taetigkeiten.trim() ? { ...e, status: 'Eingereicht' } : e)),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-db-navy">Berichtsheft</h1>
          <p className="text-sm text-db-navy-light">Dein digitaler Ausbildungsnachweis</p>
        </div>
        <button
          onClick={() => setNeu(leererEntwurf())}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-db-red px-4 py-2 text-sm font-semibold text-white hover:bg-db-red-dark"
        >
          <Plus size={16} /> Eintrag
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-db-gray-200 bg-white p-4">
          <p className="text-2xl font-semibold text-db-navy">{wocheStunden} Std.</p>
          <p className="text-xs text-db-navy-light">Erfasst diese Woche</p>
        </div>
        <div className="rounded-xl border border-db-gray-200 bg-white p-4">
          <p className={`text-2xl font-semibold ${offeneEntwuerfe > 0 ? 'text-db-red' : 'text-db-green'}`}>
            {offeneEntwuerfe}
          </p>
          <p className="text-xs text-db-navy-light">Noch nicht eingereicht</p>
        </div>
      </div>

      {neu && (
        <div className="space-y-3 rounded-xl border border-db-red/30 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-db-navy">Neuer Eintrag · {neu.datum}</p>
            <button onClick={() => setNeu(null)} className="text-db-navy-light hover:text-db-navy">
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {kategorien.map((k) => (
              <button
                key={k}
                onClick={() => setNeu((d) => d && { ...d, kategorie: k })}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  neu.kategorie === k
                    ? 'border-db-navy bg-db-navy text-white'
                    : 'border-db-gray-200 bg-white text-db-navy-light'
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          <textarea
            value={neu.taetigkeiten}
            onChange={(e) => setNeu((d) => d && { ...d, taetigkeiten: e.target.value })}
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
              value={neu.stunden}
              onChange={(e) => setNeu((d) => d && { ...d, stunden: Number(e.target.value) })}
              className="w-20 rounded-lg border border-db-gray-200 px-2 py-1.5 text-sm text-db-navy outline-none focus:border-db-red"
            />
          </div>

          <button
            onClick={speichern}
            className="w-full rounded-full bg-db-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-db-navy-light"
          >
            Als Entwurf speichern
          </button>
        </div>
      )}

      <div className="space-y-3">
        {eintraege.map((e) => (
          <div key={e.id} className="rounded-xl border border-db-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-db-navy">{e.datum}</p>
                <p className="text-xs text-db-navy-light">{e.kategorie} · {e.stunden} Std.</p>
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
}
