import type { AzubiProfil } from '../data/mock'
import { heuteISO } from './wochen'

export const pruefungsTitel = ['Abschlussprüfung Teil 1', 'Abschlussprüfung Teil 2'] as const

export interface NaechstePruefung {
  titel: string
  datumLabel: string
  tageVerbleibend: number
}

function tageZwischen(vonISO: string, bisISO: string): number {
  const von = new Date(`${vonISO}T00:00:00`)
  const bis = new Date(`${bisISO}T00:00:00`)
  return Math.round((bis.getTime() - von.getTime()) / 86_400_000)
}

// Der Countdown wird bei jedem Rendern aus dem im Profil eingetragenen Datum berechnet –
// null, solange kein (gültiger) Termin eingetragen ist oder der Termin schon vorbei ist.
export function naechstePruefungFuer(profil: AzubiProfil): NaechstePruefung | null {
  if (!profil.pruefungDatum || !/^\d{4}-\d{2}-\d{2}$/.test(profil.pruefungDatum)) return null
  const tageVerbleibend = tageZwischen(heuteISO(), profil.pruefungDatum)
  if (Number.isNaN(tageVerbleibend) || tageVerbleibend < 0) return null
  return {
    titel: profil.pruefungTitel || pruefungsTitel[0],
    datumLabel: new Date(`${profil.pruefungDatum}T00:00:00`).toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    tageVerbleibend,
  }
}

export function countdownText(tage: number): string {
  if (tage === 0) return 'heute'
  if (tage === 1) return 'morgen'
  return `noch ${tage} Tage`
}
