import { Lock } from 'lucide-react-native'
import { ScrollView, Text, View } from 'react-native'
import RangKarte from '../components/RangKarte'
import { useLernstand } from '../context/LernstandContext'
import { usePunkte } from '../context/PunkteContext'
import { fortschrittProThema } from '../lib/lernstand'
import { raenge, rangFuer } from '../lib/rang'

function relativeZeit(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minuten = Math.floor(diffMs / 60000)
  if (minuten < 1) return 'gerade eben'
  if (minuten < 60) return `vor ${minuten} Min.`
  const stunden = Math.floor(minuten / 60)
  if (stunden < 24) return `vor ${stunden} Std.`
  const tage = Math.floor(stunden / 24)
  return `vor ${tage} ${tage === 1 ? 'Tag' : 'Tagen'}`
}

export default function Fortschritt() {
  const { stand } = usePunkte()
  const { aktuell } = rangFuer(stand.gesamt)
  const { lernstand } = useLernstand()
  const themen = fortschrittProThema(lernstand)
  const sicherGesamt = themen.reduce((n, t) => n + t.sicher, 0)
  const kartenGesamt = themen.reduce((n, t) => n + t.gesamt, 0)

  return (
    <ScrollView className="flex-1 bg-db-gray-50 dark:bg-[#10141B]" contentContainerClassName="gap-4 p-4">
      <View>
        <Text className="text-xl font-semibold text-db-navy dark:text-[#EEF1F4]">Fortschritt</Text>
        <Text className="text-sm text-db-navy-light dark:text-[#9AA4B0]">
          Punkte sammeln fürs Lernen und für dein Berichtsheft
        </Text>
      </View>

      <RangKarte />

      <View className="rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4">
        <View className="flex-row items-baseline justify-between gap-2">
          <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Prüfungsvorbereitung</Text>
          <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
            {sicherGesamt} von {kartenGesamt} Karten sicher
          </Text>
        </View>
        <View className="mt-3 gap-3">
          {themen.map((t) => (
            <View key={t.thema}>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-medium text-db-navy dark:text-[#EEF1F4]">{t.thema}</Text>
                <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
                  {t.sicher}/{t.gesamt}
                  {t.schwach > 0 && <Text className="text-db-amber"> · {t.schwach} schwach</Text>}
                </Text>
              </View>
              <View className="mt-1 h-1.5 w-full flex-row overflow-hidden rounded-full bg-db-gray-100 dark:bg-[#1A2029]">
                <View className="h-full bg-db-green" style={{ width: `${(t.sicher / t.gesamt) * 100}%` }} />
                <View className="h-full bg-db-amber" style={{ width: `${(t.schwach / t.gesamt) * 100}%` }} />
              </View>
            </View>
          ))}
        </View>
        <Text className="mt-3 text-xs text-db-navy-light dark:text-[#9AA4B0]">Üben im Wissen-Tab unter „Prüfungstraining“.</Text>
      </View>

      <View className="rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4">
        <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Ränge</Text>
        <View className="mt-3 gap-1.5">
          {raenge.map((r) => (
            <View
              key={r.name}
              className={`flex-row items-center justify-between rounded-lg px-3 py-2 ${
                r.name === aktuell.name ? 'bg-db-red/5' : ''
              }`}
            >
              <Text
                className={`text-sm ${
                  r.name === aktuell.name ? 'font-semibold text-db-red-dark' : 'text-db-navy-light dark:text-[#9AA4B0]'
                }`}
              >
                {r.icon} {r.name}
              </Text>
              <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">ab {r.minPunkte} P.</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="items-center rounded-xl border border-dashed border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4">
        <Lock size={20} color="#5C6670" />
        <Text className="mt-2 text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Shop kommt bald</Text>
        <Text className="mt-1 text-center text-xs text-db-navy-light dark:text-[#9AA4B0]">
          Hier kannst du deine Punkte bald gegen etwas eintauschen – sammel schon mal fleißig.
        </Text>
      </View>

      <View className="rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4">
        <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Verlauf</Text>
        {stand.verlauf.length === 0 ? (
          <Text className="mt-2 text-sm text-db-navy-light dark:text-[#9AA4B0]">
            Noch keine Punkte gesammelt – leg los im Wissen-Tab oder mit dem Berichtsheft.
          </Text>
        ) : (
          <View className="mt-3 divide-y divide-db-gray-100 dark:divide-[#2A323D]">
            {stand.verlauf.slice(0, 30).map((e) => (
              <View key={e.id + e.datum} className="flex-row items-center justify-between gap-3 py-2">
                <View className="min-w-0 flex-1">
                  <Text className="text-sm text-db-navy dark:text-[#EEF1F4]" numberOfLines={1}>
                    {e.grund}
                  </Text>
                  <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">{relativeZeit(e.datum)}</Text>
                </View>
                <Text className="shrink-0 text-sm font-semibold text-db-green">+{e.betrag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}
