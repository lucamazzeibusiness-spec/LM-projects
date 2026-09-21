import { router } from 'expo-router'
import { Image, Text, View } from 'react-native'
import ProfilForm from '../components/ProfilForm'
import { useAzubiProfil } from '../context/AzubiProfilContext'
import { DB_LOGO_PNG } from '../lib/dbLogo'
import type { AzubiProfil } from '../data/mock'

export default function Onboarding() {
  const { profil, profilSpeichern } = useAzubiProfil()

  const fertig = (p: AzubiProfil) => {
    profilSpeichern(p)
    router.replace('/(tabs)')
  }

  return (
    <View className="flex-1 bg-db-gray-50 dark:bg-[#10141B]">
      <View className="flex-row items-center gap-3 px-4 pt-14">
        <Image source={{ uri: DB_LOGO_PNG }} className="h-9" style={{ width: 40, height: 26 }} resizeMode="contain" />
        <View>
          <Text className="text-sm font-bold text-db-navy dark:text-[#EEF1F4]">Azubi</Text>
          <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">Kurz einrichten, dann geht's los</Text>
        </View>
      </View>
      <ProfilForm profil={profil} onFertig={fertig} />
    </View>
  )
}
