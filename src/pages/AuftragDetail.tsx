import { Camera, Check, ChevronLeft, PenLine, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GewerkBadge, PrioBadge, StatusBadge } from '../components/Badges'
import { auftraege } from '../data/mock'

interface Draft {
  checked: Record<string, boolean>
  notiz: string
  signiert: boolean
}

export default function AuftragDetail() {
  const { id } = useParams()
  const auftrag = auftraege.find((a) => a.id === id)
  const storageKey = `wartungsprotokoll:${id}`

  const [draft, setDraft] = useState<Draft>({ checked: {}, notiz: '', signiert: false })
  const [savedHint, setSavedHint] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(storageKey)
    if (raw) setDraft(JSON.parse(raw))
  }, [storageKey])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(draft))
    setSavedHint(true)
    const t = setTimeout(() => setSavedHint(false), 1200)
    return () => clearTimeout(t)
  }, [draft, storageKey])

  if (!auftrag) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-db-navy-light">Auftrag nicht gefunden.</p>
        <Link to="/auftraege" className="text-sm font-medium text-db-red hover:underline">
          Zurück zur Übersicht
        </Link>
      </div>
    )
  }

  const total = auftrag.checklist.length
  const done = auftrag.checklist.filter((c) => draft.checked[c.id]).length
  const progress = Math.round((done / total) * 100)

  const toggle = (itemId: string) =>
    setDraft((d) => ({ ...d, checked: { ...d.checked, [itemId]: !d.checked[itemId] } }))

  return (
    <div className="space-y-5">
      <Link to="/auftraege" className="flex items-center gap-1 text-sm text-db-navy-light hover:text-db-navy">
        <ChevronLeft size={16} /> Aufträge
      </Link>

      <div className="rounded-xl border border-db-gray-200 bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-db-navy-light">{auftrag.id}</p>
            <h1 className="text-lg font-semibold text-db-navy">{auftrag.titel}</h1>
          </div>
          <StatusBadge status={auftrag.status} />
        </div>
        <p className="mt-1 text-sm text-db-navy-light">
          {auftrag.anlage} {auftrag.baureihe ? `(${auftrag.baureihe})` : ''} · {auftrag.ort}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <GewerkBadge gewerk={auftrag.gewerk} />
          <PrioBadge prioritaet={auftrag.prioritaet} />
          <span className="text-xs text-db-navy-light">Fällig: {auftrag.faelligkeit}</span>
        </div>
        <p className="mt-3 text-sm text-db-navy">{auftrag.beschreibung}</p>
      </div>

      <div className="rounded-xl border border-db-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-db-navy">Digitales Wartungsprotokoll</h2>
          <span className="text-xs font-medium text-db-navy-light">
            {done}/{total} erledigt
          </span>
        </div>
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-db-gray-100">
          <div
            className="h-full rounded-full bg-db-green transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ul className="space-y-2">
          {auftrag.checklist.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => toggle(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                  draft.checked[item.id]
                    ? 'border-db-green/30 bg-db-green/5 text-db-navy'
                    : 'border-db-gray-200 text-db-navy hover:border-db-navy/30'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    draft.checked[item.id] ? 'border-db-green bg-db-green text-white' : 'border-db-gray-400'
                  }`}
                >
                  {draft.checked[item.id] && <Check size={13} />}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-db-gray-200 px-3 py-2.5 text-sm text-db-navy-light hover:border-db-navy/30">
          <Camera size={16} /> Foto hinzufügen
        </button>

        <div className="mt-4">
          <label className="mb-1 block text-xs font-medium text-db-navy-light">Notiz / Befund</label>
          <textarea
            value={draft.notiz}
            onChange={(e) => setDraft((d) => ({ ...d, notiz: e.target.value }))}
            rows={3}
            placeholder="z. B. Abweichungen, verbaute Teile, Nacharbeit erforderlich..."
            className="w-full rounded-lg border border-db-gray-200 px-3 py-2 text-sm text-db-navy outline-none focus:border-db-red"
          />
        </div>

        <button
          onClick={() => setDraft((d) => ({ ...d, signiert: !d.signiert }))}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full border px-3 py-3 text-sm font-semibold transition-colors ${
            draft.signiert
              ? 'border-db-green bg-db-green/10 text-db-green'
              : 'border-db-red bg-db-red text-white hover:bg-db-red-dark'
          }`}
        >
          <PenLine size={16} />
          {draft.signiert ? 'Protokoll digital signiert' : 'Protokoll signieren & abschließen'}
        </button>

        <p className="mt-2 flex items-center justify-center gap-1 text-xs text-db-navy-light">
          <Save size={12} className={savedHint ? 'text-db-green' : ''} />
          Entwurf wird lokal gespeichert – auch ohne Netzverbindung
        </p>
      </div>
    </div>
  )
}
