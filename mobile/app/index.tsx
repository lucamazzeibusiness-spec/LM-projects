import { Redirect } from 'expo-router'
import { View } from 'react-native'
import { useAzubiProfil } from '../context/AzubiProfilContext'

export default function Gate() {
  const { profil, geladen } = useAzubiProfil()

  if (!geladen) return <View className="flex-1 bg-db-gray-50" />
  if (!profil) return <Redirect href="/onboarding" />
  return <Redirect href="/(tabs)" />
}
