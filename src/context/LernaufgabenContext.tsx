import { createContext, useContext, useState, type ReactNode } from 'react'
import { lernaufgaben as basisLernaufgaben, type Lernaufgabe } from '../data/mock'
import { cloudSchreiben } from '../lib/cloudSync'

export interface LernaufgabeDraft {
  checked: Record<string, boolean>
  notiz: string
  erledigt: boolean
}

export const leererDraft: LernaufgabeDraft = { checked: {}, notiz: '', erledigt: false }

function storageKeyFuer(id: string): string {
  return `lernaufgabe:${id}`
}

// Lädt den Bearbeitungsstand jeder bekannten Aufgabe einmalig aus localStorage – die Liste der
// möglichen IDs kennen wir vorab aus den Basisdaten, Lernaufgaben selbst werden nicht synchronisiert.
function geladeneDrafts(): Record<string, LernaufgabeDraft> {
  const drafts: Record<string, LernaufgabeDraft> = {}
  for (const a of basisLernaufgaben) {
    try {
      const raw = localStorage.getItem(storageKeyFuer(a.id))
      if (raw) drafts[a.id] = JSON.parse(raw)
    } catch {
      // Eintrag bleibt auf dem Standard (leererDraft) stehen.
    }
  }
  return drafts
}

interface LernaufgabenContextValue {
  // Basisdaten mit live überschriebenem Status, sobald der Nutzer eine Aufgabe als erledigt markiert –
  // ohne das würde "Als erledigt markieren" nirgends außer auf der Detailseite selbst sichtbar.
  lernaufgaben: Lernaufgabe[]
  draftFuer: (id: string) => LernaufgabeDraft
  draftAktualisieren: (id: string, updater: (d: LernaufgabeDraft) => LernaufgabeDraft) => void
}

const LernaufgabenContext = createContext<LernaufgabenContextValue | null>(null)

export function LernaufgabenProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<Record<string, LernaufgabeDraft>>(geladeneDrafts)

  const draftFuer = (id: string) => drafts[id] ?? leererDraft

  const draftAktualisieren = (id: string, updater: (d: LernaufgabeDraft) => LernaufgabeDraft) => {
    setDrafts((prev) => {
      const naechster = updater(prev[id] ?? leererDraft)
      try {
        localStorage.setItem(storageKeyFuer(id), JSON.stringify(naechster))
      } catch {
        // localStorage evtl. voll oder blockiert – lokaler State bleibt trotzdem aktuell.
      }
      cloudSchreiben(storageKeyFuer(id), naechster)
      return { ...prev, [id]: naechster }
    })
  }

  const lernaufgabenMitStatus = basisLernaufgaben.map((a) =>
    drafts[a.id]?.erledigt && a.status !== 'Erledigt' ? { ...a, status: 'Erledigt' as const } : a,
  )

  return (
    <LernaufgabenContext.Provider value={{ lernaufgaben: lernaufgabenMitStatus, draftFuer, draftAktualisieren }}>
      {children}
    </LernaufgabenContext.Provider>
  )
}

export function useLernaufgaben() {
  const ctx = useContext(LernaufgabenContext)
  if (!ctx) throw new Error('useLernaufgaben muss innerhalb von <LernaufgabenProvider> verwendet werden')
  return ctx
}
