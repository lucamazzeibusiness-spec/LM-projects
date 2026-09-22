import { Check, RotateCcw, Shuffle, Sparkles, Trophy } from 'lucide-react-native'
import { useEffect, useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { usePunkte } from '../context/PunkteContext'
import { useZuordnenBestzeiten } from '../context/ZuordnenContext'
import { lernkarten, type Lernkarte, type Pruefungsphase, type Themenbereich } from '../data/mock'
import { formatZeit } from '../lib/zeit'
import Flashcard from './Flashcard'
import Zuordnen from './Zuordnen'

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
  const [modus, setModus] = useState<'karten' | 'zuordnen'>('karten')
  const [deck, setDeck] = useState<Lernkarte[]>([])
  const [flipped, setFlipped] = useState(false)
  const [gewusst, setGewusst] = useState(0)
  const [wiederholen, setWiederholen] = useState(0)
  const [zuordnenRunde, setZuordnenRunde] = useState(0)
  const [zuordnenErgebnis, setZuordnenErgebnis] = useState<{ sekunden: number; fehler: number; neuerBest: boolean } | null>(null)
  const { punkteVergeben } = usePunkte()
  const { bestFuer, bestSetzenWennBesser } = useZuordnenBestzeiten()

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
  useEffect(() => setZuordnenErgebnis(null), [themaFilter, teilFilter])

  const aktuell = deck[0]
  const gesamt = gefiltert().length

  const kannIch = () => {
    if (aktuell) punkteVergeben(`karte:${aktuell.id}`, 5, `Lernkarte gemeistert: ${aktuell.themenbereich}`)
    setDeck((d) => d.slice(1))
    setGewusst((g) => g + 1)
    setFlipped(false)
  }

  const nochUeben = () => {
    setDeck((d) => [...d.slice(1), d[0]])
    setWiederholen((w) => w + 1)
    setFlipped(false)
  }

  const zuordnenSchluessel = `lernkarten:${themaFilter}:${teilFilter}`
  const zuordnenPaare = useMemo(
    () => shuffle(gefiltert()).slice(0, 6).map((k) => ({ id: k.id, begriff: k.frage, definition: k.antwort })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [themaFilter, teilFilter, zuordnenRunde],
  )
  const zuordnenBest = bestFuer(zuordnenSchluessel)

  const zuordnenAbschluss = (sekunden: number, fehler: number) => {
    const neuerBest = bestSetzenWennBesser(zuordnenSchluessel, sekunden)
    if (neuerBest) {
      const punkte = Math.max(10, 40 - Math.round(sekunden / 2) - fehler * 2)
      punkteVergeben(`zuordnen-best:${zuordnenSchluessel}:${Date.now()}`, punkte, `Neue Bestzeit Zuordnen: ${formatZeit(sekunden)}`)
    }
    setZuordnenErgebnis({ sekunden, fehler, neuerBest })
  }

  const neueZuordnenRunde = () => {
    setZuordnenErgebnis(null)
    setZuordnenRunde((r) => r + 1)
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

      <View className="flex-row gap-1 rounded-full bg-db-gray-100 dark:bg-[#1A2029] p-1">
        <Pressable
          onPress={() => setModus('karten')}
          className={`flex-1 items-center rounded-full py-1.5 ${modus === 'karten' ? 'bg-white dark:bg-[#171C24]' : ''}`}
        >
          <Text className={`text-xs font-semibold ${modus === 'karten' ? 'text-db-navy dark:text-[#EEF1F4]' : 'text-db-navy-light dark:text-[#9AA4B0]'}`}>
            Karteikarten
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setModus('zuordnen')}
          className={`flex-1 items-center rounded-full py-1.5 ${modus === 'zuordnen' ? 'bg-white dark:bg-[#171C24]' : ''}`}
        >
          <Text className={`text-xs font-semibold ${modus === 'zuordnen' ? 'text-db-navy dark:text-[#EEF1F4]' : 'text-db-navy-light dark:text-[#9AA4B0]'}`}>
            Zuordnen
          </Text>
        </Pressable>
      </View>

      {modus === 'karten' && gesamt > 0 && (
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

      {modus === 'zuordnen' ? (
        zuordnenPaare.length < 4 ? (
          <View className="items-center rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-6">
            <Text className="text-sm text-db-navy-light dark:text-[#9AA4B0]">Zu wenige Karten für diesen Filter (mind. 4 nötig).</Text>
          </View>
        ) : zuordnenErgebnis ? (
          <View className="items-center gap-3 rounded-xl border border-db-green/30 bg-db-green/5 p-6">
            <Sparkles size={24} color="#1E8A3C" />
            <Text className="text-lg font-semibold text-db-navy dark:text-[#EEF1F4]">Geschafft in {formatZeit(zuordnenErgebnis.sekunden)}!</Text>
            <Text className="text-sm text-db-navy-light dark:text-[#9AA4B0]">
              {zuordnenErgebnis.fehler === 0 ? 'Ohne Fehler – stark!' : `${zuordnenErgebnis.fehler} Fehler (je +3 Sek.)`}
            </Text>
            {zuordnenErgebnis.neuerBest ? (
              <View className="flex-row items-center gap-1.5">
                <Trophy size={15} color="#D98600" />
                <Text className="text-sm font-semibold text-db-amber">Neue Bestzeit für diesen Filter!</Text>
              </View>
            ) : (
              zuordnenBest !== null && (
                <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">Bestzeit: {formatZeit(zuordnenBest)}</Text>
              )
            )}
            <Pressable
              onPress={neueZuordnenRunde}
              className="flex-row items-center gap-1.5 rounded-full bg-db-red px-5 py-2.5"
            >
              <Shuffle size={15} color="#fff" />
              <Text className="text-sm font-semibold text-white">Neue Runde</Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-2">
            {zuordnenBest !== null && (
              <View className="flex-row items-center gap-1.5">
                <Trophy size={13} color="#D98600" />
                <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
                  Bestzeit für diesen Filter: {formatZeit(zuordnenBest)}
                </Text>
              </View>
            )}
            <Zuordnen key={zuordnenRunde} paare={zuordnenPaare} onAbschluss={zuordnenAbschluss} />
          </View>
        )
      ) : aktuell ? (
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
