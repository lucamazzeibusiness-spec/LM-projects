import { BULLET } from './stichpunkte'

// Rechtschreib- und Grammatikprüfung über die öffentliche LanguageTool-API (kostenlos, ohne
// Schlüssel, erlaubt Aufrufe direkt aus dem Browser). Der Text wird dafür an languagetool.org
// geschickt – nur auf ausdrücklichen Knopfdruck, nie automatisch beim Tippen.
const API_URL = 'https://api.languagetool.org/v2/check'

export interface GrammatikFund {
  id: string
  offset: number
  length: number
  fehlerText: string
  meldung: string
  vorschlaege: string[]
}

interface LanguageToolMatch {
  message: string
  shortMessage?: string
  offset: number
  length: number
  replacements: { value: string }[]
  rule: { id: string; category: { id: string } }
}

// Regeln, die bei Stichpunkten nur stören: fehlender Schlusspunkt am Zeilenende, typografische
// Feinheiten (Gedankenstrich statt "-", typografische Anführungszeichen) und Leerzeichen-Hinweise.
const IGNORIERTE_REGELN = new Set(['PUNCTUATION_PARAGRAPH_END', 'WHITESPACE_RULE', 'DE_UNPAIRED_BRACKETS'])
const IGNORIERTE_KATEGORIEN = new Set(['TYPOGRAPHY'])

function liegtImStichpunktPraefix(text: string, offset: number): boolean {
  const zeilenStart = text.lastIndexOf('\n', offset - 1) + 1
  return text.startsWith(BULLET, zeilenStart) && offset < zeilenStart + BULLET.length
}

export function fundeAusAntwort(text: string, matches: LanguageToolMatch[]): GrammatikFund[] {
  return matches
    .filter((m) => !IGNORIERTE_REGELN.has(m.rule.id) && !IGNORIERTE_KATEGORIEN.has(m.rule.category.id))
    .filter((m) => !liegtImStichpunktPraefix(text, m.offset))
    .map((m, i) => ({
      id: `${m.offset}-${m.rule.id}-${i}`,
      offset: m.offset,
      length: m.length,
      fehlerText: text.slice(m.offset, m.offset + m.length),
      meldung: m.message,
      vorschlaege: m.replacements.slice(0, 3).map((r) => r.value),
    }))
}

export async function textPruefen(text: string): Promise<GrammatikFund[]> {
  const body = new URLSearchParams({ text, language: 'de-DE' })
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: body.toString(),
  })
  if (res.status === 429) throw new Error('Zu viele Prüfungen in kurzer Zeit – bitte kurz warten und nochmal versuchen.')
  if (!res.ok) throw new Error('Die Prüfung hat gerade nicht geklappt. Bitte später nochmal versuchen.')
  const daten = (await res.json()) as { matches: LanguageToolMatch[] }
  return fundeAusAntwort(text, daten.matches)
}

// Übernimmt einen Vorschlag und verschiebt die Positionen der übrigen Funde entsprechend –
// so bleiben die restlichen Korrekturen gültig, ohne den Text erneut prüfen zu müssen.
// Funde, die sich mit der geänderten Stelle überschneiden, fallen weg.
export function vorschlagAnwenden(
  text: string,
  funde: GrammatikFund[],
  fund: GrammatikFund,
  ersatz: string,
): { text: string; funde: GrammatikFund[] } {
  const neuerText = text.slice(0, fund.offset) + ersatz + text.slice(fund.offset + fund.length)
  const delta = ersatz.length - fund.length
  const ende = fund.offset + fund.length
  const uebrige = funde
    .filter((f) => f.id !== fund.id && (f.offset + f.length <= fund.offset || f.offset >= ende))
    .map((f) => (f.offset >= ende ? { ...f, offset: f.offset + delta } : f))
  return { text: neuerText, funde: uebrige }
}
