import { Shuffle, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { usePunkte } from '../context/PunkteContext'
import { baureihen } from '../data/fahrzeuge'
import Lernmodus from './Lernmodus'

const RUNDENGROESSE = 8

function shuffle<T>(arr: T[]): T[] {
  const kopie = [...arr]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
  }
  return kopie
}

// Nur Baureihen mit Spitz- bzw. Typname eignen sich als Frage („Vectron" → BR 193).
const quizBaureihen = baureihen.filter((b) => b.spitzname)

export default function BaureihenQuiz({ onSchliessen }: { onSchliessen: () => void }) {
  const [runde, setRunde] = useState(0)
  const [ergebnis, setErgebnis] = useState<{ richtig: number; gesamt: number } | null>(null)
  const { punkteVergeben } = usePunkte()

  const paare = useMemo(
    () =>
      shuffle(quizBaureihen)
        .slice(0, RUNDENGROESSE)
        .map((b) => ({ id: b.id, begriff: `${b.spitzname} (${b.art})`, definition: b.name })),
    // Neue Runde = neu mischen; runde dient nur als Auslöser.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runde],
  )

  const gemeistert = (id: string) => {
    const b = quizBaureihen.find((x) => x.id === id)
    if (b) punkteVergeben(`baureihe:${id}`, 3, `Baureihe erkannt: ${b.name}`)
  }

  const neueRunde = () => {
    setErgebnis(null)
    setRunde((r) => r + 1)
  }

  return (
    <div className="space-y-3 rounded-xl border border-db-gray-200 bg-db-surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-db-navy">Baureihen-Quiz · Welche Baureihe ist das?</p>
        <button onClick={onSchliessen} className="text-xs font-semibold text-db-navy-light hover:text-db-navy">
          Zur Liste
        </button>
      </div>
      {ergebnis ? (
        <div className="space-y-3 py-2 text-center">
          <Sparkles size={24} className="mx-auto text-db-green" />
          <p className="text-lg font-semibold text-db-navy">
            {ergebnis.richtig} von {ergebnis.gesamt} auf Anhieb erkannt
          </p>
          <button
            onClick={neueRunde}
            className="mx-auto flex items-center gap-1.5 rounded-full bg-db-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-db-red-dark"
          >
            <Shuffle size={15} /> Neue Runde
          </button>
        </div>
      ) : (
        <Lernmodus
          key={runde}
          paare={paare}
          onKarteGemeistert={gemeistert}
          onAbschluss={(richtig, gesamt) => setErgebnis({ richtig, gesamt })}
        />
      )}
    </div>
  )
}
