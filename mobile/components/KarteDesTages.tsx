import { router } from 'expo-router'
import { ArrowRight, Check, RotateCcw, Target } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useLernstand } from '../context/LernstandContext'
import { usePunkte } from '../context/PunkteContext'
import { lernkarten } from '../data/mock'
import { karteDesTagesWaehlen } from '../lib/lernstand'
import { ladeGespeichert, speichere } from '../lib/storage'
import { heuteISO } from '../lib/wochen'

const SPEICHER_KEY = 'karteDesTages'

export default function KarteDesTages() {
  const { lernstand, geladen, ergebnisMerken } = useLernstand()
  const { punkteVergeben } = usePunkte()
  const [id, setId] = useState<string | null>(null)
  const [aufgedeckt, setAufgedeckt] = useState(false)

  // Die Auswahl wird pro Tag festgehalten: Nach dem Beantworten ändert sich der Lernstand, eine
  // neu berechnete Auswahl würde sonst mitten am Tag auf eine andere Karte springen. Gewählt wird
  // erst, wenn der gespeicherte Lernstand geladen ist.
  useEffect(() => {
    if (!geladen || id) return
    const heute = heuteISO()
    ladeGespeichert<{ datum: string; id: string } | null>(SPEICHER_KEY, null).then((gespeichert) => {
      if (gespeichert?.datum === heute && lernkarten.some((k) => k.id === gespeichert.id)) {
        setId(gespeichert.id)
        return
      }
      const neu = karteDesTagesWaehlen(heute, lernstand).id
      setId(neu)
      speichere(SPEICHER_KEY, { datum: heute, id: neu }).catch(() => {})
    })
  }, [geladen, id, lernstand])

  const karte = id ? lernkarten.find((k) => k.id === id) : undefined
  if (!karte) return null

  const zuletzt = lernstand[karte.id]?.zuletzt
  const heuteErledigt = !!zuletzt && new Date(zuletzt).toDateString() === new Date().toDateString()
  const antwortSichtbar = aufgedeckt || heuteErledigt

  const bewerten = (richtig: boolean) => {
    ergebnisMerken(karte.id, richtig)
    if (richtig) punkteVergeben(`karte:${karte.id}`, 5, `Lernkarte gemeistert: ${karte.themenbereich}`)
  }

  return (
    <View className="rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-1.5">
          <Target size={15} color="#EC0016" />
          <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Karte des Tages</Text>
        </View>
        <Text className="overflow-hidden rounded-full bg-db-gray-100 dark:bg-[#1A2029] px-2.5 py-0.5 text-[11px] font-medium text-db-navy-light dark:text-[#9AA4B0]">
          {karte.themenbereich} · {karte.pruefungsteil}
        </Text>
      </View>
      <Text className="mt-3 text-sm font-medium text-db-navy dark:text-[#EEF1F4]">{karte.frage}</Text>

      {antwortSichtbar ? (
        <Text className="mt-3 rounded-lg bg-db-gray-50 dark:bg-[#10141B] p-3 text-sm text-db-navy dark:text-[#EEF1F4]">{karte.antwort}</Text>
      ) : (
        <Pressable onPress={() => setAufgedeckt(true)} className="mt-3 items-center rounded-full border border-db-gray-200 dark:border-[#2A323D] px-4 py-2">
          <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Antwort zeigen</Text>
        </Pressable>
      )}

      {heuteErledigt ? (
        <View className="mt-3 flex-row items-center justify-between gap-2">
          <View className="flex-1 flex-row items-center gap-1">
            <Check size={14} color="#1E8A3C" />
            <Text className="flex-1 text-xs font-medium text-db-green">Für heute erledigt – morgen kommt die nächste</Text>
          </View>
          <Pressable onPress={() => router.push('/wissen')} className="flex-row items-center gap-1">
            <Text className="text-xs font-semibold text-db-red">Weiter üben</Text>
            <ArrowRight size={13} color="#EC0016" />
          </Pressable>
        </View>
      ) : (
        aufgedeckt && (
          <View className="mt-3 flex-row gap-2">
            <Pressable
              onPress={() => bewerten(false)}
              className="flex-1 flex-row items-center justify-center gap-1.5 rounded-full border border-db-amber/40 bg-db-amber/5 px-3 py-2"
            >
              <RotateCcw size={14} color="#D98600" />
              <Text className="text-sm font-semibold text-db-amber">Nochmal üben</Text>
            </Pressable>
            <Pressable onPress={() => bewerten(true)} className="flex-1 flex-row items-center justify-center gap-1.5 rounded-full bg-db-red px-3 py-2">
              <Check size={14} color="#fff" />
              <Text className="text-sm font-semibold text-white">Wusste ich</Text>
            </Pressable>
          </View>
        )
      )}
    </View>
  )
}
