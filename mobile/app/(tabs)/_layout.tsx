import { Redirect, router, Tabs } from 'expo-router'
import { BookOpen, CalendarDays, ClipboardList, GraduationCap, LayoutGrid } from 'lucide-react-native'
import { Image, Pressable, Text, View } from 'react-native'
import { useAzubiProfil } from '../../context/AzubiProfilContext'
import { DB_LOGO_PNG } from '../../lib/dbLogo'

function Header() {
  const { profil } = useAzubiProfil()
  const initialen = profil ? profil.name.slice(0, 2).toUpperCase() || '?' : '?'

  return (
    <View className="flex-row items-center gap-3 border-b border-db-gray-200 bg-white px-4 pb-3 pt-14">
      <Image source={{ uri: DB_LOGO_PNG }} style={{ width: 38, height: 26 }} resizeMode="contain" />
      <View className="flex-1">
        <Text className="text-sm font-bold text-db-navy">Azubi</Text>
        {profil && (
          <Text className="text-xs text-db-navy-light">
            {profil.ausbildungsberuf} · {profil.lehrjahr}. Lehrjahr
          </Text>
        )}
      </View>
      <Pressable
        onPress={() => router.push('/profil')}
        className="h-8 w-8 items-center justify-center rounded-full bg-db-gray-100"
      >
        <Text className="text-xs font-semibold text-db-navy">{initialen}</Text>
      </Pressable>
    </View>
  )
}

export default function TabsLayout() {
  const { profil, geladen } = useAzubiProfil()

  if (!geladen) return null
  if (!profil) return <Redirect href="/onboarding" />

  return (
    <View className="flex-1">
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#EC0016',
          tabBarInactiveTintColor: '#5C6670',
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Start', tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} /> }}
        />
        <Tabs.Screen
          name="aufgaben"
          options={{ title: 'Aufgaben', tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} /> }}
        />
        <Tabs.Screen
          name="berichtsheft"
          options={{ title: 'Berichtsheft', tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} /> }}
        />
        <Tabs.Screen
          name="wissen"
          options={{ title: 'Wissen', tabBarIcon: ({ color, size }) => <GraduationCap color={color} size={size} /> }}
        />
        <Tabs.Screen
          name="ausbildungsplan"
          options={{ title: 'Ausbildung', tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} /> }}
        />
      </Tabs>
    </View>
  )
}
