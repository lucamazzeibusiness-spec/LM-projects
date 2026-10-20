import { Shuffle, Sparkles } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
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
    <View className="gap-3 rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4">
      <View className="flex-row items-center justify-between gap-2">
        <Text className="flex-1 text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Baureihen-Quiz · Welche Baureihe ist das?</Text>
        <Pressable onPress={onSchliessen} hitSlop={8}>
          <Text className="text-xs font-semibold text-db-navy-light dark:text-[#9AA4B0]">Zur Liste</Text>
        </Pressable>
      </View>
      {ergebnis ? (
        <View className="items-center gap-3 py-2">
          <Sparkles size={24} color="#1E8A3C" />
          <Text className="text-lg font-semibold text-db-navy dark:text-[#EEF1F4]">
            {ergebnis.richtig} von {ergebnis.gesamt} auf Anhieb erkannt
          </Text>
          <Pressable onPress={neueRunde} className="flex-row items-center gap-1.5 rounded-full bg-db-red px-5 py-2.5">
            <Shuffle size={15} color="#fff" />
            <Text className="text-sm font-semibold text-white">Neue Runde</Text>
          </Pressable>
        </View>
      ) : (
        <Lernmodus key={runde} paare={paare} onKarteGemeistert={gemeistert} onAbschluss={(richtig, gesamt) => setErgebnis({ richtig, gesamt })} />
      )}
    </View>
  )
}
