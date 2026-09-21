import { router } from 'expo-router'
import { MapPin, Target } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { GewerkBadge, PrioBadge, StatusBadge } from '../../../components/Badges'
import { lernaufgaben, type Gewerk, type LernaufgabeStatus } from '../../../data/mock'

const gewerke: (Gewerk | 'Alle')[] = ['Alle', 'Elektrik', 'Mechanik', 'Mechatronik']
const stati: (LernaufgabeStatus | 'Alle')[] = ['Alle', 'Offen', 'In Arbeit', 'Erledigt']

function FilterChip({ label, active, onPress, variant }: { label: string; active: boolean; onPress: () => void; variant: 'red' | 'navy' }) {
  const activeClass = variant === 'red' ? 'border-db-red bg-db-red' : 'border-db-navy bg-db-navy'
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-3 py-1.5 ${active ? activeClass : 'border-db-gray-200 bg-white'}`}
    >
      <Text className={`text-xs font-medium ${active ? 'text-white' : 'text-db-navy-light'}`}>{label}</Text>
    </Pressable>
  )
}

export default function Aufgaben() {
  const [gewerk, setGewerk] = useState<Gewerk | 'Alle'>('Alle')
  const [status, setStatus] = useState<LernaufgabeStatus | 'Alle'>('Alle')

  const gefiltert = useMemo(
    () => lernaufgaben.filter((a) => (gewerk === 'Alle' || a.gewerk === gewerk) && (status === 'Alle' || a.status === status)),
    [gewerk, status],
  )

  return (
    <ScrollView className="flex-1 bg-db-gray-50" contentContainerClassName="gap-4 p-4">
      <View>
        <Text className="text-xl font-semibold text-db-navy">Aufgaben</Text>
        <Text className="text-sm text-db-navy-light">Von deinem Ausbilder zugewiesen, mit Lernziel</Text>
      </View>

      <View className="gap-2">
        <View className="flex-row flex-wrap gap-2">
          {gewerke.map((g) => (
            <FilterChip key={g} label={g} active={gewerk === g} onPress={() => setGewerk(g)} variant="red" />
          ))}
        </View>
        <View className="flex-row flex-wrap gap-2">
          {stati.map((s) => (
            <FilterChip key={s} label={s} active={status === s} onPress={() => setStatus(s)} variant="navy" />
          ))}
        </View>
      </View>

      <View className="gap-3">
        {gefiltert.map((a) => (
          <Pressable
            key={a.id}
            onPress={() => router.push(`/aufgaben/${a.id}`)}
            className="rounded-xl border border-db-gray-200 bg-white p-4"
          >
            <View className="flex-row items-start justify-between gap-3">
              <View>
                <Text className="text-xs font-medium text-db-navy-light">{a.id}</Text>
                <Text className="text-sm font-semibold text-db-navy">{a.titel}</Text>
              </View>
              <StatusBadge status={a.status} />
            </View>
            <View className="mt-1 flex-row items-center gap-1">
              <MapPin size={12} color="#5C6670" />
              <Text className="text-xs text-db-navy-light">
                {a.anlage} {a.baureihe ? `(${a.baureihe})` : ''} · {a.ort}
              </Text>
            </View>
            <View className="mt-2 flex-row items-start gap-1.5">
              <Target size={13} color="#EC0016" style={{ marginTop: 2 }} />
              <Text className="flex-1 text-xs text-db-navy">{a.lernziel}</Text>
            </View>
            <View className="mt-3 flex-row flex-wrap items-center gap-2">
              <GewerkBadge gewerk={a.gewerk} />
              <PrioBadge prioritaet={a.prioritaet} />
              <Text className="text-xs text-db-navy-light">Fällig: {a.faelligkeit}</Text>
            </View>
          </Pressable>
        ))}
        {gefiltert.length === 0 && (
          <Text className="rounded-xl border border-dashed border-db-gray-200 p-6 text-center text-sm text-db-navy-light">
            Keine Aufgaben für diese Filter.
          </Text>
        )}
      </View>
    </ScrollView>
  )
}
