import { router } from 'expo-router'
import { ArrowRight, Check, Target, X } from 'lucide-react-native'
import { useEffect, useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useLernstand } from '../context/LernstandContext'
import { usePunkte } from '../context/PunkteContext'
import { lernkarten } from '../data/mock'
import { antwortOptionen, karteDesTagesGeeignet, karteDesTagesWaehlen } from '../lib/lernstand'
import { ladeGespeichert, speichere } from '../lib/storage'
import { heuteISO } from '../lib/wochen'

const SPEICHER_KEY = 'karteDesTages'

export default function KarteDesTages() {
  const { lernstand, geladen, ergebnisMerken } = useLernstand()
  const { punkteVergeben } = usePunkte()
  const [id, setId] = useState<string | null>(null)
  const [gewaehlt, setGewaehlt] = useState<string | null>(null)

  // Die Auswahl wird pro Tag festgehalten: Nach dem Beantworten ändert sich der Lernstand, eine
  // neu berechnete Auswahl würde sonst mitten am Tag auf eine andere Karte springen. Gewählt wird
  // erst, wenn der gespeicherte Lernstand geladen ist.
  useEffect(() => {
    if (!geladen || id) return
    const heute = heuteISO()
    ladeGespeichert<{ datum: string; id: string } | null>(SPEICHER_KEY, null).then((gespeichert) => {
      const gespeicherteKarte = lernkarten.find((k) => k.id === gespeichert?.id)
      if (gespeichert?.datum === heute && gespeicherteKarte && karteDesTagesGeeignet(gespeicherteKarte)) {
        setId(gespeichert.id)
        return
      }
      const neu = karteDesTagesWaehlen(heute, lernstand).id
      setId(neu)
      speichere(SPEICHER_KEY, { datum: heute, id: neu }).catch(() => {})
    })
  }, [geladen, id, lernstand])

  const karte = id ? lernkarten.find((k) => k.id === id) : undefined
  const optionen = useMemo(() => (karte ? antwortOptionen(karte, heuteISO()) : []), [karte])
  if (!karte) return null

  const stand = lernstand[karte.id]
  const heuteErledigt = !!stand?.zuletzt && new Date(stand.zuletzt).toDateString() === new Date().toDateString()
  const beantwortet = gewaehlt !== null || heuteErledigt
  const richtig = gewaehlt !== null ? gewaehlt === karte.antwort : stand?.letztesErgebnis === 'richtig'

  const antworten = (option: string) => {
    if (beantwortet) return
    setGewaehlt(option)
    const treffer = option === karte.antwort
    ergebnisMerken(karte.id, treffer)
    if (treffer) punkteVergeben(`karte:${karte.id}`, 5, `Frage des Tages: ${karte.themenbereich}`)
  }

  const optionStil = (option: string) => {
    if (!beantwortet) return 'border-db-gray-200 dark:border-[#2A323D]'
    if (option === karte.antwort) return 'border-db-green/50 bg-db-green/5'
    if (option === gewaehlt) return 'border-db-red/50 bg-db-red/5'
    return 'border-db-gray-200 dark:border-[#2A323D] opacity-60'
  }

  return (
    <View className="rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-1.5">
          <Target size={15} color="#EC0016" />
          <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Frage des Tages</Text>
        </View>
        <Text className="overflow-hidden rounded-full bg-db-gray-100 dark:bg-[#1A2029] px-2.5 py-0.5 text-[11px] font-medium text-db-navy-light dark:text-[#9AA4B0]">
          {karte.themenbereich} · {karte.pruefungsteil}
        </Text>
      </View>
      <Text className="mt-3 text-sm font-medium text-db-navy dark:text-[#EEF1F4]">{karte.frage}</Text>

      <View className="mt-3 gap-2">
        {optionen.map((option) => (
          <Pressable
            key={option}
            onPress={() => antworten(option)}
            disabled={beantwortet}
            className={`flex-row items-start gap-2 rounded-lg border px-3 py-2.5 ${optionStil(option)}`}
          >
            <Text className="flex-1 text-sm text-db-navy dark:text-[#EEF1F4]">{option}</Text>
            {beantwortet && option === karte.antwort && <Check size={16} color="#1E8A3C" />}
            {beantwortet && option === gewaehlt && option !== karte.antwort && <X size={16} color="#EC0016" />}
          </Pressable>
        ))}
      </View>

      {beantwortet && (
        <View className="mt-3 flex-row items-center justify-between gap-2">
          <Text className={`flex-1 text-xs font-medium ${richtig ? 'text-db-green' : 'text-db-amber'}`}>
            {richtig ? 'Richtig! Morgen kommt die nächste Frage.' : 'Nicht ganz – die Frage kommt bald wieder.'}
          </Text>
          <Pressable onPress={() => router.push('/wissen')} className="flex-row items-center gap-1">
            <Text className="text-xs font-semibold text-db-red">Weiter üben</Text>
            <ArrowRight size={13} color="#EC0016" />
          </Pressable>
        </View>
      )}
    </View>
  )
}
