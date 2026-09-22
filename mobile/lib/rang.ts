export interface Rang {
  name: string
  minPunkte: number
  icon: string
}

export const raenge: Rang[] = [
  { name: 'Neuling', minPunkte: 0, icon: '🌱' },
  { name: 'Lehrling', minPunkte: 100, icon: '🔧' },
  { name: 'Geselle', minPunkte: 300, icon: '⚙️' },
  { name: 'Facharbeiter', minPunkte: 700, icon: '🛠️' },
  { name: 'Experte', minPunkte: 1500, icon: '⭐' },
  { name: 'Meister', minPunkte: 3000, icon: '🏆' },
]

export interface RangFortschritt {
  aktuell: Rang
  naechster: Rang | null
  fortschritt: number // 0..1 innerhalb der aktuellen Stufe
  punkteBisNaechster: number | null
}

export function rangFuer(punkte: number): RangFortschritt {
  let aktuell = raenge[0]
  let naechster: Rang | null = null
  for (let i = 0; i < raenge.length; i++) {
    if (punkte >= raenge[i].minPunkte) {
      aktuell = raenge[i]
      naechster = raenge[i + 1] ?? null
    }
  }
  if (!naechster) {
    return { aktuell, naechster: null, fortschritt: 1, punkteBisNaechster: null }
  }
  const spanne = naechster.minPunkte - aktuell.minPunkte
  const fortschritt = spanne > 0 ? (punkte - aktuell.minPunkte) / spanne : 1
  return { aktuell, naechster, fortschritt: Math.min(1, Math.max(0, fortschritt)), punkteBisNaechster: naechster.minPunkte - punkte }
}
