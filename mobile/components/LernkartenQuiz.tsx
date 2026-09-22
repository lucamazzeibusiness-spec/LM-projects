import { Check, RotateCcw, Sparkles } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { lernkarten, type Lernkarte, type Pruefungsphase, type Themenbereich } from '../data/mock'
import Flashcard from './Flashcard'

const themenbereiche: (Themenbereich | 'Alle')[] = [
  'Alle',
  'Mathematik',
  'Elektrotechnik',
  'Sicherheit',
  'Metalltechnik',
  'Steuerungstechnik',
  'Wirtschaft & Soziales',
  'Ausbildung',
]

const pruefungsteile: (Pruefungsphase | 'Alle')[] = ['Alle', 'AP1', 'AP2']

const schwierigkeitStyle: Record<string, string> = {
  Grundlagen: 'bg-db-green/10 text-db-green',
  Fortgeschritten: 'bg-db-amber/10 text-db-amber',
}

function shuffle(karten: Lernkarte[]): Lernkarte[] {
  const kopie = [...karten]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
  }
  return kopie
}

export default function LernkartenQuiz() {
  const [themaFilter, setThemaFilter] = useState<Themenbereich | 'Alle'>('Alle')
  const [teilFilter, setTeilFilter] = useState<Pruefungsphase | 'Alle'>('Alle')
  const [deck, setDeck] = useState<Lernkarte[]>([])
  const [flipped, setFlipped] = useState(false)
  const [gewusst, setGewusst] = useState(0)
  const [wiederholen, setWiederholen] = useState(0)

  const gefiltert = () =>
    lernkarten.filter(
      (k) => (themaFilter === 'Alle' || k.themenbereich === themaFilter) && (teilFilter === 'Alle' || k.pruefungsteil === teilFilter),
    )

  const starten = () => {
    setDeck(shuffle(gefiltert()))
    setFlipped(false)
    setGewusst(0)
    setWiederholen(0)
  }

  useEffect(starten, [themaFilter, teilFilter])

  const aktuell = deck[0]
  const gesamt = gefiltert().length

  const kannIch = () => {
    setDeck((d) => d.slice(1))
    setGewusst((g) => g + 1)
    setFlipped(false)
  }

  const nochUeben = () => {
    setDeck((d) => [...d.slice(1), d[0]])
    setWiederholen((w) => w + 1)
    setFlipped(false)
  }

  return (
    <View className="gap-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pr-2">
        {themenbereiche.map((t) => (
          <Pressable
            key={t}
            onPress={() => setThemaFilter(t)}
            className={`rounded-full border px-3 py-1.5 ${
              themaFilter === t ? 'border-db-red bg-db-red' : 'border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24]'
            }`}
          >
            <Text className={`text-xs font-medium ${themaFilter === t ? 'text-white' : 'text-db-navy-light dark:text-[#9AA4B0]'}`}>{t}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View className="flex-row gap-1 rounded-full bg-db-gray-100 dark:bg-[#1A2029] p-1">
        {pruefungsteile.map((t) => (
          <Pressable
            key={t}
            onPress={() => setTeilFilter(t)}
            className={`flex-1 items-center rounded-full py-1.5 ${teilFilter === t ? 'bg-white dark:bg-[#171C24]' : ''}`}
          >
            <Text className={`text-xs font-semibold ${teilFilter === t ? 'text-db-navy dark:text-[#EEF1F4]' : 'text-db-navy-light dark:text-[#9AA4B0]'}`}>
              {t === 'Alle' ? 'Alle Prüfungsteile' : t}
            </Text>
          </Pressable>
        ))}
      </View>

      {gesamt > 0 && (
        <View className="gap-1.5">
          <View className="h-1.5 w-full overflow-hidden rounded-full bg-db-gray-100 dark:bg-[#1A2029]">
            <View
              className="h-full rounded-full bg-db-red"
              style={{ width: `${((gesamt - deck.length) / gesamt) * 100}%` }}
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
              Karte {Math.min(gesamt - deck.length + 1, gesamt)} von {gesamt}
            </Text>
            <View className="flex-row gap-3">
              <Text className="text-xs text-db-green">✓ {gewusst}</Text>
              <Text className="text-xs text-db-amber">↻ {wiederholen}</Text>
            </View>
          </View>
        </View>
      )}

      {aktuell ? (
        <View className="gap-3">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="overflow-hidden rounded-full bg-db-gray-100 dark:bg-[#1A2029] px-2.5 py-1 text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">
              {aktuell.themenbereich}
            </Text>
            <Text className="overflow-hidden rounded-full bg-db-navy/5 px-2.5 py-1 text-xs font-medium text-db-navy dark:text-[#EEF1F4]">
              {aktuell.pruefungsteil}
            </Text>
            <Text className={`overflow-hidden rounded-full px-2.5 py-1 text-xs font-medium ${schwierigkeitStyle[aktuell.schwierigkeit]}`}>
              {aktuell.schwierigkeit}
            </Text>
          </View>

          <Flashcard key={aktuell.id} front={aktuell.frage} back={aktuell.antwort} onFlipChange={setFlipped} />

          {flipped && (
            <View className="flex-row gap-2">
              <Pressable
                onPress={nochUeben}
                className="flex-1 flex-row items-center justify-center gap-1.5 rounded-full border border-db-amber/40 bg-db-amber/5 px-4 py-3"
              >
                <RotateCcw size={15} color="#D98600" />
                <Text className="text-sm font-semibold text-db-amber">Nochmal üben</Text>
              </Pressable>
              <Pressable
                onPress={kannIch}
                className="flex-1 flex-row items-center justify-center gap-1.5 rounded-full bg-db-red px-4 py-3"
              >
                <Check size={15} color="#fff" />
                <Text className="text-sm font-semibold text-white">Kann ich</Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
        <View className="items-center rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-6">
          <Sparkles size={24} color="#EC0016" />
          <Text className="mt-2 text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">
            {gesamt === 0 ? 'Keine Karten für diesen Filter.' : 'Runde geschafft!'}
          </Text>
          {gesamt > 0 && (
            <Text className="mt-1 text-xs text-db-navy-light dark:text-[#9AA4B0]">
              {gewusst} direkt gewusst · {wiederholen}× wiederholt
            </Text>
          )}
          {gesamt > 0 && (
            <Pressable onPress={starten} className="mt-4 rounded-full bg-db-red px-5 py-2.5">
              <Text className="text-sm font-semibold text-white">Nochmal von vorn</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  )
}
