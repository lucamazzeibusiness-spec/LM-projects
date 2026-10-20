import { baureihen } from '../data/fahrzeuge'

// Lädt zu jeder Baureihe das Titelfoto ihres deutschen Wikipedia-Artikels (Bilder von Wikimedia
// Commons, frei lizenziert) samt Urheber und Lizenz – die müssen beim Anzeigen genannt werden.
// Zwei Anfragen für alle Baureihen: erst die Titelbilder der Artikel, dann deren Bildinfos.

export interface FahrzeugFoto {
  url: string
  urheber: string
  lizenz: string
  quelleUrl: string
}

export type FahrzeugFotos = Record<string, FahrzeugFoto>

const API = 'https://de.wikipedia.org/w/api.php'
const BREITE = 640

interface Umleitung {
  from: string
  to: string
}

interface ArtikelAntwort {
  query?: { normalized?: Umleitung[]; redirects?: Umleitung[]; pages?: { title: string; pageimage?: string }[] }
}

interface BildAntwort {
  query?: {
    normalized?: Umleitung[]
    pages?: {
      title: string
      imageinfo?: {
        thumburl?: string
        url?: string
        descriptionurl?: string
        extmetadata?: Record<string, { value?: string } | undefined>
      }[]
    }[]
  }
}

function anfrageUrl(parameter: Record<string, string>): string {
  const basis: Record<string, string> = { action: 'query', format: 'json', formatversion: '2', origin: '*' }
  const alle = { ...basis, ...parameter }
  return `${API}?${Object.entries(alle)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')}`
}

// Folgt Normalisierungen (Leerzeichen/Großschreibung) und Weiterleitungen bis zum Endtitel.
function endtitel(titel: string, ...listen: (Umleitung[] | undefined)[]): string {
  let aktuell = titel
  for (const liste of listen) {
    const treffer = liste?.find((u) => u.from === aktuell)
    if (treffer) aktuell = treffer.to
  }
  return aktuell
}

function ohneHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export function fotosAusAntworten(artikel: ArtikelAntwort, bilder: BildAntwort): FahrzeugFotos {
  const bildNachArtikel = new Map<string, string>()
  for (const seite of artikel.query?.pages ?? []) {
    if (seite.pageimage) bildNachArtikel.set(seite.title, `Datei:${seite.pageimage}`)
  }

  const infoNachDatei = new Map<string, FahrzeugFoto>()
  for (const seite of bilder.query?.pages ?? []) {
    const info = seite.imageinfo?.[0]
    const url = info?.thumburl ?? info?.url
    if (!info || !url) continue
    const meta = info.extmetadata ?? {}
    infoNachDatei.set(seite.title, {
      url,
      urheber: ohneHtml(meta.Artist?.value ?? '') || 'Unbekannt',
      lizenz: ohneHtml(meta.LicenseShortName?.value ?? '') || 'siehe Quelle',
      quelleUrl: info.descriptionurl ?? url,
    })
  }

  const fotos: FahrzeugFotos = {}
  for (const b of baureihen) {
    if (!b.wikipedia) continue
    const artikelTitel = endtitel(b.wikipedia, artikel.query?.normalized, artikel.query?.redirects)
    const datei = bildNachArtikel.get(artikelTitel)
    if (!datei) continue
    const foto = infoNachDatei.get(endtitel(datei, bilder.query?.normalized))
    if (foto) fotos[b.id] = foto
  }
  return fotos
}

export async function fahrzeugFotosLaden(): Promise<FahrzeugFotos> {
  const titel = baureihen.flatMap((b) => (b.wikipedia ? [b.wikipedia] : []))
  const artikel: ArtikelAntwort = await (
    await fetch(anfrageUrl({ prop: 'pageimages', piprop: 'name', redirects: '1', titles: titel.join('|') }))
  ).json()

  const dateien = [...new Set((artikel.query?.pages ?? []).flatMap((s) => (s.pageimage ? [`Datei:${s.pageimage}`] : [])))]
  if (dateien.length === 0) return {}

  const bilder: BildAntwort = await (
    await fetch(
      anfrageUrl({
        prop: 'imageinfo',
        iiprop: 'url|extmetadata',
        iiurlwidth: String(BREITE),
        iiextmetadatafilter: 'Artist|LicenseShortName',
        titles: dateien.join('|'),
      }),
    )
  ).json()

  return fotosAusAntworten(artikel, bilder)
}
