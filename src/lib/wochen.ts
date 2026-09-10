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
