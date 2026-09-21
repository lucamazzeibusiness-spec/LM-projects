import { Stack } from 'expo-router'

export default function AufgabenLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#fff' }, headerTintColor: '#14181F' }}>
      <Stack.Screen name="index" options={{ title: 'Aufgaben', headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: 'Aufgabe' }} />
    </Stack>
  )
}
