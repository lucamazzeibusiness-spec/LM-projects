import { AlertCircle, MapPin, Search, Wrench } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { ScrollView, Text, TextInput, View } from 'react-native'
import { Pressable } from 'react-native'
import { GewerkBadge } from '../../components/Badges'
import LernkartenQuiz from '../../components/LernkartenQuiz'
import { ersatzteile, fehlerfaelle, type Gewerk } from '../../data/mock'

const gewerke: (Gewerk | 'Alle')[] = ['Alle', 'Elektrik', 'Mechanik', 'Mechatronik']
type Tab = 'fehlerdiagnose' | 'ersatzteile' | 'pruefung'

const schwierigkeitStyle: Record<string, string> = {
  Grundlagen: 'bg-db-green/10 text-db-green',
  Fortgeschritten: 'bg-db-amber/10 text-db-amber',
}

export default function Wissen() {
  const [tab, setTab] = useState<Tab>('fehlerdiagnose')
  const [query, setQuery] = useState('')
  const [gewerk, setGewerk] = useState<Gewerk | 'Alle'>('Alle')

  const fehler = useMemo(() => {
    const q = query.trim().toLowerCase()
    return fehlerfaelle.filter((f) => {
      const matchesGewerk = gewerk === 'Alle' || f.gewerk === gewerk
      const matchesQuery =
        q === '' ||
        f.code.toLowerCase().includes(q) ||
        f.titel.toLowerCase().includes(q) ||
        f.baureihe.toLowerCase().includes(q) ||
        f.symptome.some((s) => s.toLowerCase().includes(q))
      return matchesGewerk && matchesQuery
    })
  }, [query, gewerk])

  const teile = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ersatzteile.filter((e) => {
      const matchesGewerk = gewerk === 'Alle' || e.kategorie === gewerk
      const matchesQuery = q === '' || e.name.toLowerCase().includes(q) || e.nummer.toLowerCase().includes(q)
      return matchesGewerk && matchesQuery
    })
  }, [query, gewerk])

  return (
    <ScrollView className="flex-1 bg-db-gray-50" contentContainerClassName="gap-4 p-4">
      <View>
        <Text className="text-xl font-semibold text-db-navy">Wissen</Text>
        <Text className="text-sm text-db-navy-light">Nachschlagen und verstehen – nicht nur auswendig lernen</Text>
      </View>

      <View className="flex-row gap-1 rounded-full bg-db-gray-100 p-1">
        {(
          [
            ['fehlerdiagnose', 'Fehlerdiagnose'],
            ['ersatzteile', 'Ersatzteile-Lexikon'],
            ['pruefung', 'Prüfungstraining'],
          ] as const
        ).map(([key, label]) => (
          <Pressable
            key={key}
            onPress={() => setTab(key)}
            className={`flex-1 items-center rounded-full py-2 ${tab === key ? 'bg-white' : ''}`}
          >
            <Text className={`text-sm font-semibold ${tab === key ? 'text-db-navy' : 'text-db-navy-light'}`}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {tab === 'pruefung' && <LernkartenQuiz />}

      {tab !== 'pruefung' && (
        <>
          <View className="relative justify-center">
            <Search size={16} color="#5C6670" style={{ position: 'absolute', left: 12, zIndex: 1 }} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={tab === 'fehlerdiagnose' ? 'z. B. E-4471, Türsteuerung, BR 412...' : 'Teilename oder Teilenummer...'}
              className="w-full rounded-lg border border-db-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-db-navy"
            />
          </View>

          <View className="flex-row flex-wrap gap-2">
            {gewerke.map((g) => (
              <Pressable
                key={g}
                onPress={() => setGewerk(g)}
                className={`rounded-full border px-3 py-1.5 ${gewerk === g ? 'border-db-red bg-db-red' : 'border-db-gray-200 bg-white'}`}
              >
                <Text className={`text-xs font-medium ${gewerk === g ? 'text-white' : 'text-db-navy-light'}`}>{g}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {tab === 'fehlerdiagnose' && (
        <View className="gap-3">
          {fehler.map((f) => (
            <View key={f.id} className="rounded-xl border border-db-gray-200 bg-white p-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-row items-center gap-2">
                  <AlertCircle size={16} color="#EC0016" />
                  <View>
                    <Text className="text-xs font-medium text-db-navy-light">{f.code}</Text>
                    <Text className="text-sm font-semibold text-db-navy">{f.titel}</Text>
                  </View>
                </View>
                <View className="items-end gap-1.5">
                  <GewerkBadge gewerk={f.gewerk} />
                  <Text className={`overflow-hidden rounded-full px-2 py-0.5 text-[11px] font-medium ${schwierigkeitStyle[f.schwierigkeit]}`}>
                    {f.schwierigkeit}
                  </Text>
                </View>
              </View>
              <Text className="mt-1 text-xs text-db-navy-light">
                {f.baureihe} · {f.haeufigkeit}
              </Text>

              <View className="mt-3">
                <Text className="text-xs font-medium text-db-navy-light">Symptome</Text>
                <Text className="text-sm text-db-navy">{f.symptome.join(' · ')}</Text>
              </View>
              <View className="mt-2">
                <Text className="text-xs font-medium text-db-navy-light">Wahrscheinliche Ursache</Text>
                <Text className="text-sm text-db-navy">{f.ursache}</Text>
              </View>
              <View className="mt-3 rounded-lg bg-db-gray-50 p-3">
                <View className="mb-1.5 flex-row items-center gap-1.5">
                  <Wrench size={13} color="#5C6670" />
                  <Text className="text-xs font-medium text-db-navy-light">Lösungsschritte</Text>
                </View>
                {f.loesung.map((step, i) => (
                  <Text key={i} className="text-sm text-db-navy">
                    {i + 1}. {step}
                  </Text>
                ))}
              </View>
              <Text className="mt-3 rounded-lg border border-db-red/20 bg-db-red/5 p-2.5 text-xs text-db-red-dark">
                💡 {f.merksatz}
              </Text>
            </View>
          ))}
          {fehler.length === 0 && (
            <Text className="rounded-xl border border-dashed border-db-gray-200 p-6 text-center text-sm text-db-navy-light">
              Keine Treffer. Suchbegriff oder Filter anpassen.
            </Text>
          )}
        </View>
      )}

      {tab === 'ersatzteile' && (
        <View className="gap-3">
          {teile.map((e) => (
            <View key={e.id} className="rounded-xl border border-db-gray-200 bg-white p-4">
              <View className="flex-row items-start justify-between gap-3">
                <View>
                  <Text className="text-sm font-semibold text-db-navy">{e.name}</Text>
                  <Text className="text-xs text-db-navy-light">{e.nummer}</Text>
                </View>
                <Text className="overflow-hidden rounded-full bg-db-gray-100 px-2.5 py-1 text-xs font-medium text-db-navy-light">
                  {e.kategorie}
                </Text>
              </View>
              <Text className="mt-2 text-sm text-db-navy">{e.funktion}</Text>
              <View className="mt-2 flex-row items-center gap-1">
                <MapPin size={12} color="#5C6670" />
                <Text className="text-xs text-db-navy-light">{e.lagerort}</Text>
              </View>
            </View>
          ))}
          {teile.length === 0 && (
            <Text className="rounded-xl border border-dashed border-db-gray-200 p-6 text-center text-sm text-db-navy-light">
              Keine Treffer. Suchbegriff oder Filter anpassen.
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  )
}
