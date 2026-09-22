import { router } from 'expo-router'
import { Pressable, Text } from 'react-native'
import { usePunkte } from '../context/PunkteContext'
import { rangFuer } from '../lib/rang'

export default function RangBadge() {
  const { stand } = usePunkte()
  const { aktuell } = rangFuer(stand.gesamt)

  return (
    <Pressable
      onPress={() => router.push('/fortschritt')}
      className="h-8 flex-row items-center gap-1.5 rounded-full bg-db-gray-100 dark:bg-[#1A2029] px-2.5"
    >
      <Text className="text-xs font-semibold text-db-navy dark:text-[#EEF1F4]">
        {aktuell.icon} {stand.gesamt} P
      </Text>
    </Pressable>
  )
}
