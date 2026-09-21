import AsyncStorage from '@react-native-async-storage/async-storage'

export async function ladeGespeichert<T>(schluessel: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(schluessel)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export async function speichere<T>(schluessel: string, wert: T): Promise<void> {
  await AsyncStorage.setItem(schluessel, JSON.stringify(wert))
}
