import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import '../global.css'
import { AzubiProfilProvider } from '../context/AzubiProfilContext'
import { themeInitialisieren } from '../lib/theme'

export default function RootLayout() {
  const [themeBereit, setThemeBereit] = useState(false)

  useEffect(() => {
    themeInitialisieren().finally(() => setThemeBereit(true))
  }, [])

  if (!themeBereit) return <View className="flex-1 bg-db-gray-50" />

  return (
    <AzubiProfilProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="profil" options={{ headerShown: true, title: 'Profil bearbeiten', presentation: 'modal' }} />
      </Stack>
    </AzubiProfilProvider>
  )
}
