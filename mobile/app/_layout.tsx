import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import '../global.css'
import Login from '../components/Login'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { AzubiProfilProvider } from '../context/AzubiProfilContext'
import { themeInitialisieren } from '../lib/theme'

function Gate() {
  const { user, bereit } = useAuth()

  if (!bereit) return <View className="flex-1 bg-db-gray-50" />
  if (!user) return <Login />

  // Erst ab hier mounten die Hooks, die aus AsyncStorage lesen – die
  // Cloud-Daten wurden von AuthProvider bereits dort hineingespiegelt.
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

export default function RootLayout() {
  const [themeBereit, setThemeBereit] = useState(false)

  useEffect(() => {
    themeInitialisieren().finally(() => setThemeBereit(true))
  }, [])

  if (!themeBereit) return <View className="flex-1 bg-db-gray-50" />

  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
