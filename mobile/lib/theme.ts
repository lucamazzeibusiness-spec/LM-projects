import { colorScheme } from 'nativewind'
import { ladeGespeichert, speichere } from './storage'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme:modus'

// Liest die gespeicherte Wahl und wendet sie an. Wird beim App-Start einmal aufgerufen,
// bevor die UI angezeigt wird (siehe app/_layout.tsx) – ohne gespeicherte Wahl bleibt es beim
// Systemdesign (NativeWind reagiert dann automatisch auf Appearance-Änderungen).
export async function themeInitialisieren(): Promise<void> {
  const gespeichert = await ladeGespeichert<Theme | null>(STORAGE_KEY, null)
  if (gespeichert) colorScheme.set(gespeichert)
}

export function themeSetzen(theme: Theme) {
  colorScheme.set(theme)
  speichere(STORAGE_KEY, theme)
}
