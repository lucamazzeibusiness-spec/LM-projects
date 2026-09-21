import { Stack } from 'expo-router'
import '../global.css'
import { AzubiProfilProvider } from '../context/AzubiProfilContext'

export default function RootLayout() {
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
