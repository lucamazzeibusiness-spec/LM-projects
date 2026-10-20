// Gemeinsame Logik für automatische Stichpunkte im Berichtsheft-Textfeld: neue Zeilen (Enter)
// bekommen automatisch ein "- " vorangestellt, genau wie in Notizen-Apps üblich.

export const BULLET = '- '

interface Einfuegestelle {
  index: number
  eingefuegt: string
}

// Findet die Stelle, an der sich `neu` gegenüber `alt` unterscheidet (Präfix/Suffix-Diff) –
// liefert bei einer einzelnen Tastatureingabe genau die eine eingefügte Stelle zurück.
function findeEinfuegestelle(alt: string, neu: string): Einfuegestelle | null {
  if (neu.length <= alt.length) return null
  let praefix = 0
  while (praefix < alt.length && alt[praefix] === neu[praefix]) praefix++
  let suffix = 0
  while (suffix < alt.length - praefix && alt[alt.length - 1 - suffix] === neu[neu.length - 1 - suffix]) suffix++
  return { index: praefix, eingefuegt: neu.slice(praefix, neu.length - suffix) }
}

export interface BulletVerarbeitung {
  wert: string
  // Gewünschte Cursor-Position nach der Änderung, oder null wenn die Standardposition passt.
  cursor: number | null
}

export function bulletEingabeVerarbeiten(alt: string, neu: string): BulletVerarbeitung {
  if (alt.trim() === '' && neu.trim() !== '' && !neu.startsWith(BULLET)) {
    const wert = BULLET + neu
    return { wert, cursor: wert.length }
  }

  const stelle = findeEinfuegestelle(alt, neu)
  if (stelle && stelle.eingefuegt === '\n') {
    const nachDemUmbruch = neu.slice(stelle.index + 1)
    if (!nachDemUmbruch.startsWith(BULLET)) {
      const wert = neu.slice(0, stelle.index + 1) + BULLET + nachDemUmbruch
      return { wert, cursor: stelle.index + 1 + BULLET.length }
    }
  }

  return { wert: neu, cursor: null }
}

// Ob ein Text (abzüglich der Stichpunkt-Präfixe) echten Inhalt hat – ein Feld, in dem nur
// automatisch "- " eingefügt, aber nichts geschrieben wurde, zählt nicht als ausgefüllt.
export function hatEchtenInhalt(text: string): boolean {
  return text.split('\n').some((zeile) => zeile.replace(/^-+\s*/, '').trim() !== '')
}

function ohneBullet(zeile: string): string {
  return zeile.replace(/^-+\s*/, '').trim()
}

const ABWESENHEITEN = new Set(['urlaub', 'krank', 'feiertag'])

// Die häufigsten eigenen Stichpunkte aus früheren Einträgen (neueste zuerst übergeben), als
// Vorschläge zum schnellen Wiederverwenden. Was schon im aktuellen Text steht, fällt heraus.
export function haeufigeStichpunkte(fruehereTexte: string[], aktuellerText: string, max = 6): string[] {
  const vorhanden = new Set(aktuellerText.split('\n').map((z) => ohneBullet(z).toLowerCase()))
  const zaehler = new Map<string, { text: string; anzahl: number; zuerst: number }>()
  fruehereTexte.slice(0, 30).forEach((text, index) => {
    for (const roh of text.split('\n')) {
      const zeile = ohneBullet(roh)
      const schluessel = zeile.toLowerCase()
      if (!zeile || zeile.length > 70 || ABWESENHEITEN.has(schluessel) || vorhanden.has(schluessel)) continue
      const bisher = zaehler.get(schluessel)
      if (bisher) bisher.anzahl++
      else zaehler.set(schluessel, { text: zeile, anzahl: 1, zuerst: index })
    }
  })
  return [...zaehler.values()]
    .sort((a, b) => b.anzahl - a.anzahl || a.zuerst - b.zuerst)
    .slice(0, max)
    .map((e) => e.text)
}

// Hängt einen Stichpunkt als neue Zeile an; leere "- "-Zeilen am Ende werden dabei ersetzt.
export function stichpunktAnhaengen(text: string, zeile: string): string {
  const zeilen = text.split('\n')
  while (zeilen.length > 0 && ohneBullet(zeilen[zeilen.length - 1]) === '') zeilen.pop()
  zeilen.push(`${BULLET}${zeile}`)
  return zeilen.join('\n')
}
