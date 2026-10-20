import { Shuffle, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { usePunkte } from '../context/PunkteContext'
import { baureihen } from '../data/fahrzeuge'
import type { FahrzeugFotos } from '../lib/fahrzeugFotos'
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

type Modus = 'fotos' | 'namen'

export default function BaureihenQuiz({ fotos, onSchliessen }: { fotos: FahrzeugFotos; onSchliessen: () => void }) {
  // Foto-Modus nur, wenn genug Fotos geladen sind (sonst z. B. offline): mind. 4 für die Antwortoptionen.
  const mitFoto = baureihen.filter((b) => fotos[b.id])
  const fotosMoeglich = mitFoto.length >= 4
  const [modus, setModus] = useState<Modus>('fotos')
  const aktiverModus: Modus = modus === 'fotos' && fotosMoeglich ? 'fotos' : 'namen'
  const [runde, setRunde] = useState(0)
  const [ergebnis, setErgebnis] = useState<{ richtig: number; gesamt: number } | null>(null)
  const { punkteVergeben } = usePunkte()

  const paare = useMemo(
    () =>
      aktiverModus === 'fotos'
        ? shuffle(mitFoto)
            .slice(0, RUNDENGROESSE)
            .map((b) => ({
              id: b.id,
              begriff: 'Welche Baureihe ist das?',
              definition: b.name,
              bild: fotos[b.id].url,
              bildNachweis: `Foto: ${fotos[b.id].urheber} · ${fotos[b.id].lizenz} · Wikimedia Commons`,
            }))
        : shuffle(quizBaureihen)
            .slice(0, RUNDENGROESSE)
            .map((b) => ({ id: b.id, begriff: `${b.spitzname} (${b.art})`, definition: b.name })),
    // Neue Runde bzw. Moduswechsel = neu mischen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runde, aktiverModus],
  )

  const gemeistert = (id: string) => {
    const b = baureihen.find((x) => x.id === id)
    if (b) punkteVergeben(`baureihe:${id}`, 3, `Baureihe erkannt: ${b.name}`)
  }

  const modusWechseln = (m: Modus) => {
    setModus(m)
    setErgebnis(null)
    setRunde((r) => r + 1)
  }

  const neueRunde = () => {
    setErgebnis(null)
    setRunde((r) => r + 1)
  }

  return (
    <div className="space-y-3 rounded-xl border border-db-gray-200 bg-db-surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-db-navy">Baureihen-Quiz</p>
        <button onClick={onSchliessen} className="text-xs font-semibold text-db-navy-light hover:text-db-navy">
          Zur Liste
        </button>
      </div>
      {fotosMoeglich && (
        <div className="flex gap-1 rounded-full bg-db-gray-100 p-1">
          {(
            [
              ['fotos', 'Nach Foto'],
              ['namen', 'Nach Namen'],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              onClick={() => modusWechseln(m)}
              className={`flex-1 rounded-full py-1.5 text-xs font-semibold ${
                aktiverModus === m ? 'bg-db-surface text-db-navy shadow-sm' : 'text-db-navy-light'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
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
          key={`${aktiverModus}-${runde}`}
          paare={paare}
          onKarteGemeistert={gemeistert}
          onAbschluss={(richtig, gesamt) => setErgebnis({ richtig, gesamt })}
        />
      )}
    </div>
  )
}
