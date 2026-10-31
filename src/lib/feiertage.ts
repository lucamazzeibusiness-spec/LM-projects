import { tagVerschieben } from './wochen'

// Gesetzliche Feiertage, die in allen Bundesländern gelten. Landesspezifische (z. B.
// Fronleichnam, Reformationstag) fehlen, weil das Profil kein Bundesland kennt – dafür gibt es
// im Eintrag weiterhin den Knopf "Feiertag".

// Ostersonntag nach der Gaußschen Osterformel (gregorianischer Kalender), als JJJJ-MM-TT.
function ostersonntag(jahr: number): string {
  const a = jahr % 19
  const b = Math.floor(jahr / 100)
  const c = jahr % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const monat = Math.floor((h + l - 7 * m + 114) / 31)
  const tag = ((h + l - 7 * m + 114) % 31) + 1
  return `${jahr}-${String(monat).padStart(2, '0')}-${String(tag).padStart(2, '0')}`
}

function feiertageImJahr(jahr: number): Map<string, string> {
  const ostern = ostersonntag(jahr)
  return new Map([
    [`${jahr}-01-01`, 'Neujahr'],
    [tagVerschieben(ostern, -2), 'Karfreitag'],
    [tagVerschieben(ostern, 1), 'Ostermontag'],
    [`${jahr}-05-01`, 'Tag der Arbeit'],
    [tagVerschieben(ostern, 39), 'Christi Himmelfahrt'],
    [tagVerschieben(ostern, 50), 'Pfingstmontag'],
    [`${jahr}-10-03`, 'Tag der Deutschen Einheit'],
    [`${jahr}-12-25`, '1. Weihnachtstag'],
    [`${jahr}-12-26`, '2. Weihnachtstag'],
  ])
}

const cache = new Map<number, Map<string, string>>()

// Name des bundesweiten Feiertags an diesem Datum (JJJJ-MM-TT), sonst null.
export function feiertagAm(datumISO: string): string | null {
  const jahr = Number(datumISO.slice(0, 4))
  if (!Number.isInteger(jahr)) return null
  if (!cache.has(jahr)) cache.set(jahr, feiertageImJahr(jahr))
  return cache.get(jahr)!.get(datumISO) ?? null
}
