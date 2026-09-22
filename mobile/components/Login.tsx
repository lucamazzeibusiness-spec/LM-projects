import { useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useAuth } from '../context/AuthContext'
import { DB_LOGO_PNG } from '../lib/dbLogo'

function fehlerText(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Für diese E-Mail existiert bereits ein Konto. Versuch es mit „Anmelden".'
    case 'auth/invalid-email':
      return 'Diese E-Mail-Adresse sieht nicht gültig aus.'
    case 'auth/weak-password':
      return 'Das Passwort muss mindestens 6 Zeichen lang sein.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-Mail oder Passwort stimmt nicht.'
    case 'auth/too-many-requests':
      return 'Zu viele Versuche. Bitte kurz warten und nochmal probieren.'
    case 'auth/network-request-failed':
      return 'Keine Verbindung. Prüf dein Internet und versuch es nochmal.'
    default:
      return 'Etwas ist schiefgelaufen. Bitte nochmal versuchen.'
  }
}

export default function Login() {
  const { registrieren, anmelden } = useAuth()
  const [modus, setModus] = useState<'anmelden' | 'registrieren'>('anmelden')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [passwort, setPasswort] = useState('')
  const [ladt, setLadt] = useState(false)
  const [fehler, setFehler] = useState<string | null>(null)

  const absenden = async () => {
    setFehler(null)
    setLadt(true)
    try {
      if (modus === 'registrieren') {
        await registrieren(name, email, passwort)
      } else {
        await anmelden(email, passwort)
      }
    } catch (err) {
      const code = err && typeof err === 'object' && 'code' in err ? String(err.code) : ''
      setFehler(fehlerText(code))
    } finally {
      setLadt(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-db-gray-50 dark:bg-[#10141B]">
      <ScrollView contentContainerClassName="flex-1 items-center justify-center px-4 py-8" keyboardShouldPersistTaps="handled">
        <View className="w-full max-w-sm">
          <View className="mb-8 items-center gap-3">
            <Image source={{ uri: DB_LOGO_PNG }} style={{ width: 64, height: 45 }} resizeMode="contain" />
            <View className="items-center">
              <Text className="text-lg font-bold text-db-navy dark:text-[#EEF1F4]">Azubi</Text>
              <Text className="text-sm text-db-navy-light dark:text-[#9AA4B0]">
                {modus === 'registrieren' ? 'Erstell dein Konto, um loszulegen' : 'Melde dich an, um weiterzumachen'}
              </Text>
            </View>
          </View>

          <View className="gap-3 rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-5">
            {modus === 'registrieren' && (
              <View>
                <Text className="mb-1 text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">Wie heißt du?</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Max"
                  autoComplete="name"
                  className="w-full rounded-lg border border-db-gray-200 dark:border-[#2A323D] px-3 py-2.5 text-sm text-db-navy dark:text-[#EEF1F4]"
                />
              </View>
            )}

            <View>
              <Text className="mb-1 text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">E-Mail</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="max@beispiel.de"
                autoComplete="email"
                autoCapitalize="none"
                keyboardType="email-address"
                className="w-full rounded-lg border border-db-gray-200 dark:border-[#2A323D] px-3 py-2.5 text-sm text-db-navy dark:text-[#EEF1F4]"
              />
            </View>

            <View>
              <Text className="mb-1 text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">Passwort</Text>
              <TextInput
                value={passwort}
                onChangeText={setPasswort}
                placeholder="Mindestens 6 Zeichen"
                secureTextEntry
                autoComplete={modus === 'registrieren' ? 'new-password' : 'current-password'}
                className="w-full rounded-lg border border-db-gray-200 dark:border-[#2A323D] px-3 py-2.5 text-sm text-db-navy dark:text-[#EEF1F4]"
              />
            </View>

            {fehler && <Text className="rounded-lg bg-db-red/5 px-3 py-2 text-xs text-db-red-dark">{fehler}</Text>}

            <Pressable
              onPress={absenden}
              disabled={ladt || !email.trim() || passwort.length < 6}
              className="items-center rounded-full bg-db-red px-4 py-3 disabled:opacity-50"
            >
              <Text className="text-sm font-semibold text-white">
                {ladt ? 'Einen Moment …' : modus === 'registrieren' ? 'Konto erstellen' : 'Anmelden'}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              setFehler(null)
              setModus((m) => (m === 'anmelden' ? 'registrieren' : 'anmelden'))
            }}
            className="mt-4"
          >
            <Text className="text-center text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">
              {modus === 'anmelden' ? 'Noch kein Konto? Jetzt registrieren' : 'Schon ein Konto? Hier anmelden'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
