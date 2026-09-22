import { Text, View } from 'react-native'
import { usePunkte } from '../context/PunkteContext'
import { rangFuer } from '../lib/rang'

export default function RangKarte({ kompakt = false }: { kompakt?: boolean }) {
  const { stand, streak } = usePunkte()
  const { aktuell, naechster, fortschritt, punkteBisNaechster } = rangFuer(stand.gesamt)

  return (
    <View
      className={`rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] ${kompakt ? 'p-3' : 'p-4'}`}
    >
      <View className="flex-row items-center gap-3">
        <Text style={{ fontSize: kompakt ? 24 : 30 }}>{aktuell.icon}</Text>
        <View className="min-w-0 flex-1">
          <View className="flex-row items-baseline justify-between gap-2">
            <Text className={`font-semibold text-db-navy dark:text-[#EEF1F4] ${kompakt ? 'text-sm' : 'text-base'}`}>
              {aktuell.name}
            </Text>
            <Text className="shrink-0 text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">{stand.gesamt} Punkte</Text>
          </View>
          <View className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-db-gray-100 dark:bg-[#1A2029]">
            <View className="h-full rounded-full bg-db-red" style={{ width: `${fortschritt * 100}%` }} />
          </View>
          <Text className="mt-1 text-[11px] text-db-navy-light dark:text-[#9AA4B0]">
            {naechster ? `Noch ${punkteBisNaechster} Punkte bis ${naechster.name} ${naechster.icon}` : 'Höchster Rang erreicht 🎉'}
          </Text>
        </View>
      </View>
      {streak > 0 && !kompakt && (
        <View className="mt-3 flex-row items-center gap-1.5 rounded-lg bg-db-amber/10 px-2.5 py-1.5">
          <Text className="text-xs font-medium text-db-amber">
            🔥 {streak} {streak === 1 ? 'Tag' : 'Tage'} in Folge Berichtsheft geführt
          </Text>
        </View>
      )}
    </View>
  )
}
