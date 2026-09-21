import { Check, RotateCcw, Sparkles } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { lernkarten, type Lernkarte, type Pruefungsphase, type Themenbereich } from '../data/mock'

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
              themaFilter === t ? 'border-db-red bg-db-red' : 'border-db-gray-200 bg-white'
            }`}
          >
            <Text className={`text-xs font-medium ${themaFilter === t ? 'text-white' : 'text-db-navy-light'}`}>{t}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View className="flex-row gap-1 rounded-full bg-db-gray-100 p-1">
        {pruefungsteile.map((t) => (
          <Pressable
            key={t}
            onPress={() => setTeilFilter(t)}
            className={`flex-1 items-center rounded-full py-1.5 ${teilFilter === t ? 'bg-white' : ''}`}
          >
            <Text className={`text-xs font-semibold ${teilFilter === t ? 'text-db-navy' : 'text-db-navy-light'}`}>
              {t === 'Alle' ? 'Alle Prüfungsteile' : t}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-db-navy-light">
          Noch {deck.length} von {gesamt} Karten
        </Text>
        <View className="flex-row gap-3">
          <Text className="text-xs text-db-green">✓ {gewusst}</Text>
          <Text className="text-xs text-db-amber">↻ {wiederholen}</Text>
        </View>
      </View>

      {aktuell ? (
        <View className="rounded-xl border border-db-gray-200 bg-white p-5">
          <View className="mb-3 flex-row flex-wrap items-center gap-2">
            <Text className="overflow-hidden rounded-full bg-db-gray-100 px-2.5 py-1 text-xs font-medium text-db-navy-light">
              {aktuell.themenbereich}
            </Text>
            <Text className="overflow-hidden rounded-full bg-db-navy/5 px-2.5 py-1 text-xs font-medium text-db-navy">
              {aktuell.pruefungsteil}
            </Text>
            <Text className={`overflow-hidden rounded-full px-2.5 py-1 text-xs font-medium ${schwierigkeitStyle[aktuell.schwierigkeit]}`}>
              {aktuell.schwierigkeit}
            </Text>
          </View>

          <Text className="min-h-24 text-sm font-medium leading-relaxed text-db-navy">
            {flipped ? aktuell.antwort : aktuell.frage}
          </Text>

          {!flipped ? (
            <Pressable onPress={() => setFlipped(true)} className="mt-5 items-center rounded-full bg-db-navy px-4 py-3">
              <Text className="text-sm font-semibold text-white">Antwort zeigen</Text>
            </Pressable>
          ) : (
            <View className="mt-5 flex-row gap-2">
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
        <View className="items-center rounded-xl border border-db-gray-200 bg-white p-6">
          <Sparkles size={24} color="#EC0016" />
          <Text className="mt-2 text-sm font-semibold text-db-navy">
            {gesamt === 0 ? 'Keine Karten für diesen Filter.' : 'Runde geschafft!'}
          </Text>
          {gesamt > 0 && (
            <Text className="mt-1 text-xs text-db-navy-light">
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
