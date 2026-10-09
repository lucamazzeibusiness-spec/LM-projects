import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { lernaufgaben as basisLernaufgaben, type Lernaufgabe } from '../data/mock'
import { cloudSchreiben } from '../lib/cloudSync'
import { ladeGespeichert, speichere } from '../lib/storage'

export interface LernaufgabeDraft {
  checked: Record<string, boolean>
  notiz: string
  erledigt: boolean
}

export const leererDraft: LernaufgabeDraft = { checked: {}, notiz: '', erledigt: false }

function storageKeyFuer(id: string): string {
  return `lernaufgabe:${id}`
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
  const [drafts, setDrafts] = useState<Record<string, LernaufgabeDraft>>({})

  useEffect(() => {
    Promise.all(
      basisLernaufgaben.map(async (a) => {
        const draft = await ladeGespeichert<LernaufgabeDraft | null>(storageKeyFuer(a.id), null)
        return [a.id, draft] as const
      }),
    ).then((eintraege) => {
      const geladen: Record<string, LernaufgabeDraft> = {}
      for (const [id, draft] of eintraege) {
        if (draft) geladen[id] = draft
      }
      setDrafts(geladen)
    })
  }, [])

  const draftFuer = (id: string) => drafts[id] ?? leererDraft

  const draftAktualisieren = (id: string, updater: (d: LernaufgabeDraft) => LernaufgabeDraft) => {
    setDrafts((prev) => {
      const naechster = updater(prev[id] ?? leererDraft)
      speichere(storageKeyFuer(id), naechster)
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
