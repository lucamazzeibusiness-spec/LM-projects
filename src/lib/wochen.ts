function isoDatum(d: Date): string {
  const jahr = d.getFullYear()
  const monat = String(d.getMonth() + 1).padStart(2, '0')
  const tag = String(d.getDate()).padStart(2, '0')
  return `${jahr}-${monat}-${tag}`
}

export function heuteISO(): string {
  return isoDatum(new Date())
}

function montagDerWoche(datumISO: string): Date {
  const d = new Date(`${datumISO}T00:00:00`)
  const wochentag = (d.getDay() + 6) % 7 // 0 = Montag
  d.setDate(d.getDate() - wochentag)
  return d
}

export function wochenSchluessel(datumISO: string): string {
  return isoDatum(montagDerWoche(datumISO))
}

export function wochenLabel(datumISO: string): string {
  const montag = montagDerWoche(datumISO)
  const sonntag = new Date(montag)
  sonntag.setDate(sonntag.getDate() + 6)
  const fmt = (d: Date) => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
  return `${fmt(montag)} – ${fmt(sonntag)}`
}

export function heutigesDatumLabel(): string {
  return new Date().toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit' })
}

export function heutigesDatumVoll(): string {
  return new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// schluessel ist der ISO-Montag der Woche (siehe wochenSchluessel). Der Ausbildungsnachweis
// bezieht sich auf die betriebliche Ausbildungswoche Montag–Freitag.
export function wochenStartEnde(schluessel: string): { von: string; bis: string } {
  const montag = new Date(`${schluessel}T00:00:00`)
  const freitag = new Date(montag)
  freitag.setDate(freitag.getDate() + 4)
  const fmt = (d: Date) => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return { von: fmt(montag), bis: fmt(freitag) }
}

const wochentagsnamen = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']

export function heutigerWochentagIndex(): number {
  return (new Date().getDay() + 6) % 7 // 0 = Montag ... 6 = Sonntag
}

export function wochentagIndexVon(datumISO: string): number {
  const d = new Date(`${datumISO}T00:00:00`)
  return (d.getDay() + 6) % 7 // 0 = Montag ... 6 = Sonntag
}

export interface Wochentag {
  tag: string
  datum: string
}

export function aktuelleWochentage(): Wochentag[] {
  const montag = montagDerWoche(heuteISO())
  const fmt = (d: Date) => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
  return wochentagsnamen.map((tag, i) => {
    const d = new Date(montag)
    d.setDate(d.getDate() + i)
    return { tag, datum: fmt(d) }
  })
}

// schluessel ist der ISO-Montag der Woche. Liefert Montag–Freitag als ISO-Datumsstrings.
export function arbeitstageDerWoche(schluessel: string): string[] {
  const montag = new Date(`${schluessel}T00:00:00`)
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(montag)
    d.setDate(d.getDate() + i)
    return isoDatum(d)
  })
}

export function wocheVerschieben(schluessel: string, deltaWochen: number): string {
  const montag = new Date(`${schluessel}T00:00:00`)
  montag.setDate(montag.getDate() + deltaWochen * 7)
  return isoDatum(montag)
}

// Fortlaufende Wochennummer seit Ausbildungsbeginn (1-basiert): die Woche, in der die
// Ausbildung begonnen hat, ist Nr. 1, jede folgende Woche zählt eins weiter.
export function wochenNummerSeit(beginnISO: string, schluessel: string): number {
  const beginnMontag = new Date(`${wochenSchluessel(beginnISO)}T00:00:00`)
  const zielMontag = new Date(`${schluessel}T00:00:00`)
  const diffTage = Math.round((zielMontag.getTime() - beginnMontag.getTime()) / 86400000)
  return Math.floor(diffTage / 7) + 1
}
