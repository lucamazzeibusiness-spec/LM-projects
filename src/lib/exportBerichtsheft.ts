import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { AzubiProfil, BerichtsheftEintrag } from '../data/mock'

interface ExportOptions {
  titel?: string
  zeitraum?: string
  dateiSuffix?: string
}

export function exportBerichtsheftPdf(
  profil: AzubiProfil,
  eintraege: BerichtsheftEintrag[],
  optionen: ExportOptions = {},
) {
  const { titel = 'Ausbildungsnachweis', zeitraum, dateiSuffix } = optionen

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const seitenbreite = doc.internal.pageSize.getWidth()
  const linksRechts = 14

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(titel, linksRechts, 18)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const kopfzeilen = [
    `Name: ${profil.name}`,
    `Ausbildungsberuf: ${profil.ausbildungsberuf}`,
    `Lehrjahr: ${profil.lehrjahr}. von ${profil.lehrjahreGesamt}`,
    `Ausbildungsbetrieb: ${profil.abteilung} · ${profil.werk}`,
    `Ausbilder/-in: ${profil.ausbilder || '–'}`,
  ]
  if (zeitraum) kopfzeilen.splice(1, 0, `Zeitraum: ${zeitraum}`)
  doc.text(kopfzeilen, linksRechts, 26)

  const sortiert = [...eintraege].reverse()
  const gesamtStunden = sortiert.reduce((sum, e) => sum + e.stunden, 0)

  autoTable(doc, {
    startY: zeitraum ? 56 : 52,
    head: [['Datum', 'Kategorie', 'Tätigkeiten', 'Std.', 'Status']],
    body: sortiert.map((e) => [e.datum, e.kategorie, e.taetigkeiten || '–', String(e.stunden), e.status]),
    foot: [['', '', 'Gesamtstunden', String(gesamtStunden), '']],
    styles: { fontSize: 8, cellPadding: 2.5, valign: 'top' },
    headStyles: { fillColor: [20, 24, 31], textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [238, 240, 242], textColor: [20, 24, 31], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 26 },
      1: { cellWidth: 24 },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 14 },
      4: { cellWidth: 24 },
    },
    margin: { left: linksRechts, right: linksRechts },
  })

  const nachTabelleY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20
  const unterschriftY = Math.min(nachTabelleY, doc.internal.pageSize.getHeight() - 20)

  doc.setDrawColor(180)
  doc.line(linksRechts, unterschriftY, linksRechts + 70, unterschriftY)
  doc.line(seitenbreite - linksRechts - 70, unterschriftY, seitenbreite - linksRechts, unterschriftY)

  doc.setFontSize(9)
  doc.text('Datum, Unterschrift Auszubildende/-r', linksRechts, unterschriftY + 5)
  doc.text('Datum, Unterschrift Ausbilder/-in', seitenbreite - linksRechts - 70, unterschriftY + 5)

  const suffix = dateiSuffix ?? new Date().toISOString().slice(0, 10)
  const dateiname = `Ausbildungsnachweis_${profil.name}_${suffix}.pdf`
  doc.save(dateiname)
}
