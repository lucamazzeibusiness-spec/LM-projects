import { Camera, Check, ChevronLeft, MessageSquare, Save, Send, Target } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GewerkBadge, PrioBadge, StatusBadge } from '../components/Badges'
import { lernaufgaben } from '../data/mock'

interface Draft {
  checked: Record<string, boolean>
  notiz: string
  eingereicht: boolean
}

const leererDraft: Draft = { checked: {}, notiz: '', eingereicht: false }

function ladeDraft(storageKey: string): Draft {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : leererDraft
  } catch {
    return leererDraft
  }
}

export default function LernaufgabeDetail() {
  const { id } = useParams()
  const aufgabe = lernaufgaben.find((a) => a.id === id)
  const storageKey = `lernaufgabe:${id}`

  const [draft, setDraft] = useState<Draft>(() => ladeDraft(storageKey))
  const [savedHint, setSavedHint] = useState(false)
  const savedHintTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    setDraft(ladeDraft(storageKey))
  }, [storageKey])

  useEffect(() => {
    return () => {
      if (savedHintTimeout.current) clearTimeout(savedHintTimeout.current)
    }
  }, [])

  const aktualisieren = (updater: (d: Draft) => Draft) => {
    setDraft((d) => {
      const naechster = updater(d)
      localStorage.setItem(storageKey, JSON.stringify(naechster))
      return naechster
    })
    setSavedHint(true)
    if (savedHintTimeout.current) clearTimeout(savedHintTimeout.current)
    savedHintTimeout.current = setTimeout(() => setSavedHint(false), 1200)
  }

  if (!aufgabe) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-db-navy-light">Lernaufgabe nicht gefunden.</p>
        <Link to="/lernaufgaben" className="text-sm font-medium text-db-red hover:underline">
          Zurück zur Übersicht
        </Link>
      </div>
    )
  }

  const total = aufgabe.checklist.length
  const done = aufgabe.checklist.filter((c) => draft.checked[c.id]).length
  const progress = Math.round((done / total) * 100)

  const toggle = (itemId: string) =>
    aktualisieren((d) => ({ ...d, checked: { ...d.checked, [itemId]: !d.checked[itemId] } }))

  return (
    <div className="space-y-5">
      <Link to="/lernaufgaben" className="flex items-center gap-1 text-sm text-db-navy-light hover:text-db-navy">
        <ChevronLeft size={16} /> Lernaufgaben
      </Link>

      <div className="rounded-xl border border-db-gray-200 bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-db-navy-light">{aufgabe.id}</p>
            <h1 className="text-lg font-semibold text-db-navy">{aufgabe.titel}</h1>
          </div>
          <StatusBadge status={aufgabe.status} />
        </div>
        <p className="mt-1 text-sm text-db-navy-light">
          {aufgabe.anlage} {aufgabe.baureihe ? `(${aufgabe.baureihe})` : ''} · {aufgabe.ort}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <GewerkBadge gewerk={aufgabe.gewerk} />
          <PrioBadge prioritaet={aufgabe.prioritaet} />
          <span className="text-xs text-db-navy-light">Fällig: {aufgabe.faelligkeit}</span>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-lg bg-db-red/5 p-3">
          <Target size={16} className="mt-0.5 shrink-0 text-db-red" />
          <div>
            <p className="text-xs font-semibold text-db-red">Lernziel</p>
            <p className="text-sm text-db-navy">{aufgabe.lernziel}</p>
          </div>
        </div>

        <p className="mt-3 text-sm text-db-navy">{aufgabe.beschreibung}</p>

        {aufgabe.ausbilderHinweis && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-db-gray-200 bg-db-gray-50 p-3">
            <MessageSquare size={15} className="mt-0.5 shrink-0 text-db-navy-light" />
            <div>
              <p className="text-xs font-semibold text-db-navy-light">Hinweis von deinem Ausbilder</p>
              <p className="text-sm text-db-navy">{aufgabe.ausbilderHinweis}</p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-db-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-db-navy">Arbeitsschritte</h2>
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
          {aufgabe.checklist.map((item) => (
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
          <label className="mb-1 block text-xs font-medium text-db-navy-light">Was hast du gelernt / verstanden?</label>
          <textarea
            value={draft.notiz}
            onChange={(e) => aktualisieren((d) => ({ ...d, notiz: e.target.value }))}
            rows={3}
            placeholder="z. B. Was war neu für dich, wo brauchst du noch Übung..."
            className="w-full rounded-lg border border-db-gray-200 px-3 py-2 text-sm text-db-navy outline-none focus:border-db-red"
          />
        </div>

        <button
          onClick={() => aktualisieren((d) => ({ ...d, eingereicht: !d.eingereicht }))}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full border px-3 py-3 text-sm font-semibold transition-colors ${
            draft.eingereicht
              ? 'border-db-green bg-db-green/10 text-db-green'
              : 'border-db-red bg-db-red text-white hover:bg-db-red-dark'
          }`}
        >
          <Send size={16} />
          {draft.eingereicht ? 'Zur Kontrolle eingereicht' : 'Zur Kontrolle beim Ausbilder einreichen'}
        </button>

        <p className="mt-2 flex items-center justify-center gap-1 text-xs text-db-navy-light">
          <Save size={12} className={savedHint ? 'text-db-green' : ''} />
          Entwurf wird lokal gespeichert – auch ohne Netzverbindung
        </p>
      </div>
    </div>
  )
}
