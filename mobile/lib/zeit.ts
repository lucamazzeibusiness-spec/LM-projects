export function formatZeit(sekunden: number): string {
  const m = Math.floor(sekunden / 60)
  const s = sekunden % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
