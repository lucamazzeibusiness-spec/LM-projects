import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { AzubiProfil, BerichtsheftEintrag } from '../data/mock'
import { heutigesDatumVoll } from './wochen'

interface ExportOptions {
  nr: string
  von: string
  bis: string
}

const tinte: [number, number, number] = [20, 24, 31]
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
    .join('\n')
}

// Baut das PDF im Layout des offiziellen DB-Ausbildungsnachweis-Formulars nach
// (Kopfbereich mit Nr./Zeitraum/Ausbildungsjahr, Tagestabelle, Unterschriftenblock).
export function exportBerichtsheftPdf(profil: AzubiProfil, eintraege: BerichtsheftEintrag[], optionen: ExportOptions) {
  const { nr, von, bis } = optionen
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const seitenbreite = doc.internal.pageSize.getWidth()
  const seitenhoehe = doc.internal.pageSize.getHeight()
  const li = 14
  const re = seitenbreite - 14

  doc.setFontSize(8)
  doc.setTextColor(90)
  doc.text('DB Intern / DB internal', li, 11)

  doc.setFillColor(226, 0, 26)
  doc.roundedRect(li, 14, 16, 10.5, 1.2, 1.2, 'F')
  doc.setTextColor(255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('DB', li + 8, 20.7, { align: 'center' })

  doc.setTextColor(...tinte)
  doc.setFontSize(11)
  doc.text(profil.unternehmensbereich, re, 18, { align: 'right' })

  const feldX = 74
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.text('Name:', feldX, 23.5)
  doc.setFont('helvetica', 'bold')
  doc.text(profil.name, feldX + 14, 23.5)
  doc.setDrawColor(120)
  doc.setLineWidth(0.2)
  doc.line(feldX + 14, 24.3, re, 24.3)

  doc.setFont('helvetica', 'normal')
  doc.text('Ausbildungsabteilung:', feldX, 29)
  doc.setFont('helvetica', 'bold')
  doc.text(profil.abteilung, feldX + 34, 29)
  doc.line(feldX + 34, 29.8, re, 29.8)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('Ausbildungsnachweis', li, 42)

  const formFelder: Array<[string, string, number, number]> = [
    [nr, 'Nr.', 92, 12],
    [von, 'Ausbildungswoche vom', 108, 22],
    [bis, 'bis', 134, 22],
    [String(profil.lehrjahr), 'Ausbildungsjahr', 178, 18],
  ]
  for (const [wert, label, x, breite] of formFelder) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.setTextColor(...tinte)
    doc.text(wert, x, 40)
    doc.setDrawColor(20)
    doc.line(x - 1, 41, x - 1 + breite, 41)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.8)
    doc.setTextColor(90)
    doc.text(label, x - 1, 44.5)
  }
  doc.setTextColor(...tinte)

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

  autoTable(doc, {
    startY: 50,
    head: [['Tag', 'Ausgeführte betriebliche Tätigkeiten, Unterweisungen, Berufsschulunterricht usw.', 'Einzel-\nstunden', 'Gesamt-\nstunden']],
    body: zeilen.map((z) => [z.tag, z.taetigkeiten, '', z.stunden]),
    foot: [[{ content: 'Wochenstunden:', colSpan: 3, styles: { halign: 'right' } } as never, String(wochenstunden)]],
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2.4,
      valign: 'middle',
      lineColor: tinte,
      lineWidth: 0.2,
      textColor: tinte,
      minCellHeight: 9,
    },
    headStyles: { fillColor: 255, textColor: tinte, fontStyle: 'bold', halign: 'left' },
    footStyles: { fillColor: 255, textColor: tinte, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
    },
    margin: { left: li, right: 14 },
  })

  let y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Durch die nachfolgenden Unterschriften wird die Richtigkeit und Vollständigkeit der obigen Angaben bestätigt.', li, y)
  y += 4

  const heute = heutigesDatumVoll()
  autoTable(doc, {
    startY: y,
    body: [
      [`Name: ${profil.name}`, 'Name:', 'Name:'],
      [`Datum: ${heute}`, 'Datum:', 'Datum:'],
      ['', '', ''],
      ['Auszubildende/-r', 'Ausbilder/-in', 'Gesetzliche/-r Vertreter/-in'],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3, lineColor: tinte, lineWidth: 0.2, textColor: tinte },
    columnStyles: {
      0: { cellWidth: (re - li) / 3 },
      1: { cellWidth: (re - li) / 3 },
      2: { cellWidth: (re - li) / 3 },
    },
    margin: { left: li, right: 14 },
    didParseCell: (data) => {
      if (data.row.index === 2) data.cell.styles.minCellHeight = 16
      if (data.row.index === 3) {
        data.cell.styles.fontStyle = 'bold'
        data.cell.styles.halign = 'center'
      }
    },
  })

  doc.setFontSize(8)
  doc.setTextColor(120)
  doc.text('Seite 1/1', li, seitenhoehe - 10)

  const dateiname = `Ausbildungsnachweis_${profil.name.replace(/\s+/g, '_')}_${nr}.pdf`
  doc.save(dateiname)
}
