import { File, Paths } from 'expo-file-system'
import * as MailComposer from 'expo-mail-composer'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { berufAbkuerzung, type AzubiProfil, type BerichtsheftEintrag } from '../data/mock'
import { DB_LOGO_PNG } from './dbLogo'
import { heutigesDatumVoll } from './wochen'

interface ExportOptions {
  nr: string
  von: string
  bis: string
  jahr: number
  unterschriftDataUrl: string
}

// Format laut betrieblicher Vorgabe: BERUF_JAHR_NR_Ausbildungsnachweis_Vorname_Nachname
// (dient sowohl als Dateiname als auch als E-Mail-Betreff bei der Abgabe an den Ausbilder).
export function ausbildungsnachweisBezeichnung(profil: AzubiProfil, nr: string, jahr: number): string {
  const berufAbk = berufAbkuerzung[profil.ausbildungsberuf]
  const [vorname, ...rest] = profil.name.trim().split(/\s+/)
  const nachname = rest.join('_') || vorname || 'Azubi'
  return `${berufAbk}_${jahr}_${nr}_Ausbildungsnachweis_${vorname || 'Azubi'}_${nachname}`
}

const wochentage = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']

function montagIndex(datumISO: string): number {
  const d = new Date(`${datumISO}T00:00:00`)
  return (d.getDay() + 6) % 7
}

function alsStichpunkte(text: string): string {
  return text
    .split('\n')
    .map((z) => z.trim())
    .filter(Boolean)
    .map((z) => (z.startsWith('-') ? z : `-${z}`))
    .join('<br/>')
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function baueHtml(profil: AzubiProfil, eintraege: BerichtsheftEintrag[], optionen: ExportOptions): string {
  const { nr, von, bis, unterschriftDataUrl } = optionen

  const nachTag = new Map<number, BerichtsheftEintrag>()
  for (const e of eintraege) nachTag.set(montagIndex(e.datumISO), e)

  const anzuzeigendeTage = [0, 1, 2, 3, 4, 5, 6].filter((i) => i < 5 || nachTag.has(i))
  const zeilen = anzuzeigendeTage.map((i) => {
    const eintrag = nachTag.get(i)
    return {
      tag: wochentage[i],
      taetigkeiten: eintrag ? alsStichpunkte(eintrag.taetigkeiten) : '',
      stunden: eintrag ? String(eintrag.stunden) : '',
    }
  })
  const wochenstunden = eintraege.reduce((sum, e) => sum + e.stunden, 0)
  const heute = heutigesDatumVoll()

  const zeilenHtml = zeilen
    .map(
      (z) => `
      <tr>
        <td class="tag"><span>${z.tag}</span></td>
        <td class="taetigkeiten">${z.taetigkeiten}</td>
        <td class="einzel"></td>
        <td class="gesamt">${z.stunden}</td>
      </tr>`,
    )
    .join('')

  return `
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      body { font-family: Helvetica, Arial, sans-serif; color: #14181F; margin: 0; padding: 24px 28px; font-size: 12px; }
      .intern { font-size: 9px; color: #5A5A5A; margin-bottom: 6px; }
      .kopf { display: flex; align-items: flex-start; justify-content: space-between; }
      .logo { height: 40px; }
      .firma { text-align: right; font-size: 13px; font-weight: bold; }
      .felder { margin-top: 6px; text-align: right; font-size: 11px; }
      .felder .zeile { margin-top: 4px; }
      .felder .label { color: #14181F; }
      .felder .wert { font-weight: bold; border-bottom: 1px solid #777; padding-bottom: 2px; min-width: 220px; display: inline-block; }
      h1 { font-size: 18px; margin: 22px 0 4px; }
      .formrow { display: flex; gap: 28px; margin-bottom: 16px; }
      .formrow .feld { display: flex; flex-direction: column; }
      .formrow .feld .wert { font-weight: bold; border-bottom: 1px solid #14181F; padding-bottom: 2px; font-size: 13px; }
      .formrow .feld .label { font-size: 8px; color: #5A5A5A; margin-top: 2px; }
      table { border-collapse: collapse; width: 100%; }
      table.haupt td, table.haupt th { border: 1.2px solid #000; padding: 6px 8px; font-size: 10.5px; vertical-align: middle; }
      table.haupt th { text-align: left; font-weight: bold; }
      td.tag { width: 34px; text-align: center; font-weight: bold; }
      td.tag span { writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap; }
      td.taetigkeiten { line-height: 1.5; }
      td.einzel { width: 50px; }
      td.gesamt { width: 50px; text-align: center; font-weight: bold; }
      tfoot td { border: 1.2px solid #000; padding: 6px 8px; font-weight: bold; font-size: 10.5px; }
      tfoot td.label { text-align: right; }
      tfoot td.wert { text-align: center; }
      .bestaetigung { margin: 16px 0 8px; font-size: 10.5px; }
      table.unterschrift td { border: 1.2px solid #000; width: 33.33%; padding: 8px; font-size: 10.5px; vertical-align: top; }
      table.unterschrift tr.sig td { height: 60px; text-align: center; vertical-align: middle; }
      table.unterschrift tr.sig img { max-height: 50px; max-width: 90%; }
      table.unterschrift tr.label td { text-align: center; font-weight: bold; }
      .seite { margin-top: 24px; font-size: 9px; color: #777; }
    </style>
  </head>
  <body>
    <div class="intern">DB Intern / DB internal</div>
    <div class="kopf">
      <img class="logo" src="${DB_LOGO_PNG}" />
      <div>
        <div class="firma">${escapeHtml(profil.unternehmensbereich)}</div>
        <div class="felder">
          <div class="zeile"><span class="label">Name: </span><span class="wert">${escapeHtml(profil.name)}</span></div>
          <div class="zeile"><span class="label">Ausbildungsabteilung: </span><span class="wert">${escapeHtml(profil.abteilung)}</span></div>
        </div>
      </div>
    </div>

    <h1>Ausbildungsnachweis</h1>
    <div class="formrow">
      <div class="feld"><span class="wert">${nr}</span><span class="label">Nr.</span></div>
      <div class="feld"><span class="wert">${von}</span><span class="label">Ausbildungswoche vom</span></div>
      <div class="feld"><span class="wert">${bis}</span><span class="label">bis</span></div>
      <div class="feld" style="margin-left:auto"><span class="wert">${profil.lehrjahr}</span><span class="label">Ausbildungsjahr</span></div>
    </div>

    <table class="haupt">
      <thead>
        <tr>
          <th>Tag</th>
          <th>Ausgeführte betriebliche Tätigkeiten, Unterweisungen, Berufsschulunterricht usw.</th>
          <th>Einzel-<br/>stunden</th>
          <th>Gesamt-<br/>stunden</th>
        </tr>
      </thead>
      <tbody>
        ${zeilenHtml}
      </tbody>
      <tfoot>
        <tr>
          <td class="label" colspan="3">Wochenstunden:</td>
          <td class="wert">${wochenstunden}</td>
        </tr>
      </tfoot>
    </table>

    <p class="bestaetigung">Durch die nachfolgenden Unterschriften wird die Richtigkeit und Vollständigkeit der obigen Angaben bestätigt.</p>

    <table class="unterschrift">
      <tr>
        <td>Name: ${escapeHtml(profil.name)}</td>
        <td>Name:</td>
        <td>Name:</td>
      </tr>
      <tr>
        <td>Datum: ${heute}</td>
        <td>Datum:</td>
        <td>Datum:</td>
      </tr>
      <tr class="sig">
        <td><img src="${unterschriftDataUrl}" /></td>
        <td></td>
        <td></td>
      </tr>
      <tr class="label">
        <td>Auszubildende/-r</td>
        <td>Ausbilder/-in</td>
        <td>Gesetzliche/-r Vertreter/-in</td>
      </tr>
    </table>

    <div class="seite">Seite 1/1</div>
  </body>
  </html>`
}

export async function exportBerichtsheftPdf(
  profil: AzubiProfil,
  eintraege: BerichtsheftEintrag[],
  optionen: ExportOptions,
): Promise<string> {
  const html = baueHtml(profil, eintraege, optionen)
  const { uri } = await Print.printToFileAsync({ html, base64: false })

  const basisname = ausbildungsnachweisBezeichnung(profil, optionen.nr, optionen.jahr)
  const ziel = new File(Paths.cache, `${basisname}.pdf`)
  if (ziel.exists) ziel.delete()
  await new File(uri).copy(ziel)

  const ausbilderEmail = profil.ausbilderEmail.trim()
  if (ausbilderEmail && (await MailComposer.isAvailableAsync())) {
    await MailComposer.composeAsync({
      recipients: [ausbilderEmail],
      subject: basisname,
      attachments: [ziel.uri],
    })
    return basisname
  }

  const kannTeilen = await Sharing.isAvailableAsync()
  if (kannTeilen) {
    await Sharing.shareAsync(ziel.uri, { mimeType: 'application/pdf', dialogTitle: basisname, UTI: 'com.adobe.pdf' })
  }
  return basisname
}
